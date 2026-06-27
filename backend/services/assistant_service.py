import re
from schemas.models import PredictRequest, PredictResponse

def generate_grounded_response(
    user_message: str,
    req: PredictRequest | None = None,
    res: PredictResponse | None = None
) -> str:
    msg = user_message.lower().strip()
    
    # 1. Out-of-scope Filter
    out_of_scope_topics = [
        r'\bweather\b', r'\bcode\b', r'\bprogramming\b', r'\bpython\b', r'\bjavascript\b',
        r'\bhtml\b', r'\bcss\b', r'\brecipe\b', r'\bcook\b', r'\bpolitics\b', r'\bpresident\b',
        r'\bstock\b', r'\bmarket\b', r'\bprice\b', r'\bsport\b', r'\bfootball\b', r'\bgame\b'
    ]
    # Exempt gaming_time if user is asking about gaming hours in wellness context
    if any(re.search(pattern, msg) for pattern in out_of_scope_topics) and not re.search(r'\bgaming hours\b|\bplay time\b', msg):
        return (
            "I specialize in digital well-being, device habits, sleep restoration, and academic impacts. "
            "Let's keep our conversation focused on helping you build a healthier digital lifestyle! "
            "Feel free to ask about your wellness score or how to improve your habits."
        )

    # If no prediction data is available yet, prompt user to take the assessment
    if req is None or res is None:
        return (
            "Hello! I am your MindSync AI wellness coach. To provide personalized advice, I need to see your "
            "digital habits first. Please go to the 'Assessment' tab and complete the questionnaire so I can "
            "analyze your wellness score and suggest target changes!"
        )

    # Calculate local derived variables
    addiction_score = res.risk_probability * 7.0 + 2.0
    academic_disrupted = res.sleep_disruption_index > 50 or res.cognitive_focus_index < 60

    # 2. Intent Matching & Grounded Responses
    words = set(re.findall(r'\b\w+\b', msg))
    
    # Intent A: Hello / Intro
    if any(k in words for k in ['hello', 'hi', 'hey', 'greetings']) or 'who are you' in msg or 'what is your name' in msg:
        return (
            f"Hello {req.name}! I am your MindSync AI digital wellness coach. I've reviewed your assessment "
            f"and can help explain your Wellness Score ({res.cognitive_focus_index:.1f}/100), dependency risks "
            f"({res.risk_level} Risk), and recommended action steps. What would you like to discuss today?"
        )
        
    # Intent B: Addiction Risk / Prediction Score
    elif any(k in msg for k in ['addiction', 'risk', 'high score', 'classify', 'prediction', 'why is my score']):
        top_features_str = ", ".join([f"{f['feature']} (+{f['impact']})" for f in res.top_features[:2]])
        return (
            f"I see you are asking about your smartphone dependency risk. According to our XGBoost model, "
            f"you are classified as {res.risk_level} Risk with a predicted addiction score of {addiction_score:.1f}/9. "
            f"The primary factors driving this prediction are: {top_features_str}. "
            f"I suggest starting by reducing your {res.top_features[0]['feature'].lower()} and setting screen limits. "
            f"Small, consistent daily boundaries will help lower this risk significantly."
        )
        
    # Intent C: Wellness Score / Focus Index
    elif any(k in msg for k in ['wellness score', 'wellness index', 'focus index', 'my score', 'focus score']):
        return (
            f"Your overall Digital Wellness Score is {res.cognitive_focus_index:.1f} out of 100. "
            f"This score combines your reported screen time ({req.screen_time} hrs), social media usage ({req.social_media_time} hrs), "
            f"sleep duration ({req.sleep_duration} hrs), and predicted addiction level. "
            f"To boost this score, I recommend targeting your sleep duration—improving sleep is the fastest way to "
            f"restore cognitive focus. Let's aim to decrease screen time and build healthier routines!"
        )

    # Intent D: Sleep / Night routines
    elif any(k in msg for k in ['sleep', 'night', 'bed', 'insomnia', 'disturbed']):
        status = "disturbed by notifications" if req.sleep_disturbance == "yes" else "restful"
        return (
            f"You reported an average sleep duration of {req.sleep_duration} hours per night, which is {status}. "
            f"Insufficient sleep is highly correlated with elevated phone urge indices. "
            f"My recommendation is to turn off all screens 30 minutes before bed and charge your phone across the room. "
            f"Getting 7.5+ hours of restorative sleep will immediately boost your focus and digital boundaries!"
        )

    # Intent E: Recommendations / How to improve / Action plan
    elif any(k in msg for k in ['improve', 'recommend', 'change', 'action', 'do', 'help', 'tips', 'advice']):
        recs = "\\n".join([f"- {rec}" for rec in res.recommendations])
        return (
            f"Here is your personalized action plan based on your wellness profile:\\n{recs}\\n"
            f"I recommend choosing just one step to work on this week—like setting a screen-free bedtime. "
            f"Focus on small wins to establish lasting digital wellness habits!"
        )

    # Intent F: Academic Performance / Focus
    elif any(k in msg for k in ['academic', 'performance', 'gpa', 'study', 'focus', 'satisfaction', 'concentration']):
        impact_msg = "highly likely to negatively affect" if academic_disrupted else "unlikely to disrupt"
        return (
            f"Your profile indicates that your current device habits are {impact_msg} your academic performance, "
            f"with your self-rated focus at {req.concentration}/5. "
            f"Distractions during study hours often create pseudo-learning. "
            f"I suggest trying the Feynman Recall Technique or block-scheduling offline study blocks to improve retention. "
            f"You have the capability to get back on track!"
        )

    # Intent G: Habit Simulator / Screen time
    elif any(k in msg for k in ['reduce', 'screen time', 'social media time', 'simulate', 'simulator']):
        return (
            f"You currently spend {req.social_media_time} hours on social media out of {req.screen_time} total screen hours. "
            f"If you use the Habit Simulator to reduce your social media usage to 2 hours and increase sleep to 8 hours, "
            f"our models project a significant lift in your Wellness Index. "
            f"Try adjusting the sliders in the Habit Simulator tab to see these projected gains!"
        )

    # Default fallback
    recs_snippet = res.recommendations[0] if res.recommendations else "reducing late night screen exposure"
    return (
        f"I hear your question about digital habits. Looking at your wellness profile, your screen time "
        f"is {req.screen_time} hours with {res.risk_level} addiction risk. "
        f"To improve, I suggest focused actions like: '{recs_snippet}'. "
        f"Let me know if you would like me to explain your wellness score, sleep quality, or academic impact in detail!"
    )
