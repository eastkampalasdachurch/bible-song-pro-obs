"use client";

import { useState, useEffect } from "react";
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
  Settings, Play, Square as SquareIcon, ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  Plus, Search, Music, Book, Calendar, Monitor,
  Volume2, Type, Image, Layers, Video, Mic,
  AlignLeft, AlignCenter, AlignRight,
  Save, Trash2, Copy, Download, Upload, Undo, Redo,
  Menu, X, Keyboard, FolderOpen, FileText, Home,
  List, ListMusic, Mic2, VolumeX, Volume1,
  Layers as LayersIcon, Eye, EyeOff, Clock, FlipHorizontal, FlipVertical,
  Maximize2, Minimize2, RotateCw, Move, ZoomIn, ZoomOut,
  Settings2, Palette, Pen, Eraser, Highlighter, Undo2, Redo2,
  Wifi, WifiOff, Circle, ArrowUp, VideoIcon, Radio, CircleDot,
  Pencil, Type as TypeIcon, Minus, Trash, RefreshCw, Lock, Unlock
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
  sources: SceneSource[];
}

interface SceneSource {
  id: string;
  name: string;
  type: "text" | "image" | "video" | "camera" | "audio" | "media-source" | "audio-input" | "ndi";
  visible: boolean;
  locked: boolean;
  color?: string;
}

interface AnnotationTool {
  id: string;
  name: string;
  icon: string;
}

interface ScheduleItem {
  id: string;
  type: "song" | "bible";
  itemId: string;
  title: string;
  order: number;
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

// Sample songs - users can add/edit/delete their own songs
// Bible content is now fetched from live API (bible.helloao.org)
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
  { id: "scene-1", name: "Main (Song)", sources: [] },
  { id: "scene-2", name: "Bible Reading", sources: [] },
  { id: "scene-3", name: "Announcement", sources: [] },
  { id: "scene-4", name: "Blank", sources: [] },
];

const DEFAULT_SOURCES: SceneSource[] = [
  { id: "source-1", name: "Main Lyrics", type: "text", visible: true, locked: false },
  { id: "source-2", name: "Reference", type: "text", visible: true, locked: false },
  { id: "source-3", name: "Background", type: "image", visible: true, locked: false },
  { id: "source-4", name: "Camera", type: "camera", visible: false, locked: false },
  { id: "source-5", name: "Audio", type: "audio", visible: true, locked: false },
];

const ANNOTATION_TOOLS: AnnotationTool[] = [
  { id: "pen", name: "Pen", icon: "Pen" },
  { id: "highlighter", name: "Highlighter", icon: "Highlighter" },
  { id: "eraser", name: "Eraser", icon: "Eraser" },
  { id: "text", name: "Text", icon: "Type" },
  { id: "arrow", name: "Arrow", icon: "ArrowUp" },
  { id: "rectangle", name: "Rectangle", icon: "Square" },
];

const BIBLE_VERSIONS = [
  { id: "KJV", name: "King James Version (KJV)" },
  { id: "BSB", name: "Berean Standard Bible (BSB)" },
  { id: "web", name: "World English Bible (WEB)" },
];

type ToolbarTab = "bible" | "songs" | "scenes" | "media" | "audio" | "schedule" | "host" | "annotate";

export default function PanelPage() {
  const [activeTab, setActiveTab] = useState<ToolbarTab>("bible");
  const [settingsTab, setSettingsTab] = useState("fullscreen");
  const [isLive, setIsLive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>(DEFAULT_SONGS);
  
  // Bible lyrics API
  const [fetchedLyrics, setFetchedLyrics] = useState<string[]>([]);
  const [isFetchingLyrics, setIsFetchingLyrics] = useState(false);
  const [selectedAnnotationTool, setSelectedAnnotationTool] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<{id: string; text: string; x: number; y: number}[]>([]);
  
  // Host/VMix
  const [hostConnection, setHostConnection] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [hostUrl, setHostUrl] = useState("localhost:8088");
  const [apiKey, setApiKey] = useState("");
  const [hostMode, setHostMode] = useState<"obs" | "vmix" | "standalone">("obs");
  const [autoReconnect, setAutoReconnect] = useState(true);
  const [studioMode, setStudioMode] = useState(false);
  
  // Remote Show
  const [remoteShowEnabled, setRemoteShowEnabled] = useState(false);
  const [pairCode, setPairCode] = useState("");
  
  // Media files
  const [mediaFiles, setMediaFiles] = useState<{id: string; name: string; type: string}[]>([]);
  
  // Sources per scene
  const [sceneSources, setSceneSources] = useState<Record<string, SceneSource[]>>({});
  
  // Active scene
  const [activeSceneId, setActiveSceneId] = useState("scene-1");

  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verseStart, setVerseStart] = useState<number | null>(null);
  const [verseEnd, setVerseEnd] = useState<number | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
   const [bibleVersion, setBibleVersion] = useState("KJV");

  // Source management functions
  const getSourceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'camera': '#60a5fa',
      'audio-input': '#f472b6',
      'media-source': '#fb923c',
      'ndi': '#a78bfa',
      'image': '#34d399',
      'text': '#38bdf8',
      'video': '#8b5cf6'
    };
    return colors[type] || '#6b7280';
  };

  const addSourceToScene = (sceneId: string, type: SceneSource['type']) => {
    const sourceId = `source-${Date.now()}`;
    const source: SceneSource = {
      id: sourceId,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Source`,
      type,
      visible: true,
      locked: false,
      color: getSourceTypeColor(type)
    };

    setScenes(scenes.map(scene =>
      scene.id === sceneId
        ? { ...scene, sources: [...scene.sources, source] }
        : scene
    ));
  };

  const toggleSourceVisibility = (sceneId: string, sourceId: string) => {
    setScenes(scenes.map(scene =>
      scene.id === sceneId
        ? {
            ...scene,
            sources: scene.sources.map(source =>
              source.id === sourceId
                ? { ...source, visible: !source.visible }
                : source
            )
          }
        : scene
    ));
  };

  const toggleSourceLock = (sceneId: string, sourceId: string) => {
    setScenes(scenes.map(scene =>
      scene.id === sceneId
        ? {
            ...scene,
            sources: scene.sources.map(source =>
              source.id === sourceId
                ? { ...source, locked: !source.locked }
                : source
            )
          }
        : scene
    ));
  };

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

  const [bgType, setBgType] = useState<"solid" | "gradient" | "image" | "video">("solid");
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
  const [audioBarOpacity, setAudioBarOpacity] = useState(80);

  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");

  const [quickColors] = useState(["#111CB0", "#AD0000", "#000000", "#FFD500", "#008000", "#800080", "#FF6600", "#008080"]);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  // Schedule/Setlist
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [showNewSongModal, setShowNewSongModal] = useState(false);
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");
  const [lyricsEditorContent, setLyricsEditorContent] = useState("");
  const [showTranslationPanel, setShowTranslationPanel] = useState(false);
  const [translationContent, setTranslationContent] = useState("");
  const [bilingualEnabled, setBilingualEnabled] = useState(false);

  // Bible API functions with fallback system
  const fetchChapter = async (book: string, chapter: number, translation: string = "KJV") => {
    // Try bible.helloao.org first (as requested by user)
    try {
      const bookMapping: { [key: string]: string } = {
        'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM', 'Deuteronomy': 'DEU',
        'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT', '1 Samuel': '1SA', '2 Samuel': '2SA',
        '1 Kings': '1KI', '2 Kings': '2KI', '1 Chronicles': '1CH', '2 Chronicles': '2CH',
        'Ezra': 'EZR', 'Nehemiah': 'NEH', 'Esther': 'EST', 'Job': 'JOB', 'Psalms': 'PSA',
        'Proverbs': 'PRO', 'Ecclesiastes': 'ECC', 'Song of Solomon': 'SNG', 'Isaiah': 'ISA',
        'Jeremiah': 'JER', 'Lamentations': 'LAM', 'Ezekiel': 'EZE', 'Daniel': 'DAN',
        'Hosea': 'HOS', 'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA', 'Jonah': 'JON',
        'Micah': 'MIC', 'Nahum': 'NAM', 'Habakkuk': 'HAB', 'Zephaniah': 'ZEP', 'Haggai': 'HAG',
        'Zechariah': 'ZEC', 'Malachi': 'MAL', 'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK',
        'John': 'JHN', 'Acts': 'ACT', 'Romans': 'ROM', '1 Corinthians': '1CO', '2 Corinthians': '2CO',
        'Galatians': 'GAL', 'Ephesians': 'EPH', 'Philippians': 'PHP', 'Colossians': 'COL',
        '1 Thessalonians': '1TH', '2 Thessalonians': '2TH', '1 Timothy': '1TI', '2 Timothy': '2TI',
        'Titus': 'TIT', 'Philemon': 'PHM', 'Hebrews': 'HEB', 'James': 'JAS', '1 Peter': '1PE',
        '2 Peter': '2PE', '1 John': '1JN', '2 John': '2JN', '3 John': '3JN', 'Jude': 'JUD',
        'Revelation': 'REV'
      };

      const bookId = bookMapping[book] || book.toUpperCase().substring(0, 3);
      const response = await fetch(`https://bible.helloao.org/api/${translation}/${bookId}/${chapter}.json`);

      if (!response.ok) {
        throw new Error(`Primary API request failed: ${response.status}`);
      }

      const text = await response.text();
      if (text.includes('<!doctype') || text.includes('<html')) {
        throw new Error('Primary API returned HTML instead of JSON');
      }

      const chapterData = JSON.parse(text);
      return chapterData;

    } catch (error) {
      console.warn('bible.helloao.org failed, trying fallback API:', error);

      // Fallback to bible-api.com
      try {
        const bookName = book.toLowerCase();
        let translationParam = '';

        // Map translation IDs for fallback API
        if (translation === 'KJV') {
          translationParam = '?translation=kjv';
        } else if (translation === 'BSB') {
          // BSB not available in fallback, use WEB
          translationParam = '';
        } else if (translation === 'web') {
          // WEB is the default for bible-api.com
          translationParam = '';
        }

        const response = await fetch(`https://bible-api.com/${bookName}+${chapter}${translationParam}`);

        if (!response.ok) {
          throw new Error(`Fallback API request failed: ${response.status}`);
        }

        const chapterData = await response.json();

        // Transform bible-api.com response to match our expected format
        if (chapterData.verses && Array.isArray(chapterData.verses)) {
          return {
            chapter: {
              content: chapterData.verses.map((verse: any) => ({
                type: 'verse',
                number: verse.verse,
                content: [verse.text.replace(/\n/g, ' ').trim()]
              }))
            }
          };
        }

        throw new Error('Fallback API returned unexpected format');

      } catch (fallbackError) {
        console.error('Both APIs failed:', fallbackError);
        return { error: 'Failed to load Bible chapter from any API', fallback: true };
      }
    }
  };

  // Bible API integration with fallback system
  // Primary: bible.helloao.org (KJV, BSB) - Fallback: bible-api.com (KJV, WEB)
  // Provides reliable Bible content with automatic failover

  // localStorage persistence
  useEffect(() => {
    const saved = localStorage.getItem("bible-song-pro-settings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.fontSize) setFontSize(settings.fontSize);
        if (settings.bgColor) setBgColor(settings.bgColor);
        if (settings.theme) setTheme(settings.theme);
        if (settings.bibleVersion) setBibleVersion(settings.bibleVersion);
        if (settings.linesPerPage) setLinesPerPage(settings.linesPerPage);
        if (settings.autoAdvance !== undefined) setAutoAdvance(settings.autoAdvance);
        if (settings.autoGoLive !== undefined) setAutoGoLive(settings.autoGoLive);
      } catch (e) { console.error("Failed to load settings:", e); }
    }
  }, []);

  useEffect(() => {
    const settings = { fontSize, bgColor, theme, bibleVersion, linesPerPage, autoAdvance, autoGoLive };
    localStorage.setItem("bible-song-pro-settings", JSON.stringify(settings));
  }, [fontSize, bgColor, theme, bibleVersion, linesPerPage, autoAdvance, autoGoLive]);

  // Load chapter when book and chapter are selected
  useEffect(() => {
    if (selectedBook && selectedChapter) {
      const verses = verseStart ? { start: verseStart, end: verseEnd || verseStart } : undefined;
      loadChapter(selectedBook, selectedChapter, verses);
    }
  }, [selectedBook, selectedChapter, verseStart, verseEnd, bibleVersion]);

  // Save songs to localStorage
  useEffect(() => {
    localStorage.setItem("bible-song-pro-songs", JSON.stringify(songs));
  }, [songs]);

  // Editor mode
  const [editorMode, setEditorMode] = useState<"text" | "buttons">("buttons");
  const [animationPreset, setAnimationPreset] = useState("none");
   const [showAnimationModal, setShowAnimationModal] = useState(false);
   const [showPresetPopover, setShowPresetPopover] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Dual Bible
  const [dualBibleEnabled, setDualBibleEnabled] = useState(false);
  const [dualPrimaryVersion, setDualPrimaryVersion] = useState("kjv");
  const [dualSecondaryVersion, setDualSecondaryVersion] = useState("nlt");

  // Annotation stroke
  const [annotationColor, setAnnotationColor] = useState("#111CB0");
  const [annotationStroke, setAnnotationStroke] = useState(3);

  // Pinned references
  const [pinnedRef, setPinnedRef] = useState<{book: string; chapter: number; verses?: string} | null>(null);
  const [recentRefs, setRecentRefs] = useState<{book: string; chapter: number; verses?: string}[]>([]);

  // Full Screen Mode Settings
  const [fsFontSize, setFsFontSize] = useState(40);
  const [fsRefFontSize, setFsRefFontSize] = useState(32);
  const [fsLineHeight, setFsLineHeight] = useState(1.2);
  const [fsWordSpacing, setFsWordSpacing] = useState(0);
  const [fsLetterSpacing, setFsLetterSpacing] = useState(0);
  const [fsPaddingLR, setFsPaddingLR] = useState(10);
  const [fsPaddingTB, setFsPaddingTB] = useState(5);
  const [fsTextX, setFsTextX] = useState(0);
  const [fsTextY, setFsTextY] = useState(0);
  const [fsWidthPct, setFsWidthPct] = useState(100);
  const [fsScalePct, setFsScalePct] = useState(100);
  const [fsBorderRadius, setFsBorderRadius] = useState(0);
  const [fsShadowOpacity, setFsShadowOpacity] = useState(0);
  const [fsShadowBlur, setFsShadowBlur] = useState(10);
  const [fsShadowOffset, setFsShadowOffset] = useState(5);
  const [fsBgOpacity, setFsBgOpacity] = useState(100);
  const [ltBgOpacity, setLtBgOpacity] = useState(100);

  // Lowerthird Mode Settings
  const [ltFontSize, setLtFontSize] = useState(36);
  const [ltRefFontSize, setLtRefFontSize] = useState(24);
  const [ltLineHeight, setLtLineHeight] = useState(1.1);
  const [ltWordSpacing, setLtWordSpacing] = useState(0);
  const [ltLetterSpacing, setLtLetterSpacing] = useState(0);
  const [ltPaddingLR, setLtPaddingLR] = useState(8);
  const [ltPaddingTB, setLtPaddingTB] = useState(3);
  const [ltTextX, setLtTextX] = useState(0);
  const [ltTextY, setLtTextY] = useState(0);
  const [ltWidthPct, setLtWidthPct] = useState(80);
  const [ltScalePct, setLtScalePct] = useState(100);
  const [ltBorderRadius, setLtBorderRadius] = useState(10);
  const [ltShadowOpacity, setLtShadowOpacity] = useState(30);
  const [ltShadowBlur, setLtShadowBlur] = useState(15);
  const [ltShadowOffset, setLtShadowOffset] = useState(8);

  // Background Settings
  const [bgVideoOpacity, setBgVideoOpacity] = useState(100);
  const [bgVideoSpeed, setBgVideoSpeed] = useState(1);
  const [bgY, setBgY] = useState(0);
  const [bgImageUrl, setBgImageUrl] = useState("");
  const [bgVideoUrl, setBgVideoUrl] = useState("");

  // Reference Settings
  const [refLineHeight, setRefLineHeight] = useState(1.1);
  const [refWordSpacing, setRefWordSpacing] = useState(0);
  const [refLetterSpacing, setRefLetterSpacing] = useState(0);
  const [refOpacity, setRefOpacity] = useState(80);
  const [refBorderWidth, setRefBorderWidth] = useState(0);
  const [refBorderRadius, setRefBorderRadius] = useState(0);

  // Display mode
  const [displayMode, setDisplayMode] = useState<"full" | "lt" | "custom">("full");

  // Scenes
  const [scenes, setScenes] = useState<Scene[]>([
    { id: "scene-1", name: "Scene 1", sources: [] },
    { id: "scene-2", name: "Scene 2", sources: [] },
  ]);

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
    // For now, use estimated verse counts. In a full implementation,
    // we'd fetch chapter data to get exact verse counts
    const baseVerses = selectedChapter === 1 ? 31 : selectedChapter === 2 ? 25 : 20;
    return Array.from({ length: Math.min(baseVerses, 50) }, (_, i) => i + 1);
  };

  // Fetch and display chapter content
  const loadChapter = async (book: BibleBook, chapter: number, verses?: { start?: number; end?: number }) => {
    setIsFetchingLyrics(true);
    try {
      const chapterData = await fetchChapter(book.name, chapter, bibleVersion);

      if (chapterData && chapterData.error) {
        // API failed, show fallback message
        setFetchedLyrics([`Unable to load ${book.name} ${chapter} from ${bibleVersion}. Please check your internet connection or try again later.`]);
        setLineCursor(0);
        return;
      }

      if (chapterData && chapterData.chapter && chapterData.chapter.content) {
        // bible.helloao.org format
        let content = '';
        const startVerse = verses?.start || 1;
        const endVerse = verses?.end || 999; // High number to include all verses

        // Parse the complex content structure from bible.helloao.org
        const chapterVerses = chapterData.chapter.content.filter((item: any) => item.type === 'verse');

        for (let i = startVerse - 1; i < Math.min(endVerse, chapterVerses.length); i++) {
          const verse = chapterVerses[i];
          if (verse && verse.content) {
            // Extract text from verse content array
            let verseText = '';
            if (Array.isArray(verse.content)) {
              verseText = verse.content.map((part: any) => {
                if (typeof part === 'string') return part;
                if (part && typeof part === 'object' && part.text) return part.text;
                if (part && typeof part === 'object' && part.noteId !== undefined) return ''; // Skip footnotes
                return '';
              }).join(' ').trim();
            } else if (typeof verse.content === 'string') {
              verseText = verse.content;
            }

            content += verseText.replace(/\n/g, ' ').trim() + ' ';
          }
        }

        setFetchedLyrics([content.trim()]);
        setLineCursor(0);
      } else       if (chapterData && chapterData.verses && Array.isArray(chapterData.verses)) {
        // bible-api.com fallback format
        let content = '';
        const startVerse = verses?.start || 1;
        const endVerse = verses?.end || (verses?.start ? verses.start : chapterData.verses.length);

        for (let i = startVerse - 1; i < Math.min(endVerse, chapterData.verses.length); i++) {
          const verse = chapterData.verses[i];
          if (verse && verse.text) {
            content += verse.text.replace(/\n/g, ' ').trim() + ' ';
          }
        }

        setFetchedLyrics([content.trim()]);
        setLineCursor(0);
      } else {
        console.warn('No chapter content found in API response:', chapterData);
        setFetchedLyrics([`No content available for ${book.name} ${chapter}.`]);
      }
    } catch (error) {
      console.error('Failed to load chapter:', error);
      setFetchedLyrics([`Error loading ${book.name} ${chapter}. Please try again.`]);
    } finally {
      setIsFetchingLyrics(false);
    }
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

  const handleImportSongs = async () => {
    const input = document.getElementById('import-file') as HTMLInputElement;
    if (!input || !input.files) return;

    const newSongs: Song[] = [];
    for (const file of Array.from(input.files)) {
      const text = await file.text();
      const lines = text.split("\n").filter(Boolean);
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
          currentSongId = `import-${Date.now()}-${numMatch[1]}`;
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
    }

    if (newSongs.length > 0) {
      setSongs([...songs, ...newSongs]);
    }
    input.value = ''; // Reset input
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
    if (fetchedLyrics.length > 0) {
      return fetchedLyrics.slice(lineCursor * linesPerPage, (lineCursor + 1) * linesPerPage).join("\n");
    }
    if (selectedBook && selectedChapter) return `${selectedBook.name} ${selectedChapter}`;
    return selectedItem?.title || "";
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {showAnimationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAnimationModal(false)}>
          <div className="bg-card border rounded-lg shadow-lg w-full max-w-md p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Animation Presets</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAnimationModal(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["none", "fade", "slide-left", "slide-right", "pop", "zoom", "blur", "roll"].map((preset) => (
                <Button key={preset} variant={animationPreset === preset ? "secondary" : "outline"} className="h-20 capitalize" onClick={() => setAnimationPreset(preset)}>{preset.replace("-", " ")}</Button>
              ))}
            </div>
          </div>
        </div>
      )}
      {showPresetPopover && (
        <div className="fixed inset-0 z-40" onClick={() => setShowPresetPopover(false)}>
          <div className="absolute top-16 right-32 bg-card border rounded-lg shadow-lg p-4 min-w-[280px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Animation Presets</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowPresetPopover(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Transition</Label>
                <Select value={transitionType} onValueChange={(v) => setTransitionType(v as "none" | "fade" | "slide" | "dissolve")}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="fade">Fade</SelectItem>
                    <SelectItem value="slide">Slide</SelectItem>
                    <SelectItem value="dissolve">Dissolve</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Duration</Label>
                  <span className="text-xs text-muted-foreground">{transitionDuration}s</span>
                </div>
                <Slider value={transitionDuration * 100} onValueChange={(v) => setTransitionDuration((Array.isArray(v) ? v[0] : v) / 100)} min={25} max={200} step={5} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Animate Background</Label>
                <Switch checked={false} />
              </div>
            </div>
          </div>
        </div>
      )}
      {showNewSongModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowNewSongModal(false)}>
          <div className="bg-card border rounded-lg shadow-lg w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Create New Song</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowNewSongModal(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="Song title..." value={newSongTitle} onChange={(e) => setNewSongTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Artist</Label>
                  <Input placeholder="Artist name..." value={newSongArtist} onChange={(e) => setNewSongArtist(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Search Lyrics</Button>
              </div>
              <div className="text-xs text-muted-foreground">
                No lyrics fetched
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewSongModal(false)}>Cancel</Button>
                <Button onClick={() => {
                  const num = songs.length + 1;
                  setSongs([...songs, {
                    id: `new-${num}`,
                    number: num,
                    title: newSongTitle || `New Song ${num}`,
                    lyrics: []
                  }]);
                  setNewSongTitle("");
                  setNewSongArtist("");
                  setShowNewSongModal(false);
                }}>Create</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowSettingsModal(false)}>
          <div className="bg-card border rounded-lg shadow-lg w-[800px] max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Settings</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowSettingsModal(false)}><X className="h-4 w-4" /></Button>
            </div>
             <div className="flex flex-1 overflow-hidden">
               <div className="w-56 border-r border-border bg-card p-2 space-y-1">
                 <button onClick={() => setSettingsTab("fullscreen")} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm ${settingsTab === "fullscreen" ? "bg-secondary" : "hover:bg-accent/50"}`}><Maximize2 className="h-4 w-4" /> Full Screen</button>
                 <button onClick={() => setSettingsTab("lowerthird")} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm ${settingsTab === "lowerthird" ? "bg-secondary" : "hover:bg-accent/50"}`}><LayersIcon className="h-4 w-4" /> Lower Third</button>
                 <button onClick={() => setSettingsTab("typography")} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm ${settingsTab === "typography" ? "bg-secondary" : "hover:bg-accent/50"}`}><Type className="h-4 w-4" /> Typography</button>
                 <button onClick={() => setSettingsTab("background")} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm ${settingsTab === "background" ? "bg-secondary" : "hover:bg-accent/50"}`}><Image className="h-4 w-4" /> Background</button>
                 <button onClick={() => setSettingsTab("songs")} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm ${settingsTab === "songs" ? "bg-secondary" : "hover:bg-accent/50"}`}><Music className="h-4 w-4" /> Songs</button>
                 <button onClick={() => setSettingsTab("bible")} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm ${settingsTab === "bible" ? "bg-secondary" : "hover:bg-accent/50"}`}><Book className="h-4 w-4" /> Bible</button>
                 <button onClick={() => setSettingsTab("display")} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm ${settingsTab === "display" ? "bg-secondary" : "hover:bg-accent/50"}`}><Monitor className="h-4 w-4" /> Display</button>
                 <button onClick={() => setSettingsTab("animation")} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm ${settingsTab === "animation" ? "bg-secondary" : "hover:bg-accent/50"}`}><FlipHorizontal className="h-4 w-4" /> Animation</button>
                 <button onClick={() => setSettingsTab("recording")} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm ${settingsTab === "recording" ? "bg-secondary" : "hover:bg-accent/50"}`}><Circle className="h-4 w-4" /> Recording</button>
                 <button onClick={() => setSettingsTab("streaming")} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm ${settingsTab === "streaming" ? "bg-secondary" : "hover:bg-accent/50"}`}><Radio className="h-4 w-4" /> Streaming</button>
                 <button onClick={() => setSettingsTab("remote")} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm ${settingsTab === "remote" ? "bg-secondary" : "hover:bg-accent/50"}`}><Wifi className="h-4 w-4" /> Remote</button>
                 <button onClick={() => setSettingsTab("theme")} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm ${settingsTab === "theme" ? "bg-secondary" : "hover:bg-accent/50"}`}><Palette className="h-4 w-4" /> Theme</button>
               </div>
              <div className="flex-1 overflow-auto p-4">
                {settingsTab === "fullscreen" && (
                  <div className="space-y-4">
                    <Card><CardHeader><CardTitle className="text-sm">Full Screen Mode</CardTitle></CardHeader><CardContent className="grid grid-cols-3 gap-4">
                      <div className="space-y-2"><Label>Font Size: {fsFontSize}pt</Label><Slider value={[fsFontSize]} onValueChange={(v) => setFsFontSize(Array.isArray(v) ? v[0] : v)} min={12} max={120} step={1} /></div>
                      <div className="space-y-2"><Label>Line Height: {fsLineHeight}</Label><Slider value={fsLineHeight * 50} onValueChange={(v) => setFsLineHeight((Array.isArray(v) ? v[0] : v) / 50)} min={80} max={200} step={5} /></div>
                      <div className="space-y-2"><Label>Word Spacing: {fsWordSpacing}px</Label><Slider value={[fsWordSpacing + 10]} onValueChange={(v) => setFsWordSpacing((Array.isArray(v) ? v[0] : v) - 10)} min={0} max={20} step={1} /></div>
                      <div className="space-y-2"><Label>Letter Spacing: {fsLetterSpacing}px</Label><Slider value={[fsLetterSpacing + 5]} onValueChange={(v) => setFsLetterSpacing((Array.isArray(v) ? v[0] : v) - 5)} min={0} max={10} step={1} /></div>
                      <div className="space-y-2"><Label>Padding LR: {fsPaddingLR}%</Label><Slider value={[fsPaddingLR]} onValueChange={(v) => setFsPaddingLR(Array.isArray(v) ? v[0] : v)} min={0} max={30} step={1} /></div>
                      <div className="space-y-2"><Label>Padding TB: {fsPaddingTB}%</Label><Slider value={[fsPaddingTB]} onValueChange={(v) => setFsPaddingTB(Array.isArray(v) ? v[0] : v)} min={0} max={20} step={1} /></div>
                      <div className="space-y-2"><Label>Text X: {fsTextX}px</Label><Slider value={[fsTextX + 50]} onValueChange={(v) => setFsTextX((Array.isArray(v) ? v[0] : v) - 50)} min={0} max={100} step={1} /></div>
                      <div className="space-y-2"><Label>Text Y: {fsTextY}px</Label><Slider value={[fsTextY + 50]} onValueChange={(v) => setFsTextY((Array.isArray(v) ? v[0] : v) - 50)} min={0} max={100} step={1} /></div>
                      <div className="space-y-2"><Label>Width: {fsWidthPct}%</Label><Slider value={[fsWidthPct]} onValueChange={(v) => setFsWidthPct(Array.isArray(v) ? v[0] : v)} min={30} max={100} step={1} /></div>
                      <div className="space-y-2"><Label>Scale: {fsScalePct}%</Label><Slider value={[fsScalePct]} onValueChange={(v) => setFsScalePct(Array.isArray(v) ? v[0] : v)} min={30} max={150} step={5} /></div>
                      <div className="space-y-2"><Label>Border Radius: {fsBorderRadius}px</Label><Slider value={[fsBorderRadius]} onValueChange={(v) => setFsBorderRadius(Array.isArray(v) ? v[0] : v)} min={0} max={50} step={1} /></div>
                      <div className="space-y-2"><Label>Shadow Opacity: {fsShadowOpacity}%</Label><Slider value={[fsShadowOpacity]} onValueChange={(v) => setFsShadowOpacity(Array.isArray(v) ? v[0] : v)} min={0} max={100} step={5} /></div>
                      <div className="space-y-2"><Label>Shadow Blur: {fsShadowBlur}px</Label><Slider value={[fsShadowBlur]} onValueChange={(v) => setFsShadowBlur(Array.isArray(v) ? v[0] : v)} min={0} max={25} step={1} /></div>
                      <div className="space-y-2"><Label>Shadow Offset: {fsShadowOffset}px</Label><Slider value={[fsShadowOffset]} onValueChange={(v) => setFsShadowOffset(Array.isArray(v) ? v[0] : v)} min={0} max={20} step={1} /></div>
                      <div className="space-y-2"><Label>Background Opacity: {fsBgOpacity}%</Label><Slider value={[fsBgOpacity]} onValueChange={(v) => setFsBgOpacity(Array.isArray(v) ? v[0] : v)} min={0} max={100} step={5} /></div>
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle className="text-sm">Reference: {fsRefFontSize}pt</CardTitle></CardHeader><CardContent><Slider value={[fsRefFontSize]} onValueChange={(v) => setFsRefFontSize(Array.isArray(v) ? v[0] : v)} min={10} max={72} step={1} /></CardContent></Card>
                  </div>
                )}

                {settingsTab === "lowerthird" && (
                  <div className="space-y-4">
                    <Card><CardHeader><CardTitle className="text-sm">Lower Third Mode</CardTitle></CardHeader><CardContent className="grid grid-cols-3 gap-4">
                      <div className="space-y-2"><Label>Font Size: {ltFontSize}pt</Label><Slider value={[ltFontSize]} onValueChange={(v) => setLtFontSize(Array.isArray(v) ? v[0] : v)} min={12} max={72} step={1} /></div>
                      <div className="space-y-2"><Label>Line Height: {ltLineHeight}</Label><Slider value={ltLineHeight * 50} onValueChange={(v) => setLtLineHeight((Array.isArray(v) ? v[0] : v) / 50)} min={80} max={180} step={5} /></div>
                      <div className="space-y-2"><Label>Word Spacing: {ltWordSpacing}px</Label><Slider value={[ltWordSpacing + 5]} onValueChange={(v) => setLtWordSpacing((Array.isArray(v) ? v[0] : v) - 5)} min={0} max={10} step={1} /></div>
                      <div className="space-y-2"><Label>Letter Spacing: {ltLetterSpacing}px</Label><Slider value={[ltLetterSpacing + 2]} onValueChange={(v) => setLtLetterSpacing((Array.isArray(v) ? v[0] : v) - 2)} min={0} max={5} step={1} /></div>
                      <div className="space-y-2"><Label>Padding LR: {ltPaddingLR}%</Label><Slider value={[ltPaddingLR]} onValueChange={(v) => setLtPaddingLR(Array.isArray(v) ? v[0] : v)} min={0} max={20} step={1} /></div>
                      <div className="space-y-2"><Label>Padding TB: {ltPaddingTB}%</Label><Slider value={[ltPaddingTB]} onValueChange={(v) => setLtPaddingTB(Array.isArray(v) ? v[0] : v)} min={0} max={15} step={1} /></div>
                      <div className="space-y-2"><Label>Width: {ltWidthPct}%</Label><Slider value={[ltWidthPct]} onValueChange={(v) => setLtWidthPct(Array.isArray(v) ? v[0] : v)} min={30} max={100} step={1} /></div>
                      <div className="space-y-2"><Label>Scale: {ltScalePct}%</Label><Slider value={[ltScalePct]} onValueChange={(v) => setLtScalePct(Array.isArray(v) ? v[0] : v)} min={30} max={120} step={5} /></div>
                      <div className="space-y-2"><Label>Border Radius: {ltBorderRadius}px</Label><Slider value={[ltBorderRadius]} onValueChange={(v) => setLtBorderRadius(Array.isArray(v) ? v[0] : v)} min={0} max={30} step={1} /></div>
                      <div className="space-y-2"><Label>Shadow Opacity: {ltShadowOpacity}%</Label><Slider value={[ltShadowOpacity]} onValueChange={(v) => setLtShadowOpacity(Array.isArray(v) ? v[0] : v)} min={0} max={100} step={5} /></div>
                      <div className="space-y-2"><Label>Shadow Blur: {ltShadowBlur}px</Label><Slider value={[ltShadowBlur]} onValueChange={(v) => setLtShadowBlur(Array.isArray(v) ? v[0] : v)} min={0} max={25} step={1} /></div>
                      <div className="space-y-2"><Label>Shadow Offset: {ltShadowOffset}px</Label><Slider value={[ltShadowOffset]} onValueChange={(v) => setLtShadowOffset(Array.isArray(v) ? v[0] : v)} min={0} max={15} step={1} /></div>
                      <div className="space-y-2"><Label>Background Opacity: {ltBgOpacity}%</Label><Slider value={[ltBgOpacity]} onValueChange={(v) => setLtBgOpacity(Array.isArray(v) ? v[0] : v)} min={0} max={100} step={5} /></div>
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle className="text-sm">Reference: {ltRefFontSize}pt</CardTitle></CardHeader><CardContent><Slider value={[ltRefFontSize]} onValueChange={(v) => setLtRefFontSize(Array.isArray(v) ? v[0] : v)} min={8} max={36} step={1} /></CardContent></Card>
                  </div>
                )}

                {settingsTab === "typography" && (
                  <div className="space-y-4">
                    <Card><CardHeader><CardTitle className="text-sm">Typography</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Font Size: {fontSize}pt</Label><Slider value={[fontSize]} onValueChange={(v) => setFontSize(Array.isArray(v) ? v[0] : v)} min={12} max={120} step={1} /></div>
                      <div className="space-y-2"><Label>Line Spacing: {lineSpacing}</Label><Slider value={lineSpacing * 50} onValueChange={(v) => setLineSpacing((Array.isArray(v) ? v[0] : v) / 50)} min={80} max={200} step={5} /></div>
                      <Select value={textTransform} onValueChange={(v) => setTextTransform(v as "none" | "uppercase")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Normal</SelectItem><SelectItem value="uppercase">Uppercase</SelectItem></SelectContent></Select>
                      <Select value={hAlign} onValueChange={(v) => setHAlign(v as "left" | "center" | "right")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="left">Left</SelectItem><SelectItem value="center">Center</SelectItem><SelectItem value="right">Right</SelectItem></SelectContent></Select>
                    </CardContent></Card>
                  </div>
                )}

                {settingsTab === "background" && (
                  <div className="space-y-4">
                    <Card><CardHeader><CardTitle className="text-sm">Background Type</CardTitle></CardHeader><CardContent className="space-y-4">
                      <div className="flex gap-2"><Button variant={bgType === "solid" ? "secondary" : "outline"} onClick={() => setBgType("solid")}>Solid</Button><Button variant={bgType === "gradient" ? "secondary" : "outline"} onClick={() => setBgType("gradient")}>Gradient</Button><Button variant={bgType === "image" ? "secondary" : "outline"} onClick={() => setBgType("image")}>Image</Button><Button variant={bgType === "video" ? "secondary" : "outline"} onClick={() => setBgType("video")}>Video</Button></div>
                      {bgType === "solid" && <div className="space-y-2"><Label>Color</Label><div className="flex gap-2"><Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-16 h-10 p-1" /><Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} /></div></div>}
                      {bgType === "gradient" && <><div className="space-y-2"><Label>Angle: {bgGradientAngle}</Label><Slider value={bgGradientAngle} onValueChange={(v) => setBgGradientAngle(Array.isArray(v) ? v[0] : v)} min={0} max={360} step={5} /></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Start</Label><Input type="color" value={bgGradientStart} onChange={(e) => setBgGradientStart(e.target.value)} className="w-full h-10 p-1" /></div><div className="space-y-2"><Label>End</Label><Input type="color" value={bgGradientEnd} onChange={(e) => setBgGradientEnd(e.target.value)} className="w-full h-10 p-1" /></div></div></>}
                      {(bgType === "image" || bgType === "video") && <div className="space-y-2"><Label>URL</Label><Input placeholder="https://..." value={bgType === "image" ? bgImageUrl : bgVideoUrl} onChange={(e) => bgType === "image" ? setBgImageUrl(e.target.value) : setBgVideoUrl(e.target.value)} /></div>}
                      {(bgType === "image" || bgType === "video") && <div className="space-y-2"><Label>Blur: {bgBlur}px</Label><Slider value={[bgBlur]} onValueChange={(v) => setBgBlur(Array.isArray(v) ? v[0] : v)} min={0} max={20} step={1} /></div>}
                      {bgType === "video" && <><div className="space-y-2"><Label>Opacity: {bgVideoOpacity}%</Label><Slider value={[bgVideoOpacity]} onValueChange={(v) => setBgVideoOpacity(Array.isArray(v) ? v[0] : v)} min={0} max={100} step={5} /></div><div className="space-y-2"><Label>Speed: {bgVideoSpeed}x</Label><Slider value={[bgVideoSpeed * 50]} onValueChange={(v) => setBgVideoSpeed((Array.isArray(v) ? v[0] : v) / 50)} min={25} max={200} step={5} /></div><div className="space-y-2"><Label>Y Offset: {bgY}</Label><Slider value={[bgY + 50]} onValueChange={(v) => setBgY((Array.isArray(v) ? v[0] : v) - 50)} min={-50} max={50} step={1} /></div></>}
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle className="text-sm">Quick Colors</CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-2">{quickColors.map((c, i) => <button key={i} className="w-8 h-8 rounded border" style={{backgroundColor: c}} onClick={() => setBgColor(c)} />)}</div></CardContent></Card>
                  </div>
                )}

                {settingsTab === "songs" && (
                  <div className="space-y-4">
                    <Card><CardHeader><CardTitle className="text-sm">Song Settings</CardTitle></CardHeader><CardContent className="space-y-4">
                      <div className="space-y-2"><Label>Default Lines Per Page</Label><Slider value={[linesPerPage]} onValueChange={(v) => setLinesPerPage(Array.isArray(v) ? v[0] : v)} min={1} max={6} step={1} /></div>
                      <div className="flex items-center justify-between"><Label>Auto Advance</Label><Switch checked={autoAdvance} onCheckedChange={setAutoAdvance} /></div>
                      <div className="flex items-center justify-between"><Label>Auto Go Live</Label><Switch checked={autoGoLive} onCheckedChange={setAutoGoLive} /></div>
                    </CardContent></Card>
                  </div>
                )}

                {settingsTab === "bible" && (
                  <div className="space-y-4">
                    <Card><CardHeader><CardTitle className="text-sm">Bible Settings</CardTitle></CardHeader><CardContent className="space-y-4">
                      <Select value={bibleVersion} onValueChange={(v) => setBibleVersion(v || "KJV")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{BIBLE_VERSIONS.map((v) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}</SelectContent></Select>
                      <div className="flex items-center justify-between"><Label>Dual Bible</Label><Switch checked={dualBibleEnabled} onCheckedChange={setDualBibleEnabled} /></div>
                      {dualBibleEnabled && <div className="grid grid-cols-2 gap-4">
                        <Select value={dualPrimaryVersion} onValueChange={(v) => setDualPrimaryVersion(v || "kjv")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{BIBLE_VERSIONS.map((v) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}</SelectContent></Select>
                        <Select value={dualSecondaryVersion} onValueChange={(v) => setDualSecondaryVersion(v || "nlt")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{BIBLE_VERSIONS.map((v) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}</SelectContent></Select>
                      </div>}
                    </CardContent></Card>
                  </div>
                )}

                {settingsTab === "display" && (
                  <div className="space-y-4">
                    <Card><CardHeader><CardTitle className="text-sm">Display Size</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Width: {displayWidth}%</Label><Slider value={[displayWidth]} onValueChange={(v) => setDisplayWidth(Array.isArray(v) ? v[0] : v)} min={20} max={100} step={1} /></div>
                      <div className="space-y-2"><Label>Scale: {displayScale}%</Label><Slider value={[displayScale]} onValueChange={(v) => setDisplayScale(Array.isArray(v) ? v[0] : v)} min={20} max={150} step={5} /></div>
                      <div className="space-y-2"><Label>Radius: {displayRadius}px</Label><Slider value={[displayRadius]} onValueChange={(v) => setDisplayRadius(Array.isArray(v) ? v[0] : v)} min={0} max={50} step={1} /></div>
                      <div className="flex items-center justify-between"><Label>Auto Height</Label><Switch checked={autoAdjustHeight} onCheckedChange={setAutoAdjustHeight} /></div>
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle className="text-sm">Position</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-4">
                      <Select value={displayAnchor} onValueChange={(v) => setDisplayAnchor(v as "top" | "bottom")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="top">Top</SelectItem><SelectItem value="bottom">Bottom</SelectItem></SelectContent></Select>
                      <div className="space-y-2"><Label>Y Offset: {displayOffsetY}</Label><Slider value={[displayOffsetY + 50]} onValueChange={(v) => setDisplayOffsetY((Array.isArray(v) ? v[0] : v) - 50)} min={0} max={100} step={1} /></div>
                    </CardContent></Card>
                  </div>
                )}

                {settingsTab === "animation" && (
                  <div className="space-y-4">
                    <Card><CardHeader><CardTitle className="text-sm">Transition</CardTitle></CardHeader><CardContent className="space-y-4">
                      <Select value={transitionType} onValueChange={(v) => setTransitionType(v as "none" | "fade" | "slide" | "dissolve")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="fade">Fade</SelectItem><SelectItem value="slide">Slide</SelectItem><SelectItem value="dissolve">Dissolve</SelectItem></SelectContent></Select>
                      <div className="space-y-2"><Label>Duration: {transitionDuration}s</Label><Slider value={transitionDuration * 100} onValueChange={(v) => setTransitionDuration((Array.isArray(v) ? v[0] : v) / 100)} min={25} max={200} step={5} /></div>
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle className="text-sm">Song Progress</CardTitle></CardHeader><CardContent className="space-y-4">
                      <div className="space-y-2"><Label>Line Transition: {transitionDuration}s</Label><Slider value={transitionDuration * 100} onValueChange={(v) => setTransitionDuration((Array.isArray(v) ? v[0] : v) / 100)} min={0} max={200} step={5} /></div>
                    </CardContent></Card>
                  </div>
                )}

                {settingsTab === "streaming" && (
                  <div className="space-y-4">
                    <Card><CardHeader><CardTitle className="text-sm flex items-center gap-2"><CircleDot className={`h-3 w-3 ${isStreaming ? "text-red-500" : ""}`} /> Streaming</CardTitle></CardHeader><CardContent className="space-y-4">
                      <div className="flex items-center justify-between"><Label>Start Streaming</Label><Switch checked={isStreaming} onCheckedChange={setIsStreaming} /></div>
                      {isStreaming && <div className="text-xs text-green-500 flex items-center gap-1"><CircleDot className="h-2 w-2" /> Live</div>}
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle className="text-sm">Stream Destinations</CardTitle></CardHeader><CardContent className="space-y-2">
                      <div className="flex items-center gap-2 p-2 rounded border"><Checkbox /> <span className="text-sm">RTMP Server</span></div>
                      <div className="flex items-center gap-2 p-2 rounded border"><Checkbox /> <span className="text-sm">YouTube Live</span></div>
                      <div className="flex items-center gap-2 p-2 rounded border"><Checkbox /> <span className="text-sm">Twitch</span></div>
                      <Button variant="outline" size="sm" className="w-full mt-2">Configure Destinations</Button>
                    </CardContent></Card>
                  </div>
                )}

                {settingsTab === "remote" && (
                  <div className="space-y-4">
                    <Card><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Wifi className="h-3 w-3" /> Remote Show</CardTitle></CardHeader><CardContent className="space-y-4">
                      <div className="flex items-center justify-between"><Label>Enable Remote</Label><Switch checked={remoteShowEnabled} onCheckedChange={setRemoteShowEnabled} /></div>
                      {remoteShowEnabled && <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Share this code with your phone/remote device:</div>
                        <div className="flex gap-2"><Input value={pairCode || "------"} readOnly className="font-mono text-center text-lg tracking-widest" /><Button variant="outline" size="icon" onClick={() => setPairCode(Math.random().toString(36).slice(2, 8).toUpperCase())}><RefreshCw className="h-4 w-4" /></Button></div>
                      </div>}
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle className="text-sm">Connection</CardTitle></CardHeader><CardContent className="space-y-3">
                      <div className="space-y-2"><Label>Server URL</Label><Input placeholder="localhost:8089" /></div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Wifi className="h-3 w-3" /> Remote device connects via browser</div>
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle className="text-sm">Permissions</CardTitle></CardHeader><CardContent className="space-y-2">
                      <div className="flex items-center gap-2"><Checkbox defaultChecked /> <span className="text-sm">Allow remote control</span></div>
                      <div className="flex items-center gap-2"><Checkbox defaultChecked /> <span className="text-sm">Allow song requests</span></div>
                      <div className="flex items-center gap-2"><Checkbox /> <span className="text-sm">Allow schedule editing</span></div>
                    </CardContent></Card>
                  </div>
                )}

                {settingsTab === "recording" && (
                  <div className="space-y-4">
                    <Card><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Circle className={`h-3 w-3 ${isRecording ? "text-red-500" : ""}`} /> Recording</CardTitle></CardHeader><CardContent className="space-y-4">
                      <div className="flex items-center justify-between"><Label>Start Recording</Label><Switch checked={isRecording} onCheckedChange={setIsRecording} /></div>
                      {isRecording && <div className="text-xs text-red-500 flex items-center gap-1"><Circle className="h-2 w-2 animate-pulse" /> Recording...</div>}
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle className="text-sm">Recording Format</CardTitle></CardHeader><CardContent className="space-y-3">
                      <Select defaultValue="mp4"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="mp4">MP4 (H.264)</SelectItem><SelectItem value="mkv">MKV (FFV1)</SelectItem><SelectItem value="mov">MOV (ProRes)</SelectItem></SelectContent></Select>
                      <div className="space-y-2"><Label>Quality</Label><Slider defaultValue={[80]} min={50} max={100} step={5} /><div className="flex justify-between text-xs text-muted-foreground"><span>Low</span><span>High</span></div></div>
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle className="text-sm">Output Folder</CardTitle></CardHeader><CardContent className="space-y-2">
                      <div className="flex gap-2"><Input placeholder="Videos/Bible Song Pro" className="flex-1" /><Button variant="outline" size="icon"><FolderOpen className="h-4 w-4" /></Button></div>
                      <Button variant="outline" size="sm" className="w-full">Open Recording Folder</Button>
                    </CardContent></Card>
                  </div>
                )}

                {settingsTab === "theme" && (
                  <div className="space-y-4">
                    <Card><CardHeader><CardTitle className="text-sm">Appearance</CardTitle></CardHeader><CardContent className="space-y-4">
                      <Select value={theme} onValueChange={(v) => setTheme(v || "dark")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="dark">Dark</SelectItem><SelectItem value="light">Light</SelectItem><SelectItem value="system">System</SelectItem></SelectContent></Select>
                      <Select value={language} onValueChange={(v) => setLanguage(v || "en")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="es">Spanish</SelectItem><SelectItem value="fr">French</SelectItem></SelectContent></Select>
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle className="text-sm">Keyboard Shortcuts</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><div className="flex justify-between"><span>Go Live</span><Badge variant="outline">Space</Badge></div><div className="flex justify-between"><span>Clear</span><Badge variant="outline">Esc</Badge></div><div className="flex justify-between"><span>Next</span><Badge variant="outline">PageDown</Badge></div><div className="flex justify-between"><span>Prev</span><Badge variant="outline">PageUp</Badge></div></CardContent></Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
              <TabsTrigger value="host" className="text-xs gap-1"><VideoIcon className="h-3 w-3" /> Host</TabsTrigger>
              <TabsTrigger value="annotate" className="text-xs gap-1"><Pen className="h-3 w-3" /> Annotate</TabsTrigger>
              <TabsTrigger value="schedule" className="text-xs gap-1"><ListMusic className="h-3 w-3" /> Schedule</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowNewSongModal(true)}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            <div className="flex items-center rounded-md border border-input bg-background p-0.5">
              <Button variant={editorMode === "text" ? "secondary" : "ghost"} size="sm" className="h-7 px-2 text-xs" onClick={() => setEditorMode("text")}>Text</Button>
              <Button variant={editorMode === "buttons" ? "secondary" : "ghost"} size="sm" className="h-7 px-2 text-xs" onClick={() => setEditorMode("buttons")}>Buttons</Button>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => document.getElementById('import-file')?.click()} title="Import songs"><Upload className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="h-8 text-xs font-serif italic" title="Animation presets" onClick={() => setShowPresetPopover(!showPresetPopover)}>fx</Button>
            <Button variant="outline" size="icon" className="h-8 w-8" title="Annotate" onClick={() => setActiveTab("annotate")}><Pen className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" title="Dual Bible" onClick={() => setDualBibleEnabled(!dualBibleEnabled)}><Book className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={handleClear}><X className="h-4 w-4 mr-1" /></Button>
            <Button variant={isLive ? "destructive" : "default"} size="sm" onClick={handleGoLive}>
              {isLive ? <SquareIcon className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isLive ? "Live" : "Go Live"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSettingsModal(true)}><Settings className="h-4 w-4 mr-1" /> Settings</Button>
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
          <Select value={bibleVersion} onValueChange={(v) => setBibleVersion(v || "KJV")}>
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
            <div className="p-3 border-b flex items-center justify-between"><span className="font-medium">Scenes</span><Button variant="outline" size="sm" onClick={() => { const num = scenes.length + 1; setScenes([...scenes, { id: `scene-${num}`, name: `Scene ${num}`, sources: [] }]); }}><Plus className="h-3 w-3" /></Button></div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-2">
                {scenes.map((scene) => (
                  <div key={scene.id} className="border rounded-lg p-2">
                    <div className={`flex items-center gap-2 p-2 rounded cursor-pointer ${activeSceneId === scene.id ? "bg-secondary" : "hover:bg-accent/10"}`} onClick={() => setActiveSceneId(scene.id)}>
                      <LayersIcon className="h-4 w-4" />
                      <span className="flex-1 text-sm font-medium">{scene.name}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setScenes(scenes.filter(s => s.id !== scene.id)); }}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-muted-foreground mb-1">Sources ({scene.sources.length})</div>
                      {scene.sources.map((source) => (
                        <div key={source.id} className="flex items-center gap-2 p-1 rounded text-xs">
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: source.color || getSourceTypeColor(source.type) }}
                          ></div>
                          <span className="flex-1 truncate">{source.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4"
                            onClick={() => toggleSourceVisibility(scene.id, source.id)}
                          >
                            {source.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4"
                            onClick={() => toggleSourceLock(scene.id, source.id)}
                          >
                            {source.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                          </Button>
                        </div>
                      ))}
                      <div className="flex gap-1 mt-2">
                        {[
                          { type: "text", icon: TypeIcon, label: "Text" },
                          { type: "image", icon: Image, label: "Image" },
                          { type: "camera", icon: Video, label: "Camera" },
                          { type: "audio", icon: Mic, label: "Audio" },
                        ].map(({ type, icon: Icon, label }) => (
                          <Button
                            key={type}
                            variant="outline"
                            size="sm"
                            className="flex-1 h-6 text-xs"
                            onClick={() => addSourceToScene(scene.id, type as any)}
                          >
                            <Icon className="h-3 w-3 mr-1" />
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </aside>
        )}

        {activeTab === "media" && (
          <aside className="w-80 border-r border-border bg-card flex flex-col">
            <div className="p-3 border-b flex items-center justify-between"><span className="font-medium">Media / Sources</span><Button variant="outline" size="sm" onClick={() => setMediaFiles([...mediaFiles, { id: `media-${Date.now()}`, name: `Media ${mediaFiles.length + 1}`, type: "image" }])}><Upload className="h-3 w-3" /></Button></div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {mediaFiles.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm py-8"><Image className="h-8 w-8 mx-auto mb-2 opacity-50" /><p>No media files</p><Button variant="outline" size="sm" className="mt-2" onClick={() => setMediaFiles([...mediaFiles, { id: `media-${Date.now()}`, name: `Image ${mediaFiles.length + 1}`, type: "image" }])}><Upload className="h-3 w-3 mr-1" /> Add Media</Button></div>
                ) : mediaFiles.map((media) => (
                  <div key={media.id} className="flex items-center gap-2 p-2 rounded hover:bg-accent/10">
                    <Image className="h-4 w-4" />
                    <span className="flex-1 text-sm truncate">{media.name}</span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" title="Toggle visibility"><Eye className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" title="Lock"><Radio className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setMediaFiles(mediaFiles.filter(m => m.id !== media.id))}><X className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </aside>
        )}

        {activeTab === "audio" && (
          <aside className="w-80 border-r border-border bg-card flex flex-col">
            <div className="p-3 border-b"><span className="font-medium">Audio</span></div>
            <Card className="m-2"><CardHeader className="pb-2"><CardTitle className="text-sm">Master Volume</CardTitle></CardHeader><CardContent><div className="space-y-2"><Slider value={masterVolume} onValueChange={(v) => setMasterVolume(Array.isArray(v) ? v[0] : v)} min={0} max={100} step={1} /><div className="flex justify-between text-xs text-muted-foreground"><span>0</span><span>{masterVolume}%</span><span>100</span></div></div></CardContent></Card>
            <Card className="m-2"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Mic className="h-3 w-3" /> Monitor</CardTitle></CardHeader><CardContent><div className="space-y-2"><div className="flex items-center justify-between"><Label>Muted</Label><Switch checked={monitorMuted} onCheckedChange={setMonitorMuted} /></div>{!monitorMuted && <Slider value={monitorVolume} onValueChange={(v) => setMonitorVolume(Array.isArray(v) ? v[0] : v)} min={0} max={100} step={1} />}</div></CardContent></Card>
            <Card className="m-2"><CardHeader className="pb-2"><CardTitle className="text-sm">BBG / Audio Bar</CardTitle></CardHeader><CardContent><div className="space-y-2"><Slider value={audioBarOpacity} onValueChange={(v) => setAudioBarOpacity(Array.isArray(v) ? v[0] : v)} min={0} max={100} step={5} /><div className="flex justify-between text-xs text-muted-foreground"><span>0</span><span>{audioBarOpacity}%</span><span>100</span></div></div></CardContent></Card>
          </aside>
        )}

        {activeTab === "host" && (
          <aside className="w-80 border-r border-border bg-card flex flex-col">
            <div className="p-3 border-b flex items-center justify-between"><span className="font-medium">Host / vMix</span><Button variant="outline" size="sm" title="Connect" onClick={() => { if (hostConnection === "disconnected") setHostConnection("connecting"); else setHostConnection("disconnected"); }}><RefreshCw className={`h-3 w-3 ${hostConnection === "connecting" ? "animate-spin" : ""}`} /></Button></div>
            <Card className="m-2"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><VideoIcon className="h-3 w-3" /> Host Mode
              <Badge variant={hostConnection === "connected" ? "default" : "secondary"} className="ml-auto text-xs">{hostConnection}</Badge>
            </CardTitle></CardHeader><CardContent className="space-y-3"><Select defaultValue="obs"><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="obs">OBS Studio</SelectItem><SelectItem value="vmix">vMix</SelectItem><SelectItem value="standalone">Standalone</SelectItem></SelectContent></Select><div className="space-y-2"><Label>URL</Label><Input placeholder="http://localhost:8088" value={hostUrl} onChange={(e) => setHostUrl(e.target.value)} /></div><div className="space-y-2"><Label>API Key</Label><Input placeholder="Enter API key" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} /></div><Button className="w-full" onClick={() => { setHostConnection("connecting"); setTimeout(() => setHostConnection("connected"), 1500); }} disabled={hostConnection === "connected"}><Wifi className="h-3 w-3 mr-1" /> {hostConnection === "connected" ? "Connected" : "Connect"}</Button></CardContent></Card>
            <Card className="m-2"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Monitor className="h-3 w-3" /> Program Output</CardTitle></CardHeader><CardContent className="space-y-3">
              <div className="flex items-center justify-between"><Label>Studio Mode</Label><Switch /></div>
              <div className="flex items-center justify-between"><Label>Auto Reconnect</Label><Switch defaultChecked /></div>
              <div className="text-xs text-muted-foreground">Status: {hostConnection === "connected" ? "Ready to receive API calls" : "Not connected"}</div>
            </CardContent></Card>
            <Card className="m-2"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><LayersIcon className="h-3 w-3" /> Sources</CardTitle></CardHeader><CardContent>
              {hostConnection !== "connected" ? <div className="text-center text-muted-foreground text-sm py-4"><p>Not connected</p><p className="text-xs">Connect to see sources</p></div> : <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded border"><Checkbox defaultChecked /> <span className="flex-1 text-sm">Bible Song Pro</span><Eye className="h-3 w-3" /></div>
                <div className="flex items-center gap-2 p-2 rounded border"><Checkbox /> <span className="flex-1 text-sm">Main Display</span></div>
              </div>}
            </CardContent></Card>
          </aside>
        )}

        {activeTab === "annotate" && (
          <aside className="w-80 border-r border-border bg-card flex flex-col">
            <div className="p-3 border-b flex items-center justify-between"><span className="font-medium">Annotation Tools</span><Button variant="outline" size="sm" title="Clear all" onClick={() => setAnnotations([])}><Eraser className="h-3 w-3" /></Button></div>
            <Card className="m-2"><CardHeader className="pb-2"><CardTitle className="text-sm">Tools</CardTitle></CardHeader><CardContent><div className="grid grid-cols-4 gap-2">
              <Button variant={selectedAnnotationTool === "pen" ? "secondary" : "outline"} size="icon" title="Pen" onClick={() => { setSelectedAnnotationTool("pen"); console.log("Pen tool selected"); }}><Pen className="h-4 w-4" /></Button>
              <Button variant={selectedAnnotationTool === "highlighter" ? "secondary" : "outline"} size="icon" title="Highlighter" onClick={() => { setSelectedAnnotationTool("highlighter"); console.log("Highlighter tool selected"); }}><Highlighter className="h-4 w-4" /></Button>
              <Button variant={selectedAnnotationTool === "eraser" ? "secondary" : "outline"} size="icon" title="Eraser" onClick={() => { setSelectedAnnotationTool("eraser"); console.log("Eraser tool selected"); }}><Eraser className="h-4 w-4" /></Button>
              <Button variant={selectedAnnotationTool === "text" ? "secondary" : "outline"} size="icon" title="Text" onClick={() => { setSelectedAnnotationTool("text"); console.log("Text tool selected"); }}><TypeIcon className="h-4 w-4" /></Button>
            </div></CardContent></Card>
            <Card className="m-2"><CardHeader className="pb-2"><CardTitle className="text-sm">Color</CardTitle></CardHeader><CardContent><div className="flex gap-1 flex-wrap">{quickColors.map(c => <Button key={c} variant={annotationColor === c ? "secondary" : "outline"} size="icon" className="w-6 h-6" style={{backgroundColor: c}} onClick={() => setAnnotationColor(c)} />)}</div></CardContent></Card>
            <Card className="m-2"><CardHeader className="pb-2"><CardTitle className="text-sm">Stroke: {annotationStroke}px</CardTitle></CardHeader><CardContent><Slider value={[annotationStroke]} onValueChange={(v) => setAnnotationStroke(Array.isArray(v) ? v[0] : v)} min={1} max={20} step={1} /></CardContent></Card>
          </aside>
        )}

        {activeTab === "schedule" && (
          <aside className="w-80 border-r border-border bg-card flex flex-col">
            <div className="p-3 border-b flex items-center justify-between"><span className="font-medium">Schedule / Setlist</span><Button variant="outline" size="sm" onClick={() => {
              if (selectedSong) {
                setScheduleItems([...scheduleItems, { id: `schedule-${Date.now()}`, type: "song", itemId: selectedSong.id, title: selectedSong.title, order: scheduleItems.length + 1 }]);
              } else if (selectedBook && selectedChapter) {
                const title = `${selectedBook.name} ${selectedChapter}`;
                setScheduleItems([...scheduleItems, { id: `schedule-${Date.now()}`, type: "bible", itemId: `${selectedBook.id}-${selectedChapter}`, title, order: scheduleItems.length + 1 }]);
              }
            }}><Plus className="h-3 w-3" /></Button></div>
            <ScrollArea className="flex-1">
              {scheduleItems.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm py-8"><ListMusic className="h-8 w-8 mx-auto mb-2 opacity-50" /><p>No items in schedule</p><p className="text-xs mt-1">Add songs or Bible passages</p></div>
              ) : (
                <div className="p-2 space-y-1">
                  {scheduleItems.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-2 p-2 rounded hover:bg-accent/10 cursor-pointer">
                      <span className="text-xs text-muted-foreground w-5">{idx + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.type}</div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setScheduleItems(scheduleItems.filter(s => s.id !== item.id))}><X className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </aside>
        )}

        <main className="flex-1 overflow-auto">
          <div className="p-4 space-y-4">
            {activeTab === "songs" && selectedSong && (
              <>
                {editorMode === "text" && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Lyrics Editor</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <textarea
                        className="w-full h-48 p-3 rounded-md border border-input bg-background font-mono text-sm resize-none"
                        placeholder="Type or paste lyrics here..."
                        value={lyricsEditorContent}
                        onChange={(e) => setLyricsEditorContent(e.target.value)}
                      />
                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm" onClick={() => setShowTranslationPanel(!showTranslationPanel)}><TypeIcon className="h-3 w-3 mr-1" /> Translation</Button>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Word count: {lyricsEditorContent.split(/\s+/).filter(Boolean).length}</span>
                        </div>
                      </div>
                      {showTranslationPanel && (
                        <Card className="bg-muted/50">
                          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TypeIcon className="h-3 w-3" /> Translation</CardTitle></CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Checkbox id="bilingual" checked={bilingualEnabled} onCheckedChange={(c) => setBilingualEnabled(!!c)} />
                                <label htmlFor="bilingual" className="text-xs">Show bilingual globally</label>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm">Update</Button>
                                <Button variant="outline" size="sm">Remove</Button>
                              </div>
                            </div>
                            <textarea
                              className="w-full h-32 p-3 rounded-md border border-input bg-background font-mono text-sm resize-none"
                              placeholder="Translated lyrics will appear here..."
                              value={translationContent}
                              onChange={(e) => setTranslationContent(e.target.value)}
                            />
                          </CardContent>
                        </Card>
                      )}
                    </CardContent>
                  </Card>
                )}
                {editorMode === "buttons" && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Lyrics Editor (Buttons)</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-4 gap-2">
                        {selectedSong?.lyrics?.map((line, index) => (
                          <Button key={index} variant="outline" size="sm" className="text-left h-auto py-2 px-3">
                            <span className="text-xs">{line}</span>
                          </Button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Add Line</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {selectedBook && (
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
                      {isFetchingLyrics ? (
                        <div className="text-white flex items-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          Loading Bible content...
                        </div>
                      ) : (
                        <div className="text-white" style={{ fontSize: `${fontSize}px`, lineHeight: lineSpacing, textTransform: textTransform, textAlign: hAlign }}>{getPreviewContent().split('\n').map((line, i) => <p key={i}>{line}</p>)}</div>
                      )}
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
                <div className="grid grid-cols-3 gap-2">
                  <Label className="col-span-3 text-xs text-muted-foreground">Lines per Page</Label>
                  <div className="col-span-3 flex gap-1">
                    {[1,2,3,4,5,6].map(n => <Button key={n} variant={linesPerPage === n ? "secondary" : "outline"} size="sm" className="flex-1" onClick={() => setLinesPerPage(n)}>{n}</Button>)}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Label className="col-span-3 text-xs text-muted-foreground">Display Mode</Label>
                  <div className="col-span-3 flex gap-1">
                    <Button variant={displayMode === "full" ? "secondary" : "outline"} size="sm" className="flex-1" onClick={() => setDisplayMode("full")}>FS</Button>
                    <Button variant={displayMode === "lt" ? "secondary" : "outline"} size="sm" className="flex-1" onClick={() => setDisplayMode("lt")}>LT</Button>
                    <Button variant={displayMode === "custom" ? "secondary" : "outline"} size="sm" className="flex-1" onClick={() => setDisplayMode("custom")}>Custom</Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <Label className="col-span-4 text-xs text-muted-foreground">Background</Label>
                  <div className="col-span-4 flex gap-1">
                    <Button variant={bgType === "solid" ? "secondary" : "outline"} size="sm" className="flex-1" onClick={() => setBgType("solid")}>BG</Button>
                    <Button variant={bgType === "gradient" ? "secondary" : "outline"} size="sm" className="flex-1" onClick={() => setBgType("gradient")}>GB</Button>
                    <Button variant="outline" size="sm" className="flex-1">Image</Button>
                    <Button variant="outline" size="sm" className="flex-1">Video</Button>
                  </div>
                </div>
                <div className="space-x-2"><Label>Color:</Label><Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 p-0.5" /><span className="text-sm text-muted-foreground">{bgColor}</span></div>
                <div className="grid grid-cols-2 gap-4"><div className="flex items-center justify-between p-3 rounded-lg bg-muted"><Label className="text-sm">Auto Advance</Label><Switch checked={autoAdvance} onCheckedChange={setAutoAdvance} /></div><div className="flex items-center justify-between p-3 rounded-lg bg-muted"><Label className="text-sm">Auto Go Live</Label><Switch checked={autoGoLive} onCheckedChange={setAutoGoLive} /></div></div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Hidden file inputs */}
      <input type="file" id="import-file" hidden multiple onChange={(e) => handleImportSongs()} />
    </div>
  );
}