const BASE_URL = 'http://localhost:8000';

export interface PredictRequest {
  name: string;
  age: number;
  study_year: number;
  screen_time: number;
  social_media_time: number;
  gaming_time: number;
  sleep_duration: number;
  study_hours: number;
  concentration: number;
  phone_urge: number;
  sleep_disturbance: string;
  academic_satisfaction: number;
}

export interface PredictResponse {
  risk_level: string;
  risk_probability: number;
  sleep_disruption_index: number;
  cognitive_focus_index: number;
  recommendations: string[];
  top_features: Array<{ feature: string; impact: number; description: string }>;
  explanation: string;
}

export interface SimulateRequest {
  current_habits: PredictRequest;
  simulated_habits: PredictRequest;
}

export interface SimulateResponse {
  current_focus_index: number;
  simulated_focus_index: number;
  current_sleep_quality: number;
  simulated_sleep_quality: number;
  current_academic_index: number;
  simulated_academic_index: number;
  focus_delta: number;
  sleep_delta: number;
  academic_delta: number;
}

export interface AnalyticsResponse {
  average_screen_time: number;
  average_sleep_duration: number;
  risk_distribution: Record<string, number>;
  focus_by_study_year: Record<string, number>;
  total_assessments: number;
}

export const api = {
  async getHealth() {
    const res = await fetch(`${BASE_URL}/health`);
    return res.json();
  },
  
  async getAnalytics(): Promise<AnalyticsResponse> {
    const res = await fetch(`${BASE_URL}/analytics`);
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return res.json();
  },
  
  async predict(data: PredictRequest): Promise<PredictResponse> {
    const res = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to run prediction");
    return res.json();
  },
  
  async simulate(data: SimulateRequest): Promise<SimulateResponse> {
    const res = await fetch(`${BASE_URL}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to run simulation");
    return res.json();
  },
  
  async generateReport(studentName: string, assessmentData: PredictRequest, results: PredictResponse): Promise<Blob> {
    const res = await fetch(`${BASE_URL}/generate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_name: studentName,
        assessment_data: assessmentData,
        results: {
          risk_level: results.risk_level,
          risk_probability: results.risk_probability,
          sleep_disruption_index: results.sleep_disruption_index,
          cognitive_focus_index: results.cognitive_focus_index,
          recommendations: results.recommendations,
          top_features: results.top_features,
          explanation: results.explanation
        }
      }),
    });
    if (!res.ok) throw new Error("Failed to generate PDF report");
    return res.blob();
  },
  
  async chat(
    message: string,
    request: PredictRequest | null,
    response: PredictResponse | null
  ): Promise<{ assistant_message: string }> {
    const res = await fetch(`${BASE_URL}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_message: message,
        assessment_data: request,
        results: response
      }),
    });
    if (!res.ok) throw new Error("Failed to chat with Assistant");
    return res.json();
  }
};
