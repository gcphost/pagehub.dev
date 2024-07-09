import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

const SignInPage = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) void signOut();
    setTimeout(() => window.close(), 500);
  }, [session, status]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        left: 0,
        top: 0,
        background: "white",
      }}
    >
      Logging out...
    </div>
  );
};

export default SignInPage;
