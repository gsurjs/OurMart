import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server'; // Use the SERVER client we made

export default async function MarketPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Get Market Info
  // We log the error if it fails so you can see it in your VS Code terminal
  const { data: market, error: marketError } = await supabase
    .from('markets')
    .select('id, name, brand_color')
    .eq('slug', slug)
    .single();

  if (marketError || !market) {
    console.error("Market Fetch Error:", marketError); // Debugging aid
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Market Not Found</h1>
          <p className="text-gray-400">Could not load market: {slug}</p>
        </div>
      </div>
    );
  }

  // 2. Fetch Items (RLS automatically filters this now!)
  const { data: items, error: itemError } = await supabase
    .from('items')
    .select('*')
    .eq('market_id', market.id);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header with Dynamic Brand Color */}
      <div 
        className="max-w-4xl mx-auto mb-8 border-b border-gray-700 pb-4"
        style={{ borderColor: market.brand_color || '#3b82f6' }} 
      >
        <h1 
          className="text-3xl font-bold" 
          style={{ color: market.brand_color || '#3b82f6' }}
        >
          {market.name}
        </h1>
        <p className="text-gray-400 text-sm mt-1">Authorized Access Only</p>
      </div>

      {/* Grid of Items */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {items?.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg group">
            <div className="h-48 bg-gray-700 flex items-center justify-center text-gray-500">
               {/* Use the image URL if available, otherwise placeholder */}
               {item.image_url ? (
                 <img src={item.image_url} alt={item.title} className="w-full h-full object-cover"/>
               ) : (
                 <span>No Image</span>
               )}
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
      </div>
    </div>
  );
}