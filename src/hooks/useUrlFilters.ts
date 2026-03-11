import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useUrlFilters<T extends Record<string, any>>(initialValues: T) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFiltersState] = useState<T>(() => {
    const params: Record<string, any> = { ...initialValues };
    
    searchParams.forEach((value, key) => {
      if (key in initialValues) {
        const initialType = typeof initialValues[key];
        if (initialType === 'number') {
          params[key] = Number(value);
        } else if (initialType === 'boolean') {
          params[key] = value === 'true';
        } else {
          params[key] = value;
        }
      } else {
        params[key] = value;
      }
    });
    
    return params as T;
  });

  const setFilters = useCallback((newFilters: Partial<T>) => {
    setFiltersState(prev => {
      const merged = { ...prev, ...newFilters };
      
      const urlParams = new URLSearchParams(searchParams.toString());
      
      Object.entries(newFilters).forEach(([key, val]) => {
        if (val === undefined || val === null || val === '') {
          urlParams.delete(key);
        } else {
          urlParams.set(key, String(val));
        }
      });
      
      setSearchParams(urlParams, { replace: true });
      return merged as T;
    });
  }, [searchParams, setSearchParams]);

  const resetFilters = useCallback(() => {
    setFiltersState(initialValues);
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [initialValues, setSearchParams]);

  return { filters, setFilters, resetFilters };
}
