
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const mockResults = [
    { title: 'Eco-Friendly T-Shirt Supplier', description: 'Provides certified organic cotton t-shirts, available for bulk orders.', relevance: 95 },
    { title: 'Cyberpunk 3D Character Model', description: 'A game-ready asset with PBR textures and full rigging.', relevance: 88 },
    { title: 'Minimalist Logo Design Service', description: 'Specializing in clean and modern branding for startups.', relevance: 82 },
    { title: 'Mobile App UI Kit', description: 'A comprehensive Figma UI kit for building modern iOS and Android apps.', relevance: 75 },
];

function SearchResultItem({ title, description, relevance }: { title: string, description: string, relevance: number }) {
    let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
    if (relevance < 70) badgeVariant = "secondary";
    if (relevance < 50) badgeVariant = "outline";

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Relevance</span>
                <Progress value={relevance} className="flex-1" />
                <Badge variant={badgeVariant}>{relevance}%</Badge>
            </CardContent>
        </Card>
    )
}

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<any[] | null>(null);

    const handleSearch = () => {
        if (!query) return;
        setIsLoading(true);
        setResults(null);
        setTimeout(() => {
            setResults(mockResults);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-headline font-bold">Intelligent Search</h1>
                <p className="text-muted-foreground">Search across demands, creators, suppliers, and knowledge base entries.</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex gap-2">
                    <Input 
                        placeholder="Enter your search query..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        disabled={isLoading}
                    />
                    <Button onClick={handleSearch} disabled={isLoading || !query}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
                        <span className="hidden sm:inline ml-2">Search</span>
                    </Button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                {isLoading && (
                    <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">AI is searching...</p>
                    </div>
                )}

                {results && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-headline font-semibold">Search Results</h2>
                        {results.map((result, index) => (
                            <SearchResultItem key={index} {...result} />
                        ))}
                    </div>
                )}
                
                {!isLoading && !results && (
                     <div className="text-center py-12 text-muted-foreground">
                        <p>Enter a query to start searching.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
