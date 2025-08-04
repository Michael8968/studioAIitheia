import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockDemands = [
  { id: 1, title: '环保咖啡杯', description: '寻找可重复使用、可生物降解的咖啡杯供应商。', status: '开放', category: '家居用品' },
  { id: 2, title: '智能家居照明系统', description: '需要与主流语音助手兼容的智能照明解决方案。', status: '开放', category: '电子产品' },
  { id: 3, title: '有机棉T恤', description: '为新的服装系列寻找经过认证的有机棉T恤。', status: '评估中', category: '服装' },
  { id: 4, title: '本地手工皂', description: '寻找使用天然成分的小批量手工皂制作者。', status: '已关闭', category: '美容' },
  { id: 5, title: '定制化宠物项圈', description: '需要能够进行个性化刻字的耐用宠物项圈。', status: '开放', category: '其他' },
  { id: 6, title: '可持续包装解决方案', description: '为电商业务寻找环保的包装材料。', status: '评估中', category: '其他' },
];

export default function DemandsPage() {
    const statusVariantMap: { [key: string]: "secondary" | "default" | "outline" } = {
        '开放': 'secondary',
        '评估中': 'default',
        '已关闭': 'outline',
    };
    
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">需求池</h1>
          <p className="text-muted-foreground">浏览公开的需求，为客户提供您的产品。</p>
        </div>
        <Link href="/demands/new">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            提交新需求
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockDemands.map(demand => (
          <Card key={demand.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{demand.title}</CardTitle>
                <Badge variant={statusVariantMap[demand.status] || 'secondary'}>{demand.status}</Badge>
              </div>
              <CardDescription>{demand.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              
            </CardContent>
            <CardFooter>
              <Badge variant="outline">{demand.category}</Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
