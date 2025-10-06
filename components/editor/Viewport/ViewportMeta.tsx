import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { ViewAtom } from "./index";

export const ViewportMeta = () => {
  const view = useRecoilValue(ViewAtom);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Add a class to the HTML element to simulate mobile viewport
    const htmlElement = document.documentElement;

    if (view === "mobile") {
      // Add mobile simulation class
      htmlElement.classList.add('mobile-preview');
      htmlElement.classList.remove('desktop-preview');
    } else {
      // Add desktop class
      htmlElement.classList.add('desktop-preview');
      htmlElement.classList.remove('mobile-preview');
    }

    // Cleanup function
    return () => {
      htmlElement.classList.remove('mobile-preview', 'desktop-preview');
    };
  }, [view]);

  return null; // This component doesn't render anything
};
