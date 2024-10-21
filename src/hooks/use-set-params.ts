import { useSearchParams } from 'react-router-dom';

interface ParamsObject {
  [key: string]: string;
}

export function useSetParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParams = (params: ParamsObject, original?: string[]) => {
    // Clear all existing parameters
    original?.forEach(v => searchParams.delete(v));

    // Set the new parameters
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== undefined) {
        searchParams.set(key, value);
      }
    });

    setSearchParams(searchParams);
  };

  return setParams;
}
