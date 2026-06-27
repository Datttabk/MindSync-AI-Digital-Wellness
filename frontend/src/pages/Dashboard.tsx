import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Moon, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Brain,
  Download,
  Users
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Legend, 
  Cell
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { api, type AnalyticsResponse } from '../services/api';

const weeklyTrends = [
  { day: 'Mon', screenTime: 6.2, sleep: 7.0, focusScore: 68 },
  { day: 'Tue', screenTime: 5.5, sleep: 7.2, focusScore: 72 },
  { day: 'Wed', screenTime: 7.8, sleep: 5.8, focusScore: 55 },
  { day: 'Thu', screenTime: 4.8, sleep: 7.5, focusScore: 78 },
  { day: 'Fri', screenTime: 8.2, sleep: 5.5, focusScore: 48 },
  { day: 'Sat', screenTime: 9.5, sleep: 6.2, focusScore: 40 },
  { day: 'Sun', screenTime: 6.0, sleep: 8.0, focusScore: 65 },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await api.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 font-medium">
        Loading dataset analytics...
      </div>
    );
  }

  // Fallback defaults if API not responding
  const activeData = analytics || {
    average_screen_time: 6.4,
    average_sleep_duration: 6.8,
    total_assessments: 12038,
    risk_distribution: { Low: 64, Moderate: 48, High: 30 },
    focus_by_study_year: { "Undergraduate": 58.2, "Graduate": 72.1, "High School": 68.5 }
  };

  const riskChartData = [
    { name: 'Low', count: activeData.risk_distribution.Low, color: '#10b981' },
    { name: 'Moderate', count: activeData.risk_distribution.Moderate, color: '#f59e0b' },
    { name: 'High', count: activeData.risk_distribution.High, color: '#ef4444' }
  ];

  const focusLevelData = Object.entries(activeData.focus_by_study_year).map(([level, score]) => ({
    level,
    score
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Well-being Dashboard</h1>
          <p className="text-sm text-slate-500">
            A comprehensive look at aggregates of all student digital habits, cognitive load indicators, and sleep trends.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => alert("Raw data export is enabled for project supervisors.")}
          >
            Export CSV
          </Button>
          <Button 
            size="sm" 
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/assessment')}
          >
            Update Assessment
          </Button>
        </div>
      </div>

      {/* Wellness Alerts Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs">
          <h4 className="font-semibold text-blue-800">Dataset Observation</h4>
          <p className="text-blue-700 leading-relaxed mt-0.5">
            Based on {activeData.total_assessments.toLocaleString()} student entries, higher screen time is positively correlated with sleep quality degradation. Try the <span className="underline font-semibold cursor-pointer" onClick={() => navigate('/simulator')}>Habit Simulator</span> to evaluate scenarios.
          </p>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <Card className="border-slate-200/60" hoverable>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Avg Screen Time</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeData.average_screen_time.toFixed(1)} hrs</div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-red-500 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Over optimal baseline</span>
          </div>
        </Card>

        {/* Metric 2 */}
        <Card className="border-slate-200/60" hoverable>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Average Sleep</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Moon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeData.average_sleep_duration.toFixed(1)} hrs</div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-500 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Baseline sleep rating</span>
          </div>
        </Card>

        {/* Metric 3 */}
        <Card className="border-slate-200/60" hoverable>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Profiles</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeData.total_assessments.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400 font-medium">
            <span>Verified student samples</span>
          </div>
        </Card>

        {/* Metric 4 */}
        <Card className="border-slate-200/60" hoverable>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Active Predictors</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600">XGBoost / LR</div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400 font-medium">
            <span>Addiction & Academic models</span>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <Card className="lg:col-span-2 border-slate-200/60">
          <CardHeader>
            <CardTitle>Daily Habits & Focus Trend</CardTitle>
            <CardDescription>
              Overlay analyzing weekly screen exposure against measured focus levels.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px' }} 
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                <Area name="Screen Time (hrs)" type="monotone" dataKey="screenTime" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorScreen)" />
                <Area name="Focus Score (%)" type="monotone" dataKey="focusScore" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorFocus)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Category Distribution */}
        <Card className="border-slate-200/60 flex flex-col">
          <CardHeader>
            <CardTitle>Risk Classifications</CardTitle>
            <CardDescription>Distribution of student samples by risk level.</CardDescription>
          </CardHeader>
          <CardContent className="h-60 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskChartData} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px' }} 
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {riskChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Focus by Academic Level */}
      <Card className="border-slate-200/60">
        <CardHeader>
          <CardTitle>Cognitive Wellness by Academic Level</CardTitle>
          <CardDescription>Average focus indexes calculated from dataset clusters.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {focusLevelData.map((data, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">{data.level}</span>
                <span className="text-base font-bold text-slate-800">{data.score.toFixed(1)}% Wellness</span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 flex items-center justify-center text-xs font-bold text-blue-600">
                {data.score.toFixed(0)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
