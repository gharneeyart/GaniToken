import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("GaniToken", function(){
    const MAX_SUPPLY   = hre.ethers.parseUnits("10000000", 18);
    const CLAIM_AMOUNT = hre.ethers.parseUnits("100", 18);
    const COOLDOWN     = 24 * 60 * 60; 
    const INITIAL_SUPPLY = hre.ethers.parseUnits("500000", 18);

    async function deployGaniToken() {
        const [owner, gani, hali, feyi] = await hre.ethers.getSigners();

        const GaniToken = await hre.ethers.getContractFactory("GaniToken");
        const token = await GaniToken.deploy(owner.address, INITIAL_SUPPLY);

        return { token, owner, gani, hali, feyi };
    }

    describe("Deployment", function(){
        it("Should check for correct token owner, name, decimal, symbol, claim_amount, max_supply and cool_down time", async () => {
            const { token, owner } = await loadFixture(deployGaniToken);

            expect(await token.owner()).to.equal(owner.address)
            expect(await token.name()).to.equal("GaniToken");
            expect(await token.symbol()).to.equal("GSK");
            expect(await token.decimals()).to.equal(18);
            expect(await token.CLAIM_AMOUNT()).to.equal(CLAIM_AMOUNT);
            expect(await token.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
            expect(await token.COOLDOWN()).to.equal(COOLDOWN);
        });

        it("Should check if initial supply is more than max_supply", async ()=> {
            const [deployer] = await hre.ethers.getSigners();
            const Factory = await hre.ethers.getContractFactory("GaniToken");
            const over = MAX_SUPPLY + 1n;

            await expect(Factory.deploy(deployer.address, over)).to.be.revertedWithCustomError(await Factory.deploy(deployer.address, 0n), "ExceedsMaxSupply");
        });

        it("Should check initialSupply and totalSupply", async ()=> {
            const { token, owner } = await loadFixture(deployGaniToken);

            expect(await token.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
            expect(await token.totalSupply()).to.equal(INITIAL_SUPPLY);
        })

    })

    describe("request_token", function(){
        it("Should claim 100 GSK", async ()=> {
            const {token, gani} = await loadFixture(deployGaniToken);

            const balBefore = await token.balanceOf(gani.address);

            await token.connect(gani).requestToken()

            const balAfter = await token.balanceOf(gani.address);

            expect(balAfter - balBefore).to.equal(CLAIM_AMOUNT);     
        })

        it("reverts on a second immediate claim (cooldown not elapsed)", async () => {
            const { token, hali } = await loadFixture(deployGaniToken);

            await token.connect(hali).requestToken();
            await expect(token.connect(hali).requestToken()).to.be.revertedWithCustomError(token, "CooldownNotElapsed");
        });

        it("Should allow second claim after time has elapsed", async ()=> {
            const {token, feyi} = await loadFixture(deployGaniToken);

            await token.connect(feyi).requestToken();
            await time.increase(COOLDOWN);

            await expect(token.connect(feyi).requestToken()).to.not.be.reverted;
            expect(await token.balanceOf(feyi.address)).to.equal(CLAIM_AMOUNT * 2n);

        });

        it("Should allow two diff. users both claim without affecting each other's cooldown", async ()=> {
            const {token, gani, hali} = await loadFixture(deployGaniToken);

            await token.connect(gani).requestToken();
            await token.connect(hali).requestToken();

            expect(await token.balanceOf(gani.address)).to.equal(CLAIM_AMOUNT);
            expect(await token.balanceOf(hali.address)).to.equal(CLAIM_AMOUNT);
        })   
    })

    describe("mint by only owner", function(){
        it("Should allow only owner to mint to any address", async ()=> {
            const {token, owner, feyi} = await loadFixture(deployGaniToken);

            const beforeBal = await token.totalSupply();
            const beforeFeyi = await token.balanceOf(feyi.address);

            const amount = hre.ethers.parseUnits("10", 18);

            await token.connect(owner).mint(feyi.address, amount);

            const afterFeyi = await token.balanceOf(feyi.address);

            expect(await token.totalSupply()).to.equal(beforeBal + amount);
            expect(await token.balanceOf(feyi.address)).to.equal(amount);
            expect(afterFeyi - beforeFeyi).to.equal(amount);
        })

        it("Should revert when called by a non-owner", async () => {
            const { token, hali } = await loadFixture(deployGaniToken);

            await expect(token.connect(hali).mint(hali.address, CLAIM_AMOUNT)).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });

        it("Should revert when minting would exceed MAX_SUPPLY", async () => {
            const { token, owner, gani } = await loadFixture(deployGaniToken);

            const remaining = MAX_SUPPLY - await token.totalSupply();
            const over = remaining + 1n;

            await expect(token.connect(owner).mint(gani.address, over)).to.be.revertedWithCustomError(token, "ExceedsMaxSupply");
        });

        it("succeeds when minting exactly to MAX_SUPPLY", async () => {
        const { token, owner, feyi } = await loadFixture(deployGaniToken);

        const totalSupply = await token.totalSupply();
        const remaining = MAX_SUPPLY - totalSupply;

        await expect(token.connect(owner).mint(feyi.address, remaining)).to.not.be.reverted;

        expect(await token.totalSupply()).to.equal(MAX_SUPPLY);
        });

        it("cannot mint once MAX_SUPPLY is reached", async () => {
            const { token, owner, gani } = await loadFixture(deployGaniToken);

            const remaining = MAX_SUPPLY - await token.totalSupply();
            await token.connect(owner).mint(owner.address, remaining);

            await expect(token.connect(owner).mint(gani.address, 1n)).to.be.revertedWithCustomError(token, "ExceedsMaxSupply");
        });
    })
})

