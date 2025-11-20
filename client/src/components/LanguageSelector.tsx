import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-0.5 sm:gap-0.5 md:gap-1 px-1.5 sm:px-2 md:px-2.5 py-1 sm:py-1.5 md:py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
            <button
                onClick={() => setLanguage("en")}
                className={`transition-all duration-200 flex-shrink-0 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 md:py-1.5 rounded-full border-2 flex items-center justify-center ${language === "en"
                        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500 shadow-sm"
                        : "border-transparent bg-transparent opacity-75 hover:opacity-100 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-gray-900"
                    }`}
                title="English"
                aria-label="Switch to English"
            >
                <img
                    src="/flags/usa.svg"
                    alt="USA Flag"
                    className="h-3.5 sm:h-4 md:h-5 lg:h-6 w-auto"
                />
            </button>
            <button
                onClick={() => setLanguage("ko")}
                className={`transition-all duration-200 flex-shrink-0 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 md:py-1.5 rounded-full border-2 flex items-center justify-center ${language === "ko"
                        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500 shadow-sm"
                        : "border-transparent bg-transparent opacity-75 hover:opacity-100 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-gray-900"
                    }`}
                title="Korean"
                aria-label="Switch to Korean"
            >
                <img
                    src="/flags/south-korea.svg"
                    alt="South Korea Flag"
                    className="h-3.5 sm:h-4 md:h-5 lg:h-6 w-auto"
                />
            </button>
        </div>
    );
}
