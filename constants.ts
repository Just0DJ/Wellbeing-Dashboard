
import { AppUsage, DailyUsage, WellbeingStats } from './types';

export const MOCK_APPS: AppUsage[] = [
  { id: '1', name: 'Chrome', time: '3h 12m', minutes: 192, icon: 'public', color: '#4285F4' },
  { id: '2', name: 'VS Code', time: '2h 05m', minutes: 125, icon: 'code', color: '#007ACC' },
  { id: '3', name: 'Spotify', time: '1h 25m', minutes: 85, icon: 'music_note', color: '#1DB954' },
  { id: '4', name: 'Slack', time: '45m', minutes: 45, icon: 'forum', color: '#E01E5A' },
  { id: '5', name: 'Instagram', time: '32m', minutes: 32, icon: 'photo_camera', color: '#E1306C' },
];

export const WEEKLY_DATA: DailyUsage[] = [
  { day: 'M', minutes: 312 },
  { day: 'T', minutes: 420 },
  { day: 'W', minutes: 245 },
  { day: 'T', minutes: 560 },
  { day: 'F', minutes: 504 },
  { day: 'S', minutes: 630 },
  { day: 'S', minutes: 385 },
];

export const WELLBEING_DATA: WellbeingStats = {
  totalScreenTime: '6h 42m',
  changeVsYesterday: -12,
  dailyAverage: '5h 12m',
  totalPickups: 84,
  longestSession: '1h 40m',
  topApps: MOCK_APPS,
  weeklyTrend: WEEKLY_DATA,
};
