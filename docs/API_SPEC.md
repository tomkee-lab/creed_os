# Core_OS — REST API & Contract Specification

**Document Version:** 1.0.0  
**Base Path:** `/api/v1`  
**Data Format:** JSON (UTF-8)  
**Authentication:** Bearer JWT (Supabase Auth)  

---

## 1. Assessment Endpoints

### 1.1 `POST /api/v1/assessments/sessions`
Initialize a new adaptive diagnostic assessment session.

#### Request Body
```json
{
  "learnerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "domain": "stem_reasoning",
  "gradeBand": "middle_school_gr6_8"
}
```

#### Response (201 Created)
```json
{
  "sessionId": "b8a92e10-9f22-4a4b-87cf-45a7c2901234",
  "status": "in_progress",
  "domain": "stem_reasoning",
  "currentTheta": 0.0,
  "standardError": 1.0,
  "itemCount": 0,
  "firstItem": {
    "itemId": "ITEM-STEM-001",
    "prompt": "A balance scale has 3 identical spheres on the left side balancing with 1 sphere and a 12-gram weight on the right. What is the mass of one sphere?",
    "stimulusUrl": null,
    "options": [
      { "id": "opt-a", "text": "4 grams" },
      { "id": "opt-b", "text": "6 grams" },
      { "id": "opt-c", "text": "8 grams" },
      { "id": "opt-d", "text": "12 grams" }
    ]
  }
}
```

---

### 1.2 `POST /api/v1/assessments/sessions/:id/responses`
Submit a learner response to the current item, triggering server-authoritative scoring, 3PL EAP ability recalculation, and adaptive next-item selection.

#### Request Body
```json
{
  "itemId": "ITEM-STEM-001",
  "selectedOptionId": "opt-b",
  "timeSpentSeconds": 24.5
}
```

#### Response (200 OK — Test Continues)
```json
{
  "sessionId": "b8a92e10-9f22-4a4b-87cf-45a7c2901234",
  "status": "in_progress",
  "isCorrect": true,
  "currentTheta": 0.54,
  "standardError": 0.72,
  "itemCount": 1,
  "nextItem": {
    "itemId": "ITEM-STEM-008",
    "prompt": "In an experiment, fluid A flows through a pipe twice as fast as fluid B under identical pressure. Which statement about the viscosity is supported by this evidence?",
    "stimulusUrl": null,
    "options": [
      { "id": "opt-a", "text": "Fluid A has higher viscosity than Fluid B" },
      { "id": "opt-b", "text": "Fluid A has lower viscosity than Fluid B" },
      { "id": "opt-c", "text": "Both fluids have equal viscosity" },
      { "id": "opt-d", "text": "Viscosity cannot be compared without pipe diameter" }
    ]
  }
}
```

#### Response (200 OK — Test Converged & Completed)
```json
{
  "sessionId": "b8a92e10-9f22-4a4b-87cf-45a7c2901234",
  "status": "completed",
  "isCorrect": true,
  "currentTheta": 1.48,
  "standardError": 0.28,
  "itemCount": 8,
  "completionSummary": {
    "competencyEstimates": [
      { "competency": "Quantitative Reasoning", "level": 4.1, "confidence": "high" },
      { "competency": "Spatial Reasoning", "level": 4.6, "confidence": "very_high" },
      { "competency": "Scientific Inquiry", "level": 3.8, "confidence": "high" }
    ],
    "evidenceIdsGenerated": [
      "e1a49f82-1201-447a-9a11-827c191a721a",
      "e1a49f82-1201-447a-9a11-827c191a721b"
    ]
  }
}
```

---

## 2. Learner & Evidence Endpoints

### 2.1 `GET /api/v1/learners/:id/profile`
Fetch complete longitudinal learner profile including competency radar metrics and active pathway readiness.

#### Response (200 OK)
```json
{
  "learnerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Anaya Verma",
  "grade": 8,
  "competencies": {
    "spatial_reasoning": { "score": 4.5, "descriptor": "Advanced", "confidence": 0.92 },
    "quantitative_reasoning": { "score": 2.8, "descriptor": "Developing", "confidence": 0.88 },
    "logical_deduction": { "score": 3.9, "descriptor": "Proficient", "confidence": 0.85 },
    "scientific_inquiry": { "score": 3.7, "descriptor": "Proficient", "confidence": 0.82 },
    "computational_thinking": { "score": 4.1, "descriptor": "Advanced", "confidence": 0.89 }
  },
  "topPathways": [
    { "pathwayId": "PATH-ROBOTICS", "title": "Robotics & Automation", "readiness": 0.74, "mismatchStatus": "foundation_gap" },
    { "pathwayId": "PATH-PRODUCT-DESIGN", "title": "Industrial Product Design", "readiness": 0.91, "mismatchStatus": "aligned" }
  ]
}
```

---

### 2.2 `GET /api/v1/learners/:id/evidence`
Retrieve full provenance trace for the learner's demonstrated skills.

#### Response (200 OK)
```json
{
  "learnerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "evidenceCount": 14,
  "evidence": [
    {
      "id": "e1a49f82-1201-447a-9a11-827c191a721a",
      "competency": "Spatial Reasoning",
      "strengthLevel": 4,
      "sourceType": "project_mission",
      "sourceName": "RoboBridge Structural Optimization Challenge",
      "observedAt": "2026-09-28T14:30:00Z",
      "confidence": 0.92,
      "summary": "Achieved load-to-weight ratio of 4.8x using 3D isometric truss distribution."
    }
  ]
}
```

---

## 3. Pathway & Mismatch Endpoints

### 3.1 `POST /api/v1/pathways/:id/mismatch`
Evaluate prerequisite alignment between a target pathway and a learner's profile, generating a constructive growth roadmap.

#### Request Body
```json
{
  "learnerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

#### Response (200 OK)
```json
{
  "pathwayId": "PATH-ROBOTICS",
  "pathwayTitle": "Robotics & Autonomous Systems",
  "overallReadiness": 0.74,
  "status": "constructive_mismatch",
  "strengthsMeetingRequirements": [
    { "competency": "Spatial Reasoning", "required": 3.5, "demonstrated": 4.5, "delta": "+1.0" },
    { "competency": "Computational Thinking", "required": 3.0, "demonstrated": 4.1, "delta": "+1.1" }
  ],
  "foundationGaps": [
    {
      "competency": "Quantitative Reasoning",
      "required": 3.2,
      "demonstrated": 2.8,
      "delta": "-0.4",
      "coreConcept": "Proportional scaling and multi-variable equation isolation"
    }
  ],
  "recommendedIntervention": {
    "title": "8-Week Kinematic & Algebraic Foundations Sprint",
    "durationWeeks": 8,
    "weeklyCommitmentHours": 3,
    "targetedSkills": ["Linear Equation Transformation", "Ratios & Rates of Change"]
  },
  "tryBeforeYouChooseMissions": [
    {
      "missionId": "MISSION-ROBOT-01",
      "title": "Autonomous Rover Sensor Calibration",
      "description": "Calculate ultrasonic sensor feedback delay under noisy motor vibration."
    }
  ]
}
```
