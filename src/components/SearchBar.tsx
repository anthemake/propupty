"use client";
import { FC, useState, useEffect, useRef } from "react";

interface Props {
  query: string;
  loading: boolean;
  onChange: (val: string) => void;
  onSearch: () => void;
}

const SearchBar: FC<Props> = ({ query, loading, onChange, onSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<typeof SpeechRecognition.prototype | null>(
    null
  );

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const speechResult = event.results[0][0].transcript;
      onChange(speechResult);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [onChange]);

  const handleMicClick = () => {
    if (!supported) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

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

        <button
          type="button"
          onClick={handleMicClick}
          disabled={!supported}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-white p-1 rounded-full ${
            !supported ? "opacity-50 cursor-not-allowed" : "hover:bg-white/20"
          }`}
          title={
            supported
              ? isListening
                ? "Listening..."
                : "Click to speak"
              : "Voice input not supported in this browser"
          }
        >
          {isListening ? (
            <svg
              className="animate-pulse h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 14a3 3 0 003-3V6a3 3 0 00-6 0v5a3 3 0 003 3z" />
              <path
                fillRule="evenodd"
                d="M5 10a7 7 0 0014 0h-2a5 5 0 01-10 0H5z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14a3 3 0 003-3V6a3 3 0 00-6 0v5a3 3 0 003 3z" />
              <path
                fillRule="evenodd"
                d="M5 10a7 7 0 0014 0h-2a5 5 0 01-10 0H5z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
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
