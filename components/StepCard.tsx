import React, { useState } from 'react';
import { RoadmapStep, ProficiencyLevel } from '../types';
import { ChevronDown, ChevronUp, Clock, BookOpen, Lightbulb } from 'lucide-react';

interface StepCardProps {
  step: RoadmapStep;
  index: number;
  isLast: boolean;
}

const getLevelColor = (level: ProficiencyLevel) => {
  switch (level) {
    case ProficiencyLevel.Beginner:
      return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
    case ProficiencyLevel.Intermediate:
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
    case ProficiencyLevel.Advanced:
      return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
    case ProficiencyLevel.Expert:
      return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
  }
};

const getLevelBadgeColor = (level: ProficiencyLevel) => {
    switch (level) {
      case ProficiencyLevel.Beginner: return 'bg-emerald-500';
      case ProficiencyLevel.Intermediate: return 'bg-blue-500';
      case ProficiencyLevel.Advanced: return 'bg-purple-500';
      case ProficiencyLevel.Expert: return 'bg-rose-500';
      default: return 'bg-gray-500';
    }
};

const StepCard: React.FC<StepCardProps> = ({ step, index, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative pl-8 md:pl-0 print:pl-0 print:mb-4 print:break-inside-avoid">
      {/* Desktop Timeline Line (hidden on mobile, implemented differently) */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 transform -translate-x-1/2 z-0 print:hidden" 
           style={{ bottom: isLast ? 'auto' : '0', height: isLast ? '0' : '100%' }}></div>

      {/* Mobile Timeline Line */}
      <div className="md:hidden absolute left-3 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 z-0 print:hidden"
           style={{ height: isLast ? '0' : '100%' }}></div>

      {/* Timeline Dot */}
      <div className={`absolute left-3 md:left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white dark:border-slate-950 z-10 print:hidden ${getLevelBadgeColor(step.level)}`}></div>

      {/* Content Card container - Alternating sides on desktop */}
      <div className={`mb-8 flex ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'} relative z-10 print:block print:w-full print:mb-4`}>
        <div 
            className={`w-full md:w-[45%] bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-md ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'} print:w-full print:shadow-none print:border-slate-300`}
        >
          {/* Card Header */}
          <div 
            className="p-5 cursor-pointer flex justify-between items-start gap-4 print:p-4"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getLevelColor(step.level)} print:border`}>
                  {step.level}
                </span>
                <span className="flex items-center text-slate-500 dark:text-slate-400 text-xs gap-1">
                  <Clock size={12} />
                  {step.duration}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 line-clamp-2 print:line-clamp-none">{step.description}</p>
            </div>
            <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 mt-1 print:hidden">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {/* Expanded Content - Rendered but hidden with CSS to allow printing */}
          <div className={`px-5 pb-5 pt-0 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 print:bg-transparent print:border-t-0 print:pl-4 print:pb-2 ${isExpanded ? 'block' : 'hidden print:block'}`}>
            
            <div className="mt-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <BookOpen size={16} className="text-blue-500 dark:text-blue-400 print:text-black" />
                Key Concepts
              </h4>
              <div className="flex flex-wrap gap-2">
                {step.keyConcepts.map((concept, idx) => (
                  <span key={idx} className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded shadow-sm print:shadow-none print:border-slate-400">
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Lightbulb size={16} className="text-amber-500 dark:text-amber-400 print:text-black" />
                Project Idea
              </h4>
              <ul className="space-y-1">
                {step.recommendedProjects.map((project, idx) => (
                  <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <span className="mt-1.5 block w-1 h-1 rounded-full bg-amber-400 dark:bg-amber-500 flex-shrink-0 print:bg-black"></span>
                      {project}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 print:hidden">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2">Search Terms for Resources</h4>
              <div className="flex flex-wrap gap-2">
                {step.searchTerms.map((term, idx) => (
                  <a 
                    key={idx}
                    href={`https://www.google.com/search?q=${encodeURIComponent(term)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded"
                  >
                    {term} ↗
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StepCard;