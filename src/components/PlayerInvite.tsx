import { type ChangeEvent, useState } from "react";
import { useEffect } from "react";
import useDebounce from "@utils/useDebounce";
import type { User } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useSession } from "next-auth/react";
import { AlertCategory } from "@context/AlertsContext";
import { useAlerts } from "@context/AlertsContext";

const PlayerInvite = () => {
  const alert = useAlerts();
  const { data: session } = useSession();
  const [searchCondition, setSearchCondition] = useState<string>("");
  const [userList, setuserList] = useState<User[] | null>([]);

  const debouncedSearchCondition = useDebounce<string>(searchCondition, 300);
  const { data: searchResult, status } = trpc.user.getByBattleTag.useQuery(
    debouncedSearchCondition
  );

  const { mutateAsync: teamInviteMutation } =
    trpc.teamInvitation.create.useMutation();

  const handleChange = (value: string) => {
    if (value.length < 25) {
      setSearchCondition(value);
    }
  };

  const searchUsers = async () => {
    if (searchResult && searchResult.length > 0) {
      setuserList(searchResult);
    } else {
      setuserList(null);
    }
  };

  useEffect(() => {
    searchUsers();
  }, [debouncedSearchCondition, searchResult]);

  const handleInvite = async (userId: string) => {
    if (session && session.user && session.user.team) {
      try {
        // await teamInviteMutation({
        //   userId: userId,
        //   teamId: session.user.team.id,
        // });
        alert.add({
          message: "Invitation sent.",
          category: AlertCategory.ERROR,
        });
        await searchUsers();
        return;
      } catch (e) {
        alert.add({
          message: "Invitation failed.",
          category: AlertCategory.ERROR,
        });
      }
    }
  };

  return (
    <div className="">
      <input
        type="text"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange(e.target.value)
        }
        value={searchCondition}
        autoFocus={true}
        placeholder="Search players"
        className="text-netural-50 w-full rounded bg-neutral-800 px-2 py-3 outline-none focus:ring-1 focus:ring-neutral-500"
      />

      <div className="mt-5 flex flex-col border-t">
        {userList &&
          userList.map((user) => (
            <div key={user.id} className="flex justify-between py-5">
              <div className="">{user.name}</div>
              <button
                onClick={() => handleInvite(user.id)}
                className="rounded bg-neutral-100 px-1.5 text-neutral-900"
              >
                +
              </button>
            </div>
          ))}
        {!userList && <div>No results</div>}
      </div>
    </div>
  );
};

export default PlayerInvite;
