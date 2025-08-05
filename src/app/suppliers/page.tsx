
'use client';

import { useAuthStore } from "@/store/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataProcessor } from "@/components/features/data-processor";
import { User, List, UploadCloud } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SuppliersPage() {
    const { role } = useAuthStore();

    if (role !== 'supplier' && role !== 'admin') {
         return (
            <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>You do not have permission to view this page.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => window.location.href = '/login'} className="w-full">
                            Return to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Supplier Center</h1>
                <p className="text-muted-foreground">Manage your company information, products, and services.</p>
            </div>
            <Tabs defaultValue="info" className="w-full">
                <TabsList className={`grid w-full ${role === 'admin' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    <TabsTrigger value="info"><User className="mr-2"/> Basic Information</TabsTrigger>
                    <TabsTrigger value="products"><List className="mr-2"/> Products/Services</TabsTrigger>
                    {role === 'admin' && (
                         <TabsTrigger value="batch"><UploadCloud className="mr-2"/> Batch Processing</TabsTrigger>
                    )}
                </TabsList>
                <TabsContent value="info" className="mt-4">
                    <Card>
                         <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Keep your company profile up-to-date.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName">Company Name</Label>
                                    <Input id="companyName" defaultValue="Innovative Tech Inc."/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactPerson">Contact Person</Label>
                                    <Input id="contactPerson" defaultValue="John Doe"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="industry">Industry</Label>
                                    <Input id="industry" defaultValue="Electronics Manufacturing"/>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="foundedDate">Founded Date</Label>
                                    <Input id="foundedDate" type="date" defaultValue="2010-01-15"/>
                                </div>
                               <div className="space-y-2 col-span-1 md:col-span-2">
                                    <Label htmlFor="companyBio">Company Bio</Label>
                                    <Textarea id="companyBio" defaultValue="A leading manufacturer of innovative electronic components for over a decade."/>
                                </div>
                           </div>
                           <div className="flex justify-end">
                                <Button>Save Basic Information</Button>
                           </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="products" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Products / Services</CardTitle>
                            <CardDescription>Manage your product and service offerings.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground py-12">
                            <p>Product and service management is coming soon.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                {role === 'admin' && (
                    <TabsContent value="batch" className="mt-4">
                       <DataProcessor />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}
