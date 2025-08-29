import Image from "next/image";

export default function Home() {
    return (
        <main className="font-sans p-6 sm:p-10 transition-colors duration-300">
            <div className="max-w-4xl mx-auto grid gap-12">
                <div
                    className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full overflow-hidden mx-auto">
                    <Image
                        src="/canyon_wolf.PNG"
                        alt="Canyon Wolf"
                        fill
                        style={{objectFit: 'cover'}}
                        priority
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJiEkMic1LCo0NDQ0ISo5PTs0RD5FV19dX3uKiouNjpCRkJKbm5v/2wBDARUXFyAeIB4eIJsaGpubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5v/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                </div>

                <div className="space-y-6 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold">Canyon Wolf</h1>
                    <p className="text-xl sm:text-2xl text-gray-800 dark:text-gray-500 font-semibold tracking-wider hover:text-orange-600 dark:hover:text-orange-400 transform hover:scale-105 transition-all duration-300">
                        Software Developer & Gaming Enthusiast 🎮 💻
                    </p>
                    <p className="text-lg leading-relaxed">
                        Step into my digital realm, where lines of code meet virtual worlds!
                    </p>

                    <p className="text-lg leading-relaxed">
                        As a software developer with an unwavering passion for both programming and gaming,
                        I&#39;ve cultivated a unique perspective that bridges these two fascinating domains.
                        With years of experience crafting clean, efficient code and countless hours exploring
                        diverse gaming universes, I bring a creative and technical mindset to every project.
                    </p>

                    <p className="text-lg leading-relaxed">
                        This space serves as a testament to my journey, showcasing how my professional
                        expertise in software development harmoniously intertwines with my deep-rooted
                        love for gaming culture and technology.
                    </p>
                </div>
            </div>

            {/* Site info moved from footer */}
            <section aria-label="Site information" className="mt-12">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/60 ring-1 ring-black/5 dark:ring-white/10 p-4 sm:p-5 flex items-center justify-between">
                        <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                            <span aria-hidden="true">©</span>
                            <span className="sr-only">Copyright</span> {new Date().getFullYear()} Canyon Wolf
                        </div>
                        <a
                            href="https://github.com/cww2697/canyonwolf-web"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View the full repository on GitHub"
                            className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15-.46.55-.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                            </svg>
                            <span className="hidden sm:inline">GitHub</span>
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
