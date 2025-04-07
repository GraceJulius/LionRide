"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import LocationInput from "@/components/LocationInput"; 

/*added the google places api 
so that it can provide autocomplete options 
for the users*/
 import usePlacesAutocomplete,{ 
    getGeocode,
    getLatLng
  } from "use-places-autocomplete";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

export default function Dashboard() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState(null);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"], //added to aid autocomplete
  });

  // Protect route: redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Gets user location using the geolocation api on the browser
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
        
          //trying to see how autofilling users location works
        const results = await getGeocode({ location: coords });
        const address = results[0]?.formatted_address;
        if (address) setPickup(address);
      },
      (error) => console.error("Location error:", error)
    );
  }
}, []);

  const handleSeePrices = () => {
    console.log("Pickup:", pickup);
    console.log("Dropoff:", dropoff);
    alert(`Searching prices for:\nFrom: ${pickup}\nTo: ${dropoff}`);
  };

  return (
    <div className="flex flex-col">
      <div className="w-full h-[400px]">
        {!isLoaded ? (
          <p>Loading map...</p>
        ) : userLocation ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={userLocation}
            zoom={14}
          />
        ) : (
          <p>Finding your location...</p>
        )}
      </div>
  
      <div className="bg-white p-4">
        <h2 className="text-xl font-semibold mb-4 text-black">Get a ride</h2>
  
        {isLoaded ? ( // render LocationInput only after Places API is ready
          <div className="flex flex-col gap-3">
            <LocationInput
              label="Pickup location"
              value={pickup}
              setValue={setPickup}
              onPlaceSelect={(coords) => setUserLocation(coords)}
            />
  
            <LocationInput
              label="Dropoff location"
              value={dropoff}
              setValue={setDropoff}
              onPlaceSelect={(coords) =>
                console.log("Dropoff selected at:", coords)
              }
            />
  
            <button
              className="mt-4 bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-900 transition duration-200"
              onClick={handleSeePrices}
            >
              See Prices
            </button>
          </div>
        ) : (
          <p className="text-gray-500">Loading location search...</p>
        )}
      </div>
    </div>
  );
}  