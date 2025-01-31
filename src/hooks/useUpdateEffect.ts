import { useEffect, useRef } from "react";

const useUpdateEffect = (callback: () => void, dependencies: any[]) => {
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    return callback();
  }, dependencies);
};

export default useUpdateEffect;
