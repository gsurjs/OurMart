'use client'; // Client component for form handling

import { createMarket } from './actions';
import { useActionState } from 'react'; // Hook for handling server action results

export default function CreateMarketPage() {
  const [state, formAction, isPending] = useActionState(createMarket, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-blue-400">Create Your Walled Garden</h1>
        <p className="text-gray-400 mb-6">Launch a private marketplace for your organization.</p>

        <form action={formAction} className="flex flex-col gap-4">
          
          {/* Market Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Market Name</label>
            <input 
              name="name" 
              type="text" 
              placeholder="e.g. Delta Pilots Trading Post"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* Custom Slug (The URL) */}
          <div>
            <label className="block text-sm font-medium mb-1">URL Slug</label>
            <div className="flex items-center">
              <span className="bg-gray-700 p-2 border border-r-0 border-gray-600 rounded-l text-gray-400">ourmart.app/</span>
              <input 
                name="slug" 
                type="text" 
                placeholder="delta"
                className="w-full p-2 rounded-r bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                required
              />
            </div>
          </div>

          {/* The "Lock" (Allowed Domain) */}
          <div>
            <label className="block text-sm font-medium mb-1">Allowed Email Domain (The Lock)</label>
            <input 
              name="allowed_domain" 
              type="text" 
              placeholder="delta.com"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Only users with this email domain can auto-join.</p>
          </div>

          {/* Brand Color (White Labeling) */}
          <div>
            <label className="block text-sm font-medium mb-1">Brand Color</label>
            <input 
              name="brand_color" 
              type="color" 
              defaultValue="#3b82f6"
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition disabled:opacity-50"
          >
            {isPending ? 'Building Wall...' : 'Launch Market'}
          </button>

          {/* Error/Success Messages */}
          {state?.error && <p className="text-red-400 text-sm text-center">{state.error}</p>}
        </form>
      </div>
    </div>
  );
}