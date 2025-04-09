/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { Menu, Coins, Leaf, Search, Bell, User, ChevronDown, LogIn } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import AuthForm from "@/components/AuthForm"
import { getUnreadNotifications, getUserByEmail, getUserBalance, markNotificationAsRead } from "@/utils/db/actions";


interface HeaderProps {
    onMenuClick: () => void;
}
interface Notification {
    id: number;
    type: string;
    message: string;
}


export default function Header({ onMenuClick }: HeaderProps) {
    const { data: session } = useSession();
    const [loggedIn, setLoggedIn] = useState(false);
    const [signInPopUp, setSignInPopUp] = useState(false);
    // const [loading, setLoading] = useState(true);
    // @ts-expect-errror
    const [userInfo, setUserInfo] = useState<any>(null);
    // const pathname = usePathname()
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [balance, setBalance] = useState(0);
    const isMobile = useMediaQuery("(max-width:768px)")

    useEffect(() => {
        if (session?.user) {
            setSignInPopUp(false);
            setUserInfo(session.user);
            const name = session.user.name;
            const email = session.user.email;
            console.log(name, email);
            setLoggedIn(true);
        }
    }, [session]);
    const handleNotificationClick = async (notificationId: number) => {
        await markNotificationAsRead(notificationId);
        setNotifications(prevNotifications =>
            prevNotifications.filter(notification => notification.id !== notificationId)
        );
    };

    const login = () => {
        setSignInPopUp(true);
    }
    const onClose = () => {
        setSignInPopUp(false);
    }
    const getUserInfo = () => {
        console.log("Login clicked")
    }

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (session?.user?.email) {
                    const email = session.user.email;
                    const user = await getUserByEmail(email);
                    if (user) {
                        const result = await getUnreadNotifications(user?.id);
                        setNotifications(result);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        // Call fetchNotifications immediately after defining it
        fetchNotifications();

        // Set up periodic checking for new notifications
        const notificationInterval = setInterval(fetchNotifications, 30000); // Check every 30 seconds
        return () => clearInterval(notificationInterval);
    }, [session?.user?.email]); // Add session?.user?.email as dependency to run effect when it changes


    useEffect(() => {
        const fetchUserBalance = async () => {
            if (userInfo && userInfo.email) {
                const user = await getUserByEmail(userInfo.email);
                if (user) {
                    const userBalance = await getUserBalance(user.id);
                    setBalance(userBalance);
                }
            }
        };

        fetchUserBalance();

        // Correctly type the event listener
        // @ts-expect-errror
        const handleBalanceUpdate = (event: CustomEvent<any>) => {
            setBalance(event.detail);
        };
        window.addEventListener('balanceUpdated', handleBalanceUpdate as EventListener);
        return () => {
            window.removeEventListener('balanceUpdated', handleBalanceUpdate as EventListener);
        };
    }, [userInfo]);

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center">
                    <Button variant='ghost' size='icon' className="mr-2 md:mr-4" onClick={onMenuClick} >
                        <Menu className="h-6 w-6 text-gray-800" />
                    </Button>
                    <Link href={"/"} className="flex items-center">
                        <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-1 md:mr-2"></Leaf>
                        <span className="font-bold text-base md:text-lg text-gray-800">WasteWise</span>
                    </Link>
                </div>
                {!isMobile && (
                    <div className="flex-1 max-w-xl mx-4">
                        <div className="relative">
                            <input type="text" placeholder="Search..." className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500" />
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 " />
                        </div>
                    </div>
                )}
                <div className="flex items-center">
                    {isMobile && (
                        <Button variant='ghost' size="icon" className="mr-2">
                            <Search className="w-5 h-5"></Search>
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-2 relative">
                                <Bell className="h-5 w-5 text-gray-800"></Bell>
                                {notifications.length > 0 && (
                                    <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] ">{notifications.length}</Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className="w-64">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <DropdownMenuItem
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification.id)}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium">{notification.type}</span>
                                            <span className="text-sm text-gray-500">{notification.message}</span>
                                        </div>
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <DropdownMenuItem>No new notifications</DropdownMenuItem>
                            )}
                        </ DropdownMenuContent>
                    </DropdownMenu>
                    <div className="mr-2 md:mr-4 flex items-center bg-gray-100 rounded-full px-2 md:px-3 py-1">
                        <Coins className="h-4 w-4 md:h-5 md:w-5 mr-1 text-green-500" />
                        <span className="font-semibold text-sm md:text-base text-gray-800">
                            {balance.toFixed(2)}
                        </span>
                    </div>
                    {!loggedIn ? (
                        <Button onClick={login} className="bg-green-600 hover:bg-green-700 text-white text-sm md:text-base">
                            Login
                            <LogIn className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="flex items-center">
                                    <User className="h-5 w-5 mr-1" />
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={getUserInfo}>
                                    {userInfo ? userInfo.name : "Fetch User Info"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/settings">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem onClick={
                                    async () => {
                                        await signOut({ redirect: true, callbackUrl: "/" });
                                    }}>
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
            {signInPopUp && <AuthForm onClose={onClose}></AuthForm>}
        </header>
    )
}