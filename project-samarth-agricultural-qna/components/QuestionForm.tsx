
import React, { useState } from 'react';
import { SendIcon } from './icons';

interface QuestionFormProps {
  onAsk: (question: string) => void;
  isLoading: boolean;
}

const sampleQuestion = "What are the latest government schemes for farmers in Uttar Pradesh?";

export const QuestionForm: React.FC<QuestionFormProps> = ({ onAsk, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAsk(inputValue);
  };

  const handleSampleClick = () => {
    setInputValue(sampleQuestion);
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit}>
        <label htmlFor="question" className="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Ask a Question
        </label>
        <div className="relative">
          <textarea
            id="question"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="E.g., What is the current MSP for wheat and rice in Punjab?"
            className="w-full h-28 p-4 pr-12 text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 dark:bg-gray-700 resize-none"
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
            <button
                type="button"
                onClick={handleSampleClick}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                disabled={isLoading}
            >
                Try a sample question
            </button>
            <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading || !inputValue.trim()}
            >
                {isLoading ? 'Analyzing...' : 'Get Answer'}
                {!isLoading && <SendIcon className="w-5 h-5" />}
            </button>
        </div>
      </form>
    </div>
  );
};
