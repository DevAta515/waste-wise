/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import AuthForm from "@/components/AuthForm";
import { useState } from "react";
export default function SignUpPage() {
    const [signInPopUp, setSignInPopUp] = useState(false);
    const onClose = () => {
        console.log("")
        setSignInPopUp(false);
    }
    return <AuthForm onClose={onClose} />;
}
