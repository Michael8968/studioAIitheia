
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const mockResults = [
    { title: '环保T恤供应商', description: '提供经认证的有机棉T恤，可批量订购。', relevance: 95 },
    { title: '赛博朋克3D角色模型', description: '一个带有PBR纹理和完整绑定的游戏可用资产。', relevance: 88 },
    { title: '极简风格Logo设计服务', description: '专为初创公司提供简洁现代的品牌设计。', relevance: 82 },
    { title: '移动应用UI套件', description: '一个用于构建现代iOS和Android应用的综合性Figma UI套件。', relevance: 75 },
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
                <span className="text-sm text-muted-foreground">相关度</span>
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
                <h1 className="text-3xl font-headline font-bold">智能搜索</h1>
                <p className="text-muted-foreground">跨需求、创意者、供应商和知识库条目进行搜索。</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex gap-2">
                    <Input 
                        placeholder="输入您的搜索查询..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        disabled={isLoading}
                    />
                    <Button onClick={handleSearch} disabled={isLoading || !query}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
                        <span className="hidden sm:inline ml-2">搜索</span>
                    </Button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                {isLoading && (
                    <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">AI 正在搜索中...</p>
                    </div>
                )}

                {results && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-headline font-semibold">搜索结果</h2>
                        {results.map((result, index) => (
                            <SearchResultItem key={index} {...result} />
                        ))}
                    </div>
                )}
                
                {!isLoading && !results && (
                     <div className="text-center py-12 text-muted-foreground">
                        <p>输入查询以开始搜索。</p>
                    </div>
                )}
            </div>
        </div>
    )
}
