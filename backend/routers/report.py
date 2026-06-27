import io
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from schemas.models import ReportRequest

router = APIRouter()

@router.post("/generate-report", tags=["Report"])
async def generate_report(request: ReportRequest):
    # Setup byte buffer
    buffer = io.BytesIO()
    
    # Setup document
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    # Styles
    styles = getSampleStyleSheet()
    
    # Custom styles to fit white/blue theme
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=10
    )
    
    section_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=12,
        spaceAfter=6,
        borderColor=colors.HexColor('#cbd5e1'),
        borderWidth=0.5,
        borderPadding=4
    )
    
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9,
        textColor=colors.HexColor('#334155'),
        leading=13
    )

    bold_body_style = ParagraphStyle(
        'BoldBodyTextCustom',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    
    # Story flow
    story = []
    
    # Document Header
    story.append(Paragraph("MindSync AI – Digital Wellness Report", title_style))
    story.append(Paragraph("Scientific decision support analysis generated for student digital habits and cognitive focus.", body_style))
    story.append(Spacer(1, 10))
    
    # Student Profile Table
    profile_data = [
        [Paragraph("<b>Student Profile</b>", bold_body_style), ""],
        [Paragraph(f"Name: {request.student_name}", body_style), Paragraph(f"Age: {request.assessment_data.age} years", body_style)],
        [Paragraph(f"Study Year: Year {request.assessment_data.study_year}", body_style), Paragraph(f"Academic Level: {'Graduate' if request.assessment_data.study_year >= 5 else 'Undergraduate'}", body_style)]
    ]
    t_profile = Table(profile_data, colWidths=[250, 250])
    t_profile.setStyle(TableStyle([
        ('SPAN', (0, 0), (1, 0)),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f8fafc')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('LINEBELOW', (0, 0), (-1, 0), 1, colors.HexColor('#e2e8f0')),
    ]))
    story.append(t_profile)
    story.append(Spacer(1, 10))
    
    # Wellness Projections KPI Grid Table
    story.append(Paragraph("Wellness Projections & Predictions", section_style))
    
    # Determine color for risk level
    risk_color = '#b91c1c' if request.results.risk_level == "High" else ('#d97706' if request.results.risk_level == "Moderate" else '#059669')
    
    kpi_data = [
        [
            Paragraph("<b>Digital Wellness Score</b>", bold_body_style),
            Paragraph("<b>Addiction Risk</b>", bold_body_style),
            Paragraph("<b>Sleep Disruption</b>", bold_body_style)
        ],
        [
            Paragraph(f"<font size=16 color='#2563eb'><b>{request.results.cognitive_focus_index:.1f}/100</b></font>", body_style),
            Paragraph(f"<font size=12 color='{risk_color}'><b>{request.results.risk_level} ({request.results.risk_probability*100:.0f}%)</b></font>", body_style),
            Paragraph(f"<font size=12 color='#0f172a'><b>{(request.results.sleep_disruption_index):.0f}% Disrupted</b></font>", body_style)
        ]
    ]
    t_kpis = Table(kpi_data, colWidths=[166, 166, 166])
    t_kpis.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#eff6ff')),
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#bfdbfe')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#dbeafe')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(t_kpis)
    story.append(Spacer(1, 10))
    
    # Input Habits Table
    story.append(Paragraph("Student Daily Routine Metrics", section_style))
    habits_data = [
        [Paragraph("<b>Habit Dimension</b>", bold_body_style), Paragraph("<b>Reported Hours</b>", bold_body_style), Paragraph("<b>Target Reference</b>", bold_body_style)],
        [Paragraph("Daily Screen Time", body_style), Paragraph(f"{request.assessment_data.screen_time:.1f} hrs", body_style), Paragraph("< 4.0 hrs", body_style)],
        [Paragraph("Social Media Duration", body_style), Paragraph(f"{request.assessment_data.social_media_time:.1f} hrs", body_style), Paragraph("< 2.0 hrs", body_style)],
        [Paragraph("Nightly Sleep Hours", body_style), Paragraph(f"{request.assessment_data.sleep_duration:.1f} hrs", body_style), Paragraph("7.0 - 8.5 hrs", body_style)],
        [Paragraph("Independent Study Hours", body_style), Paragraph(f"{request.assessment_data.study_hours:.1f} hrs", body_style), Paragraph("> 3.0 hrs", body_style)]
    ]
    t_habits = Table(habits_data, colWidths=[200, 150, 150])
    t_habits.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (-1, 0), 1, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_habits)
    story.append(Spacer(1, 10))
    
    # Explainable AI / SHAP Summary
    story.append(Paragraph("Explainable AI (XAI) Diagnosis", section_style))
    story.append(Paragraph(f"<b>Key Contributing Factors:</b> {request.results.explanation}", body_style))
    story.append(Spacer(1, 4))
    
    # List top features
    for feat in request.results.top_features[:3]:
        feat_name = feat.get("feature", "Indicator")
        feat_impact = feat.get("impact", 0.0)
        feat_desc = feat.get("description", "")
        story.append(Paragraph(f"• <b>{feat_name}</b> (Impact Weight: +{feat_impact:.2f}): {feat_desc}", body_style))
        story.append(Spacer(1, 2))
    story.append(Spacer(1, 10))
    
    # Recommendations
    story.append(Paragraph("Personalized Action Plan", section_style))
    for rec in request.results.recommendations:
        story.append(Paragraph(f"✓ {rec}", body_style))
        story.append(Spacer(1, 3))
        
    story.append(Spacer(1, 15))
    story.append(Paragraph("<i>Note: This document provides educational feedback generated using machine learning models trained on student well-being surveys. It is intended for student decision support, not clinical diagnosis.</i>", body_style))
    
    # Build Document
    doc.build(story)
    
    # Seek to start
    buffer.seek(0)
    
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=mindsync_wellness_report_{request.student_name}.pdf"}
    )
