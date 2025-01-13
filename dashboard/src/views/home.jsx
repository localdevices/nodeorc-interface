import React, {useState, useEffect} from 'react';

import reactLogo from '/react.svg'
import orcLogo from '/orc_favicon.svg'
import api from "../api"

const Home = () => {
  const [count, setCount] = useState(0)
  const [videoFeedUrl, setVideoFeedUrl] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // Dynamically generate the stream URL
  useEffect(() => {
    setIsLoading(true);
    setError(null); // reset errors before doing a new check
    const getVideoFeed = async () => {
      try {
        const feedUrl = `${api.defaults.baseURL}/video-feed`; // Dynamically get it from Axios
        // test the feed by doing an API call
        const response = await api.head('/video-feed');
        console.log(response);
        if (response.status === 200) {
            setVideoFeedUrl(feedUrl); // Set the dynamically generated URL
            console.log("Setting load status to false");
            setIsLoading(false);

        } else {
            console.log("We have an error")
            throw new Error(`Invalid video feed. Status Code: ${response.status}`);
        }
      } catch (error) {
          setError('Failed to load video feed. Ensure the camera is connected and available.');
          console.error("Error generating video feed URL:", error);
      } finally {
          console.log("Setting load status to false")
          setIsLoading(false);
      }

    };

    getVideoFeed();
  }, []); // Empty dependency to run this once after the component is mounted

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={orcLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>NodeORC configuration</h1>
        {isLoading && <p>Loading video feed...</p>}

        {error ? (
            <p className="text-danger">{error}</p>
        ) : (
        videoFeedUrl && (
          <img
            src={videoFeedUrl} // Dynamically set the URL
            alt="Live Video Stream"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )
   )}

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}


export default Home;