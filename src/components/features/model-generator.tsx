
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { generate3DModel } from '@/ai/flows/generate-3d-model';
import { Loader2, Wand2 } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  description: z.string().min(10, { message: '请至少输入10个字符。' }),
});

export function ModelGenerator() {
  const [modelUri, setModelUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setModelUri(null);
    try {
      const result = await generate3DModel({ description: values.description });
      setModelUri(result.modelDataUri);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '生成失败',
        description: '无法生成3D模型，请稍后再试。',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>模型描述</FormLabel>
                  <FormControl>
                    <Textarea placeholder="例如：一个红色的复古跑车，带有镀铬装饰和白色轮胎" {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              生成模型
            </Button>
          </form>
        </Form>
      </div>
      <div className="flex items-center justify-center border-dashed border-2 rounded-lg p-4 aspect-square bg-muted/50 min-h-[300px] md:min-h-full">
        {isLoading && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
        {!isLoading && modelUri && (
          <Image src={modelUri} alt="生成的3D模型" width={512} height={512} className="object-contain max-h-full max-w-full rounded-lg" />
        )}
        {!isLoading && !modelUri && (
          <div className="text-center text-muted-foreground">
            <Wand2 className="mx-auto h-12 w-12 mb-4" />
            <p>您的模型将显示在这里</p>
          </div>
        )}
      </div>
    </div>
  );
}
