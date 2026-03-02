import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <main className="transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative py-12 px-6 sm:px-10 flex flex-col items-center text-center">
                <div className="relative mb-10 group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] rounded-full overflow-hidden animate-float">
                        <Image
                            src="/canyon_wolf.PNG"
                            alt="Canyon Wolf Profile"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                <div className="max-w-3xl space-y-6">
                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
                        <span className="text-primary">Canyon</span> <span className="text-secondary">Wolf</span>
                    </h1>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300">
                        Software Developer & Gaming Enthusiast 🎮 💻
                    </p>
                    <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
                    <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Building modern digital experiences where clean code meets interactive worlds. 
                        Passionate about creating intuitive software and exploring the latest in technology.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="px-6 sm:px-10 pb-16 grid gap-12 max-w-4xl mx-auto">
                <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-bold border-l-4 border-primary pl-4">About Me</h2>
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        As a software developer with an unwavering passion for both programming and gaming,
                        I&#39;ve cultivated a unique perspective that bridges these two fascinating domains.
                        With years of experience crafting clean, efficient code and countless hours exploring
                        diverse gaming universes, I bring a creative and technical mindset to every project.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        This space serves as a testament to my journey, showcasing how my professional
                        expertise in software development harmoniously intertwines with my deep-rooted
                        love for gaming culture and technology.
                    </p>
                </div>
            </section>
        </main>
    );
}
