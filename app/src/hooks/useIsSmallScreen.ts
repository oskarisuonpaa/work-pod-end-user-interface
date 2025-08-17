import { useState, useEffect } from "react";

/**
 * Custom hook to determine if the screen size is small based on a given breakpoint.
 * @param {number} breakpoint - The width in pixels below which the screen is considered small.
 * @returns {boolean} True if the screen width is less than or equal to the breakpoint, false otherwise.
 * @description This hook listens for window resize events and updates the state accordingly.
 */
function useIsSmallScreen(breakpoint: number = 580) {
  const [isSmall, setIsSmall] = useState<boolean>(window.innerWidth <= breakpoint);

  useEffect(() => {
    const handleResize = () => setIsSmall(window.innerWidth <= breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isSmall;
}

export default useIsSmallScreen;