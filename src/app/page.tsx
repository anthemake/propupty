'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import Pagination from "@/components/Pagination";
import debounce from 'lodash.debounce';

const MapWrapper = dynamic(() => import("@/components/MapWrapper"), { ssr: false });

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Listing[]>([]);
  const [selectedListings, setSelectedListings] = useState<Listing[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeQuery, setActiveQuery] = useState("");


  const itemsPerPage = 8;

  type Listing = {
    id: number;
    title: string;
    location: string;
    price: string;
    image: string;
    zone: string;
    lat: number;
    lng: number;
  };

  useEffect(() => {
    handleSearch(""); // Load all listings initially
  }, []);

  const handleSearch = async (q: string) => {
    setLoading(true);
    setActiveQuery(q); // 🛠 Track the real search text here
    try {
      let url = "/api/listings";
      if (q && q.trim() !== "") {
        url += `?query=${encodeURIComponent(q.trim())}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setResults(data);
      setSelectedListings(data); // Update map markers too
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  };
  


  const totalPages = Math.ceil(results.length / itemsPerPage);
  const paginatedResults = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleZoneSelect = async (zoneName: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/listings?zone=${encodeURIComponent(zoneName)}`);
      const data = await res.json();
      setResults(data);
      setSelectedListings(data);
    } catch (error) {
      console.error("Failed to fetch zone listings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative bg-gray-100">
      {/* Hero Section */}
      <section className="relative flex flex-col justify-center items-center text-center min-h-[70vh] p-4 bg-cover bg-center" style={{ backgroundImage: "url('/propbg7.jpg')" }}>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex justify-center w-full md:w-[600px] bg-white/10 backdrop-blur-md rounded-full overflow-hidden shadow-lg">
            <select className="bg-transparent text-white px-4 py-3 text-sm focus:outline-none">
              <option className="text-black">For Sale</option>
              <option className="text-black">For Rent</option>
              <option className="text-black">Sold</option>
            </select>

            <div className="w-px bg-white/30"></div>

            <div className="relative flex-1">
            <input
  type="text"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") handleSearch(query);
  }}
  placeholder="Place, Neighborhood, School or Agent"
  className="w-full bg-transparent text-white placeholder-gray-400 px-4 py-3 focus:outline-none"
/>

            </div>

            <button
  type="button" // 🛠 Add this just for clarity (submit vs button type)
  onClick={() => handleSearch(query)}
  disabled={loading}
  className={`px-5 flex items-center justify-center text-white transition ${
    loading ? "bg-teal-300 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600"
  }`}
>
  {loading ? (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
  ) : (
    "Search"
  )}
</button>


          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center gap-6 text-gray-600 text-sm font-medium">
            <button className="border-b-2 border-orange-800 pb-2">New to Market</button>
            <button className="hover:text-black">3D Tours</button>
            <button className="hover:text-black">Most Viewed</button>
            <button className="hover:text-black">Open Houses</button>
            <button className="hover:text-black">Price Drop</button>
          </div>
        </div>
      </section>

      {/* Quick Zone Selection */}
      <div className="flex flex-wrap justify-center gap-2 my-4">
        {['Riverfront / Canal Walk District', 'Henrico Smart City', 'The Fan District', "Scott's Addition", 'West End'].map((zone) => (
          <button
            key={zone}
            onClick={() => handleZoneSelect(zone)} // ✅ Correct now
            className="px-3 py-2 bg-gray-200 hover:bg-blue-500 hover:text-white rounded-lg text-sm transition"
          >
            {zone}
          </button>
        ))}
      </div>

      {/* View Switch */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 rounded-l-lg ${viewMode === "list" ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          List View
        </button>
        <button
          onClick={() => setViewMode("map")}
          className={`px-4 py-2 rounded-r-lg ${viewMode === "map" ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          Map View
        </button>
      </div>

      {/* Listings */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Explore Listings</h2>

        {activeQuery && (
  <div className="text-center text-sm text-gray-500 mb-6">
    Showing results for "{activeQuery}"
  </div>
)}



        {viewMode === "list" ? (
          <div className="grid md:grid-cols-2 gap-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                  className="text-lg text-blue-800"
                >
                  Searching...
                </motion.div>
              </div>
            ) : paginatedResults.length > 0 ? (
              paginatedResults.map((listing, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200"
                >
                  <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
                  <p className="text-gray-600 mb-1">{listing.location}</p>
                  <p className="text-sm text-gray-500">{listing.price}</p>
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover rounded-md mb-4"
                    style={{ objectFit: "cover" }}
                  />
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500">No results yet.</p>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        ) : (
          <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
            <MapWrapper
              listings={selectedListings}
              allListings={results}
              setSelectedListings={setSelectedListings}
              handleSearch={handleSearch}
            />
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-800 text-sm py-6">
        © 2025 PropUpTy. All rights reserved.
      </footer>
    </main>
  );
}
