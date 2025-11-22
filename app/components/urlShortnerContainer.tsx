"use client"

import ShortenForm from "./shortenForm";
import UrlLists from "./urlLists";

export default function UrlShortnerContainer() {
    return (
        <>
            <div className="p-4">
                <ShortenForm />
                <UrlLists />

            </div>


        </>
    )
}