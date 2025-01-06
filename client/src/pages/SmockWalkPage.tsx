import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SmockWalkPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Smock Walk</h1>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Home Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Overview content will go here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Log</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Maintenance records will go here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Request form and list will go here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
