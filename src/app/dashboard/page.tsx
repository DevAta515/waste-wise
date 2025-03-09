"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    const { data: session, status } = useSession();

    if (status === "loading") return <p>Loading...</p>;
    if (!session) return <p className="text-center mt-10 text-xl">Access Denied. Please sign in.</p>;

    return (
        <main className="text-center mt-10">
            <h1 className="text-2xl font-bold">Welcome, {session.user?.email}</h1>
            <Button
                className="mt-4"
                onClick={async () => {
                    await signOut({ redirect: true, callbackUrl: "/" });
                }}
            >
                Sign Out
            </Button>
        </main>
    );
}
