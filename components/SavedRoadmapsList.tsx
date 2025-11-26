import React from 'react';
import { SavedRoadmap } from '../types';
import { Trash2, ArrowRight, Calendar, Layers } from 'lucide-react';

interface SavedRoadmapsListProps {
  roadmaps: SavedRoadmap[];
  onSelect: (roadmap: SavedRoadmap) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onCreateNew: () => void;
}

const SavedRoadmapsList: React.FC<SavedRoadmapsListProps> = ({ roadmaps, onSelect, onDelete, onCreateNew }) => {
  if (roadmaps.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in-up">
        <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400 dark:text-slate-500 transition-colors">
          <Layers size={40} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3 transition-colors">No Saved Roadmaps</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 transition-colors">
          You haven't saved any learning paths yet. Generate a new roadmap and click the save button to keep track of your progress.
        </p>
        <button 
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
        >
          Create New Roadmap
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">My Roadmaps</h2>
        <button 
          onClick={onCreateNew}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg transition-colors border border-blue-100 dark:border-blue-800 hover:bg-blue-50 hover:border-blue-200"
        >
          + Create New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roadmaps.map((roadmap) => (
          <div 
            key={roadmap.id}
            onClick={() => onSelect(roadmap)}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-500"></div>
            
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                  {roadmap.steps.length} Steps
                </span>
                <button 
                  onClick={(e) => onDelete(roadmap.id, e)}
                  className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 p-2 -mr-2 -mt-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors z-10"
                  title="Delete roadmap"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 capitalize">
                {roadmap.field}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                {roadmap.overview}
              </p>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 rounded-b-xl flex justify-between items-center mt-auto">
              <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 gap-1">
                <Calendar size={12} />
                {new Date(roadmap.createdAt).toLocaleDateString()}
              </div>
              <span className="text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                View Path <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedRoadmapsList;