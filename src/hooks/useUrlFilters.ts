import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Parses URLSearchParams into a typed object based on initial values.
 */
function parseSearchParams<T extends Record<string, any>>(
  searchParams: URLSearchParams,
  initialValues: T
): T {
  const params: Record<string, any> = { ...initialValues };
  searchParams.forEach((value, key) => {
    if (key in initialValues) {
      if (value === '') {
        params[key] = initialValues[key];
      } else {
        const initialType = typeof initialValues[key];
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
}

/**
 * Hook for managing filters synced with URL search parameters.
 * Fixes "Cannot update a component while rendering" by ensuring side effects 
 * (like navigation) happen in useEffect or event handlers.
 */
export function useUrlFilters<T extends Record<string, any>>(initialValues: T) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValuesRef = useRef(initialValues);
  const isInternalUpdate = useRef(false);

  // Initialize state from URL immediately
  const [filters, setFiltersState] = useState<T>(() =>
    parseSearchParams(searchParams, initialValuesRef.current)
  );

  // 1. Sync: URL -> State (when URL changes externally)
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const parsed = parseSearchParams(searchParams, initialValuesRef.current);
    
    // Only update state if it actually changed
    const isDifferent = Object.keys(parsed).some(
      key => String(parsed[key]) !== String(filters[key])
    );

    if (isDifferent) {
      setFiltersState(parsed);
    }
  }, [searchParams, filters]);

  // 2. Sync: State -> URL (when local state changes)
  const updateUrl = useCallback((newFilters: T) => {
    const urlParams = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, val]) => {
      const defaultVal = initialValuesRef.current[key];
      // Only include values that are not empty and not the default
      if (val !== undefined && val !== null && val !== '' && String(val) !== String(defaultVal)) {
        urlParams.set(key, String(val));
      }
    });

    if (urlParams.toString() !== searchParams.toString()) {
      isInternalUpdate.current = true;
      setSearchParams(urlParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const setFilters = useCallback(
    (newFilters: Partial<T>) => {
      setFiltersState((prev) => {
        const merged = { ...prev, ...newFilters };
        // We defer URL update to avoid "update during render" warning if setFilters 
        // is somehow called in a lifecycle. However, normally it's called in event handlers.
        // To be safe, we can call updateUrl in a macrotask or just after this if not in updater.
        // Better: let useEffect handle the Sync if we want strictly one direction.
        // But traditional event-driven update is more responsive.
        return merged as T;
      });
    },
    []
  );

  // Separate effect to sync filters -> URL to ensure it happens after state update and in a safe phase
  useEffect(() => {
    // We only trigger URL update if the state change was intended to be reflected in URL
    // (In this simple hook, we always sync state to URL)
    updateUrl(filters);
  }, [filters, updateUrl]);

  const resetFilters = useCallback(() => {
    setFiltersState(initialValuesRef.current);
  }, []);

  return { filters, setFilters, resetFilters };
}
