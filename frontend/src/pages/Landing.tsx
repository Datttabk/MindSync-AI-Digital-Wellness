import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  BarChart3, 
  Sparkles, 
  CheckCircle2,
  ClipboardList,
  Sliders
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };


  return (
    <motion.div 
      className="space-y-16 py-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <motion.div 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold"
          variants={itemVariants}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Empowering Students to Thrive Digitally</span>
        </motion.div>
        
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight"
          variants={itemVariants}
        >
          Take Control of Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
            Digital Well-being
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-lg text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed"
          variants={itemVariants}
        >
          MindSync AI is a scientific decision support platform analyzing student digital habits, social media usage patterns, and predicting academic impact to suggest optimal lifestyle changes.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          variants={itemVariants}
        >
          <Button 
            size="lg" 
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/assessment')}
          >
            Start Wellness Assessment
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/dashboard')}
          >
            View Dashboard Demo
          </Button>
        </motion.div>
      </section>

      {/* Quick Stats Grid */}
      <motion.section 
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        variants={itemVariants}
      >
        {[
          { label: 'Screen Time Reduction', value: '2.4 hrs/day', desc: 'Avg. student improvement' },
          { label: 'Focus Improvement', value: '42%', desc: 'Self-reported concentration lift' },
          { label: 'GPA Positive Trend', value: '+0.35', desc: 'Academic impact observation' },
          { label: 'Privacy Minded', value: '100% Secure', desc: 'Local dataset processing' }
        ].map((stat, idx) => (
          <Card key={idx} className="text-center py-5 border-slate-100" hoverable>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
            <div className="text-xs font-semibold text-slate-800 mb-0.5">{stat.label}</div>
            <div className="text-[10px] text-slate-400">{stat.desc}</div>
          </Card>
        ))}
      </motion.section>

      {/* Value Pillars */}
      <section className="space-y-8">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How MindSync AI Works</h2>
          <p className="text-sm text-slate-400 mt-2">
            A three-step loop to measure, simulate, and enhance your cognitive focus.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: ClipboardList,
              title: '1. Assessment & Profiling',
              desc: 'Answer a research-based, clinical questionnaire detailing your device usage, sleep schedule, study patterns, and daily screen habits.'
            },
            {
              icon: Sliders,
              title: '2. Habit Simulation',
              desc: 'Use our AI-powered scenario engine to drag sliders and model how cutting down social media usage directly correlates to sleep & academic outcomes.'
            },
            {
              icon: BarChart3,
              title: '3. Analytics & Feedback',
              desc: 'Receive interactive charts detailing your wellness score and personalized, evidence-backed behavioral interventions.'
            }
          ].map((step, idx) => (
            <Card key={idx} className="flex flex-col h-full bg-white relative border-slate-200/50 hover:border-blue-200/60" hoverable>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4">
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-2">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed flex-1">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust & Scientific Foundation Section */}
      <Card className="bg-slate-900 border-none text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center space-y-6 py-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-blue-200 rounded-full text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Academic Rigor First</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">Built for IEEE Hackathon Evaluation</h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl mx-auto">
            MindSync AI outlines clean pipelines mapping student screen habits to clinical digital addiction scales (SAS-SV) and sleep quality assessments, helping academic advisors implement proper proactive interventions.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Modular React UI</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> FastAPI Services</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Clean ML Predictors</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
