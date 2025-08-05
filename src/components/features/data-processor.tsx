
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { evaluateSellerData, type EvaluateSellerDataOutput } from '@/ai/flows/evaluate-seller-data';
import { Loader2, UploadCloud, Download, FileOutput } from 'lucide-react';
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
    <div className="grid md:grid-cols-2 gap-6 items-start">
        <Card>
            <CardHeader>
                <CardTitle>批量导入</CardTitle>
                <CardDescription>上传CSV文件以批量添加或更新供应商信息。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <label htmlFor="file-upload" className="block cursor-pointer border-2 border-dashed border-muted-foreground/50 rounded-lg p-12 text-center hover:border-primary transition-colors">
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm font-semibold">将文件拖放到此处，或点击浏览</p>
                    <p className="mt-1 text-xs text-muted-foreground">支持的文件格式: CSV</p>
                    <Input id="file-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                </label>
                {file && (
                     <div className="text-sm text-muted-foreground">已选择文件: <span className="font-medium text-foreground">{file.name}</span></div>
                )}
                 <Button onClick={processData} disabled={!file || isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                    处理数据
                </Button>
                <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    下载模板
                </Button>
            </CardContent>
        </Card>
      
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>处理结果</CardTitle>
                <CardDescription>导入的数据将在此处显示。</CardDescription>
            </div>
            <Button variant="outline" disabled={!results}>
                <FileOutput className="mr-2 h-4 w-4" />
                导出数据
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>供应商名称</TableHead>
                  <TableHead>类别</TableHead>
                  <TableHead>匹配度</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">
                            <div className="flex justify-center items-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="ml-4 text-muted-foreground">AI 正在分析数据...</p>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : results && results.length > 0 ? (
                  results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{`供应商 ${index + 1}`}</TableCell>
                      <TableCell>{result.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <Progress value={result.relevanceScore * 100} className="w-20" />
                           <span>{(result.relevanceScore * 100).toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                          <Button variant="ghost" size="sm">查看</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                        暂无数据。请上传文件开始处理。
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
