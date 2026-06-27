import React from 'react';
import { 
  Info, 
  Brain, 
  BookOpen, 
  ShieldAlert, 
  Cpu, 
  Terminal, 
  Database
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card';

export const About: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
          <Info className="w-3.5 h-3.5" />
          <span>Science & Technology Foundation</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">About MindSync AI</h1>
        <p className="text-sm text-slate-500">
          Discover the underlying clinical benchmarks, methodology, and technical architecture powering our decision support tool.
        </p>
      </div>

      {/* Grid: Science and Tech */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Clinical Framework */}
        <Card className="border-slate-100 space-y-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Scientific Framework
            </CardTitle>
            <CardDescription>
              We draw indicators from validated psychological indices.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              Student digital habits are assessed against established academic research variables:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-slate-800">SAS-SV (Smartphone Addiction Scale):</strong> A short version scale containing ten items with high reliability to screen adolescents for smartphone addiction risks.
              </li>
              <li>
                <strong className="text-slate-800">PSQI (Pittsburgh Sleep Quality Index):</strong> Used to evaluate notification-based sleep disturbances and estimate sleep restoration levels.
              </li>
              <li>
                <strong className="text-slate-800">Academic Focus Index:</strong> A custom calculated projection mapping screen-free study blocks and sleep hours against overall cognitive load.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Tech Stack Overview */}
        <Card className="border-slate-100 space-y-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              Technical Architecture
            </CardTitle>
            <CardDescription>
              MindSync AI implements a decoupled 3-tier SaaS stack.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              Designed for high scalability and clean isolation of concerns:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <div className="p-1 bg-slate-100 rounded text-slate-700 mt-0.5">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-slate-800 block">Frontend (React + Vite)</strong>
                  Highly styled CSS variables, Tailwind, Lucide React, and Recharts rendering predictive indices.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="p-1 bg-slate-100 rounded text-slate-700 mt-0.5">
                  <Database className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-slate-800 block">Backend REST API (FastAPI)</strong>
                  Fast, asynchronous router endpoints checking inputs and outputting model outputs (Step 1 placeholders).
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="p-1 bg-slate-100 rounded text-slate-700 mt-0.5">
                  <Brain className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-slate-800 block">Future ML Tier (XGBoost / Joblib)</strong>
                  Prepared files to load model serialization binary files (`.pkl`/`.joblib`) and return prediction outcomes (Step 2).
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* IEEE Project Specifications */}
      <Card className="bg-slate-50 border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-2xl border border-slate-200 text-blue-600 shadow-xs flex-shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-base leading-tight">Hackathon Target Requirements</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              MindSync AI delivers a clear digital solution highlighting student health support. The decoupled code allows frontend developers and ML researchers to work in parallel. APIs are defined clearly using Pydantic validation schemas to guarantee zero-trust input parsing on the backend server.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
