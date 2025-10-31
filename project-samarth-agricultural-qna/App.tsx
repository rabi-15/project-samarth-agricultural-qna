
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { QuestionForm } from './components/QuestionForm';
import { ResultCard } from './components/ResultCard';
import { askSamarth } from './services/geminiService';
import type { SamarthResponse } from './types';

const App: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SamarthResponse | null>(null);

  const handleAskQuestion = useCallback(async (userQuestion: string) => {
    if (!userQuestion.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setQuestion(userQuestion);

    try {
      const response = await askSamarth(userQuestion);
      setResult(response);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred. Please check the console and ensure your API key is configured correctly.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <QuestionForm onAsk={handleAskQuestion} isLoading={isLoading} />
          <ResultCard
            isLoading={isLoading}
            error={error}
            result={result}
            question={question}
          />
        </main>
        <footer className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>Project Samarth | Powered by Abishek and data.gov.in</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
