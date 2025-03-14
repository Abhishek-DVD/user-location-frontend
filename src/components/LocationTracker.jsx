import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

const LocationTracker = () => {
  const user = useSelector((store) => store.user);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    let intervalId;

    const updateUserLocation = async () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy, speed } = position.coords;

          try {
            const res = await axios.put(
              `${BASE_URL}/location/update`,
              { latitude, longitude, accuracy, speed },
              { withCredentials: true }
            );

            // Store location locally
            setLocation(res.data.data);
          } catch (err) {
            console.error("Error updating location:", err);
          }
        },
        (err) => {
          setError("Location access denied. Enable GPS.");
          console.error("Geolocation error:", err);
        },
        { enableHighAccuracy: true }
      );
    };

    updateUserLocation();

    //we can also use navigator.geolocation.watchPosition(updateUserLocation, handleError, {
    //   enableHighAccuracy: true,
    // });
    //as it will only ping the server when location changes,and not every 4 seconds.

    intervalId = setInterval(updateUserLocation, 4000);

    return () => {
      clearInterval(intervalId);
    };
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Live Location Tracker</h2>
      {error && <p className="text-red-500">{error}</p>}

      {location ? (
        <div>
          <p>Latitude: {location.latitude}, Longitude: {location.longitude}</p>

          {/* Map Section */}
          <div className="w-full h-[400px] mt-5">
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[location.latitude, location.longitude]}
                icon={L.icon({
                  iconUrl: markerIconPng,
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })}
              >
                <Popup>Your Current Location</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      ) : (
        <p>Tracking location...</p>
      )}
    </div>
  );
};

export default LocationTracker;
