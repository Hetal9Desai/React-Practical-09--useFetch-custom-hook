import React, { useState } from "react";
import useFetch from "./Hooks/useFetch";
import "./App.css";

interface Post {
  id: number;
  title: string;
  body: string;
}

const App: React.FC = () => {
  const [skip, setSkip] = useState(true);

  const { isLoading, error, data } = useFetch<Post[]>({
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "GET",
    skip,
  });

  const handleFetch = () => {
    setSkip(false);
  };

  const handleClear = () => {
    setSkip(true);
  };

  return (
    <div>
      <div className="fixed-buttons">
        {skip ? (
          <button onClick={handleFetch}>Fetch Posts</button>
        ) : (
          <button onClick={handleClear}>Clear Posts</button>
        )}
      </div>

      <div className="content">
        {isLoading && <div className="loading-overlay">Loading...</div>}
        {error && <p className="error-text">Error: {error}</p>}
        {data && (
          <pre className="posts-pre">{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default App;
