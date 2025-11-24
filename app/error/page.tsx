// app/error/page.tsx
import Link from 'next/link'

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-red-900/20 border border-red-500 p-8 rounded-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
        <p className="text-gray-300 mb-6">
          There was an authentication error. This usually happens if:
        </p>
        <ul className="text-left text-sm text-gray-400 list-disc pl-5 mb-6 space-y-2">
          <li>You entered the wrong password.</li>
          <li>You are trying to sign up with an email that is already taken.</li>
          <li>You need to confirm your email address.</li>
        </ul>
        <Link 
          href="/login" 
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded font-bold transition"
        >
          Try Again
        </Link>
      </div>
    </div>
  )
}