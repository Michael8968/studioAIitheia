
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Star, Circle, MessageSquare, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

const mockDesigners = [
  { id: 'creator-1', name: 'Alice', avatar: 'female creator', rating: 4.9, online: true, desc: '10+ years in character design, specialized in fantasy and sci-fi.', tags: ['3D Character', 'Sci-Fi', 'Stylized'] },
  { id: 'creator-2', name: 'Bob', avatar: 'male designer', rating: 4.8, online: false, desc: 'Expert in architectural visualization and realistic rendering.', tags: ['ArchViz', 'Realism', 'Unreal Engine'] },
  { id: 'creator-3', name: 'Charlie', avatar: 'male artist', rating: 5.0, online: true, desc: 'Passionate about creating game-ready assets and environments.', tags: ['Game Assets', 'PBR', 'Blender'] },
  { id: 'creator-4', name: 'Diana', avatar: 'female artist', rating: 4.7, online: true, desc: 'Motion graphics and abstract 3D art specialist.', tags: ['Abstract', 'Houdini', 'Motion Design'] },
];

export default function DesignersPage() {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-3xl font-headline font-bold">Creative Designers</h1>
                <p className="text-muted-foreground">Find and collaborate with top-tier creative talent.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">System Recommendation</Button>
                    <Button onClick={() => router.push('/demand-pool')}>Publish to Demand Pool</Button>
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
                                    {designer.online ? 'Online' : 'Offline'}
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
                                Make an Appointment
                            </Button>
                            <Button variant="outline" className="w-full" disabled={!designer.online}>
                                <MessageSquare className="mr-2 h-4 w-4"/>
                                Communicate
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
