
import React from 'react';
import type { SamarthResponse } from '../types';
import { DatabaseIcon, LightBulbIcon, DocumentTextIcon, ExclamationTriangleIcon } from './icons';

interface ResultCardProps {
  isLoading: boolean;
  error: string | null;
  result: SamarthResponse | null;
  question: string;
}

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-md w-3/4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-5/6"></div>
    </div>
    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-md w-1/2"></div>
    <div className="flex flex-wrap gap-3">
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-full w-48"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-full w-56"></div>
    </div>
  </div>
);

export const ResultCard: React.FC<ResultCardProps> = ({ isLoading, error, result, question }) => {
  if (!isLoading && !error && !result) {
    return null; // Don't render anything initially
  }

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {question && (
        <div className="pb-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            <span className="text-gray-500 dark:text-gray-400">Q: </span>{question}
          </h2>
        </div>
      )}

      {isLoading && <LoadingSkeleton />}
      
      {error && (
        <div className="text-red-600 dark:text-red-400 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg">
          <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold">An Error Occurred</h3>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-8">
          {result.analysis && (
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                <DocumentTextIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{result.analysis}</p>
            </div>
          )}

          {result.summaryPoints && result.summaryPoints.length > 0 && (
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                <LightBulbIcon className="w-7 h-7 text-yellow-500 dark:text-yellow-400" />
                Key Insights
              </h3>
              <ul className="space-y-3 list-disc list-inside text-gray-600 dark:text-gray-300">
                {result.summaryPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}
          
          {result.sources && result.sources.length > 0 && (
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                <DatabaseIcon className="w-7 h-7 text-green-600 dark:text-green-500" />
                Data Sources
              </h3>
              <div className="flex flex-wrap gap-3">
                {result.sources.map((source, index) => (
                  <a
                    href={source.description}
                    key={index}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={source.description}
                    className="max-w-full sm:max-w-xs bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 ease-in-out"
                  >
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">{source.sourceName}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
