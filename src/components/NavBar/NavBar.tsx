import { useSession } from "next-auth/react";
import AuthedNavBar from "./AuthedNavBar";
import UnAuthedNavBar from "./UnAuthedNavBar";

const BaseNavBar = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className=" flex min-h-[64px] items-center border-b"></div>;
  }

  if (session) {
    return <AuthedNavBar session={session} />;
  }
  return <UnAuthedNavBar />;
};

export default BaseNavBar;
