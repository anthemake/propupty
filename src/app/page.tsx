"use client";

import { useState } from "react";
import mockListings from "@/lib/mockListings.json";
import { searchListings } from "@/lib/search";
import { motion } from "framer-motion";
import Image from "next/image";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (q: string) => {
    setLoading(true);

    setTimeout(() => {
      let filteredResults: Listing[] = searchListings(mockListings, q);

      if (q === "" || q.toLowerCase() === "any") {
        filteredResults = mockListings;
      }

      setResults(filteredResults);
      setLoading(false);
    }, 2000);
  };

  type Listing = {
    title: string;
    location: string;
    price: string;
    image: string;
  };

  return (
    <main className="relative bg-gray-100">
      <section
        className="relative flex flex-col justify-center items-center text-center min-h-[70vh] p-4 bg-cover bg-center"
        style={{ backgroundImage: "url('/propbg7.jpg')" }}
      >
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

              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    const recognition =
                      new window.webkitSpeechRecognition() ||
                      new window.SpeechRecognition();
                    recognition.lang = "en-US";
                    recognition.start();
                    recognition.onresult = function (event: any) {
                      const transcript = event.results[0][0].transcript;
                      setQuery(transcript);
                      handleSearch(transcript);
                    };
                  }
                }}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-teal-400 hover:text-teal-300 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 1v8m0 0a4 4 0 01-4-4m4 4a4 4 0 004-4m-4 8v5m0 0h4m-4 0H8"
                  />
                </svg>
              </button>
            </div>

            <button
              onClick={() => handleSearch(query)}
              className="bg-teal-500 hover:bg-teal-600 px-5 flex items-center justify-center text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                />
              </svg>
            </button>
          </div>
        </div>
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

      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Explore Listings
        </h2>

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
                className=" text-lg text-blue-800"
              >
                Searching...
              </motion.div>
            </div>
          ) : results.length > 0 ? (
            results.map((listing, idx) => (
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
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Why HomeAI?</h2>
          <p className="text-gray-600 text-lg mb-8">
            Discover homes faster, smarter, and easier with AI-powered
            technology built for tomorrow&apos;s real estate needs.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-gray-700">
            <div>
              <h3 className="text-xl font-semibold mb-2">Smart AI Search</h3>
              <p>Find the perfect property without endless browsing.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Voice Enabled</h3>
              <p>
                Control your search experience hands-free with voice commands.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p>Our technology matches you to the best listings instantly.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center text-gray-800 text-sm py-6">
        © 2025 PropUpTy. All rights reserved.
      </footer>
    </main>
  );
}
