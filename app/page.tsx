import { createClient } from "@/utils/supabase/server";
import { create } from "domain";
import Link from 'next/link';

export default async function Home() {
  // Use the new server client
  const supabase = await createClient();

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch markets
  const { data: markets } = await supabase.from('markets').select('*');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-10">
      
      {/* Show User Status */}
      <div className="absolute top-4 right-4 text-sm text-gray-400">
        {user ? (
          <span>Logged in as: <span className="text-white">{user.email}</span></span>
        ) : (
          <Link href="/login" className="bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-500">
            Login
          </Link>
        )}
      </div>

      {/* TAILWIND: 'text-4xl' = Big font. 'font-bold' = Bold. 'mb-8' = Margin Bottom 32px */}
      <h1 className="text-4xl font-bold mb-8 text-blue-400">
        Welcome to OurMart
      </h1>
      <h2>Peace, Security, & Community</h2>
      {/* TAILWIND: Grid layout. 1 column on mobile, 2 columns on larger screens (md:grid-cols-2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-4xl">
        {/* Loop through the database results */}
        {markets?.map((market) => (
          <div 
            key={market.id} 
            className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg hover:border-blue-500 transition"
          >
            <h2 className="text-2xl font-semibold">{market.name}</h2>
            <p className="text-gray-400 mt-2">Slug: {market.slug}</p>
            <Link href={`/${market.slug}`}className="mt-4 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-medium">
              Enter Market &rarr;
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}