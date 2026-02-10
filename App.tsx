
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, WellbeingStats, AppUsage } from './types';
import { WELLBEING_DATA, MOCK_APPS } from './constants';
import { ChartCircle } from './components/ChartCircle';
import { BarChart } from './components/BarChart';
import { getWellbeingAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [accentColor, setAccentColor] = useState('#13eca4');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [aiAdvice, setAiAdvice] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' | 'error' } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeFocusMode, setActiveFocusMode] = useState(false);
  
  // New States for Modal Features
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFullAppList, setShowFullAppList] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [expandStats, setExpandStats] = useState(false);

  // Sync accent color to CSS Variable
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', accentColor);
  }, [accentColor]);

  // Handle Toast visibility
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
  }, []);

  const stats = useMemo(() => {
    if (timeRange === 'week') {
      return { 
        ...WELLBEING_DATA, 
        totalScreenTime: '38h 12m', 
        changeVsYesterday: -4, 
        dailyAverage: '5h 27m' 
      };
    }
    if (timeRange === 'month') {
      return { 
        ...WELLBEING_DATA, 
        totalScreenTime: '142h 5m', 
        changeVsYesterday: +2, 
        dailyAverage: '4h 45m' 
      };
    }
    return WELLBEING_DATA;
  }, [timeRange]);

  const handleAiInsight = async () => {
    setIsAiLoading(true);
    setCurrentView(View.AI_COACH);
    try {
      const advice = await getWellbeingAdvice(stats);
      setAiAdvice(advice);
      showToast("Coach generated new insights!", "success");
    } catch (err) {
      showToast("Failed to connect to AI Coach", "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  const NavItem = ({ view, icon, filled = true }: { view: View, icon: string, filled?: boolean }) => (
    <button 
      onClick={() => setCurrentView(view)}
      className={`group flex flex-col items-center gap-1 transition-all duration-300 relative ${currentView !== view ? 'opacity-50 hover:opacity-100' : ''}`}
    >
      <div className={`h-14 w-12 flex items-center justify-center rounded-full transition-colors ${currentView === view ? 'bg-primary/20' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}>
        <span className={`material-symbols-outlined ${filled ? '' : 'light'} ${currentView === view ? 'text-primary' : ''}`}>
          {icon}
        </span>
      </div>
      {currentView === view && <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full" />}
    </button>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
      
      {/* Modals Container */}
      {(showCalendar || showFullAppList || showProfile) && (
        <div className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-6">
           <div className="bg-surface-dark w-full max-w-lg rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden animate-slide-up relative">
              
              {/* Profile Modal */}
              {showProfile && (
                <div className="p-10">
                   <div className="flex flex-col items-center text-center gap-6 mb-10">
                      <div className="size-24 rounded-full border-4 border-primary p-1">
                        <img src="https://picsum.photos/seed/user-pro/200/200" className="size-full rounded-full object-cover" alt="Profile" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black tracking-tighter">Alex Johnson</h2>
                        <p className="text-primary font-bold uppercase tracking-widest text-xs">Premium Member</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4 mb-10">
                      <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Savings</p>
                        <p className="text-xl font-bold">12h 40m</p>
                      </div>
                      <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Focus Streak</p>
                        <p className="text-xl font-bold">14 Days</p>
                      </div>
                   </div>
                   <button onClick={() => setShowProfile(false)} className="w-full py-5 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl">Close Profile</button>
                </div>
              )}

              {/* Calendar Modal */}
              {showCalendar && (
                <div className="p-8">
                   <div className="flex justify-between items-center mb-8">
                     <h2 className="text-2xl font-black tracking-tighter">Select Date</h2>
                     <button onClick={() => setShowCalendar(false)} className="size-10 bg-white/5 rounded-full flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
                   </div>
                   <div className="grid grid-cols-7 gap-2 mb-8">
                      {['M','T','W','T','F','S','S'].map(d => <div key={d} className="text-center text-[10px] font-bold text-slate-500 p-2">{d}</div>)}
                      {Array.from({length: 31}).map((_, i) => (
                        <button 
                          key={i} 
                          className={`size-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${i === 14 ? 'bg-primary text-black' : 'hover:bg-white/5 text-slate-400'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                   </div>
                   <div className="flex items-center gap-4 bg-primary/10 border border-primary/20 p-4 rounded-2xl">
                     <span className="material-symbols-outlined text-primary">info</span>
                     <p className="text-xs font-bold text-primary">Viewing report for Oct 15, 2024</p>
                   </div>
                </div>
              )}

              {/* Full App List Modal */}
              {showFullAppList && (
                <div className="p-0 flex flex-col h-[80vh]">
                   <div className="p-8 border-b border-white/5 flex justify-between items-center shrink-0">
                      <h2 className="text-2xl font-black tracking-tighter">Detailed Usage</h2>
                      <button onClick={() => setShowFullAppList(false)} className="size-10 bg-white/5 rounded-full flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
                   </div>
                   <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {MOCK_APPS.concat(MOCK_APPS).map((app, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 group hover:border-primary/50 transition-all">
                           <div className="size-12 rounded-2xl flex items-center justify-center shrink-0 bg-black/20" style={{ color: app.color }}>
                             <span className="material-symbols-outlined text-2xl">{app.icon}</span>
                           </div>
                           <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <p className="font-extrabold">{app.name}</p>
                                <p className="text-sm font-bold text-primary">{app.time}</p>
                              </div>
                              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${(app.minutes / 240) * 100}%` }} />
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="p-6 bg-surface-dark-highlight shrink-0">
                      <button onClick={() => setShowFullAppList(false)} className="w-full py-4 bg-primary text-black font-black rounded-2xl uppercase tracking-widest text-[10px]">Return to dashboard</button>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] toast-active shadow-2xl">
          <div className={`px-6 py-3 rounded-full flex items-center gap-3 border backdrop-blur-md ${
            toast.type === 'success' ? 'bg-primary/10 border-primary text-primary' : 
            toast.type === 'error' ? 'bg-rose-500/10 border-rose-500 text-rose-500' : 
            'bg-blue-500/10 border-blue-500 text-blue-400'
          }`}>
            <span className="material-symbols-outlined text-[20px]">
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Sidebar Nav */}
      <nav className="h-full w-24 flex-shrink-0 flex flex-col items-center py-10 gap-10 border-r border-white/5 bg-background-dark z-20">
        <div className="size-14 rounded-full bg-primary flex items-center justify-center text-background-dark mb-4 shadow-[0_8px_20px_rgba(19,236,164,0.4)] cursor-pointer hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-3xl">spa</span>
        </div>
        <div className="flex flex-col gap-8 w-full items-center">
          <NavItem view={View.DASHBOARD} icon="dashboard" />
          <NavItem view={View.WEEKLY_INSIGHTS} icon="bar_chart" filled={false} />
          <button 
             onClick={handleAiInsight}
             className={`group flex flex-col items-center gap-1 transition-all duration-300 ${currentView === View.AI_COACH ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-100'}`}
          >
             <div className={`h-14 w-12 flex items-center justify-center rounded-full ${currentView === View.AI_COACH ? 'bg-primary/20' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}>
               <span className={`material-symbols-outlined ${isAiLoading ? 'animate-spin' : 'light'} ${currentView === View.AI_COACH ? 'text-primary' : ''}`}>
                 auto_awesome
               </span>
             </div>
          </button>
          <NavItem view={View.SETTINGS} icon="settings" filled={false} />
        </div>
        <div className="mt-auto">
          <button 
            onClick={() => setShowProfile(true)}
            className="size-14 rounded-full bg-surface-variant p-0.5 overflow-hidden border-2 border-primary/20 shadow-lg cursor-pointer hover:border-primary transition-all active:scale-90"
          >
            <img 
              alt="User" 
              className="w-full h-full rounded-full object-cover" 
              src="https://picsum.photos/seed/user-pro/120/120" 
            />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative flex flex-col bg-background-dark scroll-smooth">
        
        {currentView === View.DASHBOARD && (
          <div className="p-8 md:p-12 pb-32 max-w-4xl mx-auto w-full">
            <header className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-1">Focus & Wellbeing</h2>
                <h1 className="text-4xl font-extrabold tracking-tighter">Daily Report</h1>
              </div>
              <button 
                onClick={() => setShowCalendar(true)}
                className="size-12 rounded-2xl bg-surface-variant hover:bg-primary/10 hover:border-primary/50 flex items-center justify-center transition-all border border-white/5 group shadow-sm"
              >
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">calendar_month</span>
              </button>
            </header>

            {/* Time Range Selector */}
            <div className="flex gap-3 mb-12 bg-white/5 p-1.5 rounded-full w-fit">
              {(['today', 'week', 'month'] as const).map(range => (
                <button 
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`h-10 px-6 rounded-full text-[10px] font-black transition-all duration-300 uppercase tracking-widest ${timeRange === range ? 'bg-primary shadow-[0_4px_15px_rgba(19,236,164,0.3)] text-black' : 'text-slate-500 hover:text-white'}`}
                >
                  {range}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               {/* Left Column: Big Chart */}
               <div className="lg:col-span-7 flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-[3rem] py-12 px-6">
                 <ChartCircle 
                    percentage={timeRange === 'today' ? 65 : timeRange === 'week' ? 45 : 80} 
                    centerLabel="Total Screen Time" 
                    centerValue={stats.totalScreenTime} 
                    subValue={`${Math.abs(stats.changeVsYesterday)}% VS PREVIOUS`} 
                 />
                 
                 {/* Day Widget Inline */}
                 <div className="mt-12 w-full grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Pickups</p>
                       <p className="text-2xl font-black">{stats.totalPickups}</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Peak Use</p>
                       <p className="text-2xl font-black">{stats.longestSession}</p>
                    </div>
                 </div>
               </div>

               {/* Right Column: App List and Stats Expandable */}
               <div className="lg:col-span-5 flex flex-col gap-8">
                  <section className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-extrabold tracking-tight">Top Usage</h3>
                      <button 
                        onClick={() => setShowFullAppList(true)}
                        className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
                      >
                        SEE MORE
                      </button>
                    </div>
                    <div className="flex flex-col gap-4">
                      {stats.topApps.slice(0, 4).map(app => (
                        <div key={app.id} className="bg-surface-variant p-5 rounded-3xl flex items-center gap-4 border border-white/5 hover:border-primary/20 transition-all group">
                          <div className="size-12 rounded-2xl bg-black/30 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-2xl" style={{ color: app.color }}>{app.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-extrabold text-sm block">{app.name}</span>
                              <span className="font-bold text-xs text-primary">{app.time}</span>
                            </div>
                            <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${(app.minutes / 240) * 100}%` }} />
                            </div>
                          </div>
                          <button className="size-8 rounded-full hover:bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="material-symbols-outlined text-slate-300 text-[18px]">more_vert</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Expandable Stats Widget */}
                  <div className={`bg-primary/5 border border-primary/20 rounded-[2.5rem] overflow-hidden transition-all duration-500 ${expandStats ? 'max-h-[500px]' : 'max-h-[80px]'}`}>
                     <button 
                        onClick={() => setExpandStats(!expandStats)}
                        className="w-full flex items-center justify-between p-6 h-[80px]"
                     >
                        <div className="flex items-center gap-3">
                           <span className="material-symbols-outlined text-primary">analytics</span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary">In-depth Statistics</span>
                        </div>
                        <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${expandStats ? 'rotate-180' : ''}`}>expand_more</span>
                     </button>
                     <div className="px-6 pb-8 space-y-6">
                        <div className="h-px bg-primary/20 w-full" />
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400 font-bold">Unlocking Frequency</span>
                              <span className="text-sm font-black">12/hr</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400 font-bold">Sleep Disruption</span>
                              <span className="text-sm font-black text-rose-500">LOW</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400 font-bold">Cognitive Load</span>
                              <span className="text-sm font-black text-emerald-500">STABLE</span>
                           </div>
                        </div>
                        <div className="p-4 bg-primary/10 rounded-2xl">
                           <p className="text-[10px] text-primary/60 font-bold uppercase mb-2">Recommendation</p>
                           <p className="text-xs leading-relaxed font-bold">Your productivity peaks between 10 AM and 12 PM. Use Focus Mode then for 20% better results.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Keeping other views for consistency */}
        {currentView === View.WEEKLY_INSIGHTS && (
          <div className="p-8 md:p-12 pb-24 max-w-2xl mx-auto w-full animate-slide-up">
            <header className="flex items-center justify-between mb-10">
               <button onClick={() => setCurrentView(View.DASHBOARD)} className="size-12 flex items-center justify-center rounded-2xl bg-surface-variant border border-white/5 hover:border-primary/50 transition-colors">
                 <span className="material-symbols-outlined text-slate-400">arrow_back</span>
               </button>
               <h1 className="text-lg font-extrabold uppercase tracking-[0.2em] text-primary">Trends</h1>
               <div className="rounded-2xl bg-surface-dark px-5 py-3 border border-white/5 shadow-sm">
                 <span className="text-xs font-bold tracking-tight">Nov 1 - Nov 7</span>
               </div>
            </header>
            <div className="mb-10">
              <h2 className="text-4xl font-extrabold tracking-tighter leading-tight">Momentum Score</h2>
              <p className="text-base text-slate-400 mt-2">You're maintaining a healthy balance this week.</p>
            </div>
            <div className="w-full rounded-[2.5rem] bg-surface-dark p-8 border border-white/5 shadow-2xl mb-10 overflow-hidden relative group">
              <div className="flex flex-col gap-1 mb-10 relative z-10">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Average Focus Time</span>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-extrabold tracking-tighter">{stats.dailyAverage}</span>
                </div>
              </div>
              <BarChart data={stats.weeklyTrend} />
            </div>
          </div>
        )}

        {currentView === View.SETTINGS && (
           <div className="p-8 md:p-12 pb-24 max-w-2xl mx-auto w-full animate-slide-up">
              <header className="flex items-center justify-between mb-12">
                <button onClick={() => setCurrentView(View.DASHBOARD)} className="size-12 flex items-center justify-center rounded-2xl bg-surface-variant border border-white/5 hover:border-primary/50 transition-colors">
                  <span className="material-symbols-outlined text-slate-400">arrow_back</span>
                </button>
                <h1 className="text-lg font-extrabold uppercase tracking-[0.2em] text-primary">Preferences</h1>
                <div className="w-12" />
              </header>
              <section className="mb-12">
                 <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Interface Configuration</h3>
                 <div className="bg-surface-dark p-6 rounded-3xl flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-5">
                      <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-3xl">dark_mode</span>
                      </div>
                      <div>
                        <p className="font-extrabold text-lg">Always Dark</p>
                        <p className="text-xs font-bold text-slate-500">True black optimization</p>
                      </div>
                    </div>
                    <div className="w-16 h-9 rounded-full bg-primary relative"><div className="absolute top-1.5 size-6 bg-white rounded-full left-8.5" /></div>
                 </div>
              </section>
           </div>
        )}

        {currentView === View.AI_COACH && (
          <div className="p-8 md:p-12 pb-24 max-w-2xl mx-auto w-full animate-slide-up">
            <header className="flex items-center gap-6 mb-12">
              <button onClick={() => setCurrentView(View.DASHBOARD)} className="size-12 flex items-center justify-center rounded-2xl bg-surface-variant border border-white/5 hover:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-slate-400">arrow_back</span>
              </button>
              <h1 className="text-4xl font-extrabold tracking-tighter">Coach Intelligence</h1>
            </header>
            <div className="bg-primary/5 border border-primary/10 p-10 rounded-[2.5rem]">
               <h2 className="text-2xl font-extrabold tracking-tight mb-4">Usage Analysis</h2>
               <div className="flex flex-col gap-5">
                 {isAiLoading ? (
                   <div className="h-40 flex items-center justify-center"><span className="animate-spin material-symbols-outlined text-primary text-4xl">refresh</span></div>
                 ) : aiAdvice.map((tip, idx) => (
                    <div key={idx} className="flex gap-6 items-start bg-white/5 p-6 rounded-3xl border border-white/5">
                        <div className="size-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span className="text-black text-xs font-black">{idx + 1}</span></div>
                        <p className="text-sm font-bold leading-relaxed">{tip}</p>
                    </div>
                 ))}
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile-only floating button */}
      <div className="fixed bottom-8 right-8 md:hidden z-50">
        <button 
          onClick={() => setCurrentView(currentView === View.SETTINGS ? View.DASHBOARD : View.SETTINGS)}
          className="size-16 bg-primary rounded-3xl shadow-xl flex items-center justify-center text-black active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-3xl font-black">
            {currentView === View.SETTINGS ? 'home' : 'settings'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default App;
