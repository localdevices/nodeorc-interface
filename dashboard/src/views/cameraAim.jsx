import React, {useState, useEffect} from 'react';

import reactLogo from '/react.svg'
import orcLogo from '/orc_favicon.svg'
import api from "../api"
import './cameraAim.css'

const CameraAim = () => {
  const [videoFeedUrl, setVideoFeedUrl] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggledOn, setIsToggledOn] = useState(false); // Toggle state
  const [isSwitchDisabled, setIsSwitchDisabled] = useState(true); // State

  // define if the switch for Raspi camera should be disabled or enabled
  useEffect(() => {
    const fetchSwitchState = async () => {
      try {
        const response = await api.get("/pivideo/has_picam");
        console.log(response);
        if (response.status === 200) {
          const { enabled } = response.data;
          setIsSwitchDisabled(!enabled); // Disable if "enabled" is false
        } else {
          throw new Error("Invalid API response");
        }
      } catch (error) {
        console.error("Failed to fetch availability of Raspi camera:", error);
        setError("Failed to establish if a raspberry pi camera is available or not.");
      }
    };

    fetchSwitchState(); // Call the function when the component mounts
  }, []);

  // Function to handle the toggle state change
  const handleToggle = async () => {
    setIsLoading(true);
    const newState = !isToggledOn; // Determine new state
    setIsToggledOn(newState); // Update toggle state
    try {
      if (newState) {
        // Call endpoint for "enabled" state
        await api.post('/pivideo/start');
        console.log("PiCamera enabled.");
        const feedUrl = `${api.defaults.baseURL}/pivideo/stream`;
        setVideoFeedUrl(feedUrl);
      } else {
        // Call endpoint for "disabled" state
        await api.post('/pivideo/stop');
        console.log("PiCamera disabled.");
      }
    } catch (error) {
      console.error("Error or disabling PiCamera:", error);
      setError('Failed to enable/disable PiCamera.');
    } finally {
      console.log("Setting load status to false")
      setIsLoading(false);
    }
  };
  // submit form to display stream
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null); // reset errors before doing a new check
    const getVideoFeed = async () => {
      try {
        console.log(event);
        const videoUrl = event.target.videoUrl.value;
        const feedUrl = `${api.defaults.baseURL}/video/feed/?video_url=${encodeURIComponent(videoUrl)}`;
        // test the feed by doing an API call
        const response = await api.head('/video/feed/?video_url=' + encodeURIComponent(videoUrl));
        if (response.status === 200) {
            setVideoFeedUrl(feedUrl); // Set the dynamically generated URL
            console.log("Setting load status to false");
            setIsLoading(false);

        } else {
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
  };

  return (
    <>
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
      <div className='container'>
        <form onSubmit={handleFormSubmit}>
            <div className='mb-3 mt-3'>
                <label htmlFor='name' className='form-label'>
                    Video stream URL (e.g. rtsp://... or http://)
                </label>
                <input type='text' className='form-control' id='videoUrl' name='videoUrl'/>
            </div>
            <button type='submit' className='btn btn-primary'>
                Submit
            </button>
        </form>
      </div>
      <div className='container'>
          <div className='mb-3 mt-3'>Start Raspberry Pi camera (only on Raspberry systems with camera)
            <div className="form-check form-switch">
              <label className="form-label" htmlFor="picamSwitch" style={{ marginLeft: '0' }}></label>
              <input
                style={{width: "40px", height: "20px", borderRadius: "15px"}}
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="picamSwitch"
                onClick={handleToggle}
                {...(isSwitchDisabled ? { disabled: "" } : {})}
              />
            </div>
          </div>
      </div>
    </>
  )
}


export default CameraAim;