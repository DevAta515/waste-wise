"use client";

import { useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface AuthModalProps {
    onClose: () => void;
}

export default function AuthForm({ onClose }: AuthModalProps) {
    // const { data: session } = useSession();
    const modalRef = useRef<HTMLDivElement>(null);
    // const router = useRouter();
    // Close when clicking outside the modal
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handleGoogleSignIn = async () => {
        await signIn("google", { callbackUrl: "/", redirect: true });
        // onClose();

    };
    // useEffect(() => {
    //     if (session) {
    //         onClose();
    //         router.push("/"); // Redirect to dashboard after login
    //     }
    // }, [session, router, onClose]);

    return (
        <div className="fixed inset-0 bg-transparent flex justify-center items-center z-[60] backdrop-blur-sm">
            <div ref={modalRef} className="relative shadow-lg w-96 p-6 border-green-400 border-[1px] rounded-lg">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-1 right-3 text-black-500 hover:text-black"
                >
                    <X className="w-5 h-5" onClick={() => console.log("clicked")} />
                </button>

                {/* Modal Content */}
                <Card>
                    <CardHeader className="text-center text-xl font-semibold">
                        Sign In
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <Button onClick={handleGoogleSignIn} className="w-full">
                            Sign in with Google
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
