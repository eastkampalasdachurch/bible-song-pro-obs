export interface DisplayInfo {
  id: number;
  label: string;
  width: number;
  height: number;
  x: number;
  y: number;
  isPrimary: boolean;
  isInternal: boolean;
}

export interface ServerInfo {
  httpPort: number;
  relayPort: number;
  preferredHost: string;
  availableHosts: string[];
  displayPath: string;
  displayUrl: string;
  relayUrl: string;
}

export interface SystemStats {
  platform: string;
  arch: string;
  electronVersion: string;
  memory: {
    total: number;
    free: number;
    percent: number;
  };
  cpu: {
    percent: number;
  };
  gpu: {
    renderer: string;
    vram: string;
  };
}

export interface OutputOptions {
  source?: string;
  scene?: string;
  hidden?: boolean;
  index?: number;
  output?: string;
  transform?: {
    positionX: number;
    positionY: number;
    scaleX: number;
    scaleY: number;
    cropLeft: number;
    cropTop: number;
    cropRight: number;
    cropBottom: number;
    rotation: number;
    boundsWidth: number;
    boundsHeight: number;
  };
}

export interface BSPDesktop {
  getDisplayInfo: () => DisplayInfo;
  getServerInfo: () => ServerInfo;
  getSystemStats: () => SystemStats;
  openDisplay: (index: number) => Promise<void>;
  closeDisplay: (index: number) => Promise<void>;
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  onNotify: (callback: (event: string, data: unknown) => void) => void;
}

export interface JsonResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export interface IssuePayload {
  title: string;
  body: string;
  labels?: string[];
}

export interface GitHubIssueResult {
  number: number;
  html_url: string;
}