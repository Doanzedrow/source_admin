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

  useEffect(() => {
    const parsed = parseSearchParams(searchParams, initialValuesRef.current);

    const isDifferent = Object.keys(parsed).some(
      (key) => String(parsed[key] ?? '') !== String(filters[key] ?? '')
    );

    if (isDifferent) {
      setFiltersState(parsed);
    }
  }, [searchParams]);

  const setFilters = useCallback(
    (newFilters: Partial<T>) => {
      setFiltersState((prev) => {
        const merged = { ...prev, ...newFilters };

        const urlParams = new URLSearchParams();
        Object.entries(merged).forEach(([key, val]) => {
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
          setSearchParams(urlParams, { replace: true });
        }

        return merged as T;
      });
    },
    [searchParams, setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
    setFiltersState(initialValuesRef.current);
  }, [setSearchParams]);

  return { filters, setFilters, resetFilters };
}
