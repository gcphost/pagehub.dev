import { useEffect } from "react";
import { RecoilEnv, RecoilRoot } from "recoil";

import { SessionProvider } from "next-auth/react";
import "react-tooltip/dist/react-tooltip.css";
import "../styles/app.css";

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    const setHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setHeight();

    window.addEventListener("resize", setHeight);

    return () => window.removeEventListener("resize", setHeight);
  }, []);

  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Component {...pageProps} />

        <iframe
          className="hidden"
          name="iframe"
          id="iframe"
          title="Submission Frame"
        ></iframe>
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;
