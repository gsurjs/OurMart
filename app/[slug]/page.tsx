import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function MarketPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Get Market Info
  const { data: market, error: marketError } = await supabase
    .from('markets')
    .select('id, name, brand_color')
    .eq('slug', slug)
    .single();

  if (marketError || !market) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Market Not Found</h1>
          <p className="text-gray-400">Could not load market: {slug}</p>
        </div>
      </div>
    );
  }

  // 2. Check Permission: Can I sell? (Member OR Superuser)
  let canSell = false;
  let isSuperUser = false;
  
  if (user) {
    // Check God Mode
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single();
    
    if (profile?.subscription_status === 'superuser') isSuperUser = true;

    // Check Membership (Use maybeSingle to prevent crashes!)
    const { data: membership } = await supabase
      .from('market_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('market_id', market.id)
      .maybeSingle();
    
    if (membership || isSuperUser) canSell = true;
  }

  // 3. Fetch Items
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .eq('market_id', market.id);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header Area */}
      <div 
        className="flex justify-between items-end max-w-4xl mx-auto mb-8 border-b border-gray-700 pb-4"
        style={{ borderColor: market.brand_color || '#3b82f6' }} 
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 
              className="text-3xl font-bold" 
              style={{ color: market.brand_color || '#3b82f6' }}
            >
              {market.name}
            </h1>
            {isSuperUser && (
              <span className="bg-yellow-600 text-black text-xs font-bold px-2 py-1 rounded uppercase">
                God Mode
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-1">Authorized Access Only</p>
        </div>

        {/* The Sell Button */}
        {canSell && (
          <Link 
            href={`/${slug}/sell`}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold transition flex items-center gap-2"
          >
            + Sell Item
          </Link>
        )}
      </div>

      {/* Grid of Items */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {items?.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg group">
            <div className="h-48 bg-gray-700 flex items-center justify-center text-gray-500">
               {item.image_url && item.image_url !== 'null' ? (
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

        {items?.length === 0 && (
          <p className="text-gray-500 col-span-3 text-center py-10">
            No items yet. Be the first to list something!
          </p>
        )}
      </div>
    </div>
  );
}