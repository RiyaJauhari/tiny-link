"use client"

import UrlShortnerContainer from "./components/urlShortnerContainer";

export default function Home() {
  return (
    <main className=" mx-auto max-w-xl py-12 md:py-24">
      <div className="text-center space-y-2">

        <h1 className="relative z-10 text-lg md:text-4xl  bg-clip-text text-transparent bg-linear-to-b from-gray-950 to-neutral-600  text-center font-sans font-bold">
          URL SHORTNER
        </h1>
        <p className="md:text-lg">Shorten your url and share them easily</p>


      </div>
      <UrlShortnerContainer />
    </main>
  );
}
