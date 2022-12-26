import NextAuth, { type NextAuthOptions } from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "@env/server.mjs";
import { prisma } from "@server/db/client";
import type { AdapterAccount } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   return true;
    // },
    async session({ session, token, user }) {
      const userInfo = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          asTeamMember: {
            include: {
              team: true,
            },
          },
          accounts: {
            where: {
              provider: "battlenet",
            },
          },
        },
      });
      if (session && session.user) {
        session.user.team = userInfo?.asTeamMember?.team;
        session.user.id = user.id;
        // session.user.bNetId = (userInfo?.accounts[0] as Account).id;
      }
      return session;
    },
  },
  events: {
    // async linkAccount({ user, account, profile }) {
    //   console.log(user, account, profile);
    //   return;
    // },
  },
  adapter: {
    ...PrismaAdapter(prisma),
    async linkAccount(data) {
      if (data.provider === "battlenet") {
        // Remove the "sub" attribute because it causes an error
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { sub, ...accountData } = data;
        await prisma.account.create({
          data: {
            id: data.sub as string,
            ...accountData,
          },
        });
      } else {
        (await prisma.account.create({ data })) as unknown as AdapterAccount;
      }
    },
  },
  providers: [
    BattleNetProvider({
      clientId: env.BATTLENET_CLIENT_ID,
      clientSecret: env.BATTLENET_CLIENT_SECRET,
      issuer: "https://us.battle.net/oauth",
    }),
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    //   profile(profile) {
    //     return {
    //       id: profile.id,
    //       name: profile.username,
    //       email: profile.email,
    //       image: profile.image_url,
    //       discordTag: profile.username + "#" + profile.discriminator,
    //     };
    //   },
    // }),
  ],
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
