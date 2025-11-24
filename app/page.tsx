import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 1. Fetch ONLY the markets this user belongs to
  const { data: memberships } = await supabase
    .from('market_members')
    .select('role, market:markets (id, name, slug, brand_color)')
    .eq('user_id', user.id);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Top Nav */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-700 pb-4">
        <h1 className="text-2xl font-bold">Ourmart Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user.email}</span>
          <form action="/auth/signout" method="post">
             <button className="text-red-400 text-sm hover:underline">Sign Out</button>
          </form>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Walled Gardens</h2>
        <Link 
          href="/create-market" 
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold transition flex items-center gap-2"
        >
          + Create New Market
        </Link>
      </div>

      {/* Market Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {memberships?.map((m: any) => (
          <Link key={m.market.id} href={`/${m.market.slug}`} className="group">
            <div 
              className="bg-gray-800 border border-gray-700 p-6 rounded-lg hover:border-blue-500 transition h-full flex flex-col justify-between"
              style={{ borderTopWidth: '4px', borderTopColor: m.market.brand_color }}
            >
              <div>
                <h3 className="text-xl font-bold mb-1">{m.market.name}</h3>
                <p className="text-xs text-gray-500 font-mono">/{m.market.slug}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded ${m.role === 'admin' ? 'bg-purple-900 text-purple-200' : 'bg-gray-700 text-gray-300'}`}>
                  {m.role.toUpperCase()}
                </span>
                <span className="text-blue-400 text-sm group-hover:underline">Enter &rarr;</span>
              </div>
            </div>
          </Link>
        ))}

        {/* Empty State */}
        {memberships?.length === 0 && (
          <div className="col-span-full text-center py-20 bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
            <p className="text-gray-400 mb-4">You don't belong to any markets yet.</p>
            <Link href="/create-market" className="text-blue-400 hover:underline">
              Create your first one &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}