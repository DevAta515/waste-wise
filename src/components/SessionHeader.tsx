"use client";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { getUserByEmail, getAvailableRewards } from "@/utils/db/actions";


export default function SessionHeader({ onMenuClick }: { onMenuClick: () => void }) {
    const { data: session } = useSession();
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [sidebarOpen, setSideBarOpen] = useState(false);
    useEffect(() => {
        const fetchTotalEarnings = async () => {
            try {
                const userEmail = session?.user?.email
                if (userEmail) {
                    const user = await getUserByEmail(userEmail)
                    console.log('user from layout', user);

                    if (user) {
                        const availableRewards = await getAvailableRewards(user.id) as any
                        console.log('availableRewards from layout', availableRewards);
                        setTotalEarnings(availableRewards)
                    }
                }
            } catch (error) {
                console.error('Error fetching total earnings:', error)
            }
        }
        fetchTotalEarnings()
    }, [session]);

    return <Header onMenuClick={() => setSideBarOpen(!sidebarOpen)} totalEarnings={totalEarnings} />;
}
