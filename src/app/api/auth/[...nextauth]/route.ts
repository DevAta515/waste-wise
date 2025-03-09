import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { createUser, getUserByEmail } from "@/utils/db/actions";

export const authOptions: NextAuthOptions = {
    providers: [
        // CredentialsProvider({
        //     name: "Credentials",
        //     credentials: {
        //         email: { label: "Email", type: "email", placeholder: "user@example.com" },
        //         password: { label: "Password", type: "password" },
        //     },
        //     async authorize(credentials) {
        //         console.log("User signed in:", credentials);
        //         if (credentials?.email && credentials?.password) {
        //             return { id: "1", name: "Demo User", email: credentials.email };
        //         }
        //         throw new Error("Invalid credentials");
        //     },
        // }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: { signIn: "/signin" },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user.email) return false; // Ensure email exists

            try {
                // ✅ Check if user exists in the database
                const existingUser = await getUserByEmail(user.email);

                // ✅ If user does not exist, insert into DB
                if (!existingUser && user.name) {
                    await createUser(user.email, user.name);
                }

                return true; // ✅ Allow login
            } catch (error) {
                console.error("Database error during sign-in:", error);
                return false; // ❌ Prevent login if DB error occurs
            }
        },
    }
    // session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
