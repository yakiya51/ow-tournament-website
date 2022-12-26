import Link from "next/link";
import NavLink from "./NavLink";

const UnAuthedNavBar = () => {
  return (
    <div className=" flex min-h-[64px] items-center border-b">
      <nav className="container flex w-full items-center justify-between text-sm">
        <div className="flex">
          <Link className="flex items-center" href="/">
            <div className="text-xl font-bold">LOGO</div>
          </Link>

          <ul className="ml-6 hidden mb:flex mb:items-center mb:gap-x-6">
            {/* <NavLink href="/home" title="Home" />
            <NavLink href="/tournaments" title="Tournaments" /> */}
          </ul>
        </div>

        <div className="ml-auto flex items-center gap-5">
          <NavLink href="/login" title="Login" />

          <Link href="/signup">
            <button className="rounded bg-neutral-100  py-1.5 px-4 font-semibold text-neutral-900 ">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>
    </div>
  );
};
export default UnAuthedNavBar;
