// @ts-nocheck

export const CHANNEL_NAME = 'bible_song_pro_v1';

export const HOST_MODE_OBS = 'obs';
export const HOST_MODE_VMIX = 'vmix';
export const HOST_MODE_STANDALONE = 'standalone';

export const BSP_GITHUB_REPO_URL = 'https://github.com/eastkampalasdachurch/bible-song-pro-obs';
export const BSP_GITHUB_ISSUES_URL = `${BSP_GITHUB_REPO_URL}/issues`;
export const BSP_CONTACT_URL = 'https://www.instagram.com/eastkampalasdachurch';
export const BSP_LEGACY_LOCAL_FEEDBACK_API_URL = 'http://127.0.0.1:8787/api/github-feedback';
export const BSP_DEFAULT_FEEDBACK_API_URL = 'https://bible-song-pro-feedback.johnbatey-bsp.workers.dev/api/github-feedback';

export const VMIX_OUTPUT_MODE_DEDICATED = 'dedicated-input';
export const VMIX_OUTPUT_MODE_OVERLAY = 'overlay';
export const VMIX_OUTPUT_MODE_MANUAL = 'manual';

export const DB_NAME = 'bible-song-pro';
export const DB_VERSION = 1;
export const STORE_SONGS = 'songs';
export const STORE_BIBLES = 'bibles';
export const STORE_STATE = 'state';

export const REMOTE_SHOW_PROTOCOL_VERSION = 1;
export const REMOTE_SHOW_PAIR_CODE_LENGTH = 6;
export const REMOTE_SHOW_DEFAULT_PORT = 5510;
export const RELAY_DEFAULT_PORT = 5511;

export const SYNC_MIRROR_DB_NAME = 'bible-song-pro-sync';
export const SYNC_MIRROR_DB_VERSION = 1;
export const SYNC_MIRROR_STORE = 'messages';
export const SYNC_MIRROR_LAST_KEY = 'last';

export const BG_SETTINGS_KEYS = [
  'bgType', 'bgImageSource', 'bgImageUrl', 'bgUploadDataUrl',
  'bgVideoSource', 'bgVideoUrl', 'bgVideoUploadDataUrl',
  'bgVideoLoop', 'bgVideoSpeed', 'bgMode', 'bgColor',
  'bgGradientShadow', 'bgGradientHighlight', 'bgBlur', 'bgEdgeFix',
  'bgOpacity', 'bgOpacityFull', 'bgOpacityLT', 'bgY', 'bgToggle',
  'animateBgTransitions', 'bgGradientAngle'
];

export const ANIMATION_SETTINGS_KEYS = [
  'songTransitionType',
  'songTransitionDuration',
  'animateBgTransitions'
];

export const TYPOGRAPHY_SETTINGS_KEYS = [
  'fontFamily',
  'fontWeight',
  'fontSizeFull',
  'fullTextTransform',
  'ltFontSongs',
  'ltFontBible',
  'ltFontCustom',
  'refFontSize',
  'lineHeightFull',
  'lineHeightLT',
  'textColor',
  'refColor',
  'refBgColor'
];

export const MODE_SETTINGS_KEYS = [
  'fontSizeFull',
  'lineHeightFull',
  'fullTextTransform',
  'autoResizeFull',
  'autoResizeLT',
  'refPositionFull',
  'hAlignFullRef',
  'hAlignFull',
  'vAlignFull',
  'ltFontSongs',
  'ltFontBible',
  'ltFontCustom',
  'lineHeightLT',
  'hAlignLTSongs',
  'vAlignLTSongs',
  'ltAnchorMode',
  'ltScalePct',
  'hAlignLTBible',
  'vAlignLTBible',
  'hAlignLTBibleVerse',
  'autoAdjustLtHeight',
  'refBgColor',
  'refBgEnabled',
  'ltRefFontSize',
  'referenceShadowEnabled',
  'verseShadowEnabled',
  'referenceTextCapitalized',
  'showVersion',
  'shortenBibleVersions',
  'shortenBibleBooks',
  'showVerseNos',
  'versionSwitchUpdatesLive',
  'dualVersionModeEnabled',
  'dualVersionSecondaryId'
];

export const DEFAULT_SONG_BILINGUAL_SETTINGS = {
  bilingualEnabled: false,
  displayMode: 'stacked',
  translationMode: 'free',
  autoTranslateOnImport: true,
  autoTranslateOnOpen: true,
  targetLanguage: 'fr',
  sourceLanguage: 'auto',
  secondaryFontScale: 0.76,
  cacheTranslationsLocally: true,
  freeTranslationApiUrl: 'https://translate.googleapis.com/translate_a/single',
  translationApiUrl: '',
  translationApiKey: ''
};

export const DEFAULT_SETLIST_SETTINGS = {
  autoGoLiveOnSelect: false,
  advancePreviewAfterLive: true
};

export const SONG_TRANSLATION_LANGUAGES = [
  { code: 'auto', label: 'Auto Detect' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'nl', label: 'Dutch' },
  { code: 'pl', label: 'Polish' },
  { code: 'ru', label: 'Russian' },
  { code: 'uk', label: 'Ukrainian' },
  { code: 'tr', label: 'Turkish' },
  { code: 'ar', label: 'Arabic' },
  { code: 'fa', label: 'Persian' },
  { code: 'he', label: 'Hebrew' },
  { code: 'hi', label: 'Hindi' },
  { code: 'bn', label: 'Bengali' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'ur', label: 'Urdu' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'kn', label: 'Kannada' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'mr', label: 'Marathi' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'id', label: 'Indonesian' },
  { code: 'ms', label: 'Malay' },
  { code: 'sw', label: 'Swahili' },
  { code: 'yo', label: 'Yoruba' },
  { code: 'ig', label: 'Igbo' },
  { code: 'ha', label: 'Hausa' },
  { code: 'zu', label: 'Zulu' },
  { code: 'xh', label: 'Xhosa' }
];

export const DEFAULT_SONG_FULL_FONT = 40;
export const DEFAULT_BIBLE_FULL_FONT = 55;
export const SINGLE_BIBLE_FULL_MAX_FONT = 60;
export const SINGLE_BIBLE_LT_MAX_FONT = 30;
export const DUAL_BIBLE_FULL_MAX_FONT = 36;
export const DUAL_BIBLE_LT_MAX_FONT = 23;
export const DEFAULT_SONG_FULL_LINE_HEIGHT = 1.2;
export const DEFAULT_BIBLE_FULL_LINE_HEIGHT = 1.1;

export const SEARCH_TABS = ['songs', 'bible', 'schedule'];
export const FOCUSED_WORKSPACE_TABS = ['songs', 'bible', 'schedule'];

export const DEFAULT_SEARCH_QUERIES = { songs: '', bible: '', schedule: '' };
export const MAX_BIBLE_RECENT_REFS = 20;
export const MAX_BIBLE_PINNED_REFS = 12;

export const THEME_ALIAS_MAP = Object.freeze({
  forest: 'neon-horizon',
  royal: 'midnight-bloom',
  daylight: 'paperlight',
  daylist: 'paperlight'
});

export const BIBLE_BOOKS = {
  gn: 'Genesis',
  ex: 'Exodus',
  lv: 'Leviticus',
  nm: 'Numbers',
  dt: 'Deuteronomy',
  js: 'Joshua',
  jg: 'Judges',
  rt: 'Ruth',
  '1sm': '1 Samuel',
  '2sm': '2 Samuel',
  '1ki': '1 Kings',
  '2ki': '2 Kings',
  '1ch': '1 Chronicles',
  '2ch': '2 Chronicles',
  ez: 'Ezra',
  ne: 'Nehemiah',
  es: 'Esther',
  jb: 'Job',
  ps: 'Psalm',
  pr: 'Proverbs',
  ec: 'Ecclesiastes',
  ss: 'Song of Solomon',
  is: 'Isaiah',
  jr: 'Jeremiah',
  lm: 'Lamentations',
  ek: 'Ezekiel',
  dn: 'Daniel',
  hs: 'Hosea',
  jl: 'Joel',
  am: 'Amos',
  ob: 'Obadiah',
  jn: 'Jonah',
  mc: 'Micah',
  nh: 'Nahum',
  hk: 'Habakkuk',
  zp: 'Zephaniah',
  hg: 'Haggai',
  zc: 'Zechariah',
  ml: 'Malachi',
  mt: 'Matthew',
  mk: 'Mark',
  lk: 'Luke',
  jn: 'John',
  at: 'Acts',
  rm: 'Romans',
  '1co': '1 Corinthians',
  '2co': '2 Corinthians',
  gl: 'Galatians',
  ep: 'Ephesians',
  pp: 'Philippians',
  col: 'Colossians',
  '1th': '1 Thessalonians',
  '2th': '2 Thessalonians',
  '1ti': '1 Timothy',
  '2ti': '2 Timothy',
  tt: 'Titus',
  pm: 'Philemon',
  hb: 'Hebrews',
  jm: 'James',
  '1pt': '1 Peter',
  '2pt': '2 Peter',
  '1jn': '1 John',
  '2jn': '2 John',
  '3jn': '3 John',
  jd: 'Jude',
  rv: 'Revelation'
};