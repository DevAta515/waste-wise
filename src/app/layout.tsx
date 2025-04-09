"use client"
import "./globals.css";
import { Providers } from "./providers"
import { Inter } from 'next/font/google'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
// import { getAvailableRewards, getUserByEmail } from "@/utils/db/actions";
import Sidebar from "@/components/Sidebar";
import SessionHeader from "@/components/SessionHeader";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSideBarOpen] = useState(false);
  // const { data: session } = useSession();

  // useEffect(() => {
  //   const fetchTotalEarnings = async () => {
  //     try {
  //       const userEmail = session?.user?.email
  //       if (userEmail) {
  //         const user = await getUserByEmail(userEmail)
  //         console.log('user from layout', user);

  //         if (user) {
  //           const availableRewards = await getAvailableRewards(user.id) as any
  //           console.log('availableRewards from layout', availableRewards);
  //           setTotalEarnings(availableRewards)
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching total earnings:', error)
  //     }
  //   }
  //   fetchTotalEarnings()
  // }, [session]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <SessionHeader onMenuClick={() => {
              console.log("Clicked")
              setSideBarOpen(!sidebarOpen)
            }} />
            <div className="flex flex-1 ">
              <Sidebar open={sidebarOpen} />
              <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
