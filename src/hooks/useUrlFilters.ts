import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

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

  const internalUpdateRef = useRef(false);

  const [filters, setFiltersState] = useState<T>(() =>
    parseSearchParams(searchParams, initialValuesRef.current)
  );

  useEffect(() => {
    if (internalUpdateRef.current) {
      internalUpdateRef.current = false;
      return;
    }
    const parsed = parseSearchParams(searchParams, initialValuesRef.current);

    const cleanUrlParams = new URLSearchParams();
    Object.entries(parsed).forEach(([key, val]) => {
      const defaultVal = initialValuesRef.current[key];
      if (val !== undefined && val !== null && val !== '' && String(val) !== String(defaultVal)) {
        cleanUrlParams.set(key, String(val));
      }
    });

    if (cleanUrlParams.toString() !== searchParams.toString()) {
      internalUpdateRef.current = true;
      setSearchParams(cleanUrlParams, { replace: true });
    }

    setFiltersState(parsed);
  }, [searchParams, setSearchParams]);

  const setFilters = useCallback(
    (newFilters: Partial<T>) => {
      setFiltersState((prev) => {
        const merged = { ...prev, ...newFilters };
        const urlParams = new URLSearchParams();

        Object.entries(merged).forEach(([key, val]) => {
          const defaultVal = initialValuesRef.current[key];
          // Skip empty values AND values that equal the default (no need to show in URL)
          if (val !== undefined && val !== null && val !== '' && String(val) !== String(defaultVal)) {
            urlParams.set(key, String(val));
          }
        });

        if (urlParams.toString() !== searchParams.toString()) {
          internalUpdateRef.current = true;
          setSearchParams(urlParams, { replace: true });
        }
        return merged as T;
      });
    },
    [setSearchParams, searchParams]
  );

  const resetFilters = useCallback(() => {
    internalUpdateRef.current = true;
    setFiltersState(initialValuesRef.current);
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return { filters, setFilters, resetFilters };
}
