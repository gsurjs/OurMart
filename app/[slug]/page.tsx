import { notFound } from 'next/navigation';
import { createClient as createBrowserClient } from '@supabase/supabase-js';

// setup basic client for simplicity while testing
const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// params is a Promise in next.js, so await it
export default async function MarketPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    // 1. get market info (ID and Name) based on the URL slug
    const { data: market } = await supabase
        .from('markets')
        .select('id, name')
        .eq('slug', slug)
        .single();

    // 2. if no market found, return 404// If slug doesn't exist (e.g. localhost:3000/unicorn), show 404
    if (!market) {
        return <div className="text-white text-center mt-20">Market not found</div>;
    }
    // 2. Fetch the Items for THIS market only
    const { data: items } = await supabase
        .from('items')
        .select('*')
        .eq('market_id', market.id);
    return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-blue-400">{market.name}</h1>
        <p className="text-gray-400 text-sm mt-1">Marketplace</p>
      </div>

      {/* Grid of Items */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {items?.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
            {/* Placeholder Image */}
            <div className="h-48 bg-gray-700 flex items-center justify-center text-gray-500">
              [Image]
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg truncate">{item.title}</h3>
              <p className="text-green-400 font-mono mt-1">${item.price}</p>
              <button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 py-2 rounded text-sm transition">
                View Details
              </button>
            </div>
          </div>
        ))}

        {items?.length === 0 && (
          <p className="text-gray-500 col-span-3 text-center">No items listed yet.</p>
        )}
      </div>
    </div>
  );
}