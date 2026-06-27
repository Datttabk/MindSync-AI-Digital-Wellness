import React, { useState } from 'react';
import { 
  CheckCircle2
} from 'lucide-react';
import { Card, CardTitle, CardFooter } from '../components/Card';
import { Button } from '../components/Button';

export const Recommendations: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'social' | 'sleep' | 'academic'>('all');
  const [bookmarked, setBookmarked] = useState<number[]>([]);

  const recommendations = [
    {
      id: 1,
      category: 'social',
      title: 'Digital Fasting Hour',
      impact: 'Estimated Focus +18%',
      difficulty: 'Easy',
      evidence: 'High (Clinical standard)',
      description: 'Schedule a fixed 60-minute window daily, preferably during study hours, where mobile devices are placed outside the room or kept completely turned off.',
      actions: [
        'Place phone in a drawer or another room before beginning a study session.',
        'Use browser blocking plugins (e.g. Cold Turkey) to restrict social sites.',
        'Begin with a 45-minute sprint, followed by a 15-minute screen-free break.'
      ]
    },
    {
      id: 2,
      category: 'sleep',
      title: 'No Screens 30m Before Bed',
      impact: 'Sleep Quality +25%',
      difficulty: 'Medium',
      evidence: 'Very High (Harvard Sleep study)',
      description: 'Avoid light exposure from phone and laptop screens for at least 30 minutes before sleeping. Blue light delays melatonin secretion.',
      actions: [
        'Enable night-shift screen filters (warm temperature) past 8:00 PM.',
        'Read physical books or listen to restorative audio instead of scrolling social media.',
        'Charge devices across the room, not next to the bed.'
      ]
    },
    {
      id: 3,
      category: 'academic',
      title: 'Feynman Recall Technique',
      impact: 'Academic Retention +15%',
      difficulty: 'Medium',
      evidence: 'High (Cognitive science)',
      description: 'Learn concepts by teaching them. Digital distractions often create pseudo-learning where material is read but not retained.',
      actions: [
        'Write down an explanation of the topic as if teaching a freshman.',
        'Identify gaps in explanation, go back to study materials.',
        'Perform study sessions in offline focus blocks.'
      ]
    },
    {
      id: 4,
      category: 'social',
      title: 'Social App Offloading',
      impact: 'Screen Time -1.5 hrs/day',
      difficulty: 'Hard',
      evidence: 'Medium (Empirical review)',
      description: 'Delete high-distraction social applications from your phone and access them exclusively via desktop web browsers to increase interaction friction.',
      actions: [
        'Uninstall TikTok/Instagram/Reddit mobile applications.',
        'Allow browser-only checkups once per evening for 20 minutes max.',
        'Replace impulse scrolling with a micro-journaling application.'
      ]
    }
  ];

  const toggleBookmark = (id: number) => {
    setBookmarked(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const filteredRecs = filter === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === filter);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Personalized Interventions</h1>
          <p className="text-sm text-slate-500">
            Evidence-backed behavioral techniques tailored to address your identified screen time and sleep metrics.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { label: 'All Interventions', value: 'all' },
          { label: 'Social Media Discipline', value: 'social' },
          { label: 'Sleep Quality Support', value: 'sleep' },
          { label: 'Academic & Focus Boost', value: 'academic' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              filter === tab.value
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecs.map((rec) => {
          const isSaved = bookmarked.includes(rec.id);
          return (
            <Card key={rec.id} className="flex flex-col justify-between border-slate-100 h-full" hoverable>
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    rec.category === 'social' ? 'bg-blue-50 text-blue-700' :
                    rec.category === 'sleep' ? 'bg-indigo-50 text-indigo-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    {rec.category}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    Evidence: {rec.evidence}
                  </span>
                </div>

                <CardTitle className="text-base mb-1.5">{rec.title}</CardTitle>
                <div className="text-xs font-semibold text-emerald-600 mb-3">{rec.impact}</div>
                
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {rec.description}
                </p>

                {/* Sub Action Items */}
                <div className="space-y-2 border-t border-slate-50 pt-3">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Action Steps:</span>
                  {rec.actions.map((act, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              <CardFooter className="pt-4 mt-6">
                <Button 
                  variant={isSaved ? 'secondary' : 'outline'} 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => toggleBookmark(rec.id)}
                >
                  {isSaved ? 'Remove Bookmark' : 'Add to Action Plan'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
