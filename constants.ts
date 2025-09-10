
import { CopingStrategy, CopingStrategyType, Trigger } from './types';

export const ALL_TRIGGERS: Trigger[] = [
  Trigger.People,
  Trigger.Place,
  Trigger.Emotion,
  Trigger.Money,
  Trigger.Other,
];

export const COPING_STRATEGIES: CopingStrategy[] = [
  {
    id: 'timer',
    type: CopingStrategyType.Timer,
    title: '10分待つタイマー',
    description: '衝動は一時的なもの。10分だけ時間を置いて、波が過ぎ去るのを待ってみましょう。',
  },
  {
    id: 'breathing',
    type: CopingStrategyType.Breathing,
    title: '1分間の深呼吸',
    description: 'ゆっくりと息を吸い、長く吐き出します。心を落ち着かせ、今この瞬間に集中しましょう。',
  },
  {
    id: 'alternative',
    type: CopingStrategyType.Alternative,
    title: '別の行動をする',
    description: '散歩、音楽、簡単な片付けなど、少しでも気持ちが切り替わることを試してみませんか。',
  },
  {
    id: 'urge-surfing',
    type: CopingStrategyType.UrgeSurfing,
    title: '衝動の波乗り',
    description: 'この衝動を観察してみましょう。どんな感覚ですか？判断せず、ただ波のように現れては消えるのを見守ります。',
  },
  {
    id: 'contact',
    type: CopingStrategyType.Contact,
    title: '誰かに一言連絡',
    description: '信頼できる友人や家族に「今、少し大変」と一言送るだけでも、気持ちが楽になることがあります。',
  },
];

export const AI_SYSTEM_PROMPT = `あなたは、ギャンブルの衝動に悩む人を支える優しい伴走者。CBTの基本に沿い、短く具体的に、非難せず提案します。出力構成：共感1文／いま試せること（最大3つ、各1行）／1つだけ選ぶなら…／締めの応援1文。スタイル：丁寧でフラット、絵文字は必要なときに1つまで。診断や金融助言やギャンブル手法の言及はしない。自傷や希死念慮が示唆されたら、緊急性の確認→安全な場所の確保→地域の支援窓口案内→短いセルフケアの順で案内。`;
