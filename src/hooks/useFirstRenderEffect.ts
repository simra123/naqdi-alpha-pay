import { useEffect, useRef } from "react";

const useFirstRenderEffect = (callback: () => void) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      callback();
    }
  }, []); // Empty dependency array ensures it only runs once
};

export default useFirstRenderEffect;
