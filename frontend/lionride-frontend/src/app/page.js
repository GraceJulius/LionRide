//Home/Landing Page
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Car, Bell, CreditCard, Upload } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative text-center text-white py-32">
        <div className="absolute inset-0">
          <Image
            src="/LU.jpeg"
            alt="Lincoln University"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold leading-tight">
            Catch A Ride. <br /> Make A Friend. <br /> Get Paid.
          </h1>
          <p className="mt-4 text-lg">
            Built for LU students by LU students.
          </p>
          <button className="mt-8 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg text-white font-semibold">
            Apply to Drive
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-100">
        <h2 className="text-3xl font-bold text-center text-orange-500">
          How <span className="italic">LionRide</span> Works
        </h2>

        <div className="flex flex-wrap justify-center gap-12 mt-12">
          {[
            { icon: <Car size={32} />, title: "Request a Ride" },
            { icon: <Upload size={32} />, title: "Post a Ride" },
            { icon: <Bell size={32} />, title: "Instant Notifications" },
            { icon: <CreditCard size={32} />, title: "Cashless Payment" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="max-w-xs bg-white p-6 rounded-lg text-center shadow hover:scale-105 transition"
            >
              <div className="text-orange-500 mb-4 mx-auto">{item.icon}</div>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-gray-600 mt-2">
                {idx === 0 && "Need to go somewhere? Request a ride easily."}
                {idx === 1 && "Want to offer a ride? List your trip & earn money."}
                {idx === 2 && "Stay updated with real-time notifications."}
                {idx === 3 && "Easy and secure payment via the app."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <h2 className="text-3xl font-bold text-center text-orange-500">
          <span className="italic">LionRide</span> Benefits
        </h2>

        <div className="flex flex-wrap justify-center gap-12 mt-12">
          {[ 
            {
              img: "/S1.jpg",
              title: "Flexible Working Hours",
              text: "Drive when you want, earn on your schedule.",
            },
            {
              img: "/S2.jpg",
              title: "Earnings",
              text: "Earn money by offering rides to fellow students.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="max-w-lg bg-gray-100 p-8 rounded-lg shadow-md hover:shadow-lg transition text-center"
            >
              <Image
                src={item.img}
                alt={item.title}
                width={160}
                height={160}
                className="w-40 h-40 object-cover rounded-lg mx-auto shadow-lg"

              />
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
