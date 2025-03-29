"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="LionRide Logo" width={40} height={40} />
          <span className="text-xl font-bold text-orange-600">LionRide</span>
        </Link>

        {/* Primary Navigation Links (Ride & Drive) */}
        <div className="flex space-x-6">
          <Link
            href="/signup"
            className={`font-bold  hover:text-orange-500 ${
              pathname.includes("/ride") ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Ride
          </Link>

          <Link
            href={{
              pathname: "/driver/signup",
              query: { userType: "DRIVER" },
            }}
            className={`font-bold hover:text-orange-500 ${
              pathname.includes("/driver") ? "text-orange-600" : "text-gray-600"
            }`}
          >
            Drive
          </Link>
        </div>
      </div>

      {/* Right Side Links (Auth & Help) */}
      <div className="space-x-6 flex items-center">
        {isAuthenticated ? (
          <Link
            href="/profile"
            className={`font-bold hover:text-orange-500 ${
              pathname === "/profile" ? "font-bold text-orange-600" : ""
            }`}
          >
            Profile
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className={`font-bold hover:text-orange-500 ${
                pathname === "/login" ? "font-bold text-orange-600" : ""
              }`}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={`font-bold hover:text-orange-500 ${
                pathname === "/signup" ? "font-bold text-orange-600" : ""
              }`}
            >
              Sign Up
            </Link>
          </>
        )}

        <Link
          href="/help"
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
        >
          Help
        </Link>
      </div>
    </nav>
  );
}
