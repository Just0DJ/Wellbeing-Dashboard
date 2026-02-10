
export enum View {
  DASHBOARD = 'dashboard',
  WEEKLY_INSIGHTS = 'weekly_insights',
  SETTINGS = 'settings',
  AI_COACH = 'ai_coach'
}

export interface AppUsage {
  id: string;
  name: string;
  time: string; // "3h 12m"
  minutes: number;
  icon: string;
  color: string;
}

export interface DailyUsage {
  day: string; // M, T, W, T, F, S, S
  minutes: number;
}

export interface WellbeingStats {
  totalScreenTime: string;
  changeVsYesterday: number;
  dailyAverage: string;
  totalPickups: number;
  longestSession: string;
  topApps: AppUsage[];
  weeklyTrend: DailyUsage[];
}
