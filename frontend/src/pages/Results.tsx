import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Moon, 
  Smartphone, 
  Sliders, 
  Lightbulb, 
  RefreshCw,
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { api, type PredictRequest, type PredictResponse } from '../services/api';

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const [request, setRequest] = useState<PredictRequest | null>(null);
  const [response, setResponse] = useState<PredictResponse | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const savedReq = localStorage.getItem('mindsync_assessment_request');
    const savedRes = localStorage.getItem('mindsync_assessment_response');
    
    if (savedReq && savedRes) {
      setRequest(JSON.parse(savedReq));
      setResponse(JSON.parse(savedRes));
    } else {
      // Fallback defaults if accessed directly without taking assessment
      const mockReq: PredictRequest = {
        name: 'Guest Student',
        age: 21,
        study_year: 3,
        screen_time: 8.5,
        social_media_time: 5.0,
        gaming_time: 1.5,
        sleep_duration: 5.5,
        study_hours: 2.5,
        concentration: 2,
        phone_urge: 4,
        sleep_disturbance: 'yes',
        academic_satisfaction: 2,
      };
      
      const mockRes: PredictResponse = {
        risk_level: 'High',
        risk_probability: 0.82,
        sleep_disruption_index: 75.0,
        cognitive_focus_index: 41.5,
        recommendations: [
          'Reduce daily social media usage by 1.5 hours to recover focus time.',
          'Increase sleep duration to 7.5+ hours to reduce cognitive distress.',
          'Keep phone outside study spaces to build impulse control.'
        ],
        top_features: [
          { feature: "Social Media Usage", impact: 0.75, description: "Daily screen duration spent on social networks." },
          { feature: "Phone Checking Urge", impact: 0.48, description: "Self-reported urge index to unlock device." },
          { feature: "Sleep Duration", impact: 0.20, description: "Insufficient sleeping patterns." }
        ],
        explanation: "Your Digital Addiction risk is primarily influenced by your social media usage, followed by your phone checking urge."
      };
      
      setRequest(mockReq);
      setResponse(mockRes);
    }
  }, []);

  const handleDownloadPDF = async () => {
    if (!request || !response) return;
    setIsDownloading(true);
    try {
      const blob = await api.generateReport(request.name, request, response);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindsync_wellness_report_${request.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. Make sure the backend service is running.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!request || !response) return null;

  // Visual classes for risk levels
  const getRiskBadgeClasses = (level: string) => {
    if (level === "High") return 'text-red-700 bg-red-50 border-red-200';
    if (level === "Moderate") return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Wellness Profile</h1>
          <p className="text-sm text-slate-500">
            Analysis generated for <b className="text-slate-800">{request.name}</b> based on current time allocations.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={() => navigate('/assessment')}
          >
            Retake Assessment
          </Button>
          <Button 
            size="sm" 
            isLoading={isDownloading}
            leftIcon={<FileText className="w-4 h-4" />}
            onClick={handleDownloadPDF}
          >
            Download PDF Report
          </Button>
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core Risk Badge Card */}
        <Card className="md:col-span-1 border-slate-200/60 flex flex-col justify-between" hoverable>
          <CardHeader>
            <CardTitle>Digital Habit Classification</CardTitle>
            <CardDescription>Social media dependency rating</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6 flex-1 flex flex-col justify-center">
            <div className={`inline-flex items-center mx-auto px-4 py-2 rounded-2xl border font-bold text-lg mb-4 ${getRiskBadgeClasses(response.risk_level)}`}>
              {response.risk_level} Risk
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[200px] mx-auto">
              Addiction probability calculated at <b>{(response.risk_probability * 100).toFixed(0)}%</b> based on regression modeling.
            </p>
          </CardContent>
          <CardFooter className="bg-slate-50/50 text-[10px] text-slate-400">
            Empirical threshold index SAS-SV mapping
          </CardFooter>
        </Card>

        {/* Cognitive & Academic Projections */}
        <Card className="md:col-span-2 border-slate-200/60" hoverable>
          <CardHeader>
            <CardTitle>Measured Digital & Wellness KPIs</CardTitle>
            <CardDescription>Projections derived from your questionnaire responses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Focus Score Gauge Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-600">Digital Wellness Score</span>
                <span className="font-bold text-slate-900">{response.cognitive_focus_index.toFixed(1)} / 100</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    response.cognitive_focus_index < 50 ? 'bg-red-500' : response.cognitive_focus_index < 75 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${response.cognitive_focus_index}%` }}
                />
              </div>
            </div>

            {/* Metrics Checklist row */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Moon className={`w-4 h-4 ${response.sleep_disruption_index > 50 ? 'text-red-500' : 'text-emerald-500'}`} />
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase leading-none">Sleep Disruption</span>
                  <span className="text-xs font-bold text-slate-800">{response.sleep_disruption_index.toFixed(0)}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Smartphone className="w-4 h-4 text-blue-500" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase leading-none">Screen Ratio</span>
                  <span className="text-xs font-bold text-slate-800">
                    {request.screen_time > 0 ? ((request.social_media_time / request.screen_time) * 100).toFixed(0) : 0}% Social
                  </span>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Explainable AI SHAP Section */}
      <Card className="border-slate-200/60">
        <CardHeader>
          <CardTitle>Explainable AI (XAI) Diagnosis</CardTitle>
          <CardDescription>Visualizing key features driving your digital addiction probability.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            {response.explanation}
          </p>
          
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Feature Impact Weights</h4>
            {response.top_features.map((feat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">{feat.feature}</span>
                  <span className="text-slate-400 font-semibold">{feat.impact > 0 ? `+${feat.impact.toFixed(2)}` : feat.impact.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${Math.min(100, Math.max(10, feat.impact * 100))}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">{feat.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inputs vs Standards Comparison table */}
      <Card className="border-slate-200/60">
        <CardHeader>
          <CardTitle>Habit vs Recommendation Benchmark</CardTitle>
          <CardDescription>How your values compare with clinical well-being recommendations.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400">
                <th className="py-2.5 font-semibold">Habit Element</th>
                <th className="py-2.5 font-semibold text-center">Your Value</th>
                <th className="py-2.5 font-semibold text-center">Target Recommendation</th>
                <th className="py-2.5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 font-medium">Daily Screen Time</td>
                <td className="py-3 text-center">{request.screen_time} hrs</td>
                <td className="py-3 text-center">&lt; 4.0 hrs</td>
                <td className="py-3 text-right">
                  {request.screen_time <= 4 ? (
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Optimal</span>
                  ) : (
                    <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-medium">Excessive</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Social Media Segment</td>
                <td className="py-3 text-center">{request.social_media_time} hrs</td>
                <td className="py-3 text-center">&lt; 2.0 hrs</td>
                <td className="py-3 text-right">
                  {request.social_media_time <= 2 ? (
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Optimal</span>
                  ) : (
                    <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-medium">Excessive</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Sleep Duration</td>
                <td className="py-3 text-center">{request.sleep_duration} hrs</td>
                <td className="py-3 text-center">7.0 - 8.5 hrs</td>
                <td className="py-3 text-right">
                  {request.sleep_duration >= 7 ? (
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Healthy</span>
                  ) : (
                    <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">Insufficient</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Navigation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="bg-blue-50/30 border-blue-100/70 flex items-center justify-between p-5" hoverable>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600" />
              Simulate Behavior Changes
            </h4>
            <p className="text-[11px] text-slate-500">
              Drag interactive sliders to project how cutting screen time can impact sleep.
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 bg-white text-blue-600 hover:bg-blue-100 rounded-xl"
            onClick={() => navigate('/simulator')}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </Card>

        <Card className="bg-sky-50/30 border-sky-100/70 flex items-center justify-between p-5" hoverable>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-sky-600" />
              View Action Plan
            </h4>
            <p className="text-[11px] text-slate-500">
              Browse customized recommendations for phone breaks and productivity.
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 bg-white text-sky-600 hover:bg-sky-100 rounded-xl"
            onClick={() => navigate('/recommendations')}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </Card>
      </div>
    </div>
  );
};
