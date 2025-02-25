import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useMountedQueue = (
  apiFunctions: (() => Promise<void>)[],
  queue,
  { setLastFetch, setMounted, enqueueCall }
) => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    apiFunctions.map((fn) => fn()); // Call all provided functions
    dispatch(setLastFetch(Date.now()));
  };

  useEffect(() => {
    dispatch(setMounted(true));

    if (queue) {
      fetchData(); // Call APIs only if queue was active when mounting
    }

    return () => {
      dispatch(setMounted(false)); // Track when component unmounts
    };
  }, [queue, dispatch]);

  return () => dispatch(enqueueCall());
};
export default useMountedQueue;
