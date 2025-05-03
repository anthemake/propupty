import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import Database from "better-sqlite3";
import path from "path";


export default async function ListingDetail({ params }: { params: { id: string } }) {
  const dbPath = path.join(process.cwd(), "src", "lib", "listings.db");
  const db = new Database(dbPath);

  const listing = db.prepare("SELECT * FROM listings WHERE id = ?").get(params.id) as {
    id: number;
    title: string;
    image: string;
    price: string;
    location: string;
  };

  if (!listing) return notFound();

  return (
    <>
      <Head>
        <title>{listing.title} | PropUpTy</title>
        <meta
          name="description"
          content={`Explore ${listing.title} located in ${listing.location}. Priced at ${listing.price}.`}
        />
        <meta property="og:title" content={listing.title} />
        <meta property="og:description" content={`${listing.title} in ${listing.location}`} />
        <meta property="og:image" content={listing.image} />
      </Head>

      <main className="min-h-screen bg-gray-100 px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
          <Image
            src={listing.image}
            alt={listing.title}
            width={800}
            height={500}
            className="rounded-lg mb-4 w-full object-cover h-64"
          />
          <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
          <p className="text-gray-600 mb-1">{listing.location}</p>
          <p className="text-gray-800 text-lg font-semibold mb-4">{listing.price}</p>
          <p className="text-gray-700 mb-6">
            {/* Add real content if needed */}
            This is a beautiful property located in the heart of Arlington, Virginia.
          </p>
          <div className="flex gap-4">
            <Link href="/" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
              ← Back to Listings
            </Link>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
              Contact Agent
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
