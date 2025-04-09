/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import AuthForm from "@/components/AuthForm";
import { useState } from "react";
export default function SignInPage() {
    const onClose = () => {
        console.log("")
        setSignInPopUp(false);
    }
    const [signInPopUp, setSignInPopUp] = useState(false);
    return <AuthForm onClose={onClose} />;
}
