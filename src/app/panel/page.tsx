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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Settings, Play, Square, ChevronLeft, ChevronRight,
  Plus, Search, Music, Book, Calendar, Monitor,
  Volume2, Type, Image, Layers, Video, Mic,
  AlignLeft, AlignCenter, AlignRight,
  Save, Trash2, Copy, Download, Upload,
  Menu, X, Keyboard, FolderOpen, FileText,
  List, ListMusic, Mic2, VolumeX,
  Layers as LayersIcon, Eye, Clock, FlipHorizontal,
  Palette
} from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  subtitle?: string;
  type: "song" | "bible";
}

interface BibleBook {
  id: string;
  name: string;
  chapters: number;
}

interface Song {
  id: string;
  title: string;
  number: number;
  verses?: number;
  lyrics?: string[];
}

interface Scene {
  id: string;
  name: string;
  type: "song" | "bible" | "image" | "blank";
}

const BIBLE_BOOKS: BibleBook[] = [
  { id: "genesis", name: "Genesis", chapters: 50 },
  { id: "exodus", name: "Exodus", chapters: 40 },
  { id: "leviticus", name: "Leviticus", chapters: 27 },
  { id: "numbers", name: "Numbers", chapters: 36 },
  { id: "deuteronomy", name: "Deuteronomy", chapters: 34 },
  { id: "joshua", name: "Joshua", chapters: 24 },
  { id: "judges", name: "Judges", chapters: 21 },
  { id: "ruth", name: "Ruth", chapters: 4 },
  { id: "1samuel", name: "1 Samuel", chapters: 31 },
  { id: "2samuel", name: "2 Samuel", chapters: 24 },
  { id: "1kings", name: "1 Kings", chapters: 22 },
  { id: "2kings", name: "2 Kings", chapters: 25 },
  { id: "1chronicles", name: "1 Chronicles", chapters: 29 },
  { id: "2chronicles", name: "2 Chronicles", chapters: 36 },
  { id: "ezra", name: "Ezra", chapters: 10 },
  { id: "nehemiah", name: "Nehemiah", chapters: 13 },
  { id: "esther", name: "Esther", chapters: 10 },
  { id: "job", name: "Job", chapters: 42 },
  { id: "psalms", name: "Psalms", chapters: 150 },
  { id: "proverbs", name: "Proverbs", chapters: 31 },
  { id: "ecclesiastes", name: "Ecclesiastes", chapters: 12 },
  { id: "songofsolomon", name: "Song of Solomon", chapters: 8 },
  { id: "isaiah", name: "Isaiah", chapters: 66 },
  { id: "jeremiah", name: "Jeremiah", chapters: 52 },
  { id: "lamentations", name: "Lamentations", chapters: 5 },
  { id: "ezekiel", name: "Ezekiel", chapters: 48 },
  { id: "daniel", name: "Daniel", chapters: 12 },
  { id: "hosea", name: "Hosea", chapters: 14 },
  { id: "joel", name: "Joel", chapters: 3 },
  { id: "amos", name: "Amos", chapters: 9 },
  { id: "obadiah", name: "Obadiah", chapters: 1 },
  { id: "jonah", name: "Jonah", chapters: 4 },
  { id: "micah", name: "Micah", chapters: 7 },
  { id: "nahum", name: "Nahum", chapters: 3 },
  { id: "habakkuk", name: "Habakkuk", chapters: 3 },
  { id: "zephaniah", name: "Zephaniah", chapters: 3 },
  { id: "haggai", name: "Haggai", chapters: 2 },
  { id: "zechariah", name: "Zechariah", chapters: 14 },
  { id: "malachi", name: "Malachi", chapters: 4 },
  { id: "matthew", name: "Matthew", chapters: 28 },
  { id: "mark", name: "Mark", chapters: 16 },
  { id: "luke", name: "Luke", chapters: 24 },
  { id: "john", name: "John", chapters: 21 },
  { id: "acts", name: "Acts", chapters: 28 },
  { id: "romans", name: "Romans", chapters: 16 },
  { id: "1corinthians", name: "1 Corinthians", chapters: 16 },
  { id: "2corinthians", name: "2 Corinthians", chapters: 13 },
  { id: "galatians", name: "Galatians", chapters: 6 },
  { id: "ephesians", name: "Ephesians", chapters: 6 },
  { id: "philippians", name: "Philippians", chapters: 4 },
  { id: "colossians", name: "Colossians", chapters: 4 },
  { id: "1thessalonians", name: "1 Thessalonians", chapters: 5 },
  { id: "2thessalonians", name: "2 Thessalonians", chapters: 3 },
  { id: "1timothy", name: "1 Timothy", chapters: 6 },
  { id: "2timothy", name: "2 Timothy", chapters: 4 },
  { id: "titus", name: "Titus", chapters: 3 },
  { id: "philemon", name: "Philemon", chapters: 1 },
  { id: "hebrews", name: "Hebrews", chapters: 13 },
  { id: "james", name: "James", chapters: 5 },
  { id: "1peter", name: "1 Peter", chapters: 5 },
  { id: "2peter", name: "2 Peter", chapters: 3 },
  { id: "1john", name: "1 John", chapters: 5 },
  { id: "2john", name: "2 John", chapters: 1 },
  { id: "3john", name: "3 John", chapters: 1 },
  { id: "jude", name: "Jude", chapters: 1 },
  { id: "revelation", name: "Revelation", chapters: 22 },
];

const DEFAULT_SONGS: Song[] = [
  { id: "1", title: "Joyful, Joyful", number: 1, verses: 2, lyrics: ["Joyful, joyful, we adore Thee", "God of glory, Lord of love"] },
  { id: "2", title: "Amazing Grace", number: 2, verses: 4, lyrics: ["Amazing grace, how sweet the sound", "That saved a wretch like me"] },
  { id: "3", title: "Holy, Holy, Holy", number: 3, verses: 3, lyrics: ["Holy, Holy, Holy, Lord God Almighty", "Early in the morning our song shall rise"] },
  { id: "4", title: "Great Is Thy Faithfulness", number: 4, verses: 3, lyrics: ["Great is Thy faithfulness, O God my Father", "There is no shadow of turning with Thee"] },
  { id: "5", title: "How Great Thou Art", number: 5, verses: 4, lyrics: ["O Lord my God, when I in awesome wonder", "Consider all the works Thy hands have made"] },
  { id: "6", title: "Blessed Assurance", number: 6, verses: 3, lyrics: ["Blessed assurance, Jesus is mine", "O what a foretaste of glory divine"] },
  { id: "7", title: "It Is Well with My Soul", number: 7, verses: 4, lyrics: ["When peace like a river attendeth my way", "When sorrows like sea billows roll"] },
  { id: "8", title: "Leaning on the Everlasting Arms", number: 8, verses: 3, lyrics: ["What have I to dread, leaning on the everlasting arms"] },
  { id: "9", title: "What a Friend We Have in Jesus", number: 9, verses: 3, lyrics: ["What a friend we have in Jesus", "All our sins and griefs to bear"] },
  { id: "10", title: "Standing on the Promises", number: 10, verses: 3, lyrics: ["Standing on the promises of Christ my King"] },
  { id: "11", title: "The Solid Rock", number: 11, verses: 3, lyrics: ["My hope is built on nothing less", "Than Jesus' blood and righteousness"] },
  { id: "12", title: "Pass Me Not", number: 12, verses: 2, lyrics: ["Pass me not, O gentle Savior", "Hear my humble cry"] },
  { id: "13", title: "Softly and Tenderly", number: 13, verses: 2, lyrics: ["Softly and tenderly Jesus is calling"] },
  { id: "14", title: "Just As I Am", number: 14, verses: 2, lyrics: ["Just as I am, without one plea"] },
  { id: "15", title: "Rock of Ages", number: 15, verses: 3, lyrics: ["Rock of Ages, cleft for me", "Let me hide myself in Thee"] },
  { id: "16", title: "Crown Him with Many Crowns", number: 16, verses: 3, lyrics: ["Crown Him with many crowns", "The Lamb upon His throne"] },
  { id: "17", title: "Fairest Lord Jesus", number: 17, verses: 3, lyrics: ["Fairest Lord Jesus", "Ruler of all nature"] },
  { id: "18", title: "Jesus Loves Me", number: 18, verses: 2, lyrics: ["Jesus loves me, this I know", "For the Bible tells me so"] },
  { id: "19", title: "Trust and Obey", number: 19, verses: 3, lyrics: ["Trust and obey, for there's no other way"] },
  { id: "20", title: "Leaves of the Tree", number: 20, verses: 1, lyrics: ["Are we not like leaves of the tree"] },
];

const SCENES: Scene[] = [
  { id: "scene-1", name: "Scene 1", type: "blank" },
  { id: "scene-2", name: "Scene 2", type: "blank" },
  { id: "scene-3", name: "Scene 3", type: "blank" },
  { id: "scene-4", name: "Scene 4", type: "blank" },
];

const BIBLE_VERSIONS = [
  { id: "kjv", name: "King James Version (KJV)" },
  { id: "niv", name: "New International Version (NIV)" },
  { id: "esv", name: "English Standard Version (ESV)" },
  { id: "nlt", name: "New Living Translation (NLT)" },
];

type ToolbarTab = "bible" | "songs" | "scenes" | "media" | "audio" | "schedule" | "settings";

export default function PanelPage() {
  const [activeTab, setActiveTab] = useState<ToolbarTab>("bible");
  const [settingsTab, setSettingsTab] = useState("typography");
  const [isLive, setIsLive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>(DEFAULT_SONGS);

  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verseStart, setVerseStart] = useState<number | null>(null);
  const [verseEnd, setVerseEnd] = useState<number | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [bibleVersion, setBibleVersion] = useState("kjv");

  const [lineCursor, setLineCursor] = useState(0);
  const [linesPerPage, setLinesPerPage] = useState(2);
  const [songLineCursor, setSongLineCursor] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [autoGoLive, setAutoGoLive] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const [fontSize, setFontSize] = useState(36);
  const [lineSpacing, setLineSpacing] = useState(1.1);
  const [textTransform, setTextTransform] = useState<"none" | "uppercase">("uppercase");
  const [hAlign, setHAlign] = useState<"left" | "center" | "right">("center");
  const [vAlign, setVAlign] = useState<"top" | "middle" | "bottom">("middle");
  const [autoResize, setAutoResize] = useState("shrink");

  const [bgType, setBgType] = useState<"solid" | "gradient" | "image">("solid");
  const [bgColor, setBgColor] = useState("#000000");
  const [bgGradientStart, setBgGradientStart] = useState("#AD0000");
  const [bgGradientEnd, setBgGradientEnd] = useState("#000000");
  const [bgGradientAngle, setBgGradientAngle] = useState(135);
  const [bgOpacity, setBgOpacity] = useState(100);
  const [bgBlur, setBgBlur] = useState(0);

  const [displayWidth, setDisplayWidth] = useState(100);
  const [displayScale, setDisplayScale] = useState(100);
  const [displayRadius, setDisplayRadius] = useState(0);
  const [displayAnchor, setDisplayAnchor] = useState<"top" | "bottom">("bottom");
  const [displayOffsetX, setDisplayOffsetX] = useState(0);
  const [displayOffsetY, setDisplayOffsetY] = useState(0);
  const [autoAdjustHeight, setAutoAdjustHeight] = useState(true);

  const [showRef, setShowRef] = useState(true);
  const [refFontSize, setRefFontSize] = useState(30);
  const [refTextTransform, setRefTextTransform] = useState<"none" | "uppercase">("uppercase");
  const [refHAlign, setRefHAlign] = useState<"left" | "center" | "right">("center");

  const [selectedPreset, setSelectedPreset] = useState("default");
  const [transitionDuration, setTransitionDuration] = useState(0.5);
  const [transitionType, setTransitionType] = useState<"none" | "fade" | "slide" | "dissolve">("fade");

  const [masterVolume, setMasterVolume] = useState(100);
  const [monitorVolume, setMonitorVolume] = useState(0);
  const [monitorMuted, setMonitorMuted] = useState(true);

  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");

  const [quickColors] = useState(["#111CB0", "#AD0000", "#000000", "#FFD500", "#008000", "#800080", "#FF6600", "#008080"]);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  const filteredBooks = BIBLE_BOOKS.filter(book =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(song.number).includes(searchQuery)
  );

  const getChapterOptions = () => {
    if (!selectedBook) return [];
    return Array.from({ length: selectedBook.chapters }, (_, i) => i + 1);
  };

  const getVerseOptions = () => {
    if (!selectedBook || !selectedChapter) return [];
    const baseVerses = selectedChapter === 1 ? 31 : selectedChapter === 2 ? 25 : 20;
    return Array.from({ length: Math.min(baseVerses, 50) }, (_, i) => i + 1);
  };

  const handleGoLive = () => {
    if (selectedSong || selectedBook) setIsLive(true);
  };

  const handleClear = () => {
    setIsLive(false);
    setSelectedItem(null);
    setSelectedSong(null);
    setSelectedBook(null);
    setSelectedChapter(null);
    setVerseStart(null);
    setVerseEnd(null);
    setLineCursor(0);
    setSongLineCursor(0);
  };

  const handlePrevPage = () => {
    if (activeTab === "songs" && selectedSong?.lyrics) {
      setSongLineCursor(Math.max(0, songLineCursor - 1));
    } else {
      setCurrentPage(Math.max(0, currentPage - 1));
    }
  };

  const handleNextPage = () => {
    if (activeTab === "songs" && selectedSong?.lyrics) {
      setSongLineCursor(songLineCursor + 1);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleImportSongs = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.song";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const lines = text.split("\n").filter(Boolean);
      const newSongs: Song[] = [];
      let currentSongId = "";
      let currentSongNum = 0;
      let currentSongTitle = "";
      let currentLyrics: string[] = [];

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const numMatch = trimmed.match(/^(\d{1,3})[.:]\s*(.*)$/);
        if (numMatch) {
          if (currentSongId && currentLyrics.length > 0) {
            newSongs.push({ id: currentSongId, number: currentSongNum, title: currentSongTitle, lyrics: currentLyrics });
          }
          currentSongId = `import-${numMatch[1]}`;
          currentSongNum = parseInt(numMatch[1]);
          currentSongTitle = numMatch[2] || `Song ${numMatch[1]}`;
          currentLyrics = [];
        } else if (currentSongId) {
          currentLyrics.push(trimmed);
        }
      });

      if (currentSongId && currentLyrics.length > 0) {
        newSongs.push({ id: currentSongId, number: currentSongNum, title: currentSongTitle, lyrics: currentLyrics });
      }
      setSongs([...songs, ...newSongs]);
    };
    input.click();
  };

  const [bibleQuickSearch, setBibleQuickSearch] = useState("");
  const handleBibleQuickSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && bibleQuickSearch.trim()) {
      const query = bibleQuickSearch.trim().toLowerCase();
      const match = query.match(/^(\w+)\s*(\d+)?(?::(\d+)(?:-(\d+))?)?$/);
      if (match) {
        const [, bookName, chapter, verseStartStr, verseEndStr] = match;
        const book = BIBLE_BOOKS.find(b => b.name.toLowerCase() === bookName || b.name.toLowerCase().startsWith(bookName));
        if (book) {
          setSelectedBook(book);
          setSelectedChapter(chapter ? parseInt(chapter) : 1);
          setVerseStart(verseStartStr ? parseInt(verseStartStr) : null);
          setVerseEnd(verseEndStr ? parseInt(verseEndStr) : null);
          setSelectedItem({ id: book.id, title: book.name, type: "bible" });
        }
      }
      setBibleQuickSearch("");
    }
  };

  const getContentTitle = () => {
    if (selectedSong) return `Song #${selectedSong.number}: ${selectedSong.title}`;
    if (selectedBook && selectedChapter) {
      const verses = verseStart ? `${verseStart}${verseEnd && verseEnd !== verseStart ? `-${verseEnd}` : ''}` : '';
      return `${selectedBook.name} ${selectedChapter}${verses ? `:${verses}` : ''}`;
    }
    if (selectedBook) return selectedBook.name;
    return null;
  };

  const getPreviewContent = () => {
    if (selectedSong?.lyrics) {
      return selectedSong.lyrics.slice(songLineCursor * linesPerPage, (songLineCursor + 1) * linesPerPage).join("\n");
    }
    if (selectedBook && selectedChapter) return `${selectedBook.name} ${selectedChapter}`;
    return selectedItem?.title || "";
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <Monitor className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold tracking-tight">Bible Song Pro</h1>
            <Badge variant={isLive ? "destructive" : "secondary"} className="text-xs">
              {isLive ? "LIVE" : "Preview"}
            </Badge>
          </div>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ToolbarTab)}>
            <TabsList className="h-9">
              <TabsTrigger value="bible" className="text-xs gap-1"><Book className="h-3 w-3" /> Bible</TabsTrigger>
              <TabsTrigger value="songs" className="text-xs gap-1"><Music className="h-3 w-3" /> Songs</TabsTrigger>
              <TabsTrigger value="scenes" className="text-xs gap-1"><LayersIcon className="h-3 w-3" /> Scenes</TabsTrigger>
              <TabsTrigger value="media" className="text-xs gap-1"><Image className="h-3 w-3" /> Media</TabsTrigger>
              <TabsTrigger value="audio" className="text-xs gap-1"><Volume2 className="h-3 w-3" /> Audio</TabsTrigger>
              <TabsTrigger value="schedule" className="text-xs gap-1"><ListMusic className="h-3 w-3" /> Schedule</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs gap-1"><Settings className="h-3 w-3" /> Settings</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleClear}><X className="h-4 w-4 mr-1" /> Clear</Button>
            <Button variant={isLive ? "destructive" : "default"} size="sm" onClick={handleGoLive} disabled={!selectedItem && !selectedSong && !selectedBook && !isLive}>
              {isLive ? <Square className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isLive ? "Live" : "Go Live"}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 pb-2 text-xs border-t border-border/50">
          <div className="flex items-center gap-1">
            <Checkbox id="auto-go-live" checked={autoGoLive} onCheckedChange={(c) => setAutoGoLive(!!c)} />
            <label htmlFor="auto-go-live" className="cursor-pointer">Auto Go Live</label>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1">
            <Checkbox id="auto-advance" checked={autoAdvance} onCheckedChange={(c) => setAutoAdvance(!!c)} />
            <label htmlFor="auto-advance" className="cursor-pointer">Auto Advance</label>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <Select value={bibleVersion} onValueChange={(v) => setBibleVersion(v || "kjv")}>
            <SelectTrigger className="h-6 text-xs w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              {BIBLE_VERSIONS.map((v) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {activeTab === "bible" && (
          <aside className="w-80 border-r border-border bg-card flex flex-col">
            <div className="p-3 border-b space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Genesis 1 or Psalms 23:1-5 (Enter)" value={bibleQuickSearch} onChange={(e) => setBibleQuickSearch(e.target.value)} onKeyDown={handleBibleQuickSearch} className="pl-9" />
              </div>
              <Input placeholder="Filter list..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {filteredBooks.map((book) => (
                  <Button key={book.id} variant={selectedBook?.id === book.id ? "secondary" : "ghost"} className="w-full justify-start text-left h-auto py-2" onClick={() => { setSelectedBook(book); setSelectedChapter(null); setSelectedItem({ id: book.id, title: book.name, type: "bible" }); }}>
                    <div><div className="font-medium">{book.name}</div><div className="text-xs text-muted-foreground">{book.chapters} chapters</div></div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </aside>
        )}

        {activeTab === "songs" && (
          <aside className="w-80 border-r border-border bg-card flex flex-col">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search songs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Button variant="outline" size="icon" className="ml-2" onClick={handleImportSongs} title="Import songs"><Upload className="h-4 w-4" /></Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {filteredSongs.map((song) => (
                  <Button key={song.id} variant={selectedSong?.id === song.id ? "secondary" : "ghost"} className="w-full justify-start text-left h-auto py-2" onClick={() => { setSelectedSong(song); setSelectedItem({ id: song.id, title: song.title, type: "song" }); }}>
                    <div className="flex items-center gap-2"><span className="text-muted-foreground text-xs w-6">{song.number}.</span><div><div className="font-medium">{song.title}</div>{song.verses && <div className="text-xs text-muted-foreground">{song.verses} verses</div>}</div></div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </aside>
        )}

        {activeTab === "scenes" && (
          <aside className="w-80 border-r border-border bg-card flex flex-col">
            <div className="p-3 border-b flex items-center justify-between"><span className="font-medium">Scenes</span><Button variant="outline" size="sm"><Plus className="h-3 w-3" /></Button></div>
            <ScrollArea className="flex-1"><div className="p-2 space-y-1">{SCENES.map((scene) => (<Button key={scene.id} variant={selectedScene?.id === scene.id ? "secondary" : "ghost"} className="w-full justify-start text-left" onClick={() => setSelectedScene(scene)}><LayersIcon className="h-4 w-4 mr-2" />{scene.name}</Button>))}</div></ScrollArea>
          </aside>
        )}

        {activeTab === "media" && (
          <aside className="w-80 border-r border-border bg-card flex flex-col">
            <div className="p-3 border-b flex items-center justify-between"><span className="font-medium">Media</span><Button variant="outline" size="sm"><Upload className="h-3 w-3" /></Button></div>
            <ScrollArea className="flex-1"><div className="p-2 text-center text-muted-foreground text-sm py-8"><Image className="h-8 w-8 mx-auto mb-2 opacity-50" /><p>No media files</p><Button variant="outline" size="sm" className="mt-2"><Upload className="h-3 w-3 mr-1" /> Add Media</Button></div></ScrollArea>
          </aside>
        )}

        {activeTab === "audio" && (
          <aside className="w-80 border-r border-border bg-card flex flex-col">
            <div className="p-3 border-b"><span className="font-medium">Audio</span></div>
            <Card className="m-2"><CardHeader className="pb-2"><CardTitle className="text-sm">Master Volume</CardTitle></CardHeader><CardContent><div className="space-y-2"><Slider value={masterVolume} onValueChange={(v) => setMasterVolume(Array.isArray(v) ? v[0] : v)} min={0} max={100} step={1} /><div className="flex justify-between text-xs text-muted-foreground"><span>0</span><span>{masterVolume}%</span><span>100</span></div></div></CardContent></Card>
            <Card className="m-2"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Mic className="h-3 w-3" /> Monitor</CardTitle></CardHeader><CardContent><div className="space-y-2"><div className="flex items-center justify-between"><Label>Muted</Label><Switch checked={monitorMuted} onCheckedChange={setMonitorMuted} /></div>{!monitorMuted && <Slider value={monitorVolume} onValueChange={(v) => setMonitorVolume(Array.isArray(v) ? v[0] : v)} min={0} max={100} step={1} />}</div></CardContent></Card>
          </aside>
        )}

        {activeTab === "schedule" && (
          <aside className="w-80 border-r border-border bg-card flex flex-col">
            <div className="p-3 border-b flex items-center justify-between"><span className="font-medium">Schedule / Setlist</span><Button variant="outline" size="sm"><Plus className="h-3 w-3" /></Button></div>
            <ScrollArea className="flex-1"><div className="p-2 text-center text-muted-foreground text-sm py-8"><ListMusic className="h-8 w-8 mx-auto mb-2 opacity-50" /><p>No items in schedule</p><p className="text-xs mt-1">Add songs or Bible passages</p></div></ScrollArea>
          </aside>
        )}

        <main className="flex-1 overflow-auto">
          {activeTab === "settings" ? (
            <div className="p-4">
              <Tabs value={settingsTab} onValueChange={setSettingsTab}>
                <TabsList className="grid grid-cols-6 w-full">
                  <TabsTrigger value="typography" className="gap-1"><Type className="h-3 w-3" /> Typography</TabsTrigger>
                  <TabsTrigger value="background" className="gap-1"><Image className="h-3 w-3" /> Background</TabsTrigger>
                  <TabsTrigger value="display" className="gap-1"><Monitor className="h-3 w-3" /> Display</TabsTrigger>
                  <TabsTrigger value="reference" className="gap-1"><Book className="h-3 w-3" /> Reference</TabsTrigger>
                  <TabsTrigger value="animation" className="gap-1"><FlipHorizontal className="h-3 w-3" /> Animation</TabsTrigger>
                  <TabsTrigger value="theme" className="gap-1"><Palette className="h-3 w-3" /> Theme</TabsTrigger>
                </TabsList>

                <TabsContent value="typography" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card><CardHeader><CardTitle className="text-sm">Font Settings</CardTitle></CardHeader><CardContent className="space-y-4">
                      <div className="space-y-2"><Label>Font Size: {fontSize}px</Label><Slider value={fontSize} onValueChange={(v) => setFontSize(Array.isArray(v) ? v[0] : v)} min={12} max={72} step={1} /></div>
                      <div className="space-y-2"><Label>Line Spacing: {lineSpacing}</Label><Slider value={lineSpacing * 50} onValueChange={(v) => setLineSpacing((Array.isArray(v) ? v[0] : v) / 50)} min={50} max={200} step={5} /></div>
                      <div className="space-y-2"><Label>Text Transform</Label><Select value={textTransform} onValueChange={(v) => setTextTransform(v as "none" | "uppercase")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="uppercase">Uppercase</SelectItem></SelectContent></Select></div>
                      <div className="space-y-2"><Label>Align</Label><div className="flex gap-1"><Button variant={hAlign === "left" ? "secondary" : "outline"} size="icon" onClick={() => setHAlign("left")}><AlignLeft className="h-4 w-4" /></Button><Button variant={hAlign === "center" ? "secondary" : "outline"} size="icon" onClick={() => setHAlign("center")}><AlignCenter className="h-4 w-4" /></Button><Button variant={hAlign === "right" ? "secondary" : "outline"} size="icon" onClick={() => setHAlign("right")}><AlignRight className="h-4 w-4" /></Button></div></div>
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle className="text-sm">Presets</CardTitle></CardHeader><CardContent>
                      <Select value={selectedPreset} onValueChange={(v) => setSelectedPreset(v || "default")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="default">Default</SelectItem><SelectItem value="rounded-card">Rounded Card</SelectItem><SelectItem value="square-card">Square Card</SelectItem><SelectItem value="top-anchor">Top Anchor</SelectItem></SelectContent></Select>
                      <div className="flex gap-2 mt-2"><Button variant="outline" size="sm"><Save className="h-3 w-3 mr-1" /> Save</Button><Button variant="outline" size="sm"><Upload className="h-3 w-3 mr-1" /> Load</Button></div>
                    </CardContent></Card>
                  </div>
                </TabsContent>

                <TabsContent value="background" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card><CardHeader><CardTitle className="text-sm">Background Type</CardTitle></CardHeader><CardContent className="space-y-4">
                      <Select value={bgType} onValueChange={(v) => setBgType(v as "solid" | "gradient" | "image")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="solid">Solid Color</SelectItem><SelectItem value="gradient">Gradient</SelectItem><SelectItem value="image">Image</SelectItem></SelectContent></Select>
                      {bgType === "solid" && <div className="space-y-2"><Label>Color</Label><div className="flex gap-2"><Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 p-1" /><Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} /></div></div>}
                      {bgType === "gradient" && <>
                        <div className="space-y-2"><Label>Angle: {bgGradientAngle}</Label><Slider value={bgGradientAngle} onValueChange={(v) => setBgGradientAngle(Array.isArray(v) ? v[0] : v)} min={0} max={360} step={5} /></div>
                        <div className="space-y-2"><Label>Start Color</Label><div className="flex gap-2"><Input type="color" value={bgGradientStart} onChange={(e) => setBgGradientStart(e.target.value)} className="w-12 h-10 p-1" /><Input value={bgGradientStart} onChange={(e) => setBgGradientStart(e.target.value)} /></div></div>
                        <div className="space-y-2"><Label>End Color</Label><div className="flex gap-2"><Input type="color" value={bgGradientEnd} onChange={(e) => setBgGradientEnd(e.target.value)} className="w-12 h-10 p-1" /><Input value={bgGradientEnd} onChange={(e) => setBgGradientEnd(e.target.value)} /></div></div>
                      </>}
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle className="text-sm">Quick Colors</CardTitle></CardHeader><CardContent className="space-y-4">
                      <Label>Preset Colors</Label>
                      <div className="flex flex-wrap gap-2">
                        {quickColors.map((color, idx) => (
                          <button key={idx} className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform" style={{ backgroundColor: color }} onClick={() => { setBgColor(color); setRecentColors([color, ...recentColors.filter(c => c !== color)].slice(0, 8)); }} title={color} />
                        ))}
                      </div>
                      <Label>Recent Colors</Label>
                      <div className="flex flex-wrap gap-2">
                        {recentColors.length > 0 ? recentColors.map((color, idx) => (
                          <button key={idx} className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform" style={{ backgroundColor: color }} onClick={() => setBgColor(color)} title={color} />
                        )) : <span className="text-xs text-muted-foreground">No recent colors</span>}
                      </div>
                    </CardContent></Card>
                  </div>
                </TabsContent>

                <TabsContent value="display" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card><CardHeader><CardTitle className="text-sm">Size</CardTitle></CardHeader><CardContent className="space-y-4">
                      <div className="space-y-2"><Label>Width: {displayWidth}%</Label><Slider value={displayWidth} onValueChange={(v) => setDisplayWidth(Array.isArray(v) ? v[0] : v)} min={20} max={100} step={1} /></div>
                      <div className="space-y-2"><Label>Scale: {displayScale}%</Label><Slider value={displayScale} onValueChange={(v) => setDisplayScale(Array.isArray(v) ? v[0] : v)} min={20} max={150} step={5} /></div>
                      <div className="space-y-2"><Label>Border Radius: {displayRadius}px</Label><Slider value={displayRadius} onValueChange={(v) => setDisplayRadius(Array.isArray(v) ? v[0] : v)} min={0} max={50} step={1} /></div>
                      <div className="flex items-center justify-between"><Label>Auto Adjust Height</Label><Switch checked={autoAdjustHeight} onCheckedChange={setAutoAdjustHeight} /></div>
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle className="text-sm">Position</CardTitle></CardHeader><CardContent className="space-y-4">
                      <Select value={displayAnchor} onValueChange={(v) => setDisplayAnchor(v as "top" | "bottom")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="top">Top</SelectItem><SelectItem value="bottom">Bottom</SelectItem></SelectContent></Select>
                      <div className="space-y-2"><Label>Offset X: {displayOffsetX}</Label><Slider value={[displayOffsetX + 50]} onValueChange={(v) => setDisplayOffsetX((Array.isArray(v) ? v[0] : v) - 50)} min={0} max={100} step={1} /></div>
                      <div className="space-y-2"><Label>Offset Y: {displayOffsetY}</Label><Slider value={[displayOffsetY + 50]} onValueChange={(v) => setDisplayOffsetY((Array.isArray(v) ? v[0] : v) - 50)} min={0} max={100} step={1} /></div>
                    </CardContent></Card>
                  </div>
                </TabsContent>

                <TabsContent value="reference" className="space-y-4 mt-4">
                  <Card><CardHeader><CardTitle className="text-sm">Reference Display</CardTitle></CardHeader><CardContent className="space-y-4">
                    <div className="flex items-center justify-between"><Label>Show Reference</Label><Switch checked={showRef} onCheckedChange={setShowRef} /></div>
                    {showRef && <>
                      <div className="space-y-2"><Label>Font Size: {refFontSize}px</Label><Slider value={refFontSize} onValueChange={(v) => setRefFontSize(Array.isArray(v) ? v[0] : v)} min={12} max={48} step={1} /></div>
                      <div className="space-y-2"><Label>Text Transform</Label><Select value={refTextTransform} onValueChange={(v) => setRefTextTransform(v as "none" | "uppercase")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="uppercase">Uppercase</SelectItem></SelectContent></Select></div>
                      <div className="space-y-2"><Label>Align</Label><div className="flex gap-1"><Button variant={refHAlign === "left" ? "secondary" : "outline"} size="icon" onClick={() => setRefHAlign("left")}><AlignLeft className="h-4 w-4" /></Button><Button variant={refHAlign === "center" ? "secondary" : "outline"} size="icon" onClick={() => setRefHAlign("center")}><AlignCenter className="h-4 w-4" /></Button><Button variant={refHAlign === "right" ? "secondary" : "outline"} size="icon" onClick={() => setRefHAlign("right")}><AlignRight className="h-4 w-4" /></Button></div></div>
                    </>}
                  </CardContent></Card>
                </TabsContent>

                <TabsContent value="animation" className="space-y-4 mt-4">
                  <Card><CardHeader><CardTitle className="text-sm">Transition</CardTitle></CardHeader><CardContent className="space-y-4">
                    <Select value={transitionType} onValueChange={(v) => setTransitionType(v as "none" | "fade" | "slide" | "dissolve")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="fade">Fade</SelectItem><SelectItem value="slide">Slide</SelectItem><SelectItem value="dissolve">Dissolve</SelectItem></SelectContent></Select>
                    <div className="space-y-2"><Label>Duration: {transitionDuration}s</Label><Slider value={transitionDuration * 100} onValueChange={(v) => setTransitionDuration((Array.isArray(v) ? v[0] : v) / 100)} min={25} max={200} step={5} /></div>
                  </CardContent></Card>
                </TabsContent>

                <TabsContent value="theme" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card><CardHeader><CardTitle className="text-sm">Appearance</CardTitle></CardHeader><CardContent className="space-y-4">
                      <Select value={theme} onValueChange={(v) => setTheme(v || "dark")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="dark">Dark</SelectItem><SelectItem value="light">Light</SelectItem><SelectItem value="system">System</SelectItem></SelectContent></Select>
                      <Select value={language} onValueChange={(v) => setLanguage(v || "en")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="es">Spanish</SelectItem><SelectItem value="fr">French</SelectItem><SelectItem value="de">German</SelectItem></SelectContent></Select>
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle className="text-sm">Keyboard Shortcuts</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><div className="flex justify-between"><span>Go Live</span><Badge variant="outline">Space</Badge></div><div className="flex justify-between"><span>Clear</span><Badge variant="outline">Esc</Badge></div><div className="flex justify-between"><span>Next Page</span><Badge variant="outline">PageDown</Badge></div><div className="flex justify-between"><span>Prev Page</span><Badge variant="outline">PageUp</Badge></div></CardContent></Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {activeTab === "bible" && selectedBook && (
                <Card>
                  <CardHeader><CardTitle className="text-sm">Select Passage</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Book</Label>
                        <Input value={selectedBook.name} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Chapter</Label>
                        <Select value={selectedChapter?.toString() || ""} onValueChange={(v) => setSelectedChapter(v ? parseInt(v) : null)}>
                          <SelectTrigger><SelectValue placeholder="Select chapter" /></SelectTrigger>
                          <SelectContent>
                            {getChapterOptions().map((ch) => <SelectItem key={ch} value={ch.toString()}>{ch}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Verses (optional)</Label>
                        <div className="flex gap-2">
                          <Select value={verseStart?.toString() || ""} onValueChange={(v) => setVerseStart(v ? parseInt(v) : null)}>
                            <SelectTrigger><SelectValue placeholder="From" /></SelectTrigger>
                            <SelectContent>
                              {getVerseOptions().map((v) => <SelectItem key={v} value={v.toString()}>{v}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <span className="self-center">-</span>
                          <Select value={verseEnd?.toString() || ""} onValueChange={(v) => setVerseEnd(v ? parseInt(v) : null)}>
                            <SelectTrigger><SelectValue placeholder="To" /></SelectTrigger>
                            <SelectContent>
                              {getVerseOptions().map((v) => <SelectItem key={v} value={v.toString()}>{v}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader><CardTitle>{getContentTitle() || "Select content"}</CardTitle><CardDescription>{getContentTitle() ? `${selectedItem?.type === 'song' ? 'Song' : 'Bible'} • ${isLive ? 'Live on display' : 'Ready'}` : "Choose content from the sidebar"}</CardDescription></CardHeader>
                <CardContent>
                  {getContentTitle() ? (
                    <div className="space-y-4">
                      <div className="rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center" style={{ background: bgType === "gradient" ? `linear-gradient(${bgGradientAngle}deg, ${bgGradientStart}, ${bgGradientEnd})` : bgColor, opacity: bgOpacity / 100, width: `${displayWidth}%`, borderRadius: `${displayRadius}px`, margin: '0 auto', transform: `scale(${displayScale / 100})`, transformOrigin: displayAnchor === 'top' ? 'top center' : 'bottom center' }}>
                        <div className="text-white" style={{ fontSize: `${fontSize}px`, lineHeight: lineSpacing, textTransform: textTransform, textAlign: hAlign }}>{getPreviewContent().split('\n').map((line, i) => <p key={i}>{line}</p>)}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={handlePrevPage}><ChevronLeft className="h-4 w-4" /></Button>
                          <span className="text-sm text-muted-foreground">{activeTab === "songs" && selectedSong?.lyrics ? `${songLineCursor + 1} / ${Math.ceil((selectedSong.lyrics?.length || 1) / linesPerPage)}` : `Page ${currentPage + 1}`}</span>
                          <Button variant="outline" size="icon" onClick={handleNextPage}><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleGoLive}><Play className="h-4 w-4 mr-1" /> Go Live</Button>
                          <Button variant="outline" onClick={handleClear}>Clear</Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                      {activeTab === "bible" ? <><Book className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Select a book and chapter</p></> : activeTab === "songs" ? <><Music className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Select a song</p></> : <><Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Select content</p></>}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-4 w-4" /> Live Controls</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label>Lines per Page</Label><Slider value={linesPerPage} onValueChange={(v) => setLinesPerPage(Array.isArray(v) ? v[0] : v)} min={1} max={6} step={1} /><div className="flex justify-between text-xs text-muted-foreground"><span>1</span><span>Current: {linesPerPage}</span><span>6</span></div></div>
                  <div className="grid grid-cols-2 gap-4"><div className="flex items-center justify-between p-3 rounded-lg bg-muted"><Label className="text-sm">Auto Advance</Label><Switch checked={autoAdvance} onCheckedChange={setAutoAdvance} /></div><div className="flex items-center justify-between p-3 rounded-lg bg-muted"><Label className="text-sm">Show Lyrics</Label><Switch defaultChecked /></div></div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}