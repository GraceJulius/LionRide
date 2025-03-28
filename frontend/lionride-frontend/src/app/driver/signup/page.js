"use client";
import { useSearchParams } from "next/navigation";
import Signup from "../../signup/page"; //links the driver with the main signup page already created

export default function DriverSignup(){
    const searchParams = useSearchParams();
    const userType = searchParams.get("userType") || "USER";
    console.log("User Type:", userType);
    return <Signup userType={userType} />;
}