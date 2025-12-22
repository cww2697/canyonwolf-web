"use client";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function SparkLauncherPage() {
  const images = [
      "/img/TerraVista/scenery.png",
      "/img/TerraVista/aircraft.png",
  ];

  return (
    <main className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-semibold">TerraVista</h1>
                <span className="px-2 py-0.5 text-xs font-medium text-white bg-green-500 rounded">Coming Soon</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
                TerraVista is a powerful X-Plane addon manager and organizer designed to simplify managing complex
                X-Plane scenery libraries. Spend more time flying in your simulator and less
                time manually editing configuration files with this intuitive scenery management tool.
          </p>
        </header>

        <section aria-label="TerraVista screenshots" className="rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-white/10 bg-white/60 dark:bg-gray-900/40">
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
              <div key={src} className="bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`TerraVista screenshot ${idx + 1}`}
                       className="object-contain max-h-[70vh] w-full"/>
              </div>
            ))}
          </Carousel>
        </section>

        {/* Details */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold">About TerraVista</h2>
          <div className="grid sm:grid-cols-1 gap-4">
            {/* What it does */}
            <div className="rounded-lg ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-gray-900/40 p-4">
              <h3 id="spark-what" className="text-lg font-medium mb-2">What it does</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>X-Plane scenery manager with intuitive organizer interface to enable or disable custom scenery
                      packs effortlessly.
                  </li>
                  <li>Edit X-Plane scenery_packs.ini configuration file directly with visual file tree navigation.
                  </li>
                  <li>Advanced X-Plane scenery pack editor with drag-and-drop reordering and built-in text editor for
                      scenery_packs.ini management.
                  </li>
                  <li>Cross-platform X-Plane utility supporting Windows, macOS, and Linux - lightweight Java-based
                      flight simulator addon tool.
                  </li>
                  <li>X-Plane aircraft livery manager for organizing and customizing flight simulator skins and aircraft
                      paintwork.
                  </li>
              </ul>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* System requirements */}
            <div className="rounded-lg ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-gray-900/40 p-4">
              <h3 className="text-lg font-medium mb-2">System requirements</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Java 21+</li>
                <li>1 GB of disk space</li>
                <li>2 GB of RAM</li>
                <li>Internet connection</li>
              </ul>
            </div>

            {/* Roadmap */}
            <div className="rounded-lg ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-gray-900/40 p-4">
              <h3 className="text-lg font-medium mb-2">Roadmap</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Dark Mode</li>
                <li>Scenery Profiles</li>
                <li>X-Plane Plug-in Management</li>
                <li>Autogeneration of scenery_packs.ini for new installs</li>
                <li>Section support for better organization</li>
                <li>Cloud backups</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Legal disclaimer */}
        <section className="rounded-lg ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-gray-900/40 p-4">
            <h3 className="text-lg font-medium mb-2">Legal</h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <p>
                    Icons, scenery data, aircraft models, and flight simulator content referenced or displayed by this
                    application are the property of their respective owners and may be protected by copyright and/or
                    trademark laws. Such materials are used solely for identification and informational purposes.
                    No affiliation with or endorsement by Laminar Research or X-Plane is implied.
                </p>
            </div>
        </section>

        <div className="flex flex-col items-center gap-3">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-green-600 text-white hover:bg-green-500 transition-colors"
          >
            <span>Coming Soon</span>
            {/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">*/}
            {/*  <path fillRule="evenodd" d="M3 16.5a.75.75 0 01.75-.75h3.9a.75.75 0 010 1.5H4.5v2.25h15V17.25h-3.15a.75.75 0 010-1.5h3.9a.75.75 0 01.75.75v3.75A1.5 1.5 0 0119.5 21.75h-15A1.5 1.5 0 013 20.25V16.5z" clipRule="evenodd" />*/}
            {/*  <path fillRule="evenodd" d="M12 3a.75.75 0 01.75.75v9.69l2.72-2.72a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 111.06-1.06l2.72 2.72V3.75A.75.75 0 0112 3z" clipRule="evenodd" />*/}
            {/*</svg>*/}
          </a>
        </div>
      </div>
    </main>
  );
}
