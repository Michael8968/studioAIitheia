
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { evaluateSellerData, type EvaluateSellerDataOutput } from '@/ai/flows/evaluate-seller-data';
import { Loader2, UploadCloud, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

const demandCategories = ["电子产品", "家居用品", "服装", "美容", "其他"];

export function DataProcessor() {
  const [file, setFile] = useState<File | null>(null);
  const [sellerData, setSellerData] = useState<string>('');
  const [results, setResults] = useState<EvaluateSellerDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (e) => {
          setSellerData(e.target?.result as string);
        };
        reader.readAsText(selectedFile);
        setResults(null);
      } else {
        toast({
          variant: 'destructive',
          title: '文件类型错误',
          description: '请上传一个 CSV 文件。',
        });
      }
    }
  };

  const processData = async () => {
    if (!sellerData) {
      toast({
        variant: 'destructive',
        title: '无数据',
        description: '请先上传一个文件。',
      });
      return;
    }
    setIsLoading(true);
    setResults(null);
    try {
      const evaluation = await evaluateSellerData({ sellerData, demandCategories });
      setResults(evaluation);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '处理失败',
        description: '评估卖家数据时出错。请检查您的 CSV 文件内容。',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>供应商数据处理</CardTitle>
          <CardDescription>上传供应商数据的 CSV 文件，AI 将自动评估其与需求类别的相关性。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center p-2 border rounded-md bg-secondary/50 w-full sm:flex-grow">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground"/>
                <span className="text-sm text-muted-foreground truncate">{file ? file.name : '未选择文件'}</span>
            </div>
            <div className="flex gap-4">
               <label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" asChild>
                   <div>
                    <UploadCloud className="mr-2 h-4 w-4" /> 上传 CSV
                   </div>
                </Button>
                <Input id="file-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
              </label>
              <Button onClick={processData} disabled={!file || isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                处理数据
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">AI 正在分析数据，请稍候...</p>
        </div>
      )}

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>评估结果</CardTitle>
            <CardDescription>AI 已根据您的需求类别对上传的数据进行了评分。</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">需求类别</TableHead>
                  <TableHead className="w-[200px]">相关性分数</TableHead>
                  <TableHead>AI 分析原因</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.category}>
                    <TableCell className="font-medium">{result.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                         <Progress value={result.relevanceScore * 100} className="w-28" />
                         <span className="font-mono text-sm text-foreground">{(result.relevanceScore * 100).toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{result.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
