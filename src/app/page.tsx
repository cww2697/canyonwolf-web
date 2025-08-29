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
        </main>
    );
}
