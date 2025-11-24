'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createMarket(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // 1. Get Current User (The Creator)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in to create a market.' };

  const name = formData.get('name') as string;
  const slug = (formData.get('slug') as string).toLowerCase().replace(/\s+/g, '-');
  const allowed_domain = formData.get('allowed_domain') as string;
  const brand_color = formData.get('brand_color') as string;

  // 2. Create the Market Row
  const { data: market, error: marketError } = await supabase
    .from('markets')
    .insert({
      name,
      slug,
      allowed_domain,
      brand_color,
      // We could add an 'owner_id' column here later for billing purposes
    })
    .select()
    .single();

  if (marketError) {
    if (marketError.code === '23505') return { error: 'This URL slug is already taken.' };
    return { error: 'Failed to create market. ' + marketError.message };
  }

  // 3. Make the Creator the first ADMIN of this market
  const { error: memberError } = await supabase
    .from('market_members')
    .insert({
      user_id: user.id,
      market_id: market.id,
      role: 'admin' // <--- This gives them invite powers later
    });

  if (memberError) {
    return { error: 'Market created, but failed to join as admin.' };
  }

  // 4. Success! Send them to their new walled garden
  revalidatePath('/');
  redirect(`/${slug}`);
}