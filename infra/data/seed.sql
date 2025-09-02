-- Seed script for Holly v6

DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS phases;

CREATE TABLE IF NOT EXISTS projects (
    project_id TEXT PRIMARY KEY,
    project_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS phases (
    phase_id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    phase_name TEXT NOT NULL,
    FOREIGN KEY(project_id) REFERENCES projects(project_id)
);

-- Insert projects
INSERT INTO projects (project_id, project_name) VALUES
 ('proj1', 'Project 1'),
 ('proj2', 'Project 2'),
 ('proj3', 'Project 3'),
 ('proj4', 'Project 4'),
 ('proj5', 'Project 5');

-- Insert phases (3 per project)
INSERT INTO phases (phase_id, project_id, phase_name) VALUES
 ('proj1_phase1', 'proj1', 'Phase 1 of proj1'),
 ('proj1_phase2', 'proj1', 'Phase 2 of proj1'),
 ('proj1_phase3', 'proj1', 'Phase 3 of proj1'),
 ('proj2_phase1', 'proj2', 'Phase 1 of proj2'),
 ('proj2_phase2', 'proj2', 'Phase 2 of proj2'),
 ('proj2_phase3', 'proj2', 'Phase 3 of proj2'),
 ('proj3_phase1', 'proj3', 'Phase 1 of proj3'),
 ('proj3_phase2', 'proj3', 'Phase 2 of proj3'),
 ('proj3_phase3', 'proj3', 'Phase 3 of proj3'),
 ('proj4_phase1', 'proj4', 'Phase 1 of proj4'),
 ('proj4_phase2', 'proj4', 'Phase 2 of proj4'),
 ('proj4_phase3', 'proj4', 'Phase 3 of proj4'),
 ('proj5_phase1', 'proj5', 'Phase 1 of proj5'),
 ('proj5_phase2', 'proj5', 'Phase 2 of proj5'),
 ('proj5_phase3', 'proj5', 'Phase 3 of proj5');

-- Tasks are inserted dynamically in app seeding script (see Python helper)
