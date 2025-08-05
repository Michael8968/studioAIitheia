
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getProductRecommendations, type ProductRecommendationsOutput } from '@/ai/flows/product-recommendations';
import { generateUserProfile, type UserProfile } from '@/ai/flows/generate-user-profile';
import { Loader2, Image as ImageIcon, Send, Sparkles, Tags, BrainCircuit, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '../ui/badge';
import { useAuthStore } from '@/store/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const formSchema = z.object({
  description: z.string().min(1, { message: '请输入您要搜索的内容' }),
  image: z.instanceof(File).optional(),
});
type FormValues = z.infer<typeof formSchema>;

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to read file as Data URI'));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

const UserMessage = ({ text, imageUrl }: { text: string; imageUrl?: string | null }) => (
    <div className="flex items-start justify-end gap-3">
        <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-lg">
            {imageUrl && <Image src={imageUrl} alt="用户上传" width={200} height={200} className="rounded-md mb-2" />}
            <p>{text}</p>
        </div>
        <Avatar className="border">
            <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="user avatar" />
            <AvatarFallback>您</AvatarFallback>
        </Avatar>
    </div>
);

const AIMessage = ({ profile, recommendations, onPublish }: { profile: UserProfile | null; recommendations: ProductRecommendationsOutput['recommendations']; onPublish: () => void; }) => {
    const { role } = useAuthStore();
    return (
        <div className="flex items-start gap-3">
            <Avatar className="border">
                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="bot avatar" />
                <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-4 max-w-2xl">
                {profile && <UserProfileDisplay profile={profile} />}
                {recommendations.length > 0 && <RecommendationsDisplay recommendations={recommendations} onPublish={onPublish} showPublishButton={role === 'user'} />}
            </div>
        </div>
    );
};

const LoadingMessage = () => (
    <div className="flex items-start gap-3">
        <Avatar className="border">
            <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-4 w-full max-w-2xl">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2].map(i => (
                        <Card key={i}>
                            <Skeleton className="h-32 w-full rounded-t-lg" />
                            <CardHeader>
                                <Skeleton className="h-5 w-3/4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    </div>
);

const UserProfileDisplay = ({ profile }: { profile: UserProfile }) => (
    <Card className="bg-accent/20 border-accent">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><BrainCircuit className="text-primary" /> 用户画像分析</CardTitle>
            <CardDescription>AI 根据您的输入生成的分析结果。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            <div>
                <h3 className="font-semibold flex items-center gap-2"><Sparkles className="text-primary/80"/>画像总结</h3>
                <p className="text-muted-foreground mt-1 text-sm">{profile.summary}</p>
            </div>
            <div>
                <h3 className="font-semibold flex items-center gap-2"><Tags className="text-primary/80"/>关键词标签</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    {profile.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
            </div>
        </CardContent>
    </Card>
);

const RecommendationsDisplay = ({ recommendations, onPublish, showPublishButton }: { recommendations: ProductRecommendationsOutput['recommendations']; onPublish: () => void; showPublishButton: boolean; }) => (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><CheckCircle className="text-primary"/> 首要推荐</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((item, index) => (
                    <Card key={index} className="flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                        <div className="aspect-video bg-muted relative">
                            <Image
                                src={item.imageUrl || `https://placehold.co/600x400.png`}
                                alt={item.name}
                                layout="fill"
                                className="object-cover"
                                data-ai-hint="product photo"
                            />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-bold">{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow text-sm">
                            <p className="text-muted-foreground line-clamp-3">{item.description}</p>
                        </CardContent>
                        <CardFooter className="gap-2">
                            <Button size="sm" asChild variant="secondary">
                                <a href={item.link || '#'} target="_blank" rel="noopener noreferrer">查看详情</a>
                            </Button>
                            <Button size="sm" asChild>
                                <a href={item.link || '#'} target="_blank" rel="noopener noreferrer">立即购买</a>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
             <Card className="bg-background">
                <CardHeader>
                    <CardTitle className="text-md font-semibold">推荐理由</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">这些推荐是基于您对舒适和防水性的需求，结合了徒步场景的专业考量，为您精选了市场上评价最高且最符合条件的产品。</p>
                </CardContent>
            </Card>
            {showPublishButton && (
                <div className="text-center pt-2">
                    <Button variant="outline" onClick={onPublish}>不满意？发布到需求池</Button>
                </div>
            )}
        </CardContent>
    </Card>
);

type Message = {
    type: 'user' | 'ai' | 'loading';
    text?: string;
    imageUrl?: string | null;
    profile?: UserProfile | null;
    recommendations?: ProductRecommendationsOutput['recommendations'];
};

export function ShoppingAssistant() {
    const [messages, setMessages] = useState<Message[]>([
        { type: 'ai', profile: null, recommendations: [] }
    ]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { description: '' },
    });
    const {formState: { isSubmitting }} = form;

    const handlePublishToDemandPool = () => {
        toast({
            title: '功能正在开发中',
            description: '很快您就可以将需求一键发布到需求池了！',
        });
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const userMessageText = data.description;
        const userImageFile = data.image;

        let userMessageImageUrl: string | null = null;
        let imageDataUri: string | undefined = undefined;

        if (userImageFile) {
            userMessageImageUrl = URL.createObjectURL(userImageFile);
            imageDataUri = await fileToDataUri(userImageFile);
        }

        setMessages(prev => [...prev, { type: 'user', text: userMessageText, imageUrl: userMessageImageUrl }, { type: 'loading' }]);
        form.reset();
        setImagePreview(null);

        try {
            const profile = await generateUserProfile({
                description: userMessageText,
                photoDataUri: imageDataUri
            });

            const result = await getProductRecommendations({
                userProfile: profile,
                photoDataUri: imageDataUri
            });

            setMessages(prev => {
                const newMessages = [...prev];
                const loadingIndex = newMessages.findIndex(m => m.type === 'loading');
                if (loadingIndex !== -1) {
                    newMessages[loadingIndex] = { type: 'ai', profile, recommendations: result.recommendations };
                }
                return newMessages;
            });

        } catch (error) {
            toast({
                variant: 'destructive',
                title: '出错啦',
                description: '无法获取推荐，请稍后再试。',
            });
            setMessages(prev => prev.filter(m => m.type !== 'loading'));
            console.error(error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('image', file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            form.setValue('image', undefined);
            setImagePreview(null);
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start h-full">
            <div className="lg:col-span-2 h-full flex flex-col">
                <Card className="flex-1 flex flex-col shadow-lg">
                    <CardHeader className="border-b">
                        <CardTitle className="font-headline text-2xl">AI 购物助手</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 overflow-y-auto space-y-6">
                        {messages.map((msg, index) => {
                            if (msg.type === 'user' && msg.text) {
                                return <UserMessage key={index} text={msg.text} imageUrl={msg.imageUrl} />;
                            }
                            if (msg.type === 'ai') {
                                if (index === 0) { // Welcome message
                                    return (
                                        <div key={index} className="flex items-start gap-3">
                                            <Avatar className="border"><AvatarFallback>AI</AvatarFallback></Avatar>
                                            <div className="bg-card rounded-lg p-3 max-w-lg"><p>您好！我是您的专属AI购物助手，请告诉我您在寻找什么？可以描述一下，或者上传一张图片。😊</p></div>
                                        </div>
                                    );
                                }
                                return <AIMessage key={index} profile={msg.profile || null} recommendations={msg.recommendations || []} onPublish={handlePublishToDemandPool} />;
                            }
                            if (msg.type === 'loading') {
                                return <LoadingMessage key={index} />;
                            }
                            return null;
                        })}
                    </CardContent>
                    <CardFooter className="p-4 border-t">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
                                {imagePreview && (
                                    <div className="relative w-24 h-24">
                                        <Image src={imagePreview} alt="图片预览" layout="fill" className="rounded-md object-cover" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                            onClick={() => {
                                                form.setValue('image', undefined);
                                                setImagePreview(null);
                                            }}
                                        >
                                            &times;
                                        </Button>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Textarea placeholder="例如：我想要一双适合夏天徒步的舒适、防水的运动鞋..." {...field} rows={1} className="min-h-[40px]"/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" variant="outline" size="icon" asChild>
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <ImageIcon />
                                        <input id="image-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                                    </label>
                                </Button>
                                <Button type="submit" disabled={isSubmitting} size="icon">
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
                                </Button>
                                </div>
                            </form>
                        </Form>
                    </CardFooter>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline">高端定制服务</CardTitle>
                        <CardDescription>需要更个性化的服务吗？我们可以为您连接顶级设计师和供应商。</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video bg-muted rounded-lg mb-4 relative overflow-hidden">
                            <Image src="https://placehold.co/600x400.png" layout="fill" objectFit="cover" alt="定制服务" data-ai-hint="luxury customization" />
                        </div>
                        <Button className="w-full">了解更多</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
