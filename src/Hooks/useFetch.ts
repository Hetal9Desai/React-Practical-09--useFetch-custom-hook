import { useState, useEffect } from "react";

interface UseFetchParams {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  payload?: Record<string, unknown> | null;
  skip?: boolean;
  onSuccess: (data: unknown) => void;
}

interface UseFetchResponse {
  isLoading: boolean;
  error: string | null;
}

type FetchError = {
  message: string;
};

const useFetch = ({
  url,
  method = "GET",
  payload = null,
  skip = false,
  onSuccess,
}: UseFetchParams): UseFetchResponse => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (skip) return;

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

        const data = await res.json();
        onSuccess(data);
      } catch (err) {
        const error = err as FetchError;
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, method, payload, skip, onSuccess]);

  return { isLoading, error };
};

export default useFetch;
