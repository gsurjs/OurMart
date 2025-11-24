import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <form className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Log in to Ourmart</h2>
        
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:border-blue-500 outline-none"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:border-blue-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button formAction={login} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-medium transition">
              Log in
            </button>
            <button formAction={signup} className="flex-1 bg-transparent border border-gray-600 hover:bg-gray-700 text-white py-2 rounded font-medium transition">
              Sign up
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}