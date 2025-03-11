import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import { BASE_URL } from "../utils/constants";

const ResizeMap = () => {
    const map = useMap();
  
    useEffect(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 0);
    }, [map]);
  
    return null;
  };


const AdminView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false); // <- Modal control

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/user/${userId}`, {
        withCredentials: true,
      });

      setUser(res.data.data);
    } catch (err) {
      console.error("Error fetching user info:", err);
      setError(
        err.response?.data?.message || "Failed to fetch user information."
      );
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchUserLocation = async () => {
    if (!userId) return;
      
    try {
      setLoadingLocation(true);
      const res = await axios.get(`${BASE_URL}/admin/user-location/${userId}`, {
        withCredentials: true,
      });
      setLocation(res.data.data);
      setError("");
    } catch (err) {
      console.error("Error fetching user location:", err);
      setError(
        err.response?.data?.message || "Failed to fetch user location."
      );
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchUserLocation();
  }, [userId]);

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 text-lg">Loading user...</p>
      </div>
    );
  }

  console.log(location);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 pb-20">
      {/* Main content container */}
      <div className="flex-1 w-full max-w-5xl mx-auto p-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
            Tracking: {user?.firstName}
          </h2>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
          )}

          {/* Location Info */}
          {location && (
            <div className="text-center mb-6 space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Latitude:</strong> {location.latitude}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Longitude:</strong> {location.longitude}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Speed:</strong> {location.speed ?? "N/A"}
              </p>
            </div>
          )}

          {/* View Map Button */}
          {location && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowMapModal(true)}
                className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
              >
                View on Map
              </button>
            </div>
          )}

          {/* Loading/Fallback */}
          {!location && !error && !loadingLocation && (
            <p className="text-center text-gray-500">No location available.</p>
          )}

          {loadingLocation && (
            <p className="text-center text-gray-500">Fetching location...</p>
          )}
        </div>
      </div>

      {/* Modal for Map */}
      {showMapModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] flex flex-col">
      
      {/* Modal Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {user?.firstName}'s Location Map
        </h3>
        <button
          onClick={() => setShowMapModal(false)}
          className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Map Content */}
      <div className="relative" style={{ height: "400px", width: "100%" }}>
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <ResizeMap />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker
            position={[location.latitude, location.longitude]}
            icon={L.icon({
              iconUrl: markerIconPng,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>
              {user?.name}'s Current Location
              <br />
              Lat: {location.latitude}
              <br />
              Lng: {location.longitude}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end p-4 border-t border-gray-300 dark:border-gray-700">
        <button
          onClick={() => setShowMapModal(false)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminView;
