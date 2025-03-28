"use client"; // Mark as a client component
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Signup from "../../signup/page"; // Links the driver with the main signup page already created

// Component that uses useSearchParams
function DriverSignupContent() {
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType") || "USER";
  console.log("User Type:", userType);
  return <Signup userType={userType} />;
}

// Default export for the page
export default function DriverSignup() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DriverSignupContent />
    </Suspense>
  );
}