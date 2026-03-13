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


export function useUrlFilters<T extends Record<string, any>>(initialValues: T) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValuesRef = useRef(initialValues);

  const [filters, setFiltersState] = useState<T>(() =>
    parseSearchParams(searchParams, initialValuesRef.current)
  );

  // Sync state when URL changes (e.g. browser back button)
  useEffect(() => {
    const parsed = parseSearchParams(searchParams, initialValuesRef.current);

    const isDifferent = Object.keys(parsed).some(
      (key) => String(parsed[key] ?? '') !== String(filters[key] ?? '')
    );

    if (isDifferent) {
      setFiltersState(parsed);
    }
  }, [searchParams]);

  const updateUrl = useCallback((newFilters: T) => {
    const urlParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      const defaultVal = initialValuesRef.current[key];
      if (
        val !== undefined &&
        val !== null &&
        val !== '' &&
        String(val) !== String(defaultVal)
      ) {
        urlParams.set(key, String(val));
      }
    });

    if (urlParams.toString() !== searchParams.toString()) {
      // Use setTimeOut or ensure this is called in an event/effect
      // to avoid "Cannot update a component while rendering"
      setSearchParams(urlParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const setFilters = useCallback(
    (newPartialFilters: Partial<T>) => {
      setFiltersState((prev) => {
        const next = { ...prev, ...newPartialFilters };
        // We defer the URL update to avoid React warnings about 
        // updating RouterProvider during render
        setTimeout(() => updateUrl(next), 0);
        return next;
      });
    },
    [updateUrl]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
    setFiltersState(initialValuesRef.current);
  }, [setSearchParams]);

  return { filters, setFilters, resetFilters };
}
