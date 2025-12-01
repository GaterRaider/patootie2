import 'dotenv/config';
import { getDb, createFAQItem, getFAQItemsByLanguage } from "../db";

async function seedDeFAQ() {
    console.log("🌱 Starting German FAQ seeding...");

    const db = await getDb();
    if (!db) {
        console.error("❌ Database not available");
        process.exit(1);
    }

    // Check if German items already exist to avoid duplicates
    const existingDe = await getFAQItemsByLanguage('de');
    if (existingDe.length > 0) {
        console.log(`⚠️  Found ${existingDe.length} existing German FAQ items. Skipping seeding.`);
        process.exit(0);
    }

    const deItems = [
        {
            question: "Was ist HandokHelper und für wen ist es gedacht?",
            answer: "HandokHelper ist ein persönlicher Unterstützungsservice, der Ihnen beim Umgang mit deutschen Behörden und Bürokratie hilft. Er richtet sich an Menschen, die nach Deutschland ziehen, bereits als Ausländer in Deutschland leben oder im Ausland leben, aber deutsche Papierarbeit wie Rentenanträge oder Registrierungen erledigen müssen. HandokHelper unterstützt Sie bei der Wohnungssuche, Einwanderungsangelegenheiten, offiziellen Anmeldungen, finanziellen Leistungen und mehr und fungiert als Ihr lokaler Ansprechpartner in Deutschland.",
            displayOrder: 0
        },
        {
            question: "Kann HandokHelper mir bei der Wohnungssuche in Deutschland helfen, auch wenn ich noch im Ausland bin?",
            answer: "Ja. HandokHelper unterstützt Sie bei der Wohnungssuche in Deutschland, auch wenn Sie sich noch in einem anderen Land befinden. Wir können bei der Suche nach Wohnungen oder Häusern helfen, Besichtigungen organisieren, mit Vermietern oder Wohnungsbaugesellschaften kommunizieren und Mietverträge prüfen. Wir helfen auch bei der nachfolgenden Bürokratie wie der Anmeldung, damit Sie reibungslos in Ihr neues Zuhause einziehen können.",
            displayOrder: 1
        },
        {
            question: "Wie unterstützt HandokHelper bei Einwanderung und Visa?",
            answer: "HandokHelper bietet Unterstützung bei Visumanträgen, Aufenthaltstiteln und anderen Einwanderungsverfahren in Deutschland. Wir helfen Ihnen zu verstehen, welches Visum oder welchen Aufenthaltstitel Sie benötigen, bereiten die erforderlichen Unterlagen vor, kommunizieren mit der Ausländerbehörde und überwachen Fristen. Typische Fälle sind Arbeitsvisa, Familienzusammenführung, Studienvisa, Blaue Karte und die Verlängerung oder Änderung Ihres aktuellen Aufenthaltstitels. Wir führen Sie Schritt für Schritt durch die deutschen rechtlichen und administrativen Anforderungen.",
            displayOrder: 2
        },
        {
            question: "Können Sie bei deutschen Rentenerstattungen helfen, wenn ich im Ausland lebe?",
            answer: "Ja, eine der Spezialitäten von HandokHelper ist die Unterstützung von Menschen, die im Ausland leben, aber Rentenansprüche in Deutschland haben. Wir helfen Ihnen, deutsche Rentenerstattungen zu beantragen, Rentenzahlungen anzufordern, Ihre Versicherungszeiten zu klären und mit der Deutschen Rentenversicherung zu kommunizieren. Wenn Sie unsicher sind, ob Sie Anspruch auf eine Zahlung oder Erstattung haben, können wir Ihre Situation prüfen, Ihre Optionen erklären und die notwendigen Anträge und Formulare vorbereiten.",
            displayOrder: 3
        },
        {
            question: "Ich brauche Hilfe bei deutschen Sozialleistungen (Kindergeld etc.). Ist das möglich?",
            answer: "HandokHelper kann Ihnen bei einer Reihe von deutschen Sozial- und Finanzleistungen helfen, wie z.B. Kindergeld, bestimmten Familienleistungen oder damit verbundenen bürokratischen Verfahren. Wir helfen Ihnen, die Anspruchsberechtigung zu verstehen, die richtigen Unterlagen zusammenzustellen und Anträge bei den zuständigen Behörden einzureichen. Unser Ziel ist es sicherzustellen, dass Sie keine Leistungen verpassen, auf die Sie Anspruch haben.",
            displayOrder: 4
        },
        {
            question: "Welche Art von „Behörden und Dokumenten“ kann HandokHelper für mich erledigen?",
            answer: "Wir können Sie bei fast jeder Aufgabe unterstützen, die deutsche Behörden, Ämter oder offizielle Dokumente betrifft. Dazu gehören An- und Abmeldung, Steuernummern, Meldebescheinigungen, Geburts- und Heiratsurkunden, Führerscheinumtausch, Versicherungsunterlagen und verschiedene Bestätigungen, die von deutschen Ämtern verlangt werden. Wir können auch bei der Kommunikation mit Rathäusern, Finanzämtern, Rentenversicherungen, Ausländerbehörden und anderen Institutionen helfen.",
            displayOrder: 5
        },
        {
            question: "Kann HandokHelper in meinem Namen handeln, wenn ich nicht persönlich in Deutschland sein kann?",
            answer: "In vielen Fällen ja. Wenn rechtlich zulässig und mit den erforderlichen Vollmachten ausgestattet, kann HandokHelper Aufgaben vor Ort in Deutschland für Sie erledigen. Dazu gehören das Einreichen von Unterlagen, die Wahrnehmung von Terminen, das Abholen oder Versenden offizieller Briefe und die Klärung von Angelegenheiten direkt mit deutschen Behörden.",
            displayOrder: 6
        },
        {
            question: "Wie läuft der Prozess vom ersten Kontakt bis zum Abschluss ab?",
            answer: "Der Prozess ist unkompliziert. Zuerst senden Sie Ihre Anfrage über das Kontaktformular und wählen die Servicekategorie, die zu Ihrer Situation passt. HandokHelper prüft Ihren Fall und kontaktiert Sie für ein unverbindliches Beratungsgespräch. Nachdem wir uns über den Arbeitsumfang und die Gebühren geeinigt haben, beginnen wir mit der Bearbeitung Ihres Falls, halten Sie auf dem Laufenden und unterstützen Sie, bis die Angelegenheit geklärt ist.",
            displayOrder: 7
        },
        {
            question: "Wie sind die Preise und Zahlungsoptionen für HandokHelper-Dienstleistungen?",
            answer: "HandokHelper bietet Festpreise, Stundensätze oder prozentuale Gebühren an, abhängig von der Dienstleistung und Komplexität. Vor Beginn erhalten Sie ein klares Angebot mit voller Transparenz. Zahlungen erfolgen in der Regel per Banküberweisung oder Online-Zahlungsoptionen.",
            displayOrder: 8
        },
        {
            question: "Kann HandokHelper mir bei der Einrichtung von Bankkonten, Versicherungen und anderen Verträgen helfen?",
            answer: "Ja. Im Bereich Integration & Alltag unterstützt HandokHelper Sie bei Bankgrundlagen, Versicherungsverträgen (z.B. Kranken- oder Haftpflichtversicherung), Versorgungsleistungen (Strom, Internet, Gas) und anderen wesentlichen Dienstleistungen. Wir helfen Ihnen, Optionen zu vergleichen, Bedingungen zu verstehen und den notwendigen Papierkram zu erledigen.",
            displayOrder: 9
        },
        {
            question: "Ist HandokHelper sowohl für Kunden innerhalb als auch außerhalb Deutschlands verfügbar?",
            answer: "Absolut. HandokHelper arbeitet sowohl mit Kunden, die in Deutschland leben, als auch mit solchen, die im Ausland leben, aber deutsche Behördenangelegenheiten erledigen müssen. Wir unterstützen Sie aus der Ferne per E-Mail, Telefon und bei Bedarf durch Handeln vor Ort in Deutschland.",
            displayOrder: 10
        },
        {
            question: "In welchen Sprachen bietet HandokHelper Unterstützung an?",
            answer: "HandokHelper bietet Unterstützung auf Englisch, Koreanisch (한국어) und Deutsch. Dieser mehrsprachige Ansatz hilft internationalen Kunden, jeden Schritt ihres Falls nahtlos zu kommunizieren und zu verstehen.",
            displayOrder: 11
        },
        {
            question: "Ist HandokHelper eine Anwaltskanzlei oder ein Einwanderungsanwalt?",
            answer: "HandokHelper ist keine Anwaltskanzlei und ersetzt keine Rechtsberatung. Wir sind spezialisiert auf praktische Unterstützung, Kommunikation mit deutschen Behörden und Hilfe beim Ausfüllen erforderlicher Dokumente. Für komplexe Rechtsfälle, die einen Anwalt erfordern, können wir Sie entsprechend beraten.",
            displayOrder: 12
        },
        {
            question: "Wie schnell kann HandokHelper mit der Arbeit an meinem Fall beginnen?",
            answer: "Sobald Sie Ihre Anfrage einreichen, prüft HandokHelper Ihren Fall und kontaktiert Sie zeitnah. Der Startzeitpunkt hängt von der Dringlichkeit, Komplexität und behördlichen Fristen ab. Wir bemühen uns immer, so schnell wie möglich zu beginnen.",
            displayOrder: 13
        },
        {
            question: "Was, wenn ich mir nicht sicher bin, welchen Service ich benötige?",
            answer: "Wenn Sie unsicher sind, beschreiben Sie einfach Ihre Situation in eigenen Worten im Kontaktformular. HandokHelper wird Ihre Anfrage einordnen und Sie zur richtigen Servicekategorie führen.",
            displayOrder: 15
        }
    ];

    let totalMigrated = 0;

    for (const item of deItems) {
        try {
            await createFAQItem({
                language: 'de',
                question: item.question,
                answer: item.answer,
                displayOrder: item.displayOrder,
                isPublished: true,
            });
            console.log(`   ✅ Created: "${item.question.substring(0, 50)}..."`);
            totalMigrated++;
        } catch (error) {
            console.error(`   ❌ Failed to create item: ${item.question}`, error);
        }
    }

    console.log(`\n✨ Seeding complete! Created ${totalMigrated} German FAQ items.`);
    process.exit(0);
}

seedDeFAQ().catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
});
