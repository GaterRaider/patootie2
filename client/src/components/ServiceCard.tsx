import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, LucideIcon } from "lucide-react";
import { useState } from "react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  servicesList?: string[];
  ctaText: string;
  onClick: () => void;
  language?: "en" | "ko";
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  servicesList,
  ctaText,
  onClick,
  language = "en",
}: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 relative overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 flex-shrink-0">
            <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Expandable section with bullet points */}
        {servicesList && servicesList.length > 0 && (
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-96" : "max-h-0"}`}>
            <div className="pt-2 pb-4 border-t">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {servicesList.map((service, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="leading-relaxed">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="w-full shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105"
              size="sm"
            >
              {ctaText}
            </Button>

            {servicesList && servicesList.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors py-1"
              >
                <span>
                  {isExpanded
                    ? (language === "ko" ? "줄이기" : "Show less")
                    : (language === "ko" ? "자세히 보기" : "Learn more")}
                </span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
