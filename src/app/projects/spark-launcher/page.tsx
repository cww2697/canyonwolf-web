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
    <main className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-semibold">Spark Launcher</h1>
                <span className="px-2 py-0.5 text-xs font-medium text-white bg-orange-500 rounded">BETA</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Spark Launcher brings your PC game libraries together in one place. Browse cover art, see key details, and launch quickly — with simple setup and a friendly design.
          </p>
        </header>

        <section aria-label="Spark Launcher screenshots" className="rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-white/10 bg-white/60 dark:bg-gray-900/40">
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
                  <img src={src} alt={`Spark Launcher screenshot ${idx + 1}`}
                       className="object-contain max-h-[70vh] w-full"/>
              </div>
            ))}
          </Carousel>
        </section>

        {/* Details */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold">About Spark Launcher</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* What it does */}
            <div className="rounded-lg ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-gray-900/40 p-4">
              <h3 id="spark-what" className="text-lg font-medium mb-2">What it does</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Combine all your libraries into one place:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Steam</li>
                    <li>EA app (formerly Origin)</li>
                    <li>Battle.net</li>
                    <li>Ubisoft Connect</li>
                    <li>Custom Game Libraries</li>
                  </ul>
                </li>
                <li>Shows box art and key details at a glance.</li>
                <li>Lets you point Spark Launcher to where each store is installed so your games are found.</li>
                  <li>Can pull cover art from IGDB (Requires IGDB API keys available at <a href="https://dev.twitch.tv/"
                                                                                           target="_blank"
                                                                                           rel="noopener noreferrer"
                                                                                           className="text-orange-600 hover:text-orange-500">dev.twitch.tv</a>)
                  </li>
                <li>Simple Settings to adjust folders, theme, and integrations.</li>
              </ul>
            </div>

            {/* App Layout */}
              <div
                  className="rounded-lg ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-gray-900/40 p-4 flex flex-col h-full">
                  <div className="flex-grow">
                      <h3 className="text-lg font-medium mb-2">App layout</h3>
                      <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                          <li className="flex flex-col">
                              <h4 className="font-medium text-lg mb-1">Home</h4>
                              <p>Rows of recommendations so you can jump back into favorites quickly.</p>
                          </li>
                          <li className="flex flex-col">
                              <h4 className="font-medium text-lg mb-1">Library</h4>
                              <p>Everything Spark Launcher finds, with cover art when available, fully searchable.</p>
                          </li>
                          <li className="flex flex-col">
                              <h4 className="font-medium text-lg mb-1">Settings</h4>
                              <p>Pick a theme, set library folders, add IGDB details, and run maintenance tasks.</p>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>

          {/* System requirements & Roadmap */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* System requirements */}
            <div className="rounded-lg ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-gray-900/40 p-4">
              <h3 className="text-lg font-medium mb-2">System requirements</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Windows 11</li>
                <li>Java 21+</li>
                <li>1 GB of disk space</li>
                <li>4 GB of RAM</li>
                <li>Internet connection</li>
              </ul>
            </div>

            {/* Roadmap */}
            <div className="rounded-lg ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-gray-900/40 p-4">
              <h3 className="text-lg font-medium mb-2">Roadmap</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">Here’s what we’re excited to bring next:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Community themes</li>
                <li>Custom app launch options</li>
                <li>Custom home layout</li>
                <li>Favorite games in your library</li>
                <li>More ways to sort your library</li>
                <li>Play suggestions based on what you’ve played and when</li>
              </ul>
            </div>
          </div>
        </section>

          {/* Installation */}
          <section className="rounded-lg ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-gray-900/40 p-4">
              <div className="flex-grow">
                  <h3 className="text-lg font-medium mb-2">Installation</h3>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                      <div
                          className="p-4 mb-4 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 rounded">
                          <p className="font-medium">Important</p>
                          <p>Make sure you have JDK 21 or higher installed before building from source.</p>
                      </div>
                      <p>To build Spark Launcher from source:</p>

                      <ol className="list-decimal pl-5 space-y-2">
                          <li>Download the latest release source code from the GitHub releases page</li>
                          <li>Extract the downloaded archive to your preferred location</li>
                          <li>Open a terminal/command prompt in the extracted directory</li>
                          <li>Run the Gradle build command:
                              <pre
                                  className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm whitespace-pre overflow-x-auto">
                ./gradlew composeApp:createReleaseDistributable
                </pre>
                          </li>
                      </ol>
                      <div className="mt-4">
                          <p className="font-medium mb-2">Custom build directory</p>
                          <p>To specify a custom output directory, use the following Gradle property:</p>
                          <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm overflow-x-auto">
                ./gradlew composeApp:createReleaseDistributable -PbuildDir=path/to/custom/directory
              </pre>
                      </div>
                      <p>After successful compilation, you&apos;ll find the application in the specified build
                          directory (or the default build output location if not specified).</p>
                  </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 italic">*Pre-release Note: While MSI
                  installers may be provided for some releases, they are not guaranteed for all pre-release versions. Building from
                  source is recommended for the most reliable installation.</p>
          </section>

          {/* Contributing */}
          <section className="rounded-lg ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-gray-900/40 p-4">
              <h3 className="text-lg font-medium mb-2">Contributing</h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p>We welcome contributions! Here&apos;s how you can help:</p>

                  <div className="space-y-4">
                      <div>
                          <h4 className="font-medium mb-2">Development setup</h4>
                          <ol className="list-decimal pl-5 space-y-2">
                              <li>Fork the repository</li>
                              <li>Clone your fork locally</li>
                              <li>Set up the development environment (JDK 21+)</li>
                              <li>Create a new branch for your feature</li>
                          </ol>
                      </div>

                      <div>
                          <h4 className="font-medium mb-2">Guidelines</h4>
                          <ul className="list-disc pl-5 space-y-1">
                              <li>Follow the existing code style and conventions</li>
                              <li>Write clear commit messages</li>
                              <li>Add tests for new features</li>
                              <li>Update documentation as needed</li>
                              <li>Submit a pull request with a description of your changes</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </section>

          {/* Legal disclaimer */}
          <section className="rounded-lg ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-gray-900/40 p-4">
          <h3 className="text-lg font-medium mb-2">Legal</h3>
          <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
            <p>
              Icons, box art, game titles, and game descriptions referenced or displayed by this application are the
              property of their respective owners and may be protected by copyright and/or trademark laws. Such
              materials are used solely for identification and informational purposes. No affiliation with or
              endorsement by the respective rights holders is implied.
            </p>
            <p>
              This application is provided &quot;AS IS&quot; under the terms of the GNU General Public License, version 2.0
              (GPL‑2.0), without warranties or conditions of any kind, either express or implied. For license details,
              please see the GPL‑2.0 text at
              {" "}
              <a
                href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-500"
              >
                gnu.org/licenses/gpl-2.0
              </a>
              .
            </p>
          </div>
        </section>

        <div className="flex flex-col items-center gap-3">
          <a
            href="https://github.com/cww2697/Spark-Launcher/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-orange-600 text-white hover:bg-orange-500 transition-colors"
          >
            <span>Download</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M3 16.5a.75.75 0 01.75-.75h3.9a.75.75 0 010 1.5H4.5v2.25h15V17.25h-3.15a.75.75 0 010-1.5h3.9a.75.75 0 01.75.75v3.75A1.5 1.5 0 0119.5 21.75h-15A1.5 1.5 0 013 20.25V16.5z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M12 3a.75.75 0 01.75.75v9.69l2.72-2.72a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 111.06-1.06l2.72 2.72V3.75A.75.75 0 0112 3z" clipRule="evenodd" />
            </svg>
          </a>

          <a
            href="https://github.com/cww2697/Spark-Launcher"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 inline-flex"
            aria-label="View Spark Launcher on GitHub"
            title="View on GitHub"
          >
            <svg className="w-10 h-10" fill="currentColor" viewBox=" 0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}
