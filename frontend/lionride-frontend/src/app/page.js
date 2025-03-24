//Home/Landing Page
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="text-center py-16 px-4 bg-white">
        <h1 className="text-4xl font-bold text-gray-900">
          SIGN UP WITH OUR APP, <br />
          SAVE MONEY, MAKE FRIENDS!
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Get a link to have access to the app.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="p-3 border rounded-md w-1/3"
          />
          <button className="bg-orange-500 text-white px-5 py-3 rounded-md">
            APPLY TO DRIVE
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-100">
        <h2 className="text-3xl font-bold text-center text-orange-500">How <span className="italic">LionRide</span> Works</h2>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          <div className="max-w-xs text-center">
            <h3 className="text-lg font-bold">1. Request a Ride</h3>
            <p className="text-gray-600">Need to go somewhere? Request a ride easily.</p>
          </div>
          <div className="max-w-xs text-center">
            <h3 className="text-lg font-bold">2. Post a Ride</h3>
            <p className="text-gray-600">Want to offer a ride? List your trip and earn money.</p>
          </div>
          <div className="max-w-xs text-center">
            <h3 className="text-lg font-bold">3. Instant Notifications</h3>
            <p className="text-gray-600">Stay updated with real-time notifications.</p>
          </div>
          <div className="max-w-xs text-center">
            <h3 className="text-lg font-bold">4. Cashless Payment</h3>
            <p className="text-gray-600">Easy and secure payment via the app.</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-orange-500">
          <span className="italic">LionRide</span> BENEFITS
        </h2>
        <div className="flex flex-wrap justify-center gap-12 mt-8">
          <div className="max-w-lg bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">01. Flexible Working Hours</h3>
            <p className="text-gray-600">Drive when you want, earn on your schedule.</p>
          </div>
          <div className="max-w-lg bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">02. Earnings</h3>
            <p className="text-gray-600">Earn money by offering rides to fellow students.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
};