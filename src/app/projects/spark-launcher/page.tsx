"use client";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function SparkLauncherPage() {
  const images = [
      "/img/SparkLauncher/home_dark.png",
      "/img/SparkLauncher/home_light.png",
      "/img/SparkLauncher/library_dark.png",
      "/img/SparkLauncher/settings_1.png",
      "/img/SparkLauncher/settings_2.png",
      "/img/SparkLauncher/settings_3.png",
  ];

  return (
    <main className="p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-3">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary">Spark Launcher</h1>
                <span className="px-3 py-1 text-xs font-bold text-white bg-primary rounded-full shadow-lg shadow-primary/20">BETA</span>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Spark Launcher brings your PC game libraries together in one place. Browse cover art, see key details, and launch quickly — with simple setup and a friendly design.
            </p>
        </header>

        <section aria-label="Spark Launcher screenshots" className="glass rounded-3xl overflow-hidden shadow-2xl">
          <Carousel
            showArrows
            showStatus={false}
            showThumbs={false}
            infiniteLoop
            emulateTouch
            swipeable
            autoPlay={false}
            className="w-full"
          >
            {images.map((src, idx) => (
              <div key={src} className="bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Spark Launcher screenshot ${idx + 1}`}
                       className="object-contain max-h-[60vh] w-full"/>
              </div>
            ))}
          </Carousel>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com/cww2697/Spark-Launcher/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            <span>Download Now</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </a>

          <a
            href="https://github.com/cww2697/Spark-Launcher"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl glass font-bold hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
            </svg>
            <span>GitHub</span>
          </a>
        </div>

        {/* Details Grid */}
        <section className="grid md:grid-cols-2 gap-8">
            {/* What it does */}
            <div className="glass p-8 rounded-3xl space-y-4">
              <h3 id="spark-what" className="text-2xl font-bold text-secondary">What it does</h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex gap-2">
                   <svg className="w-5 h-5 text-primary mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   <span>Combine all your libraries: Steam, EA, Battle.net, Ubisoft, and custom ones.</span>
                </li>
                <li className="flex gap-2">
                   <svg className="w-5 h-5 text-primary mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   <span>Visual box art and key details at a glance.</span>
                </li>
                <li className="flex gap-2">
                   <svg className="w-5 h-5 text-primary mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   <span>Pull high-quality cover art from IGDB.</span>
                </li>
                <li className="flex gap-2">
                   <svg className="w-5 h-5 text-primary mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   <span>Simple, modern settings to adjust your experience.</span>
                </li>
              </ul>
            </div>

            {/* App Layout */}
              <div className="glass p-8 rounded-3xl space-y-6">
                  <h3 className="text-2xl font-bold text-secondary">App Layout</h3>
                  <div className="space-y-4">
                      <div className="group">
                          <h4 className="font-bold text-lg text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                            Home
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"></path></svg>
                          </h4>
                          <p className="text-sm opacity-70">Rows of recommendations to jump back into favorites quickly.</p>
                      </div>
                      <div className="group">
                          <h4 className="font-bold text-lg text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                            Library
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"></path></svg>
                          </h4>
                          <p className="text-sm opacity-70">Everything discovered, fully searchable with rich metadata.</p>
                      </div>
                      <div className="group">
                          <h4 className="font-bold text-lg text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                            Settings
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"></path></svg>
                          </h4>
                          <p className="text-sm opacity-70">Customize themes, library paths, and external integrations.</p>
                      </div>
                  </div>
              </div>
        </section>

        {/* Requirements & Roadmap */}
        <section className="grid md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl space-y-4">
              <h3 className="text-2xl font-bold text-secondary">System Requirements</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 font-medium">
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary"></span> Windows 11</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary"></span> Java 21+</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary"></span> 1 GB disk space</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary"></span> 4 GB RAM</li>
              </ul>
            </div>

            <div className="glass p-8 rounded-3xl space-y-4">
              <h3 className="text-2xl font-bold text-secondary">Roadmap</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-secondary"></span> Community themes</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-secondary"></span> Custom app launch options</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-secondary"></span> Play suggestions engine</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-secondary"></span> Advanced library sorting</li>
              </ul>
            </div>
        </section>

        {/* Installation */}
        <section className="glass p-8 rounded-3xl space-y-6">
            <h3 className="text-2xl font-bold text-secondary">Installation</h3>
            <div className="p-4 bg-primary/10 border-l-4 border-primary rounded-r-xl">
                <p className="font-bold text-primary mb-1 uppercase text-xs tracking-widest">Important</p>
                <p className="text-sm">Ensure you have JDK 21+ installed before building from source.</p>
            </div>
            
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="font-bold">Build from source:</p>
                <ol className="space-y-4">
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 text-secondary grid place-items-center font-bold">1</span>
                      <span>Download the source from GitHub releases.</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 text-secondary grid place-items-center font-bold">2</span>
                      <span>Run the Gradle build command in your terminal:</span>
                    </li>
                    <pre className="ml-12 p-4 bg-black/10 dark:bg-black/40 rounded-xl font-mono text-sm overflow-x-auto border border-white/5">
                      ./gradlew composeApp:createReleaseDistributable
                    </pre>
                </ol>
            </div>
        </section>

        {/* Legal disclaimer */}
        <section className="glass p-8 rounded-3xl opacity-70">
          <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">Legal</h3>
          <div className="space-y-4 text-xs leading-relaxed">
            <p>
              Icons, box art, game titles, and game descriptions are the property of their respective owners. Used solely for identification purposes.
            </p>
            <p>
              Provided &quot;AS IS&quot; under GPL‑2.0. View details at
              {" "}
              <a href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                gnu.org/licenses/gpl-2.0
              </a>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
