'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const newDemandSchema = z.object({
  title: z.string().min(5, '标题至少需要5个字符。'),
  description: z.string().min(20, '描述至少需要20个字符。'),
  category: z.string({ required_error: '请选择一个类别。' }),
});

export default function NewDemandPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof newDemandSchema>>({
    resolver: zodResolver(newDemandSchema),
    defaultValues: {
      title: "",
      description: "",
    }
  });

  function onSubmit(values: z.infer<typeof newDemandSchema>) {
    console.log(values);
    toast({
      title: '提交成功！',
      description: '您的新需求已提交，正在等待审核。',
    });
    router.push('/demands');
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">提交新需求</h1>
        <p className="text-muted-foreground">请填写您的需求信息，供应商将会看到。</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>需求详情</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>需求标题</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：寻找环保包装材料" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>类别</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择一个需求类别" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="electronics">电子产品</SelectItem>
                        <SelectItem value="home-goods">家居用品</SelectItem>
                        <SelectItem value="apparel">服装</SelectItem>
                        <SelectItem value="beauty">美容</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>详细描述</FormLabel>
                    <FormControl>
                      <Textarea placeholder="请详细描述您的需求，包括数量、质量要求等..." rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">提交需求</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
