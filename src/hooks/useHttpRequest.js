import { useState } from 'react';

const useHttpRequest = (requestFunction, onSuccess, onFailure) => {
  const [result, setResult] = useState([]);
  const [isPerforming, setIsPerforming] = useState(false);

  const defaultOnFailure = (error) => {
    alert(`Oops! Something went wrong: ${error.message}`);
  };

  const performRequest = async (...args) => { // Accept multiple arguments
    if (isPerforming) return; // Prevent multiple concurrent requests
    setIsPerforming(true);
    
    try {
      // Await the request function to ensure the promise resolves
      const data = await requestFunction(...args); 
      console.log("the data is:" ,data);
      
      setResult(data);
      if(!data.success) throw new Error(`HTTP error: ${data.status} - ${data?.error
        || 'Unknown error'}`);
      if (onSuccess) onSuccess(data);
    } catch (err) {
      onFailure?.(err);
    } finally {
      setIsPerforming(false);
    }
  };

  return { result, isPerforming, performRequest };
};

export default useHttpRequest;
