import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
const UserButton = ({ session }: { session: Session }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const outsideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (
        outsideRef.current &&
        !outsideRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const battleTag = session.user.name;
  const displayName = battleTag?.substring(0, battleTag.indexOf("#"));

  return (
    <div className="relative" ref={outsideRef}>
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex cursor-pointer items-center gap-x-1"
      >
        {displayName}
        <AiFillCaretDown size="12" />
      </div>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 rounded border bg-neutral-900 text-neutral-100">
          <ul className="flex flex-col">
            <LinkButton
              setShow={setShowDropdown}
              href={`/users/${session.user?.id}`}
              label={"Profile"}
            ></LinkButton>
            <LinkButton
              setShow={setShowDropdown}
              href={`/team-invitations`}
              label={"Team Invitations"}
            ></LinkButton>
            <li className="cursor-pointer border-t border-neutral-700 p-2 px-3  text-left text-red-400 hover:bg-neutral-800">
              <div
                className="cursor-pointer"
                onClick={() => {
                  if (confirm("Log out?")) signOut();
                }}
              >
                Logout
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

const LinkButton = ({
  href,
  label,
  setShow,
}: {
  href: string;
  label: string;
  setShow: (arg0: boolean) => void;
}) => {
  const router = useRouter();
  return (
    <li
      onClick={() => {
        router.push(href);
        setShow(false);
      }}
      className="cursor-pointer py-2 px-3 text-left hover:bg-neutral-800"
    >
      <div className="whitespace-nowrap text-left">{label}</div>
    </li>
  );
};

export default UserButton;
