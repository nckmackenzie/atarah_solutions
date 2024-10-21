import { useSearchParams } from 'react-router-dom';

interface ParamsObject {
  [key: string]: string;
}

export function useSetParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const setParams = (params: ParamsObject) => {
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value === undefined) {
        searchParams.delete(key);
      } else {
        searchParams.set(key, value);
      }
    });
    setSearchParams(searchParams);
  };

  return setParams;
}
