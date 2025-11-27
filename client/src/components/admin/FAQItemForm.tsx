import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { FAQItem } from "../../../../drizzle/schema";

interface FAQItemFormProps {
    item: FAQItem | null;
    onSubmit: (data: { question: string; answer: string; isPublished?: boolean }) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

export function FAQItemForm({ item, onSubmit, onCancel, isSubmitting }: FAQItemFormProps) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [isPublished, setIsPublished] = useState(true);

    useEffect(() => {
        if (item) {
            setQuestion(item.question);
            setAnswer(item.answer);
            setIsPublished(item.isPublished);
        } else {
            setQuestion("");
            setAnswer("");
            setIsPublished(true);
        }
    }, [item]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ question, answer, isPublished });
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{item ? "Edit FAQ Item" : "Create FAQ Item"}</DialogTitle>
                        <DialogDescription>
                            {item
                                ? "Update the question and answer for this FAQ item."
                                : "Add a new frequently asked question and its answer."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="question">Question *</Label>
                            <Textarea
                                id="question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="What is your question?"
                                required
                                rows={2}
                                className="resize-none"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="answer">Answer *</Label>
                            <Textarea
                                id="answer"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Provide a detailed answer..."
                                required
                                rows={6}
                                className="resize-y"
                            />
                            <p className="text-xs text-muted-foreground">
                                {answer.length} characters
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isPublished"
                                checked={isPublished}
                                onCheckedChange={(checked) => setIsPublished(checked as boolean)}
                            />
                            <Label
                                htmlFor="isPublished"
                                className="text-sm font-normal cursor-pointer"
                            >
                                Publish immediately
                            </Label>
                        </div>

                        {/* Preview */}
                        {(question || answer) && (
                            <div className="border rounded-lg p-4 bg-muted/30">
                                <p className="text-xs font-semibold text-muted-foreground mb-2">
                                    PREVIEW
                                </p>
                                {question && (
                                    <p className="font-semibold mb-2">{question}</p>
                                )}
                                {answer && (
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {answer}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || !question.trim() || !answer.trim()}>
                            {isSubmitting ? "Saving..." : item ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
