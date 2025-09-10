
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI, Content } from '@google/genai';
import { AppData, Trigger, UrgeEvent, MoodLog, AIChatMessage } from './types';
import { ALL_TRIGGERS, COPING_STRATEGIES, AI_SYSTEM_PROMPT } from './constants';
import { loadData, saveData } from './services/storageService';
import { HomeIcon, ChartIcon, HistoryIcon, ChatIcon, SettingsIcon, PlusIcon } from './components/icons';
import UrgeStrengthChart from './components/charts/UrgeStrengthChart';
import TriggerBarChart from './components/charts/TriggerBarChart';
import ActivityHeatmap from './components/charts/ActivityHeatmap';

type Page = 'home' | 'urge' | 'chat' | 'log' | 'history' | 'analytics' | 'settings' | 'sos';

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(loadData());
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentUrge, setCurrentUrge] = useState<Partial<UrgeEvent> | null>(null);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const addUrgeEvent = (event: Omit<UrgeEvent, 'id'>) => {
    const newEvent: UrgeEvent = { ...event, id: new Date().toISOString() };
    setData(prev => ({ ...prev, urgeEvents: [...prev.urgeEvents, newEvent] }));
  };
  
  const addMoodLog = (log: Omit<MoodLog, 'id'>) => {
    const newLog: MoodLog = { ...log, id: new Date().toISOString() };
    setData(prev => ({ ...prev, moodLogs: [...prev.moodLogs, newLog] }));
    setCurrentPage('history');
  };

  const addChatMessage = (message: Omit<AIChatMessage, 'id'>) => {
    const newMessage: AIChatMessage = { ...message, id: new Date().toISOString() };
    setData(prev => ({...prev, aiChatHistory: [...prev.aiChatHistory, newMessage]}));
  };
  
  const PageRenderer = () => {
    switch (currentPage) {
      case 'home': return <HomePage onStartUrgeFlow={() => {
          setCurrentUrge({ startTime: new Date().toISOString() });
          setCurrentPage('urge');
        }}
        onStartMoodLog={() => setCurrentPage('log')}
        data={data}
        />;
      case 'urge': return <UrgeFlowPage 
        urge={currentUrge}
        onComplete={(urge) => {
            addUrgeEvent(urge);
            setCurrentUrge(null);
            setCurrentPage('home');
        }} 
        onCancel={() => {
            setCurrentUrge(null);
            setCurrentPage('home');
        }}/>;
      case 'chat': return <AIChatPage history={data.aiChatHistory} onNewMessage={addChatMessage} />;
      case 'log': return <MoodLogPage onSave={addMoodLog} />;
      case 'history': return <HistoryPage urgeEvents={data.urgeEvents} moodLogs={data.moodLogs}/>;
      case 'analytics': return <AnalyticsPage data={data} />;
      case 'settings': return <SettingsPage data={data} setData={setData} navigate={setCurrentPage} />;
      case 'sos': return <SOSPage />;
      default: return <HomePage onStartUrgeFlow={() => setCurrentPage('urge')} onStartMoodLog={() => setCurrentPage('log')} data={data} />;
    }
  };

  return (
    <div className="bg-soft-gray min-h-screen font-sans text-primary-text flex flex-col">
      <main className="flex-grow p-4 pb-24">
        <PageRenderer />
      </main>
      <BottomNav activePage={currentPage} setActivePage={setCurrentPage} />
    </div>
  );
};

// --- Sub-Components & Pages ---

// A simple card component for the home page
const InfoCard: React.FC<{title: string; value: string | number; unit: string; color: string}> = ({title, value, unit, color}) => (
    <div className={`bg-white p-4 rounded-xl shadow-md flex-1`}>
        <p className="text-sm text-secondary-text">{title}</p>
        <p className="text-2xl font-bold" style={{color}}>
            {value} <span className="text-lg font-medium">{unit}</span>
        </p>
    </div>
);

const HomePage: React.FC<{onStartUrgeFlow: () => void; onStartMoodLog: () => void; data: AppData}> = ({ onStartUrgeFlow, onStartMoodLog, data }) => {
    const nonGamblingDays = useMemo(() => {
        if (data.urgeEvents.length === 0) return 0;
        const lastEventDate = new Date(data.urgeEvents[data.urgeEvents.length-1].startTime);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastEventDate.getTime());
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }, [data.urgeEvents]);

    const savedAmount = useMemo(() => {
        return data.urgeEvents.reduce((total, event) => total + (event.savedAmount || 0), 0);
    }, [data.urgeEvents]);

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
            <h1 className="text-2xl font-bold text-center text-primary-text">こんにちは、{data.settings.nickname}さん</h1>
            <div className="w-full flex gap-4">
                <InfoCard title="連続しなかった日数" value={nonGamblingDays} unit="日" color="#68D391"/>
                <InfoCard title="推定節約金額" value={savedAmount.toLocaleString()} unit="円" color="#63B3ED"/>
            </div>
            <button
              onClick={onStartUrgeFlow}
              className="w-full bg-accent-action text-white font-bold py-6 px-4 rounded-2xl shadow-lg hover:bg-orange-500 transition-all transform hover:scale-105"
            >
              <span className="text-2xl">ギャンブルしたい</span>
              <p className="font-normal text-sm">波を乗りこなすお手伝いをします</p>
            </button>
            <button onClick={onStartMoodLog} className="flex items-center gap-2 bg-white text-accent-calm font-semibold py-3 px-6 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                <PlusIcon className="w-5 h-5" />
                <span>今の気持ちを記録する</span>
            </button>
        </div>
    );
};

const UrgeFlowPage: React.FC<{urge: Partial<UrgeEvent> | null; onComplete: (urge: Omit<UrgeEvent, 'id'>) => void; onCancel: () => void; }> = ({ urge, onComplete, onCancel }) => {
    const [step, setStep] = useState(1);
    const [strength, setStrength] = useState(5);
    const [triggers, setTriggers] = useState<Trigger[]>([]);
    const [memo, setMemo] = useState('');
    const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
    const [effectiveness, setEffectiveness] = useState(0);
    const [savedAmount, setSavedAmount] = useState('');

    const toggleTrigger = (trigger: Trigger) => {
        setTriggers(prev => prev.includes(trigger) ? prev.filter(t => t !== trigger) : [...prev, trigger]);
    };
    
    const handleComplete = () => {
        if (!urge?.startTime) return;
        onComplete({
            startTime: urge.startTime,
            endTime: new Date().toISOString(),
            strength,
            triggers,
            memo,
            usedStrategies: selectedStrategy ? [COPING_STRATEGIES.find(s=>s.id === selectedStrategy)!.type] : [],
            effectiveness,
            savedAmount: Number(savedAmount) || 0,
        });
    };

    if (step === 1) { // Strength and Triggers
        return (
            <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold">今の衝動の強さは？</h2>
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <input type="range" min="0" max="10" value={strength} onChange={e => setStrength(parseInt(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-action" />
                    <p className="text-center text-5xl font-bold mt-2 text-accent-action">{strength}</p>
                </div>
                <h2 className="text-xl font-semibold">きっかけはありましたか？ (複数選択可)</h2>
                <div className="grid grid-cols-2 gap-3">
                    {ALL_TRIGGERS.map(trigger => (
                        <button key={trigger} onClick={() => toggleTrigger(trigger)} className={`p-4 rounded-lg text-center font-semibold transition-colors ${triggers.includes(trigger) ? 'bg-accent-calm text-white' : 'bg-white'}`}>
                            {trigger}
                        </button>
                    ))}
                </div>
                <button onClick={() => setStep(2)} className="w-full bg-accent-calm text-white font-bold py-3 px-4 rounded-lg shadow-md">次へ</button>
                <button onClick={onCancel} className="w-full text-secondary-text mt-2">キャンセル</button>
            </div>
        );
    }
    
    if (step === 2) { // Coping Strategies
        return (
            <div className="space-y-4 animate-fade-in">
                <h2 className="text-xl font-semibold">試してみましょう</h2>
                <p className="text-secondary-text">ひとつ選んで、少しだけ時間をとってみませんか。</p>
                {COPING_STRATEGIES.map(strategy => (
                    <div key={strategy.id} onClick={() => { setSelectedStrategy(strategy.id); setStep(3); }} className="bg-white p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                        <h3 className="font-bold text-lg text-accent-calm">{strategy.title}</h3>
                        <p className="text-secondary-text text-sm mt-1">{strategy.description}</p>
                    </div>
                ))}
                 <button onClick={() => setStep(3)} className="w-full text-secondary-text mt-4">スキップして記録</button>
            </div>
        );
    }
    
    if (step === 3) { // Feedback
        return (
            <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold">おつかれさまでした</h2>
                <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
                     <div>
                        <label className="font-semibold block mb-2">今回節約できた金額 (任意)</label>
                        <input type="number" value={savedAmount} onChange={e => setSavedAmount(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="1000" />
                    </div>
                    <div>
                        <label className="font-semibold block mb-2">ひとことメモ (任意)</label>
                        <textarea value={memo} onChange={e => setMemo(e.target.value)} className="w-full p-2 border rounded-lg h-24" placeholder="今の気持ちや状況など..."></textarea>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <label className="font-semibold block mb-2">対処法は役に立ちましたか？</label>
                    <div className="flex justify-between items-center text-secondary-text">
                        <span>あまり...</span>
                        <span>すごく！</span>
                    </div>
                    <input type="range" min="-3" max="3" value={effectiveness} onChange={e => setEffectiveness(parseInt(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-positive" />
                    <p className="text-center text-2xl font-bold mt-2 text-accent-positive">{effectiveness > 0 ? `+${effectiveness}` : effectiveness}</p>
                </div>
                <button onClick={handleComplete} className="w-full bg-accent-positive text-white font-bold py-3 px-4 rounded-lg shadow-md">記録して終了</button>
            </div>
        )
    }
    return null;
};

const AIChatPage: React.FC<{history: AIChatMessage[], onNewMessage: (message: Omit<AIChatMessage, 'id'>) => void;}> = ({history, onNewMessage}) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY! }), []);

    const handleSend = async () => {
        if (isLoading || !input.trim()) return;
        
        const userInput = input.trim();
        onNewMessage({ role: 'user', text: userInput, timestamp: new Date().toISOString() });
        setInput('');
        setIsLoading(true);

        try {
            // Create a temporary history for the API call to include the latest message.
            const currentHistory = [...history, { role: 'user', text: userInput, id: '', timestamp: '' }];

            const contents: Content[] = currentHistory.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.text }],
            }));
            
            const geminiResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: contents,
                config: {
                    systemInstruction: AI_SYSTEM_PROMPT,
                    temperature: 0.7,
                    topP: 0.95,
                }
            });

            const aiText = geminiResponse.text;
            if (aiText) {
                onNewMessage({ role: 'assistant', text: aiText, timestamp: new Date().toISOString() });
            } else {
                throw new Error("Received empty response from AI.");
            }
        } catch (e) {
            console.error("Error calling Gemini API:", e);
            const errorMessage = "申し訳ありません、エラーが発生しました。サーバーとの通信でエラーが発生しました。";
            onNewMessage({ role: 'assistant', text: errorMessage, timestamp: new Date().toISOString() });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
            <h2 className="text-xl font-bold text-primary-text mb-4 text-center">AI相談</h2>
            <div className="flex-grow overflow-y-auto bg-white rounded-xl shadow-md p-4 space-y-4">
                {history.length === 0 && <p className="text-center text-secondary-text">どんなことでも、話してみてください。</p>}
                {history.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-accent-calm text-white' : 'bg-gray-200'}`}>
                            <p style={{whiteSpace: 'pre-wrap'}}>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-xs px-4 py-2 rounded-2xl bg-gray-200 animate-pulse">
                           <div className="h-4 w-24 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-4 flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="気持ちを言葉にしてみましょう..."
                    className="flex-grow p-3 border rounded-full shadow-sm"
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-accent-calm text-white p-3 rounded-full shadow-md disabled:bg-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
            </div>
        </div>
    );
};

const MoodLogPage: React.FC<{onSave: (log: Omit<MoodLog, 'id'>) => void;}> = ({onSave}) => {
    const [moodIcon, setMoodIcon] = useState('😊');
    const [bodySensation, setBodySensation] = useState('');
    const [color, setColor] = useState('#63B3ED');
    const [strength, setStrength] = useState(5);
    const [memo, setMemo] = useState('');

    const moods = ['😊', '🙂', '😐', '😕', '😔', '😠', '😥', '😌'];
    const colors = ['#F6AD55', '#68D391', '#63B3ED', '#A0AEC0', '#F56565', '#B794F4'];

    const handleSave = () => {
        onSave({ moodIcon, bodySensation, color, strength, memo, timestamp: new Date().toISOString() });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-center">今の気持ちを記録</h2>
             <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
                <div>
                    <label className="font-semibold block mb-2">気分アイコン</label>
                    <div className="flex flex-wrap gap-2">
                        {moods.map(m => <button key={m} onClick={() => setMoodIcon(m)} className={`text-3xl p-2 rounded-lg ${moodIcon === m ? 'bg-soft-blue' : ''}`}>{m}</button>)}
                    </div>
                </div>
                 <div>
                    <label className="font-semibold block mb-2">体の感覚</label>
                    <input type="text" value={bodySensation} onChange={e=>setBodySensation(e.target.value)} placeholder="例：胸がそわそわする" className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                    <label className="font-semibold block mb-2">今の気分を色で表すと？</label>
                     <div className="flex flex-wrap gap-2">
                        {colors.map(c => <button key={c} onClick={() => setColor(c)} style={{backgroundColor: c}} className={`w-10 h-10 rounded-full ${color === c ? 'ring-2 ring-offset-2 ring-black' : ''}`}></button>)}
                    </div>
                </div>
                <div>
                    <label className="font-semibold block mb-2">強さ</label>
                    <input type="range" min="0" max="10" value={strength} onChange={e => setStrength(parseInt(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer" style={{accentColor: color}}/>
                    <p className="text-center text-4xl font-bold mt-2" style={{color: color}}>{strength}</p>
                </div>
                 <div>
                    <label className="font-semibold block mb-2">ひとことメモ (任意)</label>
                    <textarea value={memo} onChange={e => setMemo(e.target.value)} className="w-full p-2 border rounded-lg h-20"></textarea>
                </div>
            </div>
            <button onClick={handleSave} className="w-full bg-accent-positive text-white font-bold py-3 px-4 rounded-lg shadow-md">保存する</button>
        </div>
    );
};


const HistoryPage: React.FC<{urgeEvents: UrgeEvent[], moodLogs: MoodLog[]}> = ({urgeEvents, moodLogs}) => {
    const combinedHistory = useMemo(() => {
        const urges = urgeEvents.map(e => ({...e, type: 'urge' as const, timestamp: e.startTime}));
        const moods = moodLogs.map(l => ({...l, type: 'mood' as const}));
        return [...urges, ...moods].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [urgeEvents, moodLogs]);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">履歴</h2>
            {combinedHistory.length === 0 ? (
                <p className="text-center text-secondary-text mt-8">まだ記録がありません。</p>
            ) : (
                combinedHistory.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-md">
                        {item.type === 'urge' ? (
                            <div>
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-accent-action">衝動の記録</p>
                                    <p className="text-sm text-secondary-text">{new Date(item.timestamp).toLocaleString('ja-JP')}</p>
                                </div>
                                <p>強さ: {item.strength}/10</p>
                                <p>きっかけ: {item.triggers.join(', ') || 'なし'}</p>
                                {item.savedAmount && item.savedAmount > 0 && <p>節約金額: {item.savedAmount.toLocaleString()}円</p>}
                            </div>
                        ) : (
                             <div>
                                <div className="flex justify-between items-center">
                                    <p className="font-bold" style={{color: item.color || '#000'}}>気持ちの記録 {item.moodIcon}</p>
                                    <p className="text-sm text-secondary-text">{new Date(item.timestamp).toLocaleString('ja-JP')}</p>
                                </div>
                                <p>感覚: {item.bodySensation || 'なし'}</p>
                                <p>メモ: {item.memo || 'なし'}</p>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

const AnalyticsPage: React.FC<{data: AppData}> = ({data}) => {
    const summary = useMemo(() => {
        if (data.urgeEvents.length < 3) return "記録を続けると、あなたのパターンが見えてきます。";
        const highUrgeDays = data.urgeEvents.filter(e => e.strength > 7).length;
        if(highUrgeDays > data.urgeEvents.length / 2) return "強い衝動を感じることが多いようです。大変な時はSOSページも頼ってください。";
        return "落ち着いて対処できている日が多いようです。その調子です。";
    }, [data.urgeEvents]);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">分析</h2>
            <div className="bg-soft-blue p-4 rounded-xl text-center">
                <p className="font-semibold">{summary}</p>
            </div>
            {data.urgeEvents.length > 0 ? (
                <>
                    <UrgeStrengthChart data={data.urgeEvents} />
                    <TriggerBarChart data={data.urgeEvents} />
                    <ActivityHeatmap data={data.urgeEvents} />
                </>
            ) : (
                 <p className="text-center text-secondary-text mt-8">分析できるデータがまだありません。</p>
            )}
        </div>
    );
};

const SettingsPage: React.FC<{data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>, navigate: (page: Page) => void}> = ({ data, setData, navigate }) => {
    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({...prev, settings: {...prev.settings, nickname: e.target.value}}));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">設定</h2>
             <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
                 <div>
                    <label className="font-semibold block mb-2">ニックネーム</label>
                    <input type="text" value={data.settings.nickname} onChange={handleNicknameChange} className="w-full p-2 border rounded-lg" />
                </div>
             </div>
             <div className="bg-white p-4 rounded-xl shadow-md space-y-2">
                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">通知設定（ダミー）</button>
                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">プライバシーポリシー</button>
                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">パスコード/FaceID（ダミー）</button>
                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">データのエクスポート（ダミー）</button>
             </div>
             <div className="bg-white p-4 rounded-xl shadow-md">
                <button onClick={() => navigate('sos')} className="w-full text-left p-2 text-red-600 font-bold hover:bg-red-50 rounded">SOS / 緊急時の相談窓口</button>
             </div>
        </div>
    );
};

const SOSPage: React.FC = () => (
    <div className="space-y-4 text-center">
        <h2 className="text-2xl font-bold text-red-600">つらい時は、ひとりで抱えずに</h2>
        <p className="text-secondary-text">あなたの安全が第一です。専門の窓口に相談することができます。</p>
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <h3 className="font-bold">一般的な相談窓口の例</h3>
            <p>このアプリは医療の代替ではありません。以下は一般的な情報提供であり、特定の機関を推奨するものではありません。</p>
            <a href="#" className="block w-full bg-accent-positive text-white font-bold py-3 px-4 rounded-lg shadow-md">
                地域の精神保健福祉センターを探す（外部リンク）
            </a>
            <a href="#" className="block w-full bg-accent-calm text-white font-bold py-3 px-4 rounded-lg shadow-md">
                ギャンブル等依存症問題啓発週間サイト（外部リンク）
            </a>
            <p className="text-sm text-secondary-text mt-4">もし、ご自身の安全が脅かされていると感じる場合は、すぐに警察(110)や救急(119)に連絡してください。</p>
        </div>
    </div>
);


const BottomNav: React.FC<{ activePage: Page; setActivePage: (page: Page) => void }> = ({ activePage, setActivePage }) => {
  const navItems = [
    { page: 'history', icon: HistoryIcon, label: '履歴' },
    { page: 'analytics', icon: ChartIcon, label: '分析' },
    { page: 'home', icon: HomeIcon, label: 'ホーム' },
    { page: 'chat', icon: ChatIcon, label: '相談' },
    { page: 'settings', icon: SettingsIcon, label: '設定' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around items-end max-w-lg mx-auto">
        {navItems.map(item => {
            const isActive = activePage === item.page;
            const isHome = item.page === 'home';
            return (
                <button
                key={item.page}
                onClick={() => setActivePage(item.page)}
                className={`flex flex-col items-center justify-center pt-2 pb-1 text-xs transition-colors duration-200 ${isHome ? '-translate-y-4' : ''}`}
                >
                <div className={`p-4 rounded-full transition-all duration-200 ${isHome ? 'bg-accent-action shadow-lg' : ''} ${isActive && !isHome ? 'bg-soft-blue' : ''}`}>
                    <item.icon className={`h-7 w-7 ${isHome ? 'text-white' : (isActive ? 'text-accent-calm' : 'text-gray-400')}`} />
                </div>
                {!isHome && <span className={`mt-1 font-semibold ${isActive ? 'text-accent-calm' : 'text-gray-500'}`}>{item.label}</span>}
                </button>
            );
        })}
      </div>
    </nav>
  );
};

export default App;
