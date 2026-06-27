# 🧠 Machine Learning & Data Science Documentation - MindSync AI

This document provides details on the dataset, preprocessing pipelines, model selection, evaluation metrics, explainability, and recommendation heuristics.

---

## 1. Dataset Characteristics

We utilize the **Egypt Student Social Media Addiction Dataset** (comprising 12,038 students, split into 9,627 train samples and 2,411 test samples).

### Schema Columns:
- **Age** (Numerical: 15-30) - Age of the respondent.
- **Gender** (Categorical: Male/Female) - Gender identity.
- **Academic_Level** (Categorical: Undergraduate/Graduate/High School) - Student class level.
- **Country / Governorate** (Categorical) - Location variables (constant or high-cardinality).
- **Avg_Daily_Usage_Hours** (Numerical: 0-18 hrs) - Hours active on social networks.
- **Most_Used_Platform** (Categorical: Snapchat, TikTok, Instagram, WeChat, Facebook, etc.) - Primary channel.
- **Sleep_Hours_Per_Night** (Numerical: 3-12 hrs) - Rest hours.
- **Mental_Health_Score** (Numerical: 1-10) - Subjective mental distress rating.
- **Relationship_Status** (Categorical: Single/In Relationship/Complicated) - Profile grouping.
- **Conflicts_Over_Social_Media** (Numerical: 1-10) - Score assessing personal/social arguments regarding device usage.
- **Addicted_Score** (Numerical Target: 2-9) - Clinically validated digital addiction scale.
- **Affects_Academic_Performance** (Categorical Target: Yes/No) - Indication of academic degradation.

---

## 2. Data Preprocessing & Cleaning

1. **Imputation:**
   - **Numerical columns** (`Age`, `Avg_Daily_Usage_Hours`, `Sleep_Hours_Per_Night`, `Mental_Health_Score`, `Conflicts_Over_Social_Media`) are filled using **Median Imputation** to prevent outlier skew.
   - **Categorical columns** (`Gender`, `Academic_Level`, `Most_Used_Platform`, `Relationship_Status`) are filled using **Mode Imputation** (most frequent class).
2. **Duplication:** Identifies and drops exact duplicate records (1 duplicate dropped during training).
3. **Outlier Auditing:** Utilizes Interquartile Range (IQR) checks to isolate extreme values. We report outliers (e.g. usage > 8.3 hrs) but preserve them in training as they represent real clinical extrema in student behaviors.
4. **Categorical Encoding:** One-Hot Encodes categorical features to convert them to numeric vectors.
5. **Feature Scaling:** Applies Standard Scaling (`StandardScaler`) to numerical columns.

---

## 3. Model Training & Evaluation

We train two pipelines to address two distinct target outcomes:

### Model A: Addiction Score (Regression)
- **Target:** `Addicted_Score` (ordinal target, 2 to 9 scale)
- **Metrics on Test Set:**
  - *Linear Regression (Baseline):* $R^2 = 0.8150$, $\text{RMSE} = 0.6851$, $\text{MAE} = 0.5513$
  - *Random Forest Regressor:* $R^2 = 0.8204$, $\text{RMSE} = 0.6751$, $\text{MAE} = 0.5237$
  - *XGBoost Regressor:* $R^2 = 0.8220$, $\text{RMSE} = 0.6721$, $\text{MAE} = 0.5229$
- **Selected Model:** **XGBoost Regressor** (saved to `models/best_addiction_model.joblib`).

### Model B: Academic Performance Impact (Classification)
- **Target:** `Affects_Academic_Performance` (binary target: 'Yes' -> 1, 'No' -> 0)
- **Metrics on Test Set:**
  - *Logistic Regression (Baseline):* $\text{Accuracy} = 0.8909$, $F_1 = 0.9156$, $\text{ROC-AUC} = 0.9578$
  - *Random Forest Classifier:* $\text{Accuracy} = 0.8888$, $F_1 = 0.9145$, $\text{ROC-AUC} = 0.9558$
  - *XGBoost Classifier:* $\text{Accuracy} = 0.8880$, $F_1 = 0.9132$, $\text{ROC-AUC} = 0.9568$
- **Selected Model:** **Logistic Regression Classifier** (saved to `models/best_academic_model.joblib`).

---

## 4. Explainable AI & SHAP Logic

Every prediction outputs the top feature weights driving the model decision:
- **SHAP values** explain the delta between the baseline expected output and the individual predicted value.
- The top-contributing features (e.g. `Avg_Daily_Usage_Hours` and `Conflicts_Over_Social_Media`) are sorted and displayed in a bar chart in the frontend to tell the student exactly *why* their digital addiction risk is rated High, Moderate, or Low.

---

## 5. Habit Simulator Sandbox

- **Heuristic:** Replaces the current habits variables with the simulated slider values (e.g. sleep duration, study hours, social media hours) and reruns the inference pipeline (`best_addiction_model` and `best_academic_model`).
- **Deltas:** Compares predicted indices before and after the change to calculate the exact percentage improvement in cognitive focus, sleep quality, and academic trends.

---

## 6. Recommendations Engine Heuristics

Personalized rules translate model predictions and feature inputs into targeted action items:
- $\text{Usage} \ge 4.0\text{ hours} \implies$ "Implement a Digital Fasting Hour: Lock devices away for 60 mins during study blocks."
- $\text{Sleep} < 7.0\text{ hours} \implies$ "Screen-Free Bedtime: Turn off all digital displays 30 mins before sleep."
- $\text{Addiction Score} \ge 6.0 \implies$ "Schedule screen-free weekends to detox dopamine channels."
- $\text{Phone Urge} \ge 4 \implies$ "Keep phone outside study spaces to build impulse control."
