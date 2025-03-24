import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      {/* Logo + Name */}
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/logo.png" alt="LionRide Logo" width={40} height={40} />
        <span className="text-xl font-bold text-orange-600">LionRide</span>
        <span className="text-xl font-bold text-blue-600">Ride</span>
        <span className="text-xl font-bold text-orange-600">Drive</span>
      </Link>

      {/* Navigation Links */}
      <div className="space-x-6">
        <Link href="/login" className="text-gray-600 hover:text-orange-500">Login</Link>
        <Link href="/signup" className="text-gray-600 hover:text-orange-500">SignUp</Link>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-md">Help</button>
      </div>
    </nav>
  );
}
