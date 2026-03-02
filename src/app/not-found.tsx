import Link from "next/link";

export default function NotFound() {
  return (
    <main className="p-12 sm:p-20 text-center">
      <div className="max-w-2xl mx-auto space-y-8 py-10">
        <div className="relative inline-block">
          <h1 className="text-8xl sm:text-9xl font-black tracking-tighter text-primary/20">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Lost in the Canyon</h2>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 font-medium">The page you are looking for could not be found.</p>
          <p className="text-base text-gray-600 dark:text-gray-400">It might have been removed, renamed, or vanished into the digital wilderness.</p>
        </div>

        <div className="flex items-center justify-center gap-6 pt-4">
          <Link href="/" className="inline-flex items-center px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
}
