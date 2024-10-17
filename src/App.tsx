import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Drafts from "@/components/Pages/Drafts";

export default function App() {
    return (
        <div className="container mx-auto max-w-5xl">
            <Tabs defaultValue="drafts">
                <TabsList>
                    <TabsTrigger value="mail">Mail</TabsTrigger>
                    <TabsTrigger value="drafts">Drafts</TabsTrigger>
                </TabsList>
                <TabsContent value="mail"></TabsContent>
                <TabsContent value="drafts">
                    <Drafts />
                </TabsContent>
            </Tabs>
        </div>
    );
}
