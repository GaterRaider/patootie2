import 'dotenv/config';
import { getDb, createFAQItem } from "../db";
import * as fs from "fs";
import * as path from "path";

interface FAQData {
    "@context": string;
    "@type": string;
    mainEntity: Array<{
        "@type": string;
        name: string;
        acceptedAnswer: {
            "@type": string;
            text: string;
        };
    }>;
}

async function seedFAQ() {
    console.log("🌱 Starting FAQ migration...");
    console.log("CWD:", process.cwd());

    const db = await getDb();
    if (!db) {
        console.error("❌ Database not available");
        process.exit(1);
    }

    const languages = [
        { code: "en", file: "handokhelper_faq_en.json" },
        { code: "ko", file: "handokhelper_faq_korean_final.json" },
    ];

    let totalMigrated = 0;

    for (const { code, file } of languages) {
        const filePath = path.join(process.cwd(), "client", "public", file);
        console.log(`Checking file: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️  File not found: ${file}, skipping...`);
            continue;
        }

        console.log(`\n📖 Reading ${file}...`);
        const content = fs.readFileSync(filePath, "utf-8");
        const data: FAQData = JSON.parse(content);

        console.log(`   Found ${data.mainEntity.length} FAQ items for language: ${code}`);

        for (let i = 0; i < data.mainEntity.length; i++) {
            const entity = data.mainEntity[i];

            try {
                await createFAQItem({
                    language: code,
                    question: entity.name,
                    answer: entity.acceptedAnswer.text,
                    displayOrder: i,
                    isPublished: true,
                });

                console.log(`   ✅ Migrated: "${entity.name.substring(0, 50)}..."`);
                totalMigrated++;
            } catch (error) {
                console.error(`   ❌ Failed to migrate item ${i + 1}:`, error);
            }
        }
    }

    console.log(`\n✨ Migration complete! Migrated ${totalMigrated} FAQ items.`);
    process.exit(0);
}

// Run the seed function
seedFAQ().catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
});
