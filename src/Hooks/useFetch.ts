import { useState, useEffect } from "react";

interface UseFetchParams {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  payload?: Record<string, unknown> | null;
  skip?: boolean;
}

interface UseFetchResponse<T> {
  isLoading: boolean;
  response: T | null;
  error: string | null;
}

type FetchError = {
  message: string;
};

const useFetch = <T>({
  url,
  method = "GET",
  payload = null,
  skip = false,
}: UseFetchParams): UseFetchResponse<T> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (skip) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const options: RequestInit = {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body:
            method === "GET" || method === "DELETE"
              ? null
              : JSON.stringify(payload),
        };

        const res = await fetch(url, options);

        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }

        const data: T = await res.json();
        setResponse(data);
      } catch (err) {
        const error = err as FetchError;
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, method, payload, skip]);

  return { isLoading, response, error };
};

export default useFetch;
