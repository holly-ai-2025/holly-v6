import { Task } from './tasks';

export interface Phase { id: string; name: string; tasks: Task[]; }
export interface Project { id: string; name: string; progress: number; status: 'On Track' | 'At Risk' | 'Ahead'; phases: Phase[]; }

export const projects: Project[] = [
  {
    "id": "proj1",
    "name": "Project 1",
    "progress": 0,
    "status": "On Track",
    "phases": [
      {
        "id": "proj1-ph1",
        "name": "Phase 1",
        "tasks": [
          {
            "id": "proj1-ph1-t1",
            "title": "Task 1 of Phase 1 in Project 1",
            "status": "Todo",
            "due": "2025-09-02",
            "projectId": "proj1",
            "phaseId": "proj1-ph1",
            "dependsOn": []
          },
          {
            "id": "proj1-ph1-t2",
            "title": "Task 2 of Phase 1 in Project 1",
            "status": "Todo",
            "due": "2025-09-03",
            "projectId": "proj1",
            "phaseId": "proj1-ph1",
            "dependsOn": [
              "proj1-ph1-t1"
            ]
          },
          {
            "id": "proj1-ph1-t3",
            "title": "Task 3 of Phase 1 in Project 1",
            "status": "Todo",
            "due": "2025-09-04",
            "projectId": "proj1",
            "phaseId": "proj1-ph1",
            "dependsOn": [
              "proj1-ph1-t2"
            ]
          }
        ]
      },
      {
        "id": "proj1-ph2",
        "name": "Phase 2",
        "tasks": [
          {
            "id": "proj1-ph2-t1",
            "title": "Task 1 of Phase 2 in Project 1",
            "status": "Todo",
            "due": "2025-09-04",
            "projectId": "proj1",
            "phaseId": "proj1-ph2",
            "dependsOn": []
          },
          {
            "id": "proj1-ph2-t2",
            "title": "Task 2 of Phase 2 in Project 1",
            "status": "Todo",
            "due": "2025-09-05",
            "projectId": "proj1",
            "phaseId": "proj1-ph2",
            "dependsOn": [
              "proj1-ph2-t1"
            ]
          },
          {
            "id": "proj1-ph2-t3",
            "title": "Task 3 of Phase 2 in Project 1",
            "status": "Todo",
            "due": "2025-09-06",
            "projectId": "proj1",
            "phaseId": "proj1-ph2",
            "dependsOn": [
              "proj1-ph2-t2"
            ]
          }
        ]
      },
      {
        "id": "proj1-ph3",
        "name": "Phase 3",
        "tasks": [
          {
            "id": "proj1-ph3-t1",
            "title": "Task 1 of Phase 3 in Project 1",
            "status": "Todo",
            "due": "2025-09-06",
            "projectId": "proj1",
            "phaseId": "proj1-ph3",
            "dependsOn": []
          },
          {
            "id": "proj1-ph3-t2",
            "title": "Task 2 of Phase 3 in Project 1",
            "status": "Todo",
            "due": "2025-09-07",
            "projectId": "proj1",
            "phaseId": "proj1-ph3",
            "dependsOn": [
              "proj1-ph3-t1"
            ]
          },
          {
            "id": "proj1-ph3-t3",
            "title": "Task 3 of Phase 3 in Project 1",
            "status": "Todo",
            "due": "2025-09-08",
            "projectId": "proj1",
            "phaseId": "proj1-ph3",
            "dependsOn": [
              "proj1-ph3-t2"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "proj2",
    "name": "Project 2",
    "progress": 0,
    "status": "On Track",
    "phases": [
      {
        "id": "proj2-ph1",
        "name": "Phase 1",
        "tasks": [
          {
            "id": "proj2-ph1-t1",
            "title": "Task 1 of Phase 1 in Project 2",
            "status": "Todo",
            "due": "2025-09-08",
            "projectId": "proj2",
            "phaseId": "proj2-ph1",
            "dependsOn": []
          },
          {
            "id": "proj2-ph1-t2",
            "title": "Task 2 of Phase 1 in Project 2",
            "status": "Todo",
            "due": "2025-09-09",
            "projectId": "proj2",
            "phaseId": "proj2-ph1",
            "dependsOn": [
              "proj2-ph1-t1"
            ]
          },
          {
            "id": "proj2-ph1-t3",
            "title": "Task 3 of Phase 1 in Project 2",
            "status": "Todo",
            "due": "2025-09-10",
            "projectId": "proj2",
            "phaseId": "proj2-ph1",
            "dependsOn": [
              "proj2-ph1-t2"
            ]
          }
        ]
      },
      {
        "id": "proj2-ph2",
        "name": "Phase 2",
        "tasks": [
          {
            "id": "proj2-ph2-t1",
            "title": "Task 1 of Phase 2 in Project 2",
            "status": "Todo",
            "due": "2025-09-10",
            "projectId": "proj2",
            "phaseId": "proj2-ph2",
            "dependsOn": []
          },
          {
            "id": "proj2-ph2-t2",
            "title": "Task 2 of Phase 2 in Project 2",
            "status": "Todo",
            "due": "2025-09-11",
            "projectId": "proj2",
            "phaseId": "proj2-ph2",
            "dependsOn": [
              "proj2-ph2-t1"
            ]
          },
          {
            "id": "proj2-ph2-t3",
            "title": "Task 3 of Phase 2 in Project 2",
            "status": "Todo",
            "due": "2025-09-12",
            "projectId": "proj2",
            "phaseId": "proj2-ph2",
            "dependsOn": [
              "proj2-ph2-t2"
            ]
          }
        ]
      },
      {
        "id": "proj2-ph3",
        "name": "Phase 3",
        "tasks": [
          {
            "id": "proj2-ph3-t1",
            "title": "Task 1 of Phase 3 in Project 2",
            "status": "Todo",
            "due": "2025-09-12",
            "projectId": "proj2",
            "phaseId": "proj2-ph3",
            "dependsOn": []
          },
          {
            "id": "proj2-ph3-t2",
            "title": "Task 2 of Phase 3 in Project 2",
            "status": "Todo",
            "due": "2025-09-13",
            "projectId": "proj2",
            "phaseId": "proj2-ph3",
            "dependsOn": [
              "proj2-ph3-t1"
            ]
          },
          {
            "id": "proj2-ph3-t3",
            "title": "Task 3 of Phase 3 in Project 2",
            "status": "Todo",
            "due": "2025-09-14",
            "projectId": "proj2",
            "phaseId": "proj2-ph3",
            "dependsOn": [
              "proj2-ph3-t2"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "proj3",
    "name": "Project 3",
    "progress": 0,
    "status": "On Track",
    "phases": [
      {
        "id": "proj3-ph1",
        "name": "Phase 1",
        "tasks": [
          {
            "id": "proj3-ph1-t1",
            "title": "Task 1 of Phase 1 in Project 3",
            "status": "Todo",
            "due": "2025-09-14",
            "projectId": "proj3",
            "phaseId": "proj3-ph1",
            "dependsOn": []
          },
          {
            "id": "proj3-ph1-t2",
            "title": "Task 2 of Phase 1 in Project 3",
            "status": "Todo",
            "due": "2025-09-15",
            "projectId": "proj3",
            "phaseId": "proj3-ph1",
            "dependsOn": [
              "proj3-ph1-t1"
            ]
          },
          {
            "id": "proj3-ph1-t3",
            "title": "Task 3 of Phase 1 in Project 3",
            "status": "Todo",
            "due": "2025-09-16",
            "projectId": "proj3",
            "phaseId": "proj3-ph1",
            "dependsOn": [
              "proj3-ph1-t2"
            ]
          }
        ]
      },
      {
        "id": "proj3-ph2",
        "name": "Phase 2",
        "tasks": [
          {
            "id": "proj3-ph2-t1",
            "title": "Task 1 of Phase 2 in Project 3",
            "status": "Todo",
            "due": "2025-09-16",
            "projectId": "proj3",
            "phaseId": "proj3-ph2",
            "dependsOn": []
          },
          {
            "id": "proj3-ph2-t2",
            "title": "Task 2 of Phase 2 in Project 3",
            "status": "Todo",
            "due": "2025-09-17",
            "projectId": "proj3",
            "phaseId": "proj3-ph2",
            "dependsOn": [
              "proj3-ph2-t1"
            ]
          },
          {
            "id": "proj3-ph2-t3",
            "title": "Task 3 of Phase 2 in Project 3",
            "status": "Todo",
            "due": "2025-09-18",
            "projectId": "proj3",
            "phaseId": "proj3-ph2",
            "dependsOn": [
              "proj3-ph2-t2"
            ]
          }
        ]
      },
      {
        "id": "proj3-ph3",
        "name": "Phase 3",
        "tasks": [
          {
            "id": "proj3-ph3-t1",
            "title": "Task 1 of Phase 3 in Project 3",
            "status": "Todo",
            "due": "2025-09-18",
            "projectId": "proj3",
            "phaseId": "proj3-ph3",
            "dependsOn": []
          },
          {
            "id": "proj3-ph3-t2",
            "title": "Task 2 of Phase 3 in Project 3",
            "status": "Todo",
            "due": "2025-09-19",
            "projectId": "proj3",
            "phaseId": "proj3-ph3",
            "dependsOn": [
              "proj3-ph3-t1"
            ]
          },
          {
            "id": "proj3-ph3-t3",
            "title": "Task 3 of Phase 3 in Project 3",
            "status": "Todo",
            "due": "2025-09-20",
            "projectId": "proj3",
            "phaseId": "proj3-ph3",
            "dependsOn": [
              "proj3-ph3-t2"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "proj4",
    "name": "Project 4",
    "progress": 0,
    "status": "On Track",
    "phases": [
      {
        "id": "proj4-ph1",
        "name": "Phase 1",
        "tasks": [
          {
            "id": "proj4-ph1-t1",
            "title": "Task 1 of Phase 1 in Project 4",
            "status": "Todo",
            "due": "2025-09-20",
            "projectId": "proj4",
            "phaseId": "proj4-ph1",
            "dependsOn": []
          },
          {
            "id": "proj4-ph1-t2",
            "title": "Task 2 of Phase 1 in Project 4",
            "status": "Todo",
            "due": "2025-09-21",
            "projectId": "proj4",
            "phaseId": "proj4-ph1",
            "dependsOn": [
              "proj4-ph1-t1"
            ]
          },
          {
            "id": "proj4-ph1-t3",
            "title": "Task 3 of Phase 1 in Project 4",
            "status": "Todo",
            "due": "2025-09-22",
            "projectId": "proj4",
            "phaseId": "proj4-ph1",
            "dependsOn": [
              "proj4-ph1-t2"
            ]
          }
        ]
      },
      {
        "id": "proj4-ph2",
        "name": "Phase 2",
        "tasks": [
          {
            "id": "proj4-ph2-t1",
            "title": "Task 1 of Phase 2 in Project 4",
            "status": "Todo",
            "due": "2025-09-22",
            "projectId": "proj4",
            "phaseId": "proj4-ph2",
            "dependsOn": []
          },
          {
            "id": "proj4-ph2-t2",
            "title": "Task 2 of Phase 2 in Project 4",
            "status": "Todo",
            "due": "2025-09-23",
            "projectId": "proj4",
            "phaseId": "proj4-ph2",
            "dependsOn": [
              "proj4-ph2-t1"
            ]
          },
          {
            "id": "proj4-ph2-t3",
            "title": "Task 3 of Phase 2 in Project 4",
            "status": "Todo",
            "due": "2025-09-24",
            "projectId": "proj4",
            "phaseId": "proj4-ph2",
            "dependsOn": [
              "proj4-ph2-t2"
            ]
          }
        ]
      },
      {
        "id": "proj4-ph3",
        "name": "Phase 3",
        "tasks": [
          {
            "id": "proj4-ph3-t1",
            "title": "Task 1 of Phase 3 in Project 4",
            "status": "Todo",
            "due": "2025-09-24",
            "projectId": "proj4",
            "phaseId": "proj4-ph3",
            "dependsOn": []
          },
          {
            "id": "proj4-ph3-t2",
            "title": "Task 2 of Phase 3 in Project 4",
            "status": "Todo",
            "due": "2025-09-25",
            "projectId": "proj4",
            "phaseId": "proj4-ph3",
            "dependsOn": [
              "proj4-ph3-t1"
            ]
          },
          {
            "id": "proj4-ph3-t3",
            "title": "Task 3 of Phase 3 in Project 4",
            "status": "Todo",
            "due": "2025-09-26",
            "projectId": "proj4",
            "phaseId": "proj4-ph3",
            "dependsOn": [
              "proj4-ph3-t2"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "proj5",
    "name": "Project 5",
    "progress": 0,
    "status": "On Track",
    "phases": [
      {
        "id": "proj5-ph1",
        "name": "Phase 1",
        "tasks": [
          {
            "id": "proj5-ph1-t1",
            "title": "Task 1 of Phase 1 in Project 5",
            "status": "Todo",
            "due": "2025-09-26",
            "projectId": "proj5",
            "phaseId": "proj5-ph1",
            "dependsOn": []
          },
          {
            "id": "proj5-ph1-t2",
            "title": "Task 2 of Phase 1 in Project 5",
            "status": "Todo",
            "due": "2025-09-27",
            "projectId": "proj5",
            "phaseId": "proj5-ph1",
            "dependsOn": [
              "proj5-ph1-t1"
            ]
          },
          {
            "id": "proj5-ph1-t3",
            "title": "Task 3 of Phase 1 in Project 5",
            "status": "Todo",
            "due": "2025-09-28",
            "projectId": "proj5",
            "phaseId": "proj5-ph1",
            "dependsOn": [
              "proj5-ph1-t2"
            ]
          }
        ]
      },
      {
        "id": "proj5-ph2",
        "name": "Phase 2",
        "tasks": [
          {
            "id": "proj5-ph2-t1",
            "title": "Task 1 of Phase 2 in Project 5",
            "status": "Todo",
            "due": "2025-09-28",
            "projectId": "proj5",
            "phaseId": "proj5-ph2",
            "dependsOn": []
          },
          {
            "id": "proj5-ph2-t2",
            "title": "Task 2 of Phase 2 in Project 5",
            "status": "Todo",
            "due": "2025-09-29",
            "projectId": "proj5",
            "phaseId": "proj5-ph2",
            "dependsOn": [
              "proj5-ph2-t1"
            ]
          },
          {
            "id": "proj5-ph2-t3",
            "title": "Task 3 of Phase 2 in Project 5",
            "status": "Todo",
            "due": "2025-09-30",
            "projectId": "proj5",
            "phaseId": "proj5-ph2",
            "dependsOn": [
              "proj5-ph2-t2"
            ]
          }
        ]
      },
      {
        "id": "proj5-ph3",
        "name": "Phase 3",
        "tasks": [
          {
            "id": "proj5-ph3-t1",
            "title": "Task 1 of Phase 3 in Project 5",
            "status": "Todo",
            "due": "2025-09-30",
            "projectId": "proj5",
            "phaseId": "proj5-ph3",
            "dependsOn": []
          },
          {
            "id": "proj5-ph3-t2",
            "title": "Task 2 of Phase 3 in Project 5",
            "status": "Todo",
            "due": "2025-10-01",
            "projectId": "proj5",
            "phaseId": "proj5-ph3",
            "dependsOn": [
              "proj5-ph3-t1"
            ]
          },
          {
            "id": "proj5-ph3-t3",
            "title": "Task 3 of Phase 3 in Project 5",
            "status": "Todo",
            "due": "2025-10-02",
            "projectId": "proj5",
            "phaseId": "proj5-ph3",
            "dependsOn": [
              "proj5-ph3-t2"
            ]
          }
        ]
      }
    ]
  }
];
