import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, LucideIcon } from "lucide-react";
import { useState } from "react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  fullDescription: string;
  pricing: string;
  ctaText: string;
  onClick: () => void;
  language?: "en" | "ko";
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  fullDescription,
  pricing,
  ctaText,
  onClick,
  language = "en",
}: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(true);
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
        {/* Expandable section */}
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-48" : "max-h-0"}`}>
          <div className="pt-2 pb-4 text-sm text-muted-foreground leading-relaxed border-t">
            {fullDescription}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-primary">{pricing}</p>
          
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
