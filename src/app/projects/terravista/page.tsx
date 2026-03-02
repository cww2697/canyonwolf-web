"use client";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function TerraVistaPage() {
  const images = [
      "/img/TerraVista/scenery.png",
      "/img/TerraVista/aircraft.png",
  ];

  return (
    <main className="p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-3">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-secondary">TerraVista</h1>
                <span className="px-3 py-1 text-[10px] font-black text-white bg-green-500 rounded-full shadow-lg shadow-green-500/20 uppercase tracking-widest">Coming Soon</span>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                TerraVista is a powerful X-Plane addon manager and organizer designed to simplify managing complex
                X-Plane scenery libraries. Spend more time flying and less time editing configuration files.
            </p>
        </header>

        <section aria-label="TerraVista screenshots" className="glass rounded-3xl overflow-hidden shadow-2xl">
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
                  <img src={src} alt={`TerraVista screenshot ${idx + 1}`}
                       className="object-contain max-h-[60vh] w-full"/>
              </div>
            ))}
          </Carousel>
        </section>

        {/* Details Section */}
        <section className="space-y-8">
          <div className="glass p-8 rounded-3xl space-y-6">
            <h2 className="text-3xl font-bold text-primary border-l-4 border-primary pl-4">About TerraVista</h2>
            <div className="grid gap-4">
              <ul className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Intuitive X-Plane scenery organizer to enable/disable packs effortlessly.",
                    "Edit scenery_packs.ini directly with visual file tree navigation.",
                    "Advanced drag-and-drop reordering for scenery priority management.",
                    "Lightweight Java-based utility supporting Windows, macOS, and Linux.",
                    "Built-in X-Plane aircraft livery manager for easy skin organization.",
                    "Custom scenery presets for switching between different flight scenarios."
                  ].map((feature, i) => (
                    <li key={i} className="flex gap-3 text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 text-secondary mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span className="text-sm font-medium leading-relaxed">{feature}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {/* System requirements */}
            <div className="glass p-8 rounded-3xl space-y-4">
              <h3 className="text-xl font-bold text-secondary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                System Requirements
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Java 21+</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> 1 GB disk space</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> 2 GB RAM</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Internet connection</li>
              </ul>
            </div>

            {/* Roadmap */}
            <div className="glass p-8 rounded-3xl space-y-4">
              <h3 className="text-xl font-bold text-secondary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                Roadmap
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Dark Mode Support</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> X-Plane Plug-in Management</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Autogen for new installs</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Cloud backups</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Legal disclaimer */}
        <section className="glass p-8 rounded-3xl opacity-60">
            <h3 className="text-sm font-bold mb-3 uppercase tracking-widest">Legal Disclaimer</h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-[10px] leading-relaxed">
                <p>
                    Icons, scenery data, aircraft models, and flight simulator content are the property of their respective owners. 
                    Used solely for identification and informational purposes. 
                    No affiliation with or endorsement by Laminar Research or X-Plane is implied.
                </p>
            </div>
        </section>

          <div className="flex flex-col items-center gap-6">
              <button
                  disabled
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gray-200 dark:bg-gray-800 text-gray-500 font-bold cursor-not-allowed shadow-inner"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  <span>Coming Soon</span>
              </button>
          </div>
      </div>
    </main>
  );
}
