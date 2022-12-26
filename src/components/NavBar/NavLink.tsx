import Link from "next/link";

const NavLink = ({ href, title }: { href: string; title: string }) => {
  return (
    <Link href={href}>
      <div className="text-neutral-400 transition hover:text-neutral-100">
        {title}
      </div>
    </Link>
  );
};

export default NavLink;
