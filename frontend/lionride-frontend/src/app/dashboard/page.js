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

const defaultLocation = { lat: 39.809230, lng: -75.931694 };

export default function Dashboard() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState(null);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [rideHistory, setRideHistory] = useState([]);
  const [locationError, setLocationError] = useState("");
  const [error, setError] = useState(null);

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
        if (!isLoaded) return; // Wait for the API to load

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserLocation(coords);

                    // Check if the Google Maps API is ready before using getGeocode
                    if (typeof window !== "undefined" && window.google && window.google.maps) {
                        try {
                            const results = await getGeocode({ location: coords });
                            const address = results[0]?.formatted_address;
                            if (address) setPickup(address);
                        } catch (err) {
                            console.error("Geocode error:", err);
                        }
                    }
                },
                (error) => {
                    console.error("Location error:", error);
                    setLocationError("Unable to retrieve your location; using default location.");
                    // Set to default location if location access fails
                    setUserLocation(defaultLocation);
                    // Optionally, you can also set the default pickup address
                    (async () => {
                        if (typeof window !== "undefined" && window.google && window.google.maps) {
                            try {
                                const results = await getGeocode({ location: defaultLocation });
                                const address = results[0]?.formatted_address;
                                if (address) setPickup(address);
                            } catch (err) {
                                console.error("Geocode error for default location:", err);
                            }
                        }
                    })();
                }
            );
        } else {
            setLocationError("Geolocation is not supported by your browser; using default location.");
            setUserLocation(defaultLocation);
        }
    }, [isLoaded]);

    useEffect(() => {
        const fetchRideHistory = async () => {
            try {
                // Assuming token is stored in localStorage as "token"
                const token = localStorage.getItem("token");
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await fetch(`${baseUrl}/api/v1/rides/history`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    console.error("Failed to fetch ride history");
                    return;
                }
                const data = await response.json();
                setRideHistory(data);
            } catch (err) {
                console.error("Error fetching ride history:", err);
            }
        };

        fetchRideHistory();
    }, []);

    const handleSeePrices = async () => {
        try {
            const token = localStorage.getItem("token");
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await fetch(`${baseUrl}/api/v1/rides/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    pickupAddress: pickup,
                    destinationAddress: dropoff,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error("Failed to get prices");
            }
            // Navigate to a confirmation page with the rideId in the URL
            router.push(`/ride/${data.rideId}`);
        } catch (err) {
            console.error("Error requesting ride:", err);
            setError(err.message);
        }
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

        {/* Ride History Section */}
        <div className="bg-white p-4 mt-4">
            <h2 className="text-xl font-semibold mb-4 text-black">Recent Rides</h2>
            {rideHistory.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {rideHistory.map((ride) => (
                        <div key={ride.rideId} className="p-4 border rounded-md shadow-md">
                            <h3 className="text-lg font-semibold">Ride #{ride.rideId}</h3>
                            <p><strong>From:</strong> {ride.pickupAddress}</p>
                            <p><strong>To:</strong> {ride.destinationAddress}</p>
                            <p><strong>Fare:</strong> ${ride.estimatedFare}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(ride.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No rides yet.</p>
            )}
        </div>
    </div>
  );
}  