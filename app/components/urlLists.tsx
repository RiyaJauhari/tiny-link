"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CopyIcon, TrashIcon, EyeIcon } from "lucide-react";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface UrlItem {
    code: string;
    clicks: number;
    created_at: string;
    last_clicked?: string;
}

export default function UrlLists() {
    const [urls, setUrls] = useState<UrlItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const getUrls = async () => {
        const res = await fetch("/api/links");
        const data = await res.json();
        setUrls(data);
        setLoading(false);
    };

    useEffect(() => {
        getUrls();
    }, []);

    const handleCopy = (code: string) => {
        const shortUrl = `${window.location.origin}/${code}`;
        navigator.clipboard.writeText(shortUrl);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const handleClick = async (code: string) => {
        const now = new Date().toISOString();

        setUrls(prev =>
            prev.map(item =>
                item.code === code
                    ? { ...item, clicks: item.clicks + 1, last_clicked: now }
                    : item
            )
        );

        window.open(`/${code}`, "_blank");
        await fetch(`/api/links/${code}`, { method: "GET" });
    };

    const handleDelete = async (code: string) => {
        setUrls(prev => prev.filter(item => item.code !== code));
        const res = await fetch(`/api/links/${code}`, { method: "DELETE" });
        if (!res.ok) getUrls();
    };

    if (loading) return <p className="p-4 text-center text-gray-500">Loading...</p>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Your Shortened URLs
            </h2>

            {urls.length === 0 ? (
                <p className="text-center text-gray-500">No links created yet.</p>
            ) : (
                <div className="space-y-4 w-xl items-start">
                    {urls.map(item => (
                        <div
                            key={item.code}
                            className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
                        >
                            {/* Short URL */}
                            <div className="flex-1">
                                <Tippy content={`${window.location.origin}/${item.code}`}>
                                    <span
                                        className="text-blue-600 font-medium underline cursor-pointer truncate block max-w-full"
                                        onClick={() => handleClick(item.code)}
                                    >
                                        {window.location.origin}/{item.code}
                                    </span>
                                </Tippy>
                            </div>

                            {/* Clicks */}
                            <div className="flex items-center gap-1 text-gray-700">
                                <EyeIcon className="w-5 h-5 text-blue-500" />
                                <span>{item.clicks}</span>
                            </div>

                            {/* Last Clicked */}
                            <div className="text-gray-500 text-sm whitespace-nowrap">
                                {item.last_clicked ? new Date(item.last_clicked).toLocaleString() : "-"}
                            </div>


                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleCopy(item.code)}
                                        className="hover:bg-gray-100"
                                    >
                                        <CopyIcon className="w-5 h-5 text-gray-600" />
                                    </Button>
                                    {copiedCode === item.code && (
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                                            Copied!
                                        </span>
                                    )}
                                </div>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDelete(item.code)}
                                    className="hover:bg-red-100"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>


            )}
        </div>
    );
}
