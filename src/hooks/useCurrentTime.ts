import React, { useState, useEffect } from "react";

const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs only once

  return {
    time: currentTime.toLocaleTimeString(),
    date: formatDate(currentTime),
  };
};

export default useCurrentTime;
