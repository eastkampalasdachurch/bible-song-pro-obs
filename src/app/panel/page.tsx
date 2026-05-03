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
  const [selectedItem, setSelectedItem] = useState<null | { id: string; title: string }>(null);
  const [showSettings, setShowSettings] = useState(false);

  const tabs = [
    { id: "bible", label: "Bible" },
    { id: "songs", label: "Songs" },
    { id: "schedule", label: "Schedule" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Panel</h1>
            <Badge variant={isLive ? "destructive" : "secondary"}>
              {isLive ? "LIVE" : "Preview"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={isLive ? "destructive" : "default"} onClick={() => setIsLive(!isLive)}>
              {isLive ? "Clear" : "Go Live"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-zinc-800 bg-transparent p-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex-1 rounded-none data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-50"
                >
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
                className="bg-zinc-800"
              />
            </div>

            {/* Item List */}
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {activeTab === "bible" && (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal hover:bg-zinc-800"
                      onClick={() => setSelectedItem({ id: "genesis", title: "Genesis 1" })}
                    >
                      Genesis 1
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal hover:bg-zinc-800"
                      onClick={() => setSelectedItem({ id: "psalms", title: "Psalms 23" })}
                    >
                      Psalms 23
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal hover:bg-zinc-800"
                      onClick={() => setSelectedItem({ id: "john", title: "John 3:16" })}
                    >
                      John 3:16
                    </Button>
                  </>
                )}
                {activeTab === "songs" && (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal hover:bg-zinc-800"
                      onClick={() => setSelectedItem({ id: "1", title: "JoyFUL" })}
                    >
                      1 — JoyFUL
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal hover:bg-zinc-800"
                      onClick={() => setSelectedItem({ id: "2", title: "Amazing Grace" })}
                    >
                      2 — Amazing Grace
                    </Button>
                  </>
                )}
                {activeTab === "schedule" && (
                  <div className="p-4 text-center text-sm text-zinc-500">
                    No schedule items
                  </div>
                )}
              </div>
            </ScrollArea>
          </Tabs>
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          <Card className="m-4 bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>{selectedItem ? selectedItem.title : "Select an item"}</CardTitle>
              <CardDescription>
                {selectedItem ? "Press Go Live to show on display" : "Choose an item from the sidebar"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedItem && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-zinc-800 p-8 text-center">
                    <p className="text-2xl font-semibold">{selectedItem.title}</p>
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
          <Card className="m-4 mt-0 bg-zinc-900 border-zinc-800">
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
          <aside className="w-72 border-l border-zinc-800 bg-zinc-900/50 p-4">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Settings</h2>
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme</label>
                <select className="w-full rounded-md bg-zinc-800 p-2 text-sm">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Go Live</label>
                <Switch />
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