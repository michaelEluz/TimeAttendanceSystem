import { useState, useEffect } from 'react';

// Utility function to format the date
const formatDateToBerlinDDMMYYYY = (datetime) => {
  const date = new Date(datetime);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year}: ${hours}:${minutes}`;
};

const useWorldTimeApi = (timeZone = 'Europe/Berlin') => {
  const [time, setTime] = useState(null);   // Formatted time (DD-MM-YYYY: HH:MM)
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);   // Error state

  useEffect(() => {
    // Function to fetch the time from the World Time API
    const fetchTime = async () => {
      setLoading(true);  // Set loading to true before fetching data
      try {
        const response = await fetch(`https://worldtimeapi.org/api/timezone/${timeZone}`);
        const data = await response.json();
        
        if (response.ok) {
          setTime(formatDateToBerlinDDMMYYYY(data.datetime));  // Format the datetime and set it
        } else {
          throw new Error(data.error || 'Error fetching time');
        }
      } catch (err) {
        setError(err.message);  // Handle error and set the error state
      } finally {
        setLoading(false);  // Set loading to false after the request
      }
    };

    fetchTime();  // Call the fetch function
    
  }, [timeZone]);  // The hook will run again if the `timeZone` changes

  return { time, loading, error };
};

export default useWorldTimeApi;
