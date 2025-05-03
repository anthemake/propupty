"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import Head from "next/head";
import type { Route } from "next";
import { arlingtonZones } from "@/lib/zonesGeo";


const MapWrapper = dynamic(() => import("@/components/MapWrapper"), {
  ssr: false,
});

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Listing[]>([]);
  const [selectedListings, setSelectedListings] = useState<Listing[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeQuery, setActiveQuery] = useState("");
  const [shrinkHero, setShrinkHero] = useState(false);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const exploreRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {}, []);

  const handleSearch = async (q: string) => {
    setLoading(true);
    setActiveQuery(q);

    try {
      let url = "/api/listings";
      const params = new URLSearchParams();
      
      if (activeZone) params.append('zone', activeZone);
      if (q && q.trim() !== "") params.append('query', q.trim());
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
      

      const res = await fetch(url);
      const data = await res.json();

      setResults(data);
      setSelectedListings(data);

      setTimeout(() => {
        if (exploreRef.current) {
          exploreRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
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

  const handleZoneSelect = async (zoneName: string | null) => {
    setActiveZone(zoneName);
    setLoading(true);

    try {
      let url = "/api/listings";
      if (zoneName) {
        url += `?zone=${encodeURIComponent(zoneName)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      setResults(data);
      setSelectedListings(data);

      setTimeout(() => {
        if (exploreRef.current) {
          exploreRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (error) {
      console.error("Failed to fetch zone listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("hero");
      if (!hero) return;

      const triggerPoint = hero.offsetHeight / 2;
      setShrinkHero(window.scrollY > triggerPoint);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative bg-gray-100">
      <Head>
      <title>PropUpTy | Arlington Real Estate Listings</title>
<meta name="description" content="Search and explore homes for sale and rent in Arlington's hottest neighborhoods." />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="PropUpTy | Arlington Real Estate" />
        <meta
          property="og:description"
          content="Find the perfect home in Riverfront, The Fan, Scott's Addition and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/propbg7.jpg" />
      </Head>

      <section
        id="hero"
        className="relative flex flex-col justify-center items-center text-center bg-cover bg-center transition-all duration-500 ease-in-out"
        style={{
          backgroundImage: "url('/propbg7.jpg')",
          minHeight: shrinkHero ? "15vh" : "70vh",
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: shrinkHero ? 0.85 : 1 }}
          transition={{ duration: 0.3 }}
          className={`transition-all duration-300 w-full px-4 ${
            shrinkHero
              ? "fixed top-0 left-0 right-0 z-50 flex justify-center py-2 bg-white/90 shadow-lg backdrop-blur-md"
              : "relative z-10 mt-8 flex justify-center"
          }`}
        >
          <div
            className={`flex w-full md:w-[600px] rounded-full overflow-hidden shadow-md transition-all duration-300 ${
              shrinkHero ? "bg-white text-gray-900" : "bg-white/10 text-white"
            }`}
          >
            <select
              className={`bg-transparent px-4 py-3 text-sm focus:outline-none ${
                shrinkHero ? "text-gray-800" : "text-white"
              }`}
            >
              <option className="text-black">For Sale</option>
              <option className="text-black">For Rent</option>
              <option className="text-black">Sold</option>
            </select>

            <div
              className={`w-px ${shrinkHero ? "bg-gray-300" : "bg-white/30"}`}
            />

            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch(query);
                }}
                placeholder="Place, Neighborhood, School or Agent"
                className={`w-full bg-transparent placeholder-gray-400 px-4 py-3 focus:outline-none ${
                  shrinkHero ? "text-gray-900" : "text-white"
                }`}
              />
            </div>

            <button
              type="button"
              onClick={() => handleSearch(query)}
              disabled={loading}
              className={`px-5 flex items-center justify-center transition font-semibold ${
                loading
                  ? "bg-teal-300 text-white cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600 text-white"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </motion.div>
      </section>

      <section className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center gap-6 text-gray-600 text-sm font-medium">
            <button className="border-b-2 border-orange-800 pb-2">
              New to Market
            </button>
            <button className="hover:text-black">3D Tours</button>
            <button className="hover:text-black">Most Viewed</button>
            <button className="hover:text-black">Open Houses</button>
            <button className="hover:text-black">Price Drop</button>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-2 my-4">
      {["Dominion Hills", "Ballston", "Rosslyn", "Clarendon", "Pentagon City"].map((zone) => (
  <button
    key={zone}
    onClick={() => {
      if (activeZone === zone) {
        handleZoneSelect(null);
 
      } else {
        handleZoneSelect(zone);
      }
    }}
  >
    {zone}
  </button>
))}

      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 rounded-l-lg ${
            viewMode === "list" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setViewMode("map")}
          className={`px-4 py-2 rounded-r-lg ${
            viewMode === "map" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
        >
          Map View
        </button>
      </div>

      <section
        ref={exploreRef}
        className="max-w-5xl mx-auto px-4 py-12 scroll-mt-[120px]"
      >
        <h2 className="text-2xl font-bold text-center mb-8">
          Explore Listings
        </h2>

        {activeQuery && (
          <div className="text-center text-sm text-gray-500 mb-6">
            Showing results for &quot;{activeQuery}&quot;
          </div>
        )}

        {viewMode === "list" ? (
          <div className="grid md:grid-cols-2 gap-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    repeatType: "reverse",
                  }}
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
                  <Link
                    href={`/listing/${listing.id}` as Route}
                    className="block hover:opacity-90 transition"
                  >
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover rounded-md mb-4"
                      style={{ objectFit: "cover" }}
                    />
                    <h2 className="text-xl font-semibold mb-2">
                      {listing.title}
                    </h2>
                    <p className="text-gray-600 mb-1">{listing.location}</p>
                    <p className="text-sm text-gray-500">{listing.price}</p>
                  </Link>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500">No results yet.</p>
            )}

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
  activeZone={activeZone} // ADD THIS
/>


          </div>
        )}
      </section>

      <footer className="text-center text-gray-800 text-sm py-6">
        © 2025 PropUpTy. All rights reserved.
      </footer>
    </main>
  );
}
