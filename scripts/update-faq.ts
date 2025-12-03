
import { config } from 'dotenv';
import { resolve } from 'path';
import { db, getDb, updateFAQItem } from '../server/db';
import { faqItems } from '../drizzle/schema';
import { eq, and, like } from 'drizzle-orm';

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

async function main() {
    console.log('Connecting to database...');
    const database = await getDb();

    if (!database) {
        console.error('Failed to connect to database');
        process.exit(1);
    }

    console.log('Fetching Korean FAQ items...');
    const koreanFaqs = await database
        .select()
        .from(faqItems)
        .where(eq(faqItems.language, 'ko'));

    console.log(`Found ${koreanFaqs.length} Korean FAQ items.`);

    let updatedCount = 0;

    for (const faq of koreanFaqs) {
        let needsUpdate = false;
        let newQuestion = faq.question;
        let newAnswer = faq.answer;

        if (newQuestion.includes('HandokHelper')) {
            newQuestion = newQuestion.replace(/HandokHelper/g, '한독헬퍼');
            needsUpdate = true;
        }

        if (newAnswer.includes('HandokHelper')) {
            newAnswer = newAnswer.replace(/HandokHelper/g, '한독헬퍼');
            needsUpdate = true;
        }

        if (needsUpdate) {
            console.log(`Updating FAQ ID ${faq.id}...`);
            await updateFAQItem(faq.id, {
                question: newQuestion,
                answer: newAnswer,
            });
            updatedCount++;
        }
    }

    console.log(`Updated ${updatedCount} FAQ items.`);
    process.exit(0);
}

main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
