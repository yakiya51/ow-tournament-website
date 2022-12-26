import type { ChangeEvent, Dispatch, MouseEvent, SetStateAction } from "react";
import type { Session } from "next-auth";
import { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "@utils/trpc";
import { z } from "zod";
import Modal from "@components/Modal";
import Link from "next/link";
import NavLink from "./NavLink";
import UserButton from "./UserButton";
import { AlertCategory, useAlerts } from "@context/AlertsContext";
import { HiUserGroup } from "react-icons/hi";

export const teamNameInputSchema = z
  .string()
  .trim()
  .min(5, {
    message: "Must be atleast 5 characters.",
  })
  .max(20, {
    message: "Must be 20 characters or less.",
  })
  .refine((val) => /^[A-Za-z\s]*$/.test(val), {
    message: "No special characters.",
  });

const AuthedNavBar = ({ session }: { session: Session }) => {
  const router = useRouter();
  const alerts = useAlerts();

  const [showTeamCreationModal, setShowTeamCreationModal] =
    useState<boolean>(false);
  const [teamName, setTeamName] = useState<string>("");

  const { mutateAsync: createTeam } = trpc.team.create.useMutation();

  const [error, setError]: [
    string | undefined,
    Dispatch<SetStateAction<string | undefined>>
  ] = useState();

  const handleCreateTeam = async (e: MouseEvent) => {
    e.preventDefault();
    const parse = teamNameInputSchema.safeParse(teamName);

    if (parse.success === false) {
      setError(parse.error.issues[0]?.message);
      return;
    }

    try {
      const { id: teamId } = await createTeam({ name: teamName });
      router.push(`/teams/${teamId}`);
      alerts.add({
        message: "Team created successfully!",
        category: AlertCategory.SUCCESS,
      });
      setShowTeamCreationModal(false);
    } catch (err) {
      console.log(err);
      alerts.add({
        message: "Failed to create team.",
        category: AlertCategory.ERROR,
      });
    }
  };

  const handleChange = (value: string) => {
    setTeamName(value);
    const parse = teamNameInputSchema.safeParse(value);

    if (parse.success === false) {
      setError(parse.error.issues[0]?.message);
    } else {
      setError("");
    }
  };

  return (
    <>
      <Modal
        show={showTeamCreationModal}
        hide={() => {
          setError("");
          setShowTeamCreationModal(false);
        }}
      >
        <div className="flex items-center gap-x-4">
          <div className="flex-grow">
            <label htmlFor="teamName" className=" text-neutral-400">
              Team Name
            </label>
            <input
              autoFocus={true}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(e.target.value)
              }
              required
              maxLength={20}
              className="w-full rounded border border-neutral-700 bg-neutral-900 py-1.5 px-3 outline-none focus:outline-none"
              id="teamName"
              type="text"
            />
          </div>
          <button
            onClick={handleCreateTeam}
            type="submit"
            className="mt-5 w-fit rounded bg-neutral-100 py-1.5 px-8 font-semibold text-neutral-900"
          >
            Create
          </button>
        </div>

        <p className="text-sm text-red-500">{error}</p>
      </Modal>
      <div className=" flex min-h-[64px] items-center border-b">
        <nav className="container flex w-full items-center justify-between text-sm">
          <div className="flex items-center">
            <Link className="text-xl font-bold" href="/">
              LOGO
            </Link>

            <ul className="ml-6 hidden mb:flex mb:items-center mb:gap-x-6">
              {/* <NavLink href="/home" title="Home" />
              <NavLink href="/tournaments" title="Tournaments" /> */}
            </ul>
          </div>

          <div className="flex items-center gap-x-5">
            <UserButton session={session} />
            <div className="border-l pl-5">
              {session.user.team && (
                <Link href={`/teams/${session.user.team.id}`}>
                  <HiUserGroup size="18" />
                </Link>
              )}

              {!session.user.team && (
                <button
                  onClick={() =>
                    setShowTeamCreationModal(!showTeamCreationModal)
                  }
                  className="rounded bg-neutral-100 px-2 py-1.5 font-semibold text-neutral-900"
                >
                  Create Team
                </button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default AuthedNavBar;
