import { useState, useEffect } from "react";

function useIsSmallScreen(breakpoint: number = 540) {
  const [isSmall, setIsSmall] = useState<boolean>(window.innerWidth <= breakpoint);

  useEffect(() => {
    const handleResize = () => setIsSmall(window.innerWidth <= breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isSmall;
}

export default useIsSmallScreen;