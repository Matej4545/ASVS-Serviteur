import React, { createContext, useContext, useEffect, useState } from 'react';
import { ASVSAudit, ASVSAuditResult } from '../types/types';
import { getInitialResults } from './helpers';

// Define the local storage key for easier reference
const LOCAL_STORAGE_KEY = 'ASVSServiteurData';

interface LocalStorageContextType {
    data: ASVSAudit | null;
    loading: boolean;
    updateResults: (results: ASVSAuditResult[]) => void;
    clearData: () => void;
    createNewProject: (name: string, date: Date, targetLevel: number) => void;
    loadExistingProject: (data: string) => void;
  }

// Create the Context
const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);

const LocalStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ASVSAudit | null>(null);
  const [loading, setLoading] = useState(true);
  // On mount, load data from local storage
  useEffect(() => {
    const loadData = async () => {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const data = await JSON.parse(storedData);
        setLoading(false);
        setData(data);
      }
    }
    loadData();

  }, []);



  // Update local storage and state
  const updateResults = (newResults: ASVSAuditResult[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({...data, results: newResults}));
    setData({...data!, results: newResults});
  };

  // Clear data from both local storage and state
  const clearData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setData(null);
  };

  const createNewProject = (name: string, date: Date, targetLevel: number) => {
    clearData();
    const newProject: ASVSAudit = {name, date, targetLevel, results: getInitialResults()}
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProject));
    setData(newProject);
  }

  const loadExistingProject = (data: string) => {
    const parsed = JSON.parse(data);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    setData(parsed);
  }

  // Provide state and functions to children
  return (
    <LocalStorageContext.Provider value={{ data, loading, updateResults, clearData, createNewProject, loadExistingProject }}>
      {children}
    </LocalStorageContext.Provider>
  );
};

// Custom hook to access the context easily
const useLocalStorage = (): LocalStorageContextType => {
  const context = useContext(LocalStorageContext);
  if (context === undefined) {
    throw new Error('useLocalStorage must be used within a LocalStorageProvider');
  }
  return context;
};

export { LocalStorageProvider, useLocalStorage };

