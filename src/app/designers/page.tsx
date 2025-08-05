
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Star, Circle, MessageSquare, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

const mockDesigners = [
  { id: 'creator-1', name: '爱丽丝', avatar: 'female creator', rating: 4.9, online: true, desc: '10年以上角色设计经验，专精于奇幻与科幻风格。', tags: ['3D角色', '科幻', '风格化'] },
  { id: 'creator-2', name: '鲍勃', avatar: 'male designer', rating: 4.8, online: false, desc: '建筑可视化与写实渲染专家。', tags: ['建筑可视化', '写实', 'UE引擎'] },
  { id: 'creator-3', name: '查理', avatar: 'male artist', rating: 5.0, online: true, desc: '热衷于创作游戏可用资产与环境。', tags: ['游戏资产', 'PBR', 'Blender'] },
  { id: 'creator-4', name: '戴安娜', avatar: 'female artist', rating: 4.7, online: true, desc: '动态图形与抽象3D艺术专家。', tags: ['抽象', 'Houdini', '动态设计'] },
];

export default function DesignersPage() {
    const router = useRouter();

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
                {mockDesigners.map(designer => (
                    <Card key={designer.id} className="flex flex-col">
                        <CardHeader className="flex-row items-start gap-4 space-y-0">
                            <Image src={`https://placehold.co/64x64.png`} alt={designer.name} width={64} height={64} className="rounded-full" data-ai-hint={designer.avatar} />
                            <div className="flex-1">
                                <CardTitle className="text-xl">{designer.name}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span>{designer.rating}</span>
                                    <span className="text-xs">/ 5.0</span>
                                </div>
                                <Badge variant={designer.online ? 'default' : 'outline'} className="mt-1 bg-green-500 hover:bg-green-600 text-white data-[state=false]:bg-muted data-[state=false]:text-muted-foreground">
                                    <Circle className={`mr-2 h-2 w-2 ${designer.online ? 'fill-white' : 'fill-muted-foreground'}`} />
                                    {designer.online ? '在线' : '离线'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <p className="text-sm text-muted-foreground">{designer.desc}</p>
                            <div className="flex flex-wrap gap-2">
                                {designer.tags.map(tag => (
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
                ))}
            </div>
        </div>
    );
}
