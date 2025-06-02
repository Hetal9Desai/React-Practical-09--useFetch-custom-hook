import { useState, useEffect } from "react";

interface UseFetchParams {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  payload?: Record<string, unknown> | null;
  skip?: boolean;
}

interface UseFetchResponse<T = unknown> {
  isLoading: boolean;
  error: string | null;
  data: T | null;
}

const useFetch = <T = unknown>({
  url,
  method = "GET",
  payload = null,
  skip = false,
}: UseFetchParams): UseFetchResponse<T> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (skip) {
      setIsLoading(false);
      setError(null);
      setData(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const options: RequestInit = {
          method,
          headers: {
            "Content-Type": "application/json",
          },
        };

        if (method !== "GET" && method !== "DELETE") {
          options.body = JSON.stringify(payload);
        }

        const res = await fetch(url, options);

        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }

        const result = await res.json();
        setData(result);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, method, payload, skip]);

  return { isLoading, error, data };
};

export default useFetch;
