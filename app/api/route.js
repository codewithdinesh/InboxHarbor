import axios from 'axios';
import cheerio from 'cheerio';

import { NextResponse } from 'next/server';

export async function GET(request) {

    const { searchParams } = new URL(request.url);
    const website = searchParams.get('website');

    try {
        const response = await axios.get(website);
        const html = response.data;
        const $ = cheerio.load(html);

        // Extract email addresses using a regular expression
        const extractedEmails = extractEmails(html)

        // Return the extracted email addresses as the API response
        return NextResponse.json({ emails: extractedEmails });
    } catch (error) {

        console.error('Error scraping website:', error);
        return NextResponse.json({ error: 'An error occurred while scraping the website' });
    }
}

function extractEmails(html) {
    const $ = cheerio.load(html);

    // Regular expression for extracting email addresses
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

    // Extract email addresses from the HTML content
    const extractedEmails = [];
    $('body').text().replace(emailRegex, (match) => {
        extractedEmails.push(match);
    });

    return extractedEmails;
}