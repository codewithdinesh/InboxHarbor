"use client"

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);

    const crawlWebsite = async () => {
        try {
            setLoading(true);

            const response = await fetch(`/api/?website=${encodeURIComponent(websiteUrl)}`);
            const data = await response.json();

            if (data.emails) {
                setEmails(data.emails);
            } else {
                console.error('Error extracting emails:', data.error);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error crawling website:', error.message);
            setLoading(false);
        }
    };

    return (
        <div>
            <Head>
                <title>InboxHarbor - Your Email Extractor App</title>
                <meta name="description" content="Extract email addresses from websites with InboxHarbor." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="bg-gray-100 min-h-screen flex items-center justify-center">
                <div className="max-w-3xl w-full bg-white p-8 rounded-md shadow-md">
                    <h1 className="text-4xl font-bold mb-4 text-center">InboxHarbor</h1>
                    <p className="text-gray-600 text-lg mb-6 text-center">
                        Extract email addresses from websites effortlessly.
                    </p>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Enter website URL:</label>
                        <input
                            type="text"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <button
                        onClick={crawlWebsite}
                        disabled={loading}
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        {loading ? 'Crawling...' : 'Crawl Website'}
                    </button>
                    {emails?.length > 0 && (
                        <div className="mt-4">
                            <h2 className="text-xl font-bold mb-2">Email Addresses:</h2>
                            <ul>
                                {emails?.map((email, index) => {

                                    return <Link href={`mailto:${email}`} key={index}>
                                        <li key={index} className="text-blue-500 cursor-pointer">
                                            {email}
                                        </li>
                                    </Link>
                                }
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
