import React, { useState, useCallback } from "react";
import useFetch from "./Hooks/useFetch";

interface Post {
  id: number;
  title: string;
  body: string;
}

const MyComponent: React.FC = () => {
  const [skip, setSkip] = useState(true);
  const [posts, setPosts] = useState<Post[] | null>(null);

  const handleSuccess = useCallback((data: unknown) => {
    setPosts(data as Post[]);
  }, []);

  const { isLoading, error } = useFetch({
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "GET",
    skip,
    onSuccess: handleSuccess,
  });

  const handleFetch = () => {
    setSkip(false);
  };

  const handleClear = () => {
    setPosts(null);
    setSkip(true);
  };

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        {skip && (
          <button onClick={handleFetch} style={{ marginRight: 10 }}>
            Fetch Posts
          </button>
        )}
        {!skip && <button onClick={handleClear}>Skip Posts</button>}
      </div>

      <div style={{ marginTop: 80, padding: 20 }}>
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "20px",
              fontWeight: "bold",
              zIndex: 999,
            }}
          >
            Loading...
          </div>
        )}
        {error && <p>Error: {error}</p>}
        {posts && <pre>{JSON.stringify(posts, null, 2)}</pre>}
      </div>
    </div>
  );
};

export default MyComponent;
