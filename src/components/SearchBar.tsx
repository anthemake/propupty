"use client";
import { FC } from "react";

interface Props {
  query: string;
  loading: boolean;
  onChange: (val: string) => void;
  onSearch: () => void;
}

const SearchBar: FC<Props> = ({ query, loading, onChange, onSearch }) => {
  return (
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
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="Place, Neighborhood, School or Agent"
          className="w-full bg-transparent text-white placeholder-gray-400 px-4 py-3 focus:outline-none"
        />
      </div>

      <button
        type="button"
        onClick={onSearch}
        disabled={loading}
        className={`px-5 flex items-center justify-center text-white transition ${
          loading
            ? "bg-teal-300 cursor-not-allowed"
            : "bg-teal-500 hover:bg-teal-600"
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
  );
};

export default SearchBar;
