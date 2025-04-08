// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

// // custom map styling.. might change it later on
// // const customMapStyle = [
// //   {
// //     elementType: "geometry",
// //     stylers: [{ color: "#f5f5f5" }],
// //   },
// //   {
// //     elementType: "labels.icon",
// //     stylers: [{ visibility: "off" }],
// //   },
// //   {
// //     featureType: "road",
// //     stylers: [{ color: "#ffffff" }],
// //   },
// //   {
// //     featureType: "water",
// //     stylers: [{ color: "#c9dffa" }],
// //   },
// // ];

// const mapContainerStyle = {
//   width: "100%",
//   height: "400px",
// };

// export default function RideDetailsPage() {
//   const { rideId } = useParams();
//   const router = useRouter();
//   const [ride, setRide] = useState(null);
//   const [directions, setDirections] = useState(null);
//   const [error, setError] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
//     libraries: ["places"],
//   });

//   // Get initials from localStorage... just a little customization
//   // just scratch this or come back
//  /* let initials = "??";
//   const first = typeof window !== "undefined" && localStorage.getItem("firstName");
//   const last = typeof window !== "undefined" && localStorage.getItem("lastName");

//   if (first && last) {
//     initials = `${first[0]}${last[0]}`.toUpperCase();
//   }


// const [initials, setInitials] = useState("??");

// useEffect(() => {
//   const first = localStorage.getItem("firstName");
//   const last = localStorage.getItem("lastName");

//   if (first && last) {
//     const computedInitials = `${first[0]}${last[0]}`.toUpperCase();
//     setInitials(computedInitials);
//   }
// }, []);

// */


//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     document.documentElement.classList.toggle("dark");
//   };

//  /* to cancel ride with confirmation and debugging */
// const handleCancelRide = async () => {
//     const confirm = window.confirm("Are you sure you want to cancel this ride?");
//     if (!confirm) return; // If user says no, don't cancel
  
//     const token = localStorage.getItem("token");
//     const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
//     try {
//       const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}/cancel`, {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json", // check this later
//         },
//         body: JSON.stringify({ status: "cancelled"}),
//       });
  
//       // Log raw response for debugging
//       const responseBody = await response.text();
//       console.log("Cancel response:", response.status, responseBody);
  
//       if (!response.ok) {
//         throw new Error(`Failed to cancel ride: ${response.statusText}`);
//       }
  
//       // Redirect to dashboard after successful cancel
//       router.push("/dashboard");
//     } catch (err) {
//       console.error("Cancel error:", err);
//       alert("Could not cancel ride. See console for details.");
//     }
//   };
  
  

//   useEffect(() => {
//     const fetchRide = async () => {
//       const token = localStorage.getItem("token");
//       const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

//       try {
//         const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!response.ok) throw new Error("Failed to fetch ride details");
//         const data = await response.json();
//         setRide(data);
//       } catch (err) {
//         setError("Unable to load ride info");
//         console.error(err);
//       }
//     };

//     fetchRide();
//   }, [rideId]);

//   useEffect(() => {
//     if (!isLoaded || !ride) return;

//     const directionsService = new window.google.maps.DirectionsService();
//     directionsService.route(
//       {
//         origin: ride.pickupAddress,
//         destination: ride.destinationAddress,
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === "OK") {
//           setDirections(result);
//         } else {
//           console.error("Directions failed:", status);
//         }
//       }
//     );
//   }, [isLoaded, ride]);

//   if (!isLoaded) return <p>Loading map...</p>;
//   if (error) return <p>{error}</p>;
//   if (!ride) return <p>Loading ride details...</p>;

//   return (
//     <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
//       {/* Top Bar */}
//       <header className="flex justify-between items-center px-6 py-4 shadow-md bg-white dark:bg-gray-800">
//         <h1 className="text-2xl font-bold text-orange-600 dark:text-orange-400">LionRide</h1>

//         <div className="flex items-center gap-4">
//           {/* Theme Toggle */}
//           <button
//             onClick={toggleDarkMode}
//             className="text-sm px-3 py-1 border rounded-md dark:border-white border-black hover:bg-blue-100 dark:hover:bg-orange-800"
//           >
//             {darkMode ? "Light Mode" : "Dark Mode"}
//           </button>

//           {/* Profile Bubble with Dynamic Initials
//           <div className="h-10 w-10 rounded-full bg-blue-600 dark:bg-orange-500 flex items-center justify-center text-white font-bold shadow-md">
//             {initials}
//           </div> */}
//         </div>
//       </header>

//       <main className="p-6 max-w-3xl mx-auto space-y-6">
//         {/* Ride Card */}
//         <div className="backdrop-blur-md bg-white/70 dark:bg-gray-700/40 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
//           <h2 className="text-lg mb-3 font-semibold tracking-wide">Ride Summary</h2>
//           <p><span className="text-gray-500">From:</span> {ride.pickupAddress}</p>
//           <p><span className="text-gray-500">To:</span> {ride.destinationAddress}</p>
//           <p className="mt-3 text-xl font-bold text-blue-700 dark:text-orange-300">
//             Estimated Fare: ${ride.estimatedFare}
//           </p>
//         </div>

//         {/* Map */}
//         <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-md">
//           <GoogleMap
//             mapContainerStyle={mapContainerStyle}
//             zoom={13}
//             center={{ lat: 39.809, lng: -75.931 }}
//             //options={{ styles: customMapStyle }}
//           >
//             {directions && <DirectionsRenderer directions={directions} />}
//           </GoogleMap>
//         </div>

//         {/* Request Button */}
//         {/* <button
//           onClick={() => router.push(`/ride/${rideId}/driver`)}
//           className="w-full py-3 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-blue-600 to-orange-500 hover:opacity-90 transition"
//         >
//           Request Ride
//         </button> */}

// <div className="flex flex-col sm:flex-row gap-4">
//   <button
//     onClick={() => router.push(`/ride/${rideId}/driver`)}
//     className="flex-1 py-3 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 transition"

//   >
//     Request Ride
//   </button>

//   <button
//     onClick={handleCancelRide}
//     className="flex-1 py-3 rounded-xl border border-red-600 text-red-600 font-bold text-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition"
//   >
//     Cancel
//   </button>
// </div>

//       </main>
//     </div>
//   );
// }





"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

export default function RideDetailsPage() {
  const { rideId } = useParams();
  const router = useRouter();
  const [ride, setRide] = useState(null);
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleCancelRide = async () => {
    const confirm = window.confirm("Are you sure you want to cancel this ride?");
    if (!confirm) return;

    const token = localStorage.getItem("token");
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      const responseBody = await response.text();
      console.log("Cancel response:", response.status, responseBody);

      if (!response.ok) {
        throw new Error(`Failed to cancel ride: ${response.statusText}`);
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Could not cancel ride. See console for details.");
    }
  };

  useEffect(() => {
    const fetchRide = async () => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch ride details");
        const data = await response.json();
        setRide(data);
      } catch (err) {
        setError("Unable to load ride info");
        console.error(err);
      }
    };

    fetchRide();
  }, [rideId]);

  useEffect(() => {
    if (!isLoaded || !ride) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: ride.pickupAddress,
        destination: ride.destinationAddress,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Directions failed:", status);
        }
      }
    );
  }, [isLoaded, ride]);

  useEffect(() => {
    if (!ride || ride.status === "accepted") return;

    const interval = setInterval(async () => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedRide = await response.json();
        console.log("Polling ride status:", updatedRide.status);

        if (updatedRide.status === "accepted") {
          clearInterval(interval);
          router.push(`/ride/${rideId}/driver`);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [rideId, ride]);

  if (!isLoaded) return <p>Loading map...</p>;
  if (error) return <p>{error}</p>;
  if (!ride) return <p>Loading ride details...</p>;

  if (ride.status === "pending") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-semibold text-orange-500 mb-4">Looking for a driver...</h2>
        <p className="text-gray-600 dark:text-gray-300">We’re trying to match you with the nearest available driver.</p>
        <p className="text-sm text-gray-400 mt-2">This page will automatically update once a driver accepts your ride.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <header className="flex justify-between items-center px-6 py-4 shadow-md bg-white dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-orange-600 dark:text-orange-400">LionRide</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="text-sm px-3 py-1 border rounded-md dark:border-white border-black hover:bg-blue-100 dark:hover:bg-orange-800"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      <main className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="backdrop-blur-md bg-white/70 dark:bg-gray-700/40 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
          <h2 className="text-lg mb-3 font-semibold tracking-wide">Ride Summary</h2>
          <p><span className="text-gray-500">From:</span> {ride.pickupAddress}</p>
          <p><span className="text-gray-500">To:</span> {ride.destinationAddress}</p>
          <p className="mt-3 text-xl font-bold text-blue-700 dark:text-orange-300">
            Estimated Fare: ${ride.estimatedFare}
          </p>
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-md">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={{ lat: 39.809, lng: -75.931 }}
          >
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push(`/ride/${rideId}/driver`)}
            className="flex-1 py-3 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 transition"
          >
            Request Ride
          </button>

          <button
            onClick={handleCancelRide}
            className="flex-1 py-3 rounded-xl border border-red-600 text-red-600 font-bold text-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition"
          >
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
}
