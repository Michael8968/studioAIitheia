
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Star, Circle, MessageSquare, Phone, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type User, getUsers } from '@/store/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

function DesignerCardSkeleton() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-5 w-1/4" />
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>
            </CardContent>
            <CardFooter className="gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    );
}

export default function DesignersPage() {
    const router = useRouter();
    const [designers, setDesigners] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchDesigners() {
            setIsLoading(true);
            try {
                const allUsers = await getUsers();
                const creatorUsers = allUsers.filter(user => user.role === 'creator');
                setDesigners(creatorUsers);
            } catch (error) {
                console.error("Failed to fetch designers:", error);
                toast({ variant: 'destructive', title: '加载失败', description: '无法从服务器获取设计师列表。' });
            } finally {
                setIsLoading(false);
            }
        }
        fetchDesigners();
    }, [toast]);

    const getAvatar = (name: string): string => {
        const nameMap: { [key: string]: string } = {
            '爱丽丝': 'female creator',
            '鲍勃': 'male designer',
            '查理': 'male artist',
            '戴安娜': 'female artist',
        };
        return nameMap[name] || 'user avatar';
    };
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-3xl font-headline font-bold">创意设计师</h1>
                <p className="text-muted-foreground">寻找顶尖创意人才并与之合作。</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">系统推荐</Button>
                    <Button onClick={() => router.push('/demand-pool')}>去需求池发布</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, index) => <DesignerCardSkeleton key={index} />)
                ) : (
                    designers.map(designer => (
                        <Card key={designer.id} className="flex flex-col">
                            <CardHeader className="flex-row items-start gap-4 space-y-0">
                                <Image src={`https://placehold.co/64x64.png`} alt={designer.name} width={64} height={64} className="rounded-full" data-ai-hint={getAvatar(designer.name)} />
                                <div className="flex-1">
                                    <CardTitle className="text-xl">{designer.name}</CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span>{designer.rating?.toFixed(1)}</span>
                                        <span className="text-xs">/ 5.0</span>
                                    </div>
                                    <Badge variant={designer.online ? 'default' : 'outline'} className="mt-1 bg-green-500 hover:bg-green-600 text-white data-[state=false]:bg-muted data-[state=false]:text-muted-foreground">
                                        <Circle className={`mr-2 h-2 w-2 ${designer.online ? 'fill-white' : 'fill-muted-foreground'}`} />
                                        {designer.online ? '在线' : '离线'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                <p className="text-sm text-muted-foreground">{designer.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {designer.tags?.map(tag => (
                                        <Badge key={tag} variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="gap-2">
                                <Button className="w-full" disabled={!designer.online}>
                                    <Phone className="mr-2 h-4 w-4"/>
                                    预约
                                </Button>
                                <Button variant="outline" className="w-full" disabled={!designer.online}>
                                    <MessageSquare className="mr-2 h-4 w-4"/>
                                    沟通
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
