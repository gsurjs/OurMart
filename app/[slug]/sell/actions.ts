'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createItem(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // 1. Get User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in.' };

  const slug = formData.get('slug') as string;
  const title = formData.get('title') as string;
  const price = formData.get('price') as string;

  // 2. Get Market ID
  const { data: market } = await supabase
    .from('markets')
    .select('id')
    .eq('slug', slug)
    .single();

  if (!market) return { error: 'Market not found.' };

  // 3. Insert Item
  const { error } = await supabase
    .from('items')
    .insert({
      market_id: market.id,
      seller_id: user.id,
      title,
      price: parseFloat(price),
      image_url: null // We can add image upload later
    });

  if (error) {
    console.error('Item Insert Error:', error);
    return { error: 'Failed to list item. Permission denied.' };
  }

  revalidatePath(`/${slug}`);
  redirect(`/${slug}`);
}