import React from 'react';
import { LeafIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-4">
        <LeafIcon className="w-12 h-12 text-green-600 dark:text-green-500" />
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white tracking-tight">
          Project Samarth
        </h1>
      </div>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
        Agricultural Q&A with live insights sourced exclusively from Indian government portals.
      </p>
    </header>
  );
};