-- =====================================================
-- Projects
-- =====================================================
INSERT INTO projects VALUES
('p1','AI Companion','active',20),
('p2','Frontend Redesign','planning',0),
('p3','Mobile App','active',10),
('p4','Marketing Site','active',50),
('p5','Data Pipeline','planning',0);

-- =====================================================
-- Phases
-- =====================================================
INSERT INTO phases VALUES
('ph1','Setup Backend','p1'),
('ph2','Integrate Voice','p1'),
('ph3','Deploy Prototype','p1'),
('ph4','Wireframes','p2'),
('ph5','Implement UI','p2'),
('ph6','Polish Styling','p2'),
('ph7','Auth System','p3'),
('ph8','Offline Mode','p3'),
('ph9','Notifications','p3'),
('ph10','Landing Page','p4'),
('ph11','Docs Section','p4'),
('ph12','SEO Optimisation','p4'),
('ph13','Ingestion','p5'),
('ph14','Processing','p5'),
('ph15','Analytics','p5');

-- =====================================================
-- Project Tasks (sample, truncated for brevity)
-- =====================================================
INSERT INTO tasks VALUES
('pt1','Design DB schema','Define core tables','2025-09-01','done','high','work','p1','ph1'),
('pt2','Implement FastAPI','Scaffold endpoints','2025-09-02','in_progress','high','work','p1','ph1'),
('pt3','Auth middleware','Secure tokens','2025-09-03','todo','medium','work','p1','ph1'),
('pt4','Integrate Whisper','STT engine','2025-09-04','todo','high','work','p1','ph2'),
('pt5','Integrate Coqui TTS','Voice output','2025-09-05','todo','high','work','p1','ph2');

-- =====================================================
-- Standalone Tasks (Week 1 only shown here)
-- =====================================================
INSERT INTO tasks VALUES
('t001','Plan sprint','Define backlog for week','2025-09-01','done','high','work',NULL,NULL),
('t002','Doctor appointment','Annual checkup','2025-09-01','done','medium','personal',NULL,NULL),
('t003','Team standup','Daily sync','2025-09-02','done','medium','work',NULL,NULL),
('t004','Write unit tests','Cover db models','2025-09-02','in_progress','high','work',NULL,NULL),
('t005','Grocery shopping','Weekly essentials','2025-09-02','todo','low','personal',NULL,NULL);

-- (Weeks 2–5 + remaining ~120 tasks to be expanded from seed data we prepared)

-- =====================================================
-- Habits
-- =====================================================
INSERT INTO habits VALUES
('h1','Morning Walk','daily',12,'30 days','2025-08-27'),
('h2','Journal 5 Minutes','daily',7,'30 days','2025-08-27'),
('h3','No Sugar','daily',4,'30 days','2025-08-26'),
('h4','Workout','3x/week',2,'12 weeks','2025-08-25'),
('h5','Read 20 Minutes','daily',10,'30 days','2025-08-27');