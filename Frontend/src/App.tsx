import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ConnectPrompt } from './components/ConnectPrompt';
import useRunners from './hooks/useRunner';
import "./connection";
import { TokenProvider } from './contexts/TokenContext';

export default function App() {
  const {address, isConnected} = useRunners();

  return (
    <div className="min-h-screen bg-surface-0 grid-noise relative">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-400/3 blur-[80px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[300px] bg-violet-400/3 blur-[100px] rounded-full pointer-events-none" />

      <Navbar/>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {isConnected && address ? (
          <TokenProvider>
            <Dashboard />
          </TokenProvider>
        ) : (
          <ConnectPrompt />
        )}
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1C2030',
            color: '#E8EAF0',
            border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '13px',
            fontFamily: "'JetBrains Mono', monospace",
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#34D399', secondary: '#0D1017' },
          },
          error: {
            iconTheme: { primary: '#F87171', secondary: '#0D1017' },
          },
        }}
      />
    </div>
  );
}
