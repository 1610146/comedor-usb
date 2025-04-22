import { AuthOptions } from "next-auth";
import connectMongoDB from "./lib/mongodb";
import User from "./models/user.model";
import GoogleProvider from "next-auth/providers/google";
import { Profile } from "next-auth";

interface GoogleProfile extends Profile {
  sub: string;
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
  role?: string;
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          image: profile.picture,
          role: profile.role ? profile.role : "user",
        };
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user, account }: any) {
      if (account.provider === "google") {
        const { email } = user;
        /*if (!email.endsWith("@usb.ve")) {
          console.log("Invalid email domain:", email);
          throw new Error(
            "Solo se pueden registrar correos que terminen en usb.ve"
          );
        }*/

        try {
          await connectMongoDB();
          const userExists = await User.findOne({ email});

          if (!userExists) {
            const res = await fetch("http://localhost:5500/api/user", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user
              }),
            });

            if (res.ok) {
              return user;
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      return user;
    },
  },
} satisfies AuthOptions;

export default authOptions;
