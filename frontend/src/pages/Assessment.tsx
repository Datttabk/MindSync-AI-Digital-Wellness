import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Clock, 
  BookOpen, 
  Moon, 
  Smartphone, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { api } from '../services/api';

export const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '20',
    studyYear: '3',
    screenTime: 6,
    socialMediaTime: 3.5,
    gamingTime: 1.0,
    sleepDuration: 7.0,
    studyHours: 4.0,
    concentration: '3', // 1-5
    phoneUrge: '4', // 1-5
    sleepDisturbance: 'yes',
    academicSatisfaction: '3', // 1-5
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.endsWith('Time') || name.endsWith('Duration') || name.endsWith('Hours') 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        age: parseInt(formData.age) || 20,
        study_year: parseInt(formData.studyYear) || 3,
        screen_time: formData.screenTime,
        social_media_time: formData.socialMediaTime,
        gaming_time: formData.gamingTime,
        sleep_duration: formData.sleepDuration,
        study_hours: formData.studyHours,
        concentration: parseInt(formData.concentration) || 3,
        phone_urge: parseInt(formData.phoneUrge) || 3,
        sleep_disturbance: formData.sleepDisturbance,
        academic_satisfaction: parseInt(formData.academicSatisfaction) || 3,
      };
      
      const response = await api.predict(payload);
      
      // Save data locally for Results page to read
      localStorage.setItem('mindsync_assessment_request', JSON.stringify(payload));
      localStorage.setItem('mindsync_assessment_response', JSON.stringify(response));
      
      setIsSubmitting(false);
      navigate('/results');
    } catch (err) {
      console.error(err);
      alert("Error contacting the prediction service. Make sure the backend is running.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Research-Validated Questionnaire</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Digital Wellness Assessment</h1>
        <p className="text-sm text-slate-500">
          Provide your typical daily usage metrics. Our platform utilizes these features to predict digital addiction risks and sleep disruption probabilities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Student Demographics */}
        <Card className="border-slate-100">
          <CardHeader>
            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">1</span>
              Academic Profile
            </CardTitle>
            <CardDescription>Basic background indicators for demographic grouping.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">First Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g., Alex"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm glass-input focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Age</label>
              <input
                type="number"
                name="age"
                required
                min="15"
                max="30"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm glass-input focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Year of Study</label>
              <select
                name="studyYear"
                value={formData.studyYear}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm glass-input focus:outline-none"
              >
                <option value="1">1st Year (Freshman)</option>
                <option value="2">2nd Year (Sophomore)</option>
                <option value="3">3rd Year (Junior)</option>
                <option value="4">4th Year (Senior)</option>
                <option value="5">Postgraduate</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Time Allocation (Quantitative Metrics) */}
        <Card className="border-slate-100">
          <CardHeader>
            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">2</span>
              Daily Time Allocation (Hours)
            </CardTitle>
            <CardDescription>Estimate the average hours spent on activities in a 24-hour cycle.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                <span>Total Screen Time ({formData.screenTime} hrs)</span>
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <input
                type="range"
                name="screenTime"
                min="1"
                max="18"
                step="0.5"
                value={formData.screenTime}
                onChange={handleChange}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[10px] text-slate-400">Total duration active on phones, laptops, and tablets.</span>
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                <span>Social Media Time ({formData.socialMediaTime} hrs)</span>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <input
                type="range"
                name="socialMediaTime"
                min="0"
                max="12"
                step="0.5"
                value={formData.socialMediaTime}
                onChange={handleChange}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[10px] text-slate-400">Duration spent on Instagram, TikTok, Reddit, etc.</span>
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                <span>Gaming Duration ({formData.gamingTime} hrs)</span>
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <input
                type="range"
                name="gamingTime"
                min="0"
                max="8"
                step="0.5"
                value={formData.gamingTime}
                onChange={handleChange}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                <span>Sleep Duration ({formData.sleepDuration} hrs)</span>
                <Moon className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <input
                type="range"
                name="sleepDuration"
                min="3"
                max="12"
                step="0.5"
                value={formData.sleepDuration}
                onChange={handleChange}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                <span>Study / Academic Study Hours ({formData.studyHours} hrs)</span>
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <input
                type="range"
                name="studyHours"
                min="0"
                max="10"
                step="0.5"
                value={formData.studyHours}
                onChange={handleChange}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Subjective Cognitive Indicators */}
        <Card className="border-slate-100">
          <CardHeader>
            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">3</span>
              Subjective Symptoms
            </CardTitle>
            <CardDescription>Qualitative assessments of focus levels and mental load.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                  Concentration & Focus (1-5 Scale)
                </label>
                <select
                  name="concentration"
                  value={formData.concentration}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm glass-input focus:outline-none"
                >
                  <option value="1">1 - Extremely Distracted</option>
                  <option value="2">2 - Poor Concentration</option>
                  <option value="3">3 - Moderate/Normal Focus</option>
                  <option value="4">4 - High Concentration</option>
                  <option value="5">5 - Excellent/Sharp Focus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                  Urge to check phone (1-5 Scale)
                </label>
                <select
                  name="phoneUrge"
                  value={formData.phoneUrge}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm glass-input focus:outline-none"
                >
                  <option value="1">1 - Never feel the urge</option>
                  <option value="2">2 - Weak urge, controlled easily</option>
                  <option value="3">3 - Moderate urge, check frequently</option>
                  <option value="4">4 - Strong urge, difficult to resist</option>
                  <option value="5">5 - Extreme urge, check constantly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                  Academic Satisfaction
                </label>
                <select
                  name="academicSatisfaction"
                  value={formData.academicSatisfaction}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm glass-input focus:outline-none"
                >
                  <option value="1">1 - Dissatisfied / Failing</option>
                  <option value="2">2 - Underperforming</option>
                  <option value="3">3 - Average / Satisfied</option>
                  <option value="4">4 - Performing Well</option>
                  <option value="5">5 - Outstanding Results</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                  Is sleep disrupted by phone alerts?
                </label>
                <div className="flex gap-4 mt-1">
                  {['yes', 'no'].map((val) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sleepDisturbance"
                        value={val}
                        checked={formData.sleepDisturbance === val}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-sm capitalize text-slate-700">{val}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action button */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Data processed locally. MindSync AI complies with health data privacy guidelines.</span>
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting ? 'Analyzing Digital Habits...' : 'Analyze My Habits'}
          </Button>
        </div>
      </form>
    </div>
  );
};
