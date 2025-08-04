
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getProductRecommendations, type ProductRecommendationsOutput } from '@/ai/flows/product-recommendations';
import { generateUserProfile, type UserProfile } from '@/ai/flows/generate-user-profile';
import { Loader2, Image as ImageIcon, Search, Sparkles, Tags, User } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '../ui/badge';

const formSchema = z.object({
  description: z.string().min(10, { message: '请至少输入10个字符。' }),
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

export function ShoppingAssistant() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<ProductRecommendationsOutput['recommendations']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: '' },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setIsLoadingProfile(true);
    setIsLoadingRecs(true);
    setUserProfile(null);
    setRecommendations([]);

    try {
      let imageDataUri: string | undefined = undefined;
      if (data.image) {
        imageDataUri = await fileToDataUri(data.image);
      }

      // 1. Generate User Profile
      const profile = await generateUserProfile({
        description: data.description,
        photoDataUri: imageDataUri
      });
      setUserProfile(profile);
      setIsLoadingProfile(false);

      // 2. Get Recommendations based on profile
      const result = await getProductRecommendations({ 
        userProfile: profile,
        photoDataUri: imageDataUri 
      });
      
      setRecommendations(result.recommendations);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: '出错啦',
        description: '无法获取推荐，请稍后再试。',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsLoadingProfile(false);
      setIsLoadingRecs(false);
    }
  };
  
  const showResults = isLoading || userProfile || recommendations.length > 0;


  return (
    <div className="space-y-8 max-w-5xl mx-auto">
       <div className="text-center">
        <h1 className="text-3xl font-bold md:text-4xl">AI 购物助手</h1>
        <p className="text-muted-foreground mt-2">告诉我们您在寻找什么，我们的人工智能将为您找到最佳匹配。</p>
      </div>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">描述</FormLabel>
                    <FormControl>
                      <Textarea placeholder="例如：我想要一双适合夏天徒步的舒适、防水的运动鞋..." {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-muted-foreground">上传图片 (可选)</FormLabel>
                           <div className="flex items-center gap-2 mt-2">
                             <FormControl>
                                <Input 
                                  type="file" 
                                  className="w-full max-w-sm" 
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      field.onChange(file);
                                      setImagePreview(URL.createObjectURL(file));
                                    } else {
                                      field.onChange(undefined);
                                      setImagePreview(null);
                                    }
                                  }}
                                />
                             </FormControl>
                           </div>
                        </FormItem>
                      )}
                    />
                     {imagePreview && (
                        <div className="mt-4">
                            <Image src={imagePreview} alt="Image preview" width={100} height={100} className="rounded-md object-cover" />
                        </div>
                    )}
                </div>
                 <div className="self-end">
                    <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                        寻找商品
                    </Button>
                 </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {showResults && (
        <div className='space-y-8'>
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <User className="h-5 w-5 text-primary" />
                <CardTitle>用户画像分析</CardTitle>
              </div>
              <CardDescription>AI 根据您的需求生成的初步画像。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingProfile ? (
                <>
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-28 rounded-full" />
                  </div>
                </>
              ) : userProfile ? (
                <>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent"/>画像总结</h3>
                    <p className="text-muted-foreground mt-1">{userProfile.summary}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2"><Tags className="h-4 w-4 text-accent"/>关键词标签</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {userProfile.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                    </div>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
          
          <div>
             <h2 className="text-2xl font-bold mb-4 text-center">为您推荐</h2>
             {isLoadingRecs ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[...Array(3)].map((_, i) => (
                   <Card key={i}>
                       <Skeleton className="w-full h-48 rounded-t-lg" />
                       <CardHeader>
                           <Skeleton className="h-6 w-3/4" />
                       </CardHeader>
                       <CardContent className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                       </CardContent>
                   </Card>
                 ))}
               </div>
             ) : (
                recommendations.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((item, index) => (
                      <Card key={index} className="flex flex-col hover:shadow-xl transition-shadow duration-300">
                        <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                            <Image
                                src={item.imageUrl || `https://placehold.co/600x400.png`}
                                alt={item.name}
                                width={600}
                                height={400}
                                className="w-full h-full object-cover"
                                data-ai-hint="product photo"
                            />
                          </div>
                        <CardHeader>
                          <CardTitle>{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-muted-foreground">{item.description}</p>
                        </CardContent>
                        {item.link && 
                          <CardFooter>
                            <Button asChild variant="link" className="p-0 h-auto">
                              <a href={item.link} target="_blank" rel="noopener noreferrer">查看详情</a>
                            </Button>
                          </CardFooter>
                        }
                      </Card>
                    ))}
                  </div>
                )
             )}
          </div>
        </div>
      )}

    </div>
  );
}
