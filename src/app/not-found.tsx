import Link from "next/link";

export default function NotFound() {
  return (
    <main className="font-sans p-6 sm:p-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto grid gap-8 py-10">
        <div className="text-center space-y-4">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">404</h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300">The page you are looking for could not be found.</p>
          <p className="text-base text-gray-600 dark:text-gray-400">It might have been removed, renamed, or did not exist in the first place.</p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="inline-flex items-center px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm">
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
}
