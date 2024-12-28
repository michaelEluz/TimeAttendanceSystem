import { useState, useEffect } from 'react';

const useTimeZoneDB = (zone = 'Europe/Berlin') => {
  const [time, setTime] = useState(null);  // State to store the formatted time
  const [loading, setLoading] = useState(true);  // State for loading state
  const [error, setError] = useState(null);  // State for error handling
  
  useEffect(() => {
    // Define the API URL with your TimeZoneDB API key and time zone
    const apiKey = 'YOUR_API_KEY';  // Replace with your TimeZoneDB API key
    const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=zone&zone=${zone}`;

    // Make the API request
    const fetchTime = async () => {
      setLoading(true);  // Set loading to true before fetching
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch time');
        }

        const data = await response.json();

        if (data.status === 'OK') {
          setTime(data.formatted);  // Set the formatted time
        } else {
          throw new Error('Error fetching time data');
        }
      } catch (err) {
        setError(err.message);  // Set the error message
      } finally {
        setLoading(false);  // Set loading to false after the fetch
      }
    };

    fetchTime();  // Call the function to fetch time

  }, [zone]);  // Dependency array to refetch when zone changes

  return { time, loading, error };
};

export default useTimeZoneDB;
