"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export default function PanelPage() {
  const [activeTab, setActiveTab] = useState("bible");
  const [isLive, setIsLive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<null | { id: string; title: string; content?: string }>(null);
  const [showSettings, setShowSettings] = useState(false);

  const tabs = [
    { id: "bible", label: "Bible" },
    { id: "songs", label: "Songs" },
    { id: "schedule", label: "Schedule" },
  ];

  const bibleItems = [
    { id: "genesis-1", title: "Genesis 1", content: "In the beginning God created the heavens and the earth..." },
    { id: "psalms-23", title: "Psalms 23", content: "The Lord is my shepherd; I shall not want..." },
    { id: "john-3-16", title: "John 3:16", content: "For God so loved the world that he gave his only Son..." },
  ];

  const songItems = [
    { id: "1", title: "JoyFUL", content: "Joyful, joyful, we adore Thee..." },
    { id: "2", title: "Amazing Grace", content: "Amazing grace, how sweet the sound..." },
    { id: "3", title: "Holy, Holy, Holy", content: "Holy, Holy, Holy, Lord God Almighty..." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold tracking-tight">Panel</h1>
            <Badge variant={isLive ? "destructive" : "secondary"} className="text-xs">
              {isLive ? "LIVE" : "Preview"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={isLive ? "destructive" : "default"} 
              onClick={() => setIsLive(!isLive)}
              size="sm"
            >
              {isLive ? "Clear" : "Go Live"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSettings(!showSettings)}
            >
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 px-2 pt-2">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex-1">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Search */}
            <div className="p-3">
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Item List */}
            <ScrollArea className="flex-1 px-3">
              <div className="space-y-1 pb-3">
                {activeTab === "bible" && bibleItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start font-normal hover:bg-accent"
                    onClick={() => setSelectedItem(item)}
                  >
                    {item.title}
                  </Button>
                ))}
                {activeTab === "songs" && songItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start font-normal hover:bg-accent"
                    onClick={() => setSelectedItem(item)}
                  >
                    {item.title}
                  </Button>
                ))}
                {activeTab === "schedule" && (
                  <p className="p-4 text-center text-sm text-muted-foreground">
                    No schedule items
                  </p>
                )}
              </div>
            </ScrollArea>
          </Tabs>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>{selectedItem ? selectedItem.title : "Select an item"}</CardTitle>
              <CardDescription>
                {selectedItem ? "Press Go Live to show on display" : "Choose an item from the sidebar"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedItem && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-8 text-center">
                    <p className="text-2xl font-semibold">{selectedItem.title}</p>
                    {selectedItem.content && (
                      <p className="mt-2 text-sm text-muted-foreground">{selectedItem.content}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsLive(true)}>Go Live</Button>
                    <Button variant="outline" onClick={() => setSelectedItem(null)}>
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Live Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Lines per Page</label>
                <Slider defaultValue={[2]} max={4} min={1} step={1} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Advance</label>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Settings Sidebar */}
        {showSettings && (
          <aside className="w-72 border-l border-border bg-card p-4">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Settings</h2>
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Go Live</label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Show Lyrics</label>
                <Switch defaultChecked />
              </div>
              <Button variant="outline" className="w-full" onClick={() => setShowSettings(false)}>
                Close
              </Button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}