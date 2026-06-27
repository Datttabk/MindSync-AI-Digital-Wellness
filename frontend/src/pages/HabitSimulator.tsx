import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Moon, 
  Smartphone, 
  BookOpen, 
  Activity, 
  TrendingUp, 
  HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { api, type PredictRequest, type SimulateResponse } from '../services/api';

export const HabitSimulator: React.FC = () => {
  // Current values
  const [currentHabits, setCurrentHabits] = useState({
    screenTime: 8.5,
    socialMedia: 5.0,
    studyHours: 2.5,
    sleepHours: 6.0
  });

  // Simulated values
  const [simScreenTime, setSimScreenTime] = useState(8.5);
  const [simSocialMedia, setSimSocialMedia] = useState(5.0);
  const [simStudyHours, setSimStudyHours] = useState(2.5);
  const [simSleepHours, setSimSleepHours] = useState(6.0);
  
  const [simResult, setSimResult] = useState<SimulateResponse | null>(null);

  // Load from assessment request if available
  useEffect(() => {
    const saved = localStorage.getItem('mindsync_assessment_request');
    if (saved) {
      const parsed = JSON.parse(saved);
      const initial = {
        screenTime: parsed.screen_time,
        socialMedia: parsed.social_media_time,
        studyHours: parsed.study_hours,
        sleepHours: parsed.sleep_duration
      };
      setCurrentHabits(initial);
      setSimScreenTime(parsed.screen_time);
      setSimSocialMedia(parsed.social_media_time);
      setSimStudyHours(parsed.study_hours);
      setSimSleepHours(parsed.sleep_duration);
    }
  }, []);

  // Effect to run ML simulation from API with a 250ms debounce
  useEffect(() => {
    const runSimulation = async () => {
      try {
        const currentPayload: PredictRequest = {
          name: 'Student',
          age: 21,
          study_year: 3,
          screen_time: currentHabits.screenTime,
          social_media_time: currentHabits.socialMedia,
          gaming_time: 1.0,
          sleep_duration: currentHabits.sleepHours,
          study_hours: currentHabits.studyHours,
          concentration: 3,
          phone_urge: 3,
          sleep_disturbance: 'yes',
          academic_satisfaction: 3
        };
        
        const simPayload: PredictRequest = {
          ...currentPayload,
          screen_time: simScreenTime,
          social_media_time: simSocialMedia,
          sleep_duration: simSleepHours,
          study_hours: simStudyHours
        };
        
        const result = await api.simulate({
          current_habits: currentPayload,
          simulated_habits: simPayload
        });
        
        setSimResult(result);
      } catch (err) {
        console.error("Simulation failed:", err);
      }
    };

    const debounceTimer = setTimeout(runSimulation, 250);
    return () => clearTimeout(debounceTimer);
  }, [simScreenTime, simSocialMedia, simStudyHours, simSleepHours, currentHabits]);

  const handleReset = () => {
    setSimScreenTime(currentHabits.screenTime);
    setSimSocialMedia(currentHabits.socialMedia);
    setSimStudyHours(currentHabits.studyHours);
    setSimSleepHours(currentHabits.sleepHours);
  };

  // Recharts Chart Data representing Comparison
  const chartData = simResult ? [
    {
      metric: 'Wellness Index',
      Current: Math.round(simResult.current_focus_index),
      Simulated: Math.round(simResult.simulated_focus_index)
    },
    {
      metric: 'Sleep Quality',
      Current: Math.round(simResult.current_sleep_quality),
      Simulated: Math.round(simResult.simulated_sleep_quality)
    },
    {
      metric: 'Academic Trend',
      Current: Math.round(simResult.current_academic_index),
      Simulated: Math.round(simResult.simulated_academic_index)
    }
  ] : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
          <Sliders className="w-3.5 h-3.5" />
          <span>Interactive Decision Support Sandbox</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Habit Simulator</h1>
        <p className="text-sm text-slate-500">
          Modify the sliders in the left panel to simulate how adjusting your daily routine can dynamically influence your academic efficiency and sleep quality metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sliders Control Panel */}
        <Card className="lg:col-span-1 border-slate-200/60 h-fit space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm">Simulation Variables</h3>
            <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={handleReset}>
              Reset Values
            </Button>
          </div>

          <div className="space-y-5">
            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                  Screen Time
                </span>
                <span className="text-blue-600">{simScreenTime.toFixed(1)} hrs</span>
              </div>
              <input
                type="range"
                min="1"
                max="18"
                step="0.5"
                value={simScreenTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setSimScreenTime(val);
                  if (simSocialMedia > val) setSimSocialMedia(val);
                }}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Slider 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-500" />
                  Social Media
                </span>
                <span className="text-blue-600">{simSocialMedia.toFixed(1)} hrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={simSocialMedia}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setSimSocialMedia(val);
                  if (simScreenTime < val) setSimScreenTime(val);
                }}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Slider 3 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                  Study Hours
                </span>
                <span className="text-blue-600">{simStudyHours.toFixed(1)} hrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={simStudyHours}
                onChange={(e) => setSimStudyHours(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Slider 4 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-blue-500" />
                  Sleep Duration
                </span>
                <span className="text-blue-600">{simSleepHours.toFixed(1)} hrs</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={simSleepHours}
                onChange={(e) => setSimSleepHours(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50/50 rounded-xl flex gap-2 border border-blue-100">
            <HelpCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span className="text-[10px] text-blue-700 leading-normal">
              Habit projections are updated dynamically using the trained regression and classification models from the backend.
            </span>
          </div>
        </Card>

        {/* Projection Outputs & Visualizers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Comparison Chart */}
          <Card className="border-slate-200/60">
            <CardHeader>
              <CardTitle>Outcome Projections</CardTitle>
              <CardDescription>Comparing your current questionnaire profile against simulated modifications.</CardDescription>
            </CardHeader>
            <CardContent className="h-64 w-full">
              {simResult ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="metric" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px' }} 
                      labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                    <Bar name="Current Score" dataKey="Current" fill="#cbd5e1" radius={[8, 8, 0, 0]} maxBarSize={40} />
                    <Bar name="Simulated Scenario" dataKey="Simulated" fill="#2563eb" radius={[8, 8, 0, 0]} maxBarSize={40} />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                  Running simulation...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Projection KPI Summaries */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {simResult && [
              {
                title: 'Academic Trend',
                diff: Math.round(simResult.simulated_academic_index - simResult.current_academic_index),
                value: `${Math.round(simResult.simulated_academic_index)}%`,
                desc: 'Positive outcomes likelihood'
              },
              {
                title: 'Wellness Index',
                diff: Math.round(simResult.simulated_focus_index - simResult.current_focus_index),
                value: `${Math.round(simResult.simulated_focus_index)}%`,
                desc: 'Estimated wellness index'
              },
              {
                title: 'Sleep Restoration',
                diff: Math.round(simResult.simulated_sleep_quality - simResult.current_sleep_quality),
                value: `${Math.round(simResult.simulated_sleep_quality)}%`,
                desc: 'Restorative phase rating'
              }
            ].map((proj, idx) => {
              const positive = proj.diff >= 0;
              return (
                <Card key={idx} className="border-slate-200/60 p-4">
                  <div className="text-xs text-slate-400 font-semibold mb-1">{proj.title}</div>
                  <div className="text-xl font-bold text-slate-900 mb-1">{proj.value}</div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold">
                    {proj.diff === 0 ? (
                      <span className="text-slate-400">No Change</span>
                    ) : positive ? (
                      <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> +{proj.diff}%
                      </span>
                    ) : (
                      <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3 rotate-180" /> {proj.diff}%
                      </span>
                    )}
                    <span className="text-slate-400 font-normal ml-0.5">{proj.desc}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
