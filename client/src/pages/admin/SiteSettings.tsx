import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Save, Settings2, Clock, Plus, Trash2, Edit2, GripVertical, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TestimonialItem {
    id: string;
    name: string;
    rating: number;
    profilePicture?: string;
    text?: string;
    active: boolean;
}

interface HeroTestimonialsConfig {
    enabled: boolean;
    items: TestimonialItem[];
}

export default function SiteSettings() {
    const { data: settings, isLoading } = trpc.siteSettings.getAll.useQuery();
    const utils = trpc.useContext();

    const [showResponseTime, setShowResponseTime] = useState(false);

    // Testimonials State
    const [testimonialsEnabled, setTestimonialsEnabled] = useState(false);
    const [testimonialItems, setTestimonialItems] = useState<TestimonialItem[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<TestimonialItem>>({
        name: "",
        rating: 5,
        profilePicture: "",
        text: "",
        active: true
    });

    const updateMutation = trpc.siteSettings.update.useMutation({
        onSuccess: () => {
            utils.siteSettings.getAll.invalidate();
            toast.success("Settings updated successfully!");
        },
        onError: (error) => {
            toast.error(`Failed to update settings: ${error.message}`);
        },
    });

    // Update local state when data loads
    useEffect(() => {
        if (settings) {
            setShowResponseTime(settings.showResponseTime === 'true');

            if (settings.heroTestimonials) {
                try {
                    const parsed: HeroTestimonialsConfig = JSON.parse(settings.heroTestimonials);
                    setTestimonialsEnabled(parsed.enabled);
                    setTestimonialItems(parsed.items || []);
                } catch (e) {
                    console.error("Failed to parse hero testimonials", e);
                }
            } else {
                // Initialize with some default if empty
                setTestimonialItems([]);
            }
        }
    }, [settings]);

    const handleToggleResponseTime = (checked: boolean) => {
        setShowResponseTime(checked);
        updateMutation.mutate({
            key: 'showResponseTime',
            value: checked ? 'true' : 'false',
        });
    };

    const saveTestimonialsConfig = (enabled: boolean, items: TestimonialItem[]) => {
        const config: HeroTestimonialsConfig = {
            enabled,
            items
        };
        updateMutation.mutate({
            key: 'heroTestimonials',
            value: JSON.stringify(config)
        });
    };

    const handleToggleTestimonials = (checked: boolean) => {
        setTestimonialsEnabled(checked);
        saveTestimonialsConfig(checked, testimonialItems);
    };

    const handleOpenDialog = (item?: TestimonialItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({ ...item });
        } else {
            setEditingItem(null);
            setFormData({
                name: "",
                rating: 5,
                profilePicture: "",
                text: "",
                active: true
            });
        }
        setIsDialogOpen(true);
    };

    const handleSaveItem = () => {
        if (!formData.name) {
            toast.error("Name is required");
            return;
        }

        let newItems = [...testimonialItems];

        if (editingItem) {
            // Edit existing
            newItems = newItems.map(item =>
                item.id === editingItem.id
                    ? { ...item, ...formData } as TestimonialItem
                    : item
            );
        } else {
            // Add new
            const newItem: TestimonialItem = {
                id: crypto.randomUUID(),
                name: formData.name,
                rating: formData.rating || 5,
                profilePicture: formData.profilePicture,
                text: formData.text,
                active: formData.active ?? true
            };
            newItems.push(newItem);
        }

        setTestimonialItems(newItems);
        saveTestimonialsConfig(testimonialsEnabled, newItems);
        setIsDialogOpen(false);
    };

    const handleDeleteItem = (id: string) => {
        const newItems = testimonialItems.filter(item => item.id !== id);
        setTestimonialItems(newItems);
        saveTestimonialsConfig(testimonialsEnabled, newItems);
    };

    const handleToggleItemActive = (id: string, active: boolean) => {
        const newItems = testimonialItems.map(item =>
            item.id === id ? { ...item, active } : item
        );
        setTestimonialItems(newItems);
        saveTestimonialsConfig(testimonialsEnabled, newItems);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
                <p className="text-muted-foreground">
                    Configure public-facing website features
                </p>
            </div>

            <div className="grid gap-6 max-w-4xl">
                {/* Hero Testimonials Configuration */}
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-0 bg-card">
                    <CardHeader className="space-y-1 pb-4">
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-indigo-500 fill-indigo-500" />
                            <CardTitle className="text-lg font-semibold">Hero Testimonials</CardTitle>
                        </div>
                        <CardDescription>
                            Showcase client reviews in the hero section below the CTA button
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="show-testimonials" className="text-sm font-medium">
                                    Show Testimonials
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Display the testimonial carousel on the homepage
                                </p>
                            </div>
                            <Switch
                                id="show-testimonials"
                                checked={testimonialsEnabled}
                                onCheckedChange={handleToggleTestimonials}
                                disabled={updateMutation.status === "pending"}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium">Testimonials List</h3>
                                <Button size="sm" onClick={() => handleOpenDialog()} variant="outline" className="gap-2">
                                    <Plus className="h-3.5 w-3.5" /> Add New
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {testimonialItems.length === 0 ? (
                                    <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                                        No testimonials added yet. Click "Add New" to get started.
                                    </div>
                                ) : (
                                    testimonialItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group">
                                            <div className="cursor-move text-muted-foreground hover:text-foreground">
                                                <GripVertical className="h-4 w-4" />
                                            </div>
                                            <Avatar className="h-9 w-9 border border-border">
                                                <AvatarImage src={item.profilePicture} />
                                                <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm truncate">{item.name}</span>
                                                    <div className="flex text-yellow-400">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        <span className="text-xs text-muted-foreground ml-1 text-slate-500">{item.rating.toFixed(1)}</span>
                                                    </div>
                                                </div>
                                                {item.text && (
                                                    <p className="text-xs text-muted-foreground truncate max-w-[300px]">{item.text}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={item.active}
                                                    onCheckedChange={(c) => handleToggleItemActive(item.id, c)}
                                                    className="scale-75"
                                                />
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(item)}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteItem(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Response Time Display */}
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-0 bg-card">
                    <CardHeader className="space-y-1 pb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg font-semibold">Response Time Expectations</CardTitle>
                        </div>
                        <CardDescription>
                            Display response time information on the home page
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="show-response-time" className="text-sm font-medium">
                                    Show Response Time
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Display expected response time to visitors
                                </p>
                            </div>
                            <Switch
                                id="show-response-time"
                                checked={showResponseTime}
                                onCheckedChange={handleToggleResponseTime}
                                disabled={updateMutation.status === "pending"}
                            />
                        </div>

                        {showResponseTime && (
                            <div className="pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    <strong>Current text:</strong>
                                </p>
                                <div className="mt-2 space-y-1 text-sm">
                                    <p>🇺🇸 {settings?.responseTimeText_en || "We typically respond within 24-48 hours"}</p>
                                    <p>🇰🇷 {settings?.responseTimeText_ko || "일반적으로 24-48시간 이내에 응답합니다"}</p>
                                    <p>🇩🇪 {settings?.responseTimeText_de || "Wir antworten normalerweise innerhalb von 24-48 Stunden"}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-3">
                                    To edit the response time text, update the database directly or contact your developer.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Client's Name"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Rating (1-5)</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="5"
                                    step="0.1"
                                    value={formData.rating}
                                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Active</Label>
                                <div className="flex items-center h-10">
                                    <Switch
                                        checked={formData.active}
                                        onCheckedChange={(c) => setFormData({ ...formData, active: c })}
                                    />
                                    <span className="ml-2 text-sm text-muted-foreground">{formData.active ? "Visible" : "Hidden"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Profile Picture URL</Label>
                            <Input
                                value={formData.profilePicture}
                                onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
                                placeholder="https://..."
                            />
                            <p className="text-[10px] text-muted-foreground">Leave empty to use initials fallback</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Testimonial Text (Optional)</Label>
                            <Textarea
                                value={formData.text}
                                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                placeholder="Short testimonial..."
                                className="resize-none"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveItem}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
