import React from 'react';
import { Compass, Target, Layers } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-center hover:shadow-md transition-all">
        <div className="bg-blue-50 dark:bg-blue-900/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
          <Compass size={24} />
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Discover Path</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Enter any skill or career field, and AI will map out the territory for you instantly.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-center hover:shadow-md transition-all">
        <div className="bg-purple-50 dark:bg-purple-900/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-400">
          <Layers size={24} />
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Structured Learning</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Break down complex topics into manageable levels from Beginner to Expert.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-center hover:shadow-md transition-all">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
          <Target size={24} />
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Actionable Steps</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Get specific concepts to learn and project ideas to build your portfolio.</p>
      </div>
    </div>
  );
};

export default EmptyState;