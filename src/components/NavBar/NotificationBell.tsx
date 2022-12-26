import type { Team, TeamInvitation } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useEffect, useRef, useState } from "react";
import { IoIosNotifications } from "react-icons/io";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<
    (TeamInvitation & { team: Team })[]
  >([]);

  const [show, setShow] = useState<boolean>();
  const { data: userNotifications } = trpc.user.getTeamInvitations.useQuery();

  const outsideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (userNotifications && userNotifications.length > 0) {
        setNotifications(userNotifications);
      } else {
        setNotifications([]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [userNotifications]);

  useEffect(() => {
    const handler = (e: any): void => {
      if (outsideRef.current && !outsideRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div className="relative" ref={outsideRef}>
      <IoIosNotifications
        size="20"
        onClick={() => setShow(!show)}
        className="cursor-pointer"
      />

      {show && (
        <div className="absolute right-0 mt-2 w-60 rounded border bg-neutral-900 text-neutral-100">
          <ul className="flex flex-col p-3">
            {notifications.length > 0 &&
              notifications.map((noti) => (
                <li
                  key={noti.teamId + noti.userId}
                  className="flex justify-between py-2 px-3 text-left "
                >
                  <div className="">
                    Team Invitation from
                    {noti.team.name}
                  </div>
                  <button>Accept</button>
                </li>
              ))}
            {notifications.length === 0 && (
              <div className="text-center">No notifications</div>
            )}
          </ul>
        </div>
      )}

      {show}
    </div>
  );
};

export default NotificationBell;
