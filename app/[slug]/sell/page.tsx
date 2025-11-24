'use client';

import { createItem } from './actions';
import { useActionState } from 'react';
import { useParams } from 'next/navigation';

export default function SellItemPage() {
  const params = useParams(); 
  // We assert slug is string because useParams can return string | string[]
  const slug = typeof params.slug === 'string' ? params.slug : '';
  
  const [state, formAction, isPending] = useActionState(createItem, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h1 className="text-2xl font-bold mb-4">List an Item</h1>
        
        {/* Pass slug hiddenly */}
        <input type="hidden" name="slug" value={slug} />

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-400">Title</label>
            <input name="title" required className="w-full p-2 bg-gray-700 rounded border border-gray-600 outline-none focus:border-blue-500" placeholder="e.g. Calculus Textbook"/>
          </div>

          <div>
            <label className="text-sm text-gray-400">Price ($)</label>
            <input name="price" type="number" step="0.01" required className="w-full p-2 bg-gray-700 rounded border border-gray-600 outline-none focus:border-blue-500" placeholder="0.00"/>
          </div>
          
          <button 
            disabled={isPending}
            className="mt-2 bg-green-600 hover:bg-green-500 py-2 rounded font-bold disabled:opacity-50 transition"
          >
            {isPending ? 'Listing...' : 'Post Item'}
          </button>

          {state?.error && <p className="text-red-400 text-sm text-center">{state.error}</p>}
        </form>
      </div>
    </div>
  );
}