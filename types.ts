
export enum Trigger {
  People = '人',
  Place = '場所',
  Emotion = '感情',
  Money = 'お金',
  Other = 'その他',
}

export enum CopingStrategyType {
  Timer = '10分待つ',
  Breathing = '1分呼吸法',
  Alternative = '置き換え行動',
  UrgeSurfing = '衝動の波乗り',
  Contact = '誰かに連絡',
}

export interface CopingStrategy {
  id: string;
  type: CopingStrategyType;
  title: string;
  description: string;
}

export interface UrgeEvent {
  id: string;
  strength: number; // 0-10
  triggers: Trigger[];
  memo: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  usedStrategies: CopingStrategyType[];
  effectiveness: number; // -3 to +3
  savedAmount?: number;
}

export interface MoodLog {
  id: string;
  moodIcon: string;
  bodySensation: string;
  color: string;
  strength: number; // 0-10
  memo: string;
  timestamp: string; // ISO string
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface AppData {
  urgeEvents: UrgeEvent[];
  moodLogs: MoodLog[];
  aiChatHistory: AIChatMessage[];
  settings: {
    nickname: string;
  };
}