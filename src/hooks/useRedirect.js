import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const useRedirect = (redirectPath) => {
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    router.push(redirectPath);

    setLoaded(true);
  }, [redirectPath]);

  return loaded;
};

export default useRedirect;
