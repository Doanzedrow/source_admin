import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useUrlFilters<T extends Record<string, any>>(initialValues: T) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValuesRef = useRef(initialValues);

  const [filters, setFiltersState] = useState<T>(() => {
    const params: Record<string, any> = { ...initialValuesRef.current };

    searchParams.forEach((value, key) => {
      if (key in initialValuesRef.current) {
        if (value === '') {
          params[key] = initialValuesRef.current[key];
        } else {
          const initialType = typeof initialValuesRef.current[key];
          if (initialType === 'number') {
            params[key] = Number(value);
          } else if (initialType === 'boolean') {
            params[key] = value === 'true';
          } else {
            params[key] = value;
          }
        }
      }
    });

    return params as T;
  });

  // Sync state with URL when it changes externally
  useEffect(() => {
    const params: Record<string, any> = { ...initialValuesRef.current };
    
    searchParams.forEach((value, key) => {
      if (key in initialValuesRef.current) {
        if (value === '') {
          params[key] = initialValuesRef.current[key];
        } else {
          const initialType = typeof initialValuesRef.current[key];
          if (initialType === 'number') {
            params[key] = Number(value);
          } else if (initialType === 'boolean') {
            params[key] = value === 'true';
          } else {
            params[key] = value;
          }
        }
      }
    });

    // Only update if actually different to prevent infinite loops
    const currentFiltersStr = JSON.stringify(filters);
    const newFiltersStr = JSON.stringify(params);

    if (currentFiltersStr !== newFiltersStr) {
      setFiltersState(params as T);
    }
  }, [searchParams, filters]);

  const setFilters = useCallback(
    (newFilters: Partial<T>) => {
      setFiltersState((prev) => {
        const merged = { ...prev, ...newFilters };
        const urlParams = new URLSearchParams();

        Object.entries(merged).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            urlParams.set(key, String(val));
          }
        });

        if (urlParams.toString() !== searchParams.toString()) {
          setSearchParams(urlParams, { replace: true });
        }
        return merged as T;
      });
    },
    [setSearchParams, searchParams]
  );

  const resetFilters = useCallback(() => {
    setFiltersState(initialValuesRef.current);
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return { filters, setFilters, resetFilters };
}
