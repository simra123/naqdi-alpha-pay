import React, { useRef, useEffect, useCallback } from "react";

const Clock = () => {
  const inputRef = useRef(null);

  const formatDate = useCallback((date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const currentDate = formatDate(currentTime);
      const formattedTime = currentTime.toLocaleTimeString();
      console.log(currentDate);
      if (inputRef.current) {
        inputRef.current.innerText = `${currentDate} / ${formattedTime}`;
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <p className="text-sm primary-color font-bold" ref={inputRef}></p>;
};

export default Clock;
