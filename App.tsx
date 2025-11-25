import React, { useState, useEffect, useRef } from 'react';
import { generateRoadmap } from './services/geminiService';
import { getSavedRoadmaps, saveRoadmapToStorage, deleteRoadmapFromStorage } from './services/storageService';
import { downloadMarkdown, downloadPDF } from './services/exportService';
import { RoadmapResponse, SavedRoadmap } from './types';
import StepCard from './components/StepCard';
import EmptyState from './components/EmptyState';
import SavedRoadmapsList from './components/SavedRoadmapsList';
import { Search, Loader2, Map as MapIcon, RotateCcw, Bookmark, Check, FolderOpen, Download, FileText, Printer, Moon, Sun } from 'lucide-react';

type ViewState = 'home' | 'saved';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Data State
  const [view, setView] = useState<ViewState>('home');
  const [savedRoadmaps, setSavedRoadmaps] = useState<SavedRoadmap[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Theme State
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'light';
    }
    return 'light';
  });

  // Export dropdown state
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);

  // Initialize Data
  useEffect(() => {
    fetchSavedRoadmaps();
  }, []);

  // Fetch saved roadmaps from storage
  const fetchSavedRoadmaps = async () => {
    try {
      const data = await getSavedRoadmaps();
      setSavedRoadmaps(data);
    } catch (err) {
      console.error("Failed to load roadmaps", err);
    }
  };

  useEffect(() => {
    // Click outside handler for export menu
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Check if current roadmap is saved
    if (roadmap && savedRoadmaps.length > 0) {
      // Simple check based on field name or exact ID match if we had one on the live object
      const exists = savedRoadmaps.some(r => r.field.toLowerCase() === roadmap.field.toLowerCase());
      setIsSaved(exists);
    } else {
      setIsSaved(false);
    }
  }, [roadmap, savedRoadmaps]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setRoadmap(null);
    setView('home');

    try {
      const data = await generateRoadmap(query);
      setRoadmap(data);
    } catch (err) {
      setError("Failed to generate roadmap. Please try again or check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setRoadmap(null);
    setError(null);
    setView('home');
  };

  const handleSaveRoadmap = async () => {
    if (!roadmap) return;

    try {
      const newSaved = await saveRoadmapToStorage(roadmap);
      if (newSaved) {
        setSavedRoadmaps(prev => [newSaved, ...prev]);
        setIsSaved(true);
      }
    } catch (err) {
      setIsSaved(false);
      alert('Failed to save roadmap.');
    }
  };

  const handleDeleteRoadmap = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this roadmap?')) {
      try {
        await deleteRoadmapFromStorage(id);
        setSavedRoadmaps(prev => prev.filter(r => r.id !== id));
      } catch (err) {
        alert("Failed to delete roadmap");
      }
    }
  };

  const handleViewSaved = () => {
    setView(view === 'saved' ? 'home' : 'saved');
  };

  const handleSelectSaved = (saved: SavedRoadmap) => {
    setRoadmap(saved);
    setView('home');
    setQuery(saved.field);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // Export handlers
  const handleExportMarkdown = () => {
    if (roadmap) {
      downloadMarkdown(roadmap);
      setShowExportMenu(false);
    }
  };

  const handleExportPDF = () => {
    if (roadmap && roadmapRef.current) {
      setShowExportMenu(false);
      setTimeout(() => {
        downloadPDF(roadmapRef.current!, roadmap);
      }, 100);
    }
  };

  const handlePrint = () => {
    window.print();
    setShowExportMenu(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 no-print transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <MapIcon size={20} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              SkillPath AI
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button 
              onClick={handleViewSaved}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                view === 'saved' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <FolderOpen size={18} />
              <span className="hidden sm:inline">My Roadmaps</span>
              {savedRoadmaps.length > 0 && (
                <span className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs py-0.5 px-2 rounded-full font-bold">
                  {savedRoadmaps.length}
                </span>
              )}
            </button>
            
            {roadmap && view === 'home' && (
               <button 
                 onClick={handleReset}
                 className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
               >
                 <RotateCcw size={14} /> <span className="hidden sm:inline">New</span>
               </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:py-12 print:p-0 print:w-full">
        
        {view === 'saved' ? (
          <SavedRoadmapsList 
            roadmaps={savedRoadmaps} 
            onSelect={handleSelectSaved} 
            onDelete={handleDeleteRoadmap}
            onCreateNew={handleReset}
          />
        ) : (
          <>
            {/* Search Section */}
            <div className={`transition-all duration-500 ease-in-out flex flex-col items-center no-print ${roadmap ? 'mb-12' : 'min-h-[40vh] justify-center'}`}>
              
              {!roadmap && !loading && (
                <div className="text-center mb-10 max-w-2xl">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 transition-colors">
                    What do you want to <span className="text-blue-600 dark:text-blue-400">master</span>?
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 transition-colors">
                    Generate a personalized, step-by-step roadmap for any skill, language, or career path in seconds.
                  </p>
                </div>
              )}

              <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors">
                    <Search size={22} />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Data Science, pottery, React Developer, astrophysics..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-lg shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!query.trim() || loading}
                    className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium px-6 rounded-xl transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span className="hidden sm:inline">Generating...</span>
                      </>
                    ) : (
                      'Generate'
                    )}
                  </button>
                </div>
              </form>

              {loading && (
                <div className="mt-8 text-center animate-pulse">
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Constructing your learning path...</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">This involves analyzing expert curriculums (approx. 5-10s)</p>
                </div>
              )}

              {error && (
                 <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-800 flex items-center gap-2">
                   <span className="font-semibold">Error:</span> {error}
                 </div>
              )}
            </div>

            {!loading && !roadmap && !error && <EmptyState />}

            {!loading && roadmap && (
              <div className="animate-fade-in-up">
                
                {/* Controls Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 max-w-3xl mx-auto px-1 no-print">
                   <span className="text-blue-600 dark:text-blue-400 font-semibold tracking-wide text-sm uppercase">Roadmap Generated</span>
                   
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={handleSaveRoadmap}
                        disabled={isSaved}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isSaved 
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-default' 
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm'
                        }`}
                      >
                        {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
                        {isSaved ? 'Saved' : 'Save Path'}
                      </button>

                      {/* Export Dropdown */}
                      <div className="relative" ref={exportMenuRef}>
                        <button
                          onClick={() => setShowExportMenu(!showExportMenu)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                        >
                          <Download size={16} />
                          Export
                        </button>

                        {showExportMenu && (
                          <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                            <button 
                              onClick={handleExportPDF}
                              className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 transition-colors"
                            >
                              <FileText size={16} className="text-red-500" />
                              Download PDF
                            </button>
                            <button 
                              onClick={handleExportMarkdown}
                              className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 transition-colors"
                            >
                              <FileText size={16} className="text-slate-500 dark:text-slate-400" />
                              Export as Markdown
                            </button>
                            <button 
                              onClick={handlePrint}
                              className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                            >
                              <Printer size={16} className="text-slate-500 dark:text-slate-400" />
                              Print View
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                </div>

                <div ref={roadmapRef} className="print:w-full">
                  <div className="text-center mb-10 max-w-3xl mx-auto print:mb-8 print:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 capitalize transition-colors">
                      {roadmap.field}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg transition-colors">
                      {roadmap.overview}
                    </p>
                  </div>

                  <div className="relative">
                    {roadmap.steps.map((step, index) => (
                      <StepCard 
                        key={step.id} 
                        step={step} 
                        index={index}
                        isLast={index === roadmap.steps.length - 1}
                      />
                    ))}
                  </div>
                </div>

                 <div className="mt-20 p-8 bg-slate-900 dark:bg-slate-800 rounded-2xl text-center text-slate-300 dark:text-slate-400 no-print transition-colors">
                    <h3 className="text-xl font-semibold text-white mb-2">Ready to start?</h3>
                    <p className="mb-6 max-w-xl mx-auto">The journey of a thousand miles begins with a single step. Start with the Beginner module above.</p>
                    <button 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="bg-white text-slate-900 hover:bg-slate-100 font-semibold py-2 px-6 rounded-full transition-colors"
                    >
                      Scroll to Start
                    </button>
                 </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-slate-500 dark:text-slate-400 text-sm no-print transition-colors">
        <p>© {new Date().getFullYear()} SkillPath AI.</p>
      </footer>
    </div>
  );
};

export default App;