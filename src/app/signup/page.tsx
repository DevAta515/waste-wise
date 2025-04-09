"use client"
import AuthForm from "@/components/AuthForm";
import { useState } from "react";
const [signInPopUp, setSignInPopUp] = useState(false);
const onClose = () => {
    console.log("")
    setSignInPopUp(false);
}
export default function SignUpPage() {
    return <AuthForm onClose={onClose} />;
}
