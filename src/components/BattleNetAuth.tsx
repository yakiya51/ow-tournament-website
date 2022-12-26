import { signIn } from "next-auth/react";
import { SiBattledotnet } from "react-icons/si";

const BattleNetOAuth = () => {
  return (
    <button
      className="max-w-md rounded bg-[#148EFF] py-2 px-5 text-center font-semibold"
      onClick={() => signIn("battlenet")}
    >
      <div className="flex w-full items-center justify-center gap-x-3 text-center">
        <SiBattledotnet size="18" /> Continue with Battle Net
      </div>
    </button>
  );
};

export default BattleNetOAuth;
