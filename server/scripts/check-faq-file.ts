import 'dotenv/config';
import { getDb, getFAQItemsByLanguage } from "../db";
import * as fs from 'fs';
import * as path from 'path';

async function checkFAQ() {
    const languages = ['en', 'ko', 'de'] as const;
    let output = '';

    try {
        const db = await getDb();
        if (!db) {
            output += "Database not available\n";
        } else {
            for (const lang of languages) {
                const items = await getFAQItemsByLanguage(lang);
                output += `Language: ${lang}, Count: ${items.length}\n`;
            }
        }
    } catch (e) {
        output += `Error: ${e}\n`;
    }

    fs.writeFileSync(path.join(process.cwd(), 'faq_status.txt'), output);
    process.exit(0);
}

checkFAQ().catch((e) => {
    fs.writeFileSync('faq_status.txt', `Fatal Error: ${e}`);
    process.exit(1);
});
