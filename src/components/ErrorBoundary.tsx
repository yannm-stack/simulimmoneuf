
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      sessionStorage.clear();
      localStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
          <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl border border-red-100 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Oups ! Une erreur est survenue</h1>
            <p className="text-gray-500 mb-8 leading-relaxed font-semibold italic serif">
              Il semble que des données corrompues empêchent l'affichage de cette page. Ne vous inquiétez pas, vos informations de simulation peuvent être réinitialisées.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              <RotateCcw size={20} />
              Réinitialiser et recommencer
            </button>
            <div className="mt-6 text-xs text-gray-400">
              Si le problème persiste, essayez de vider le cache de votre navigateur.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
