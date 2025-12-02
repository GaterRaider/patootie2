import 'dotenv/config';
import { getDb, getFAQItemsByLanguage } from "../db";

async function checkFAQ() {
    console.log("Checking FAQ items...");
    const db = await getDb();
    if (!db) {
        console.error("Database not available");
        process.exit(1);
    }

    const languages = ['en', 'ko', 'de'] as const;

    for (const lang of languages) {
        const items = await getFAQItemsByLanguage(lang);
        console.log(`Language: ${lang}, Count: ${items.length}`);
        if (items.length > 0) {
            console.log(`Sample item: ${items[0].question}`);
        }
    }
    process.exit(0);
}

checkFAQ().catch(console.error);
