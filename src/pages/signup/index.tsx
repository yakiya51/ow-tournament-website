import BattleNetOAuth from "@components/BattleNetAuth";
import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { getProviders, getCsrfToken } from "next-auth/react";

export default function SignUp() {
  return (
    <div className="container">
      <div className="flex flex-col justify-center text-center">
        <div className="my-10 text-2xl font-semibold text-neutral-400">
          Create An Account
        </div>
        <div className="flex justify-center">
          <BattleNetOAuth />
        </div>
      </div>
    </div>
  );
}
