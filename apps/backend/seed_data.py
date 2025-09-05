from datetime import datetime, timedelta

seed_boards = [
    {"name": "Home Life", "type": "system", "goal": "Stay on top of household and personal tasks"},
    {"name": "Health", "type": "system", "goal": "Maintain wellbeing and balance"},
    {"name": "Social", "type": "system", "goal": "Stay connected with friends and family"},
    {"name": "Client Work", "type": "custom", "goal": "Deliver high-quality client projects"},
]

seed_projects = [
    {"name": "Website Redesign", "board_name": "Client Work", "notes": "High priority client deliverable"},
    {"name": "Spring Cleaning", "board_name": "Home Life", "notes": "Plan for the weekend"},
]

seed_phases = [
    {"project_name": "Website Redesign", "name": "Planning", "deadline": datetime.utcnow() + timedelta(days=3)},
    {"project_name": "Website Redesign", "name": "Design", "deadline": datetime.utcnow() + timedelta(days=7)},
    {"project_name": "Website Redesign", "name": "Development", "deadline": None},
    {"project_name": "Spring Cleaning", "name": "Prep", "deadline": None},
    {"project_name": "Spring Cleaning", "name": "Clean", "deadline": None},
]

seed_tasks = [
    {"task_name": "Update homepage banner", "board_name": "Client Work", "project_name": "Website Redesign", "phase_name": "Design", "due_date": datetime.utcnow() + timedelta(days=2), "status": "Todo", "priority": "High", "effort_level": "Medium", "notes": "Client provided assets"},
    {"task_name": "Finalize wireframes", "board_name": "Client Work", "project_name": "Website Redesign", "phase_name": "Planning", "due_date": datetime.utcnow() + timedelta(days=1), "status": "In Progress", "priority": "High", "effort_level": "Large", "notes": "Need sign-off from client"},
    {"task_name": "Vacuum living room", "board_name": "Home Life", "project_name": "Spring Cleaning", "phase_name": "Clean", "due_date": None, "status": "Todo", "priority": "Medium", "effort_level": "Small", "notes": "Don’t forget behind the sofa"},
    {"task_name": "Organize bookshelf", "board_name": "Home Life", "project_name": "Spring Cleaning", "phase_name": "Prep", "due_date": None, "status": "Todo", "priority": "Low", "effort_level": "Small", "notes": "Might donate old books"},
    {"task_name": "Book dentist appointment", "board_name": "Health", "project_name": None, "phase_name": None, "due_date": datetime.utcnow() + timedelta(days=7), "status": "Todo", "priority": "Medium", "effort_level": "Small", "notes": "Check insurance coverage first"},
    {"task_name": "Plan birthday dinner", "board_name": "Social", "project_name": None, "phase_name": None, "due_date": None, "status": "Pinned", "priority": "Medium", "effort_level": "Medium", "notes": "Consider Italian restaurant"},
]

seed_habits = [
    {"title": "Morning meditation", "frequency": "daily", "zone": "Health", "streak": 3},
    {"title": "Check emails twice a day", "frequency": "custom", "zone": "Client Work", "streak": 1},
]

seed_reflections = [
    {"content": "Felt productive but distracted. Holly suggested I revisit tasks in Health board.", "mood": "Mixed"},
]