import { useState } from 'react';
import { InputForm } from './components/InputForm';
import { PPTPreview } from './components/PPTPreview';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { generatePresentation } from './services/api';
import { createPPT } from './services/pptGenerator';
import type { LessonInput, PresentationData, TemplateOptions } from './types';
import { Presentation, Sparkles, Cpu, Zap } from 'lucide-react';
import { DroneTextReveal } from './components/DroneTextReveal';
import { HackerBackground } from './components/HackerBackground';
import { TerminalProvider, useTerminal } from './context/TerminalContext';
import { SystemTerminal } from './components/SystemTerminal';

function AppContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presentationData, setPresentationData] = useState<PresentationData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { addLog } = useTerminal();

  const handleGenerate = async (input: LessonInput, template?: TemplateOptions) => {
    setIsLoading(true);
    setError(null);
    addLog(`Initiating generation sequence for: ${input.title}`, 'system');
    addLog('Compiling input parameters...', 'info');

    try {
      addLog('Connecting to Neural Engine...', 'warning');
      const data = await generatePresentation(input);
      addLog('Data stream received successfully.', 'success');

      // Merge template options into the presentation data
      const finalData = { ...data, template };
      setPresentationData(finalData);
      setShowPreview(true);
      addLog('Presentation compiled. Launching Preview Module.', 'system');
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown Error';
      setError(errMsg);
      addLog(`Critical Failure: ${errMsg}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (presentationData) {
      addLog('Exporting binary data to PPTX format...', 'info');
      await createPPT(presentationData);
      addLog('Download complete. File saved to local drive.', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-text selection:bg-primary selection:text-background relative overflow-hidden">
      {/* Animated Background Grid */}
      <HackerBackground />
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#151621_1px,transparent_1px),linear-gradient(to_bottom,#151621_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse"></div>
      </div>

      {/* System Terminal */}
      <SystemTerminal />

      {/* Header HUD */}
      <header className="border-b border-primary/20 bg-surface/80 backdrop-blur-md sticky top-0 z-30 relative">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-surface border border-primary/50 p-2 rounded-lg">
                <Presentation className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white tracking-wider flex items-center gap-2">
                CLEVIO <span className="text-primary">AI</span>
              </h1>
              <p className="text-xs text-primary/80 font-mono tracking-[0.2em] uppercase">System Online</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-mono">
            <div className="flex items-center gap-2 text-primary/60">
              <Cpu className="w-4 h-4" />
              <span>CORE: ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 text-accent/60">
              <Zap className="w-4 h-4" />
              <span>POWER: 100%</span>
            </div>
            <span className="px-3 py-1 border border-primary/30 rounded text-primary text-xs bg-primary/5">v2.0.77</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
            <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight flex flex-col md:block">
              <DroneTextReveal text="GENERATE" className="mr-4" delay={0.5} />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">
                LESSONS
              </span>
            </h2>
            <p className="text-xl text-text/80 max-w-2xl mx-auto font-light leading-relaxed">
              Initialize neural link. Upload parameters. <span className="text-primary font-medium">Generate educational content</span> at light speed.
            </p>
          </div>

          {error && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <ErrorMessage message={error} onRetry={() => setError(null)} />
            </div>
          )}

          {isLoading ? (
            <div className="bg-surface/50 backdrop-blur-xl p-16 rounded-2xl border border-primary/20 shadow-[0_0_50px_-12px_rgba(0,240,255,0.1)] flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan"></div>
              <LoadingSpinner message="INITIALIZING NEURAL NETWORK..." />
              <p className="text-sm font-mono text-primary/60 mt-8 text-center max-w-md animate-pulse">
                [PROCESSING DATA STREAMS] [ANALYZING PATTERNS] [COMPILING ASSETS]
              </p>
            </div>
          ) : (
            <InputForm onSubmit={handleGenerate} isLoading={isLoading} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-surface/50 backdrop-blur-sm mt-auto py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-text/40 flex items-center justify-center gap-2 font-mono text-sm">
            POWERED BY <Sparkles className="w-4 h-4 text-secondary" /> NEURAL ENGINE
          </p>
          <p className="text-[10px] text-text/20 mt-4 tracking-[0.3em] uppercase">
            &copy; {new Date().getFullYear()} Clevio Coder Camp. All Systems Nominal.
          </p>
        </div>
      </footer>

      {/* Preview Modal */}
      {showPreview && presentationData && (
        <PPTPreview
          data={presentationData}
          onDownload={handleDownload}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <TerminalProvider>
      <AppContent />
    </TerminalProvider>
  );
}

export default App;
