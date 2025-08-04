import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModelGenerator } from '@/components/features/model-generator';

export default function CreatorWorkbenchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">创意者工作台</h1>
        <p className="text-muted-foreground">管理您的任务、需求和创作。</p>
      </div>
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="generator">AI 3D 生成</TabsTrigger>
          <TabsTrigger value="tasks">当前任务</TabsTrigger>
          <TabsTrigger value="demands">相关需求</TabsTrigger>
          <TabsTrigger value="submissions">我的提交</TabsTrigger>
        </TabsList>
        <TabsContent value="generator" className="mt-4">
          <ModelGenerator />
        </TabsContent>
        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>当前任务</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">这里将显示您当前的创作任务。 (功能待开发)</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="demands" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>相关需求</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">这里将显示与您技能相关的需求。 (功能待开发)</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="submissions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>我的提交</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">这里将显示您过去提交的作品。 (功能待开发)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
