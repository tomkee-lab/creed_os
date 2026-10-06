-- Core_OS Seed Data

-- 1. Insert Core Competencies
insert into competencies (id, domain, code, name, description) values
  ('c1000000-0000-0000-0000-000000000001', 'quantitative_reasoning', 'COMP-QR', 'Quantitative Reasoning', 'Formulating equations, rates of change, proportional reasoning, and dimensional scaling.'),
  ('c1000000-0000-0000-0000-000000000002', 'spatial_reasoning', 'COMP-SR', 'Spatial Reasoning', 'Mental 3D rotation, orthographic projections, isometric visualization, and geometric transformations.'),
  ('c1000000-0000-0000-0000-000000000003', 'logical_deduction', 'COMP-LOG', 'Logical Deduction', 'Conditional inferences, syllogisms, truth validation, and constraint-based problem decomposition.'),
  ('c1000000-0000-0000-0000-000000000004', 'scientific_inquiry', 'COMP-SCI', 'Scientific Inquiry', 'Formulating falsifiable hypotheses, isolating control variables, and data-driven trend inference.'),
  ('c1000000-0000-0000-0000-000000000005', 'computational_thinking', 'COMP-CT', 'Computational Thinking', 'Algorithmic loop tracing, recursion states, pattern decomposition, and systematic problem solving.')
on conflict (code) do nothing;

-- 2. Insert STEM Pathways
insert into pathways (id, code, field, title, tagline, overview, growth_outlook, requirements, routes, missions) values
  (
    'PATH-ROBOTICS',
    'ROBOTICS-01',
    'engineering',
    'Robotics & Autonomous Systems',
    'Engineer intelligent electromechanical systems that interact dynamically with the physical world.',
    'Robotics integrates mechanical design, kinematic geometry, embedded sensor processing, and real-time control software.',
    'High Demand (+28% projected 10-year growth in automation and robotics engineering).',
    '[
      {"competency": "spatial_reasoning", "minimumLevel": 3.5, "importance": "critical_foundation"},
      {"competency": "quantitative_reasoning", "minimumLevel": 3.2, "importance": "critical_foundation"},
      {"competency": "computational_thinking", "minimumLevel": 3.0, "importance": "strongly_recommended"},
      {"competency": "scientific_inquiry", "minimumLevel": 2.8, "importance": "desirable"}
    ]',
    '[
      {"id": "r1", "type": "university_degree", "title": "B.Tech Mechatronics & Robotics", "durationYears": 4, "description": "Rigorous undergraduate engineering program with hands-on kinematics laboratory work."},
      {"id": "r2", "type": "polytechnic_diploma", "title": "Diploma in Industrial Automation", "durationYears": 3, "description": "Applied polytechnic credential emphasizing PLC programming and robotic arm servicing."},
      {"id": "r3", "type": "project_portfolio", "title": "Applied Hardware & Open-Source Portfolio", "durationYears": 2, "description": "Demonstrated ROS (Robot Operating System) contributions and physical robot build logs."}
    ]',
    '[
      {
        "id": "MISSION-ROBOT-01",
        "pathwayId": "PATH-ROBOTICS",
        "title": "RoboBridge Structural Optimization Challenge",
        "headline": "Design a lightweight bridge truss carrying 5x its own weight.",
        "description": "Construct an isometric truss structure balancing compressive and tensile load vectors under strict weight limits.",
        "durationMinutes": 45,
        "difficulty": "intermediate",
        "competenciesTested": ["spatial_reasoning", "quantitative_reasoning"],
        "scenario": "A supply rover must cross a 14-meter gorge. You are allocated 40 carbon fiber struts.",
        "constraints": ["Maximum total mass: 250 kg", "Deflection under load must not exceed 2 cm"],
        "deliverable": "A completed structural node coordinate plan and load deflection graph."
      }
    ]'
  ),
  (
    'PATH-AI-DATA',
    'DATA-AI-01',
    'computing_ai',
    'Data Intelligence & Machine Learning',
    'Discover patterns in complex multidimensional data to solve critical problems.',
    'Combines mathematical statistical inference, algorithmic efficiency, and machine learning pipelines.',
    'Exceptional Global Growth (+34% across statistical modeling and intelligent software).',
    '[
      {"competency": "computational_thinking", "minimumLevel": 3.5, "importance": "critical_foundation"},
      {"competency": "quantitative_reasoning", "minimumLevel": 3.4, "importance": "critical_foundation"},
      {"competency": "logical_deduction", "minimumLevel": 3.2, "importance": "strongly_recommended"}
    ]',
    '[
      {"id": "r4", "type": "university_degree", "title": "B.S. / B.Tech Computer Science & AI", "durationYears": 4, "description": "Core computer science foundation with advanced linear algebra and probability."},
      {"id": "r5", "type": "project_portfolio", "title": "Kaggle & GitHub Applied Machine Learning", "durationYears": 2, "description": "Public reproducible data analysis notebooks and deployed model endpoints."}
    ]',
    '[
      {
        "id": "MISSION-DATA-01",
        "pathwayId": "PATH-AI-DATA",
        "title": "Urban Climate Heat-Island Pattern Discovery",
        "headline": "Isolate microclimate temperature anomalies from 10,000 sensor feeds.",
        "description": "Clean noisy geospatial sensor readings and isolate statistical outliers to determine park cooling footprints.",
        "durationMinutes": 35,
        "difficulty": "intermediate",
        "competenciesTested": ["computational_thinking", "scientific_inquiry"],
        "scenario": "A city planning department requires empirical proof of urban canopy cooling effectiveness.",
        "constraints": ["Eliminate sensor drift anomalies", "Provide 95% confidence interval on temperature deltas"],
        "deliverable": "A cleaned anomaly matrix and correlation scatterplot."
      }
    ]'
  )
on conflict (id) do nothing;
