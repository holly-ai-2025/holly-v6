export interface Task {
  id: string;
  title: string;
  status: 'Todo' | 'In Progress' | 'Done';
  due: string;
  completed?: boolean;
  projectId?: string;
  phaseId?: string;
  dependsOn?: string[];
}

export const tasks: Task[] = [
  {
    "id": "2025-09-01-t1",
    "title": "Task 1 on 2025-09-01",
    "status": "Todo",
    "due": "2025-09-01"
  },
  {
    "id": "2025-09-01-t2",
    "title": "Task 2 on 2025-09-01",
    "status": "Todo",
    "due": "2025-09-01"
  },
  {
    "id": "2025-09-01-t3",
    "title": "Task 3 on 2025-09-01",
    "status": "Todo",
    "due": "2025-09-01"
  },
  {
    "id": "2025-09-01-t4",
    "title": "Task 4 on 2025-09-01",
    "status": "Todo",
    "due": "2025-09-01"
  },
  {
    "id": "2025-09-01-t5",
    "title": "Task 5 on 2025-09-01",
    "status": "Todo",
    "due": "2025-09-01"
  },
  {
    "id": "2025-09-02-t1",
    "title": "Task 1 on 2025-09-02",
    "status": "Todo",
    "due": "2025-09-02"
  },
  {
    "id": "2025-09-02-t2",
    "title": "Task 2 on 2025-09-02",
    "status": "Todo",
    "due": "2025-09-02"
  },
  {
    "id": "2025-09-02-t3",
    "title": "Task 3 on 2025-09-02",
    "status": "Todo",
    "due": "2025-09-02"
  },
  {
    "id": "2025-09-02-t4",
    "title": "Task 4 on 2025-09-02",
    "status": "Todo",
    "due": "2025-09-02"
  },
  {
    "id": "2025-09-02-t5",
    "title": "Task 5 on 2025-09-02",
    "status": "Todo",
    "due": "2025-09-02"
  },
  {
    "id": "2025-09-03-t1",
    "title": "Task 1 on 2025-09-03",
    "status": "Todo",
    "due": "2025-09-03"
  },
  {
    "id": "2025-09-03-t2",
    "title": "Task 2 on 2025-09-03",
    "status": "Todo",
    "due": "2025-09-03"
  },
  {
    "id": "2025-09-03-t3",
    "title": "Task 3 on 2025-09-03",
    "status": "Todo",
    "due": "2025-09-03"
  },
  {
    "id": "2025-09-03-t4",
    "title": "Task 4 on 2025-09-03",
    "status": "Todo",
    "due": "2025-09-03"
  },
  {
    "id": "2025-09-03-t5",
    "title": "Task 5 on 2025-09-03",
    "status": "Todo",
    "due": "2025-09-03"
  },
  {
    "id": "2025-09-04-t1",
    "title": "Task 1 on 2025-09-04",
    "status": "Todo",
    "due": "2025-09-04"
  },
  {
    "id": "2025-09-04-t2",
    "title": "Task 2 on 2025-09-04",
    "status": "Todo",
    "due": "2025-09-04"
  },
  {
    "id": "2025-09-04-t3",
    "title": "Task 3 on 2025-09-04",
    "status": "Todo",
    "due": "2025-09-04"
  },
  {
    "id": "2025-09-04-t4",
    "title": "Task 4 on 2025-09-04",
    "status": "Todo",
    "due": "2025-09-04"
  },
  {
    "id": "2025-09-04-t5",
    "title": "Task 5 on 2025-09-04",
    "status": "Todo",
    "due": "2025-09-04"
  },
  {
    "id": "2025-09-05-t1",
    "title": "Task 1 on 2025-09-05",
    "status": "Todo",
    "due": "2025-09-05"
  },
  {
    "id": "2025-09-05-t2",
    "title": "Task 2 on 2025-09-05",
    "status": "Todo",
    "due": "2025-09-05"
  },
  {
    "id": "2025-09-05-t3",
    "title": "Task 3 on 2025-09-05",
    "status": "Todo",
    "due": "2025-09-05"
  },
  {
    "id": "2025-09-05-t4",
    "title": "Task 4 on 2025-09-05",
    "status": "Todo",
    "due": "2025-09-05"
  },
  {
    "id": "2025-09-05-t5",
    "title": "Task 5 on 2025-09-05",
    "status": "Todo",
    "due": "2025-09-05"
  },
  {
    "id": "2025-09-06-t1",
    "title": "Task 1 on 2025-09-06",
    "status": "Todo",
    "due": "2025-09-06"
  },
  {
    "id": "2025-09-06-t2",
    "title": "Task 2 on 2025-09-06",
    "status": "Todo",
    "due": "2025-09-06"
  },
  {
    "id": "2025-09-06-t3",
    "title": "Task 3 on 2025-09-06",
    "status": "Todo",
    "due": "2025-09-06"
  },
  {
    "id": "2025-09-06-t4",
    "title": "Task 4 on 2025-09-06",
    "status": "Todo",
    "due": "2025-09-06"
  },
  {
    "id": "2025-09-06-t5",
    "title": "Task 5 on 2025-09-06",
    "status": "Todo",
    "due": "2025-09-06"
  },
  {
    "id": "2025-09-07-t1",
    "title": "Task 1 on 2025-09-07",
    "status": "Todo",
    "due": "2025-09-07"
  },
  {
    "id": "2025-09-07-t2",
    "title": "Task 2 on 2025-09-07",
    "status": "Todo",
    "due": "2025-09-07"
  },
  {
    "id": "2025-09-07-t3",
    "title": "Task 3 on 2025-09-07",
    "status": "Todo",
    "due": "2025-09-07"
  },
  {
    "id": "2025-09-07-t4",
    "title": "Task 4 on 2025-09-07",
    "status": "Todo",
    "due": "2025-09-07"
  },
  {
    "id": "2025-09-07-t5",
    "title": "Task 5 on 2025-09-07",
    "status": "Todo",
    "due": "2025-09-07"
  },
  {
    "id": "2025-09-08-t1",
    "title": "Task 1 on 2025-09-08",
    "status": "Todo",
    "due": "2025-09-08"
  },
  {
    "id": "2025-09-08-t2",
    "title": "Task 2 on 2025-09-08",
    "status": "Todo",
    "due": "2025-09-08"
  },
  {
    "id": "2025-09-08-t3",
    "title": "Task 3 on 2025-09-08",
    "status": "Todo",
    "due": "2025-09-08"
  },
  {
    "id": "2025-09-08-t4",
    "title": "Task 4 on 2025-09-08",
    "status": "Todo",
    "due": "2025-09-08"
  },
  {
    "id": "2025-09-08-t5",
    "title": "Task 5 on 2025-09-08",
    "status": "Todo",
    "due": "2025-09-08"
  },
  {
    "id": "2025-09-09-t1",
    "title": "Task 1 on 2025-09-09",
    "status": "Todo",
    "due": "2025-09-09"
  },
  {
    "id": "2025-09-09-t2",
    "title": "Task 2 on 2025-09-09",
    "status": "Todo",
    "due": "2025-09-09"
  },
  {
    "id": "2025-09-09-t3",
    "title": "Task 3 on 2025-09-09",
    "status": "Todo",
    "due": "2025-09-09"
  },
  {
    "id": "2025-09-09-t4",
    "title": "Task 4 on 2025-09-09",
    "status": "Todo",
    "due": "2025-09-09"
  },
  {
    "id": "2025-09-09-t5",
    "title": "Task 5 on 2025-09-09",
    "status": "Todo",
    "due": "2025-09-09"
  },
  {
    "id": "2025-09-10-t1",
    "title": "Task 1 on 2025-09-10",
    "status": "Todo",
    "due": "2025-09-10"
  },
  {
    "id": "2025-09-10-t2",
    "title": "Task 2 on 2025-09-10",
    "status": "Todo",
    "due": "2025-09-10"
  },
  {
    "id": "2025-09-10-t3",
    "title": "Task 3 on 2025-09-10",
    "status": "Todo",
    "due": "2025-09-10"
  },
  {
    "id": "2025-09-10-t4",
    "title": "Task 4 on 2025-09-10",
    "status": "Todo",
    "due": "2025-09-10"
  },
  {
    "id": "2025-09-10-t5",
    "title": "Task 5 on 2025-09-10",
    "status": "Todo",
    "due": "2025-09-10"
  },
  {
    "id": "2025-09-11-t1",
    "title": "Task 1 on 2025-09-11",
    "status": "Todo",
    "due": "2025-09-11"
  },
  {
    "id": "2025-09-11-t2",
    "title": "Task 2 on 2025-09-11",
    "status": "Todo",
    "due": "2025-09-11"
  },
  {
    "id": "2025-09-11-t3",
    "title": "Task 3 on 2025-09-11",
    "status": "Todo",
    "due": "2025-09-11"
  },
  {
    "id": "2025-09-11-t4",
    "title": "Task 4 on 2025-09-11",
    "status": "Todo",
    "due": "2025-09-11"
  },
  {
    "id": "2025-09-11-t5",
    "title": "Task 5 on 2025-09-11",
    "status": "Todo",
    "due": "2025-09-11"
  },
  {
    "id": "2025-09-12-t1",
    "title": "Task 1 on 2025-09-12",
    "status": "Todo",
    "due": "2025-09-12"
  },
  {
    "id": "2025-09-12-t2",
    "title": "Task 2 on 2025-09-12",
    "status": "Todo",
    "due": "2025-09-12"
  },
  {
    "id": "2025-09-12-t3",
    "title": "Task 3 on 2025-09-12",
    "status": "Todo",
    "due": "2025-09-12"
  },
  {
    "id": "2025-09-12-t4",
    "title": "Task 4 on 2025-09-12",
    "status": "Todo",
    "due": "2025-09-12"
  },
  {
    "id": "2025-09-12-t5",
    "title": "Task 5 on 2025-09-12",
    "status": "Todo",
    "due": "2025-09-12"
  },
  {
    "id": "2025-09-13-t1",
    "title": "Task 1 on 2025-09-13",
    "status": "Todo",
    "due": "2025-09-13"
  },
  {
    "id": "2025-09-13-t2",
    "title": "Task 2 on 2025-09-13",
    "status": "Todo",
    "due": "2025-09-13"
  },
  {
    "id": "2025-09-13-t3",
    "title": "Task 3 on 2025-09-13",
    "status": "Todo",
    "due": "2025-09-13"
  },
  {
    "id": "2025-09-13-t4",
    "title": "Task 4 on 2025-09-13",
    "status": "Todo",
    "due": "2025-09-13"
  },
  {
    "id": "2025-09-13-t5",
    "title": "Task 5 on 2025-09-13",
    "status": "Todo",
    "due": "2025-09-13"
  },
  {
    "id": "2025-09-14-t1",
    "title": "Task 1 on 2025-09-14",
    "status": "Todo",
    "due": "2025-09-14"
  },
  {
    "id": "2025-09-14-t2",
    "title": "Task 2 on 2025-09-14",
    "status": "Todo",
    "due": "2025-09-14"
  },
  {
    "id": "2025-09-14-t3",
    "title": "Task 3 on 2025-09-14",
    "status": "Todo",
    "due": "2025-09-14"
  },
  {
    "id": "2025-09-14-t4",
    "title": "Task 4 on 2025-09-14",
    "status": "Todo",
    "due": "2025-09-14"
  },
  {
    "id": "2025-09-14-t5",
    "title": "Task 5 on 2025-09-14",
    "status": "Todo",
    "due": "2025-09-14"
  },
  {
    "id": "2025-09-15-t1",
    "title": "Task 1 on 2025-09-15",
    "status": "Todo",
    "due": "2025-09-15"
  },
  {
    "id": "2025-09-15-t2",
    "title": "Task 2 on 2025-09-15",
    "status": "Todo",
    "due": "2025-09-15"
  },
  {
    "id": "2025-09-15-t3",
    "title": "Task 3 on 2025-09-15",
    "status": "Todo",
    "due": "2025-09-15"
  },
  {
    "id": "2025-09-15-t4",
    "title": "Task 4 on 2025-09-15",
    "status": "Todo",
    "due": "2025-09-15"
  },
  {
    "id": "2025-09-15-t5",
    "title": "Task 5 on 2025-09-15",
    "status": "Todo",
    "due": "2025-09-15"
  },
  {
    "id": "2025-09-16-t1",
    "title": "Task 1 on 2025-09-16",
    "status": "Todo",
    "due": "2025-09-16"
  },
  {
    "id": "2025-09-16-t2",
    "title": "Task 2 on 2025-09-16",
    "status": "Todo",
    "due": "2025-09-16"
  },
  {
    "id": "2025-09-16-t3",
    "title": "Task 3 on 2025-09-16",
    "status": "Todo",
    "due": "2025-09-16"
  },
  {
    "id": "2025-09-16-t4",
    "title": "Task 4 on 2025-09-16",
    "status": "Todo",
    "due": "2025-09-16"
  },
  {
    "id": "2025-09-16-t5",
    "title": "Task 5 on 2025-09-16",
    "status": "Todo",
    "due": "2025-09-16"
  },
  {
    "id": "2025-09-17-t1",
    "title": "Task 1 on 2025-09-17",
    "status": "Todo",
    "due": "2025-09-17"
  },
  {
    "id": "2025-09-17-t2",
    "title": "Task 2 on 2025-09-17",
    "status": "Todo",
    "due": "2025-09-17"
  },
  {
    "id": "2025-09-17-t3",
    "title": "Task 3 on 2025-09-17",
    "status": "Todo",
    "due": "2025-09-17"
  },
  {
    "id": "2025-09-17-t4",
    "title": "Task 4 on 2025-09-17",
    "status": "Todo",
    "due": "2025-09-17"
  },
  {
    "id": "2025-09-17-t5",
    "title": "Task 5 on 2025-09-17",
    "status": "Todo",
    "due": "2025-09-17"
  },
  {
    "id": "2025-09-18-t1",
    "title": "Task 1 on 2025-09-18",
    "status": "Todo",
    "due": "2025-09-18"
  },
  {
    "id": "2025-09-18-t2",
    "title": "Task 2 on 2025-09-18",
    "status": "Todo",
    "due": "2025-09-18"
  },
  {
    "id": "2025-09-18-t3",
    "title": "Task 3 on 2025-09-18",
    "status": "Todo",
    "due": "2025-09-18"
  },
  {
    "id": "2025-09-18-t4",
    "title": "Task 4 on 2025-09-18",
    "status": "Todo",
    "due": "2025-09-18"
  },
  {
    "id": "2025-09-18-t5",
    "title": "Task 5 on 2025-09-18",
    "status": "Todo",
    "due": "2025-09-18"
  },
  {
    "id": "2025-09-19-t1",
    "title": "Task 1 on 2025-09-19",
    "status": "Todo",
    "due": "2025-09-19"
  },
  {
    "id": "2025-09-19-t2",
    "title": "Task 2 on 2025-09-19",
    "status": "Todo",
    "due": "2025-09-19"
  },
  {
    "id": "2025-09-19-t3",
    "title": "Task 3 on 2025-09-19",
    "status": "Todo",
    "due": "2025-09-19"
  },
  {
    "id": "2025-09-19-t4",
    "title": "Task 4 on 2025-09-19",
    "status": "Todo",
    "due": "2025-09-19"
  },
  {
    "id": "2025-09-19-t5",
    "title": "Task 5 on 2025-09-19",
    "status": "Todo",
    "due": "2025-09-19"
  },
  {
    "id": "2025-09-20-t1",
    "title": "Task 1 on 2025-09-20",
    "status": "Todo",
    "due": "2025-09-20"
  },
  {
    "id": "2025-09-20-t2",
    "title": "Task 2 on 2025-09-20",
    "status": "Todo",
    "due": "2025-09-20"
  },
  {
    "id": "2025-09-20-t3",
    "title": "Task 3 on 2025-09-20",
    "status": "Todo",
    "due": "2025-09-20"
  },
  {
    "id": "2025-09-20-t4",
    "title": "Task 4 on 2025-09-20",
    "status": "Todo",
    "due": "2025-09-20"
  },
  {
    "id": "2025-09-20-t5",
    "title": "Task 5 on 2025-09-20",
    "status": "Todo",
    "due": "2025-09-20"
  },
  {
    "id": "2025-09-21-t1",
    "title": "Task 1 on 2025-09-21",
    "status": "Todo",
    "due": "2025-09-21"
  },
  {
    "id": "2025-09-21-t2",
    "title": "Task 2 on 2025-09-21",
    "status": "Todo",
    "due": "2025-09-21"
  },
  {
    "id": "2025-09-21-t3",
    "title": "Task 3 on 2025-09-21",
    "status": "Todo",
    "due": "2025-09-21"
  },
  {
    "id": "2025-09-21-t4",
    "title": "Task 4 on 2025-09-21",
    "status": "Todo",
    "due": "2025-09-21"
  },
  {
    "id": "2025-09-21-t5",
    "title": "Task 5 on 2025-09-21",
    "status": "Todo",
    "due": "2025-09-21"
  },
  {
    "id": "2025-09-22-t1",
    "title": "Task 1 on 2025-09-22",
    "status": "Todo",
    "due": "2025-09-22"
  },
  {
    "id": "2025-09-22-t2",
    "title": "Task 2 on 2025-09-22",
    "status": "Todo",
    "due": "2025-09-22"
  },
  {
    "id": "2025-09-22-t3",
    "title": "Task 3 on 2025-09-22",
    "status": "Todo",
    "due": "2025-09-22"
  },
  {
    "id": "2025-09-22-t4",
    "title": "Task 4 on 2025-09-22",
    "status": "Todo",
    "due": "2025-09-22"
  },
  {
    "id": "2025-09-22-t5",
    "title": "Task 5 on 2025-09-22",
    "status": "Todo",
    "due": "2025-09-22"
  },
  {
    "id": "2025-09-23-t1",
    "title": "Task 1 on 2025-09-23",
    "status": "Todo",
    "due": "2025-09-23"
  },
  {
    "id": "2025-09-23-t2",
    "title": "Task 2 on 2025-09-23",
    "status": "Todo",
    "due": "2025-09-23"
  },
  {
    "id": "2025-09-23-t3",
    "title": "Task 3 on 2025-09-23",
    "status": "Todo",
    "due": "2025-09-23"
  },
  {
    "id": "2025-09-23-t4",
    "title": "Task 4 on 2025-09-23",
    "status": "Todo",
    "due": "2025-09-23"
  },
  {
    "id": "2025-09-23-t5",
    "title": "Task 5 on 2025-09-23",
    "status": "Todo",
    "due": "2025-09-23"
  },
  {
    "id": "2025-09-24-t1",
    "title": "Task 1 on 2025-09-24",
    "status": "Todo",
    "due": "2025-09-24"
  },
  {
    "id": "2025-09-24-t2",
    "title": "Task 2 on 2025-09-24",
    "status": "Todo",
    "due": "2025-09-24"
  },
  {
    "id": "2025-09-24-t3",
    "title": "Task 3 on 2025-09-24",
    "status": "Todo",
    "due": "2025-09-24"
  },
  {
    "id": "2025-09-24-t4",
    "title": "Task 4 on 2025-09-24",
    "status": "Todo",
    "due": "2025-09-24"
  },
  {
    "id": "2025-09-24-t5",
    "title": "Task 5 on 2025-09-24",
    "status": "Todo",
    "due": "2025-09-24"
  },
  {
    "id": "2025-09-25-t1",
    "title": "Task 1 on 2025-09-25",
    "status": "Todo",
    "due": "2025-09-25"
  },
  {
    "id": "2025-09-25-t2",
    "title": "Task 2 on 2025-09-25",
    "status": "Todo",
    "due": "2025-09-25"
  },
  {
    "id": "2025-09-25-t3",
    "title": "Task 3 on 2025-09-25",
    "status": "Todo",
    "due": "2025-09-25"
  },
  {
    "id": "2025-09-25-t4",
    "title": "Task 4 on 2025-09-25",
    "status": "Todo",
    "due": "2025-09-25"
  },
  {
    "id": "2025-09-25-t5",
    "title": "Task 5 on 2025-09-25",
    "status": "Todo",
    "due": "2025-09-25"
  },
  {
    "id": "2025-09-26-t1",
    "title": "Task 1 on 2025-09-26",
    "status": "Todo",
    "due": "2025-09-26"
  },
  {
    "id": "2025-09-26-t2",
    "title": "Task 2 on 2025-09-26",
    "status": "Todo",
    "due": "2025-09-26"
  },
  {
    "id": "2025-09-26-t3",
    "title": "Task 3 on 2025-09-26",
    "status": "Todo",
    "due": "2025-09-26"
  },
  {
    "id": "2025-09-26-t4",
    "title": "Task 4 on 2025-09-26",
    "status": "Todo",
    "due": "2025-09-26"
  },
  {
    "id": "2025-09-26-t5",
    "title": "Task 5 on 2025-09-26",
    "status": "Todo",
    "due": "2025-09-26"
  },
  {
    "id": "2025-09-27-t1",
    "title": "Task 1 on 2025-09-27",
    "status": "Todo",
    "due": "2025-09-27"
  },
  {
    "id": "2025-09-27-t2",
    "title": "Task 2 on 2025-09-27",
    "status": "Todo",
    "due": "2025-09-27"
  },
  {
    "id": "2025-09-27-t3",
    "title": "Task 3 on 2025-09-27",
    "status": "Todo",
    "due": "2025-09-27"
  },
  {
    "id": "2025-09-27-t4",
    "title": "Task 4 on 2025-09-27",
    "status": "Todo",
    "due": "2025-09-27"
  },
  {
    "id": "2025-09-27-t5",
    "title": "Task 5 on 2025-09-27",
    "status": "Todo",
    "due": "2025-09-27"
  },
  {
    "id": "2025-09-28-t1",
    "title": "Task 1 on 2025-09-28",
    "status": "Todo",
    "due": "2025-09-28"
  },
  {
    "id": "2025-09-28-t2",
    "title": "Task 2 on 2025-09-28",
    "status": "Todo",
    "due": "2025-09-28"
  },
  {
    "id": "2025-09-28-t3",
    "title": "Task 3 on 2025-09-28",
    "status": "Todo",
    "due": "2025-09-28"
  },
  {
    "id": "2025-09-28-t4",
    "title": "Task 4 on 2025-09-28",
    "status": "Todo",
    "due": "2025-09-28"
  },
  {
    "id": "2025-09-28-t5",
    "title": "Task 5 on 2025-09-28",
    "status": "Todo",
    "due": "2025-09-28"
  },
  {
    "id": "2025-09-29-t1",
    "title": "Task 1 on 2025-09-29",
    "status": "Todo",
    "due": "2025-09-29"
  },
  {
    "id": "2025-09-29-t2",
    "title": "Task 2 on 2025-09-29",
    "status": "Todo",
    "due": "2025-09-29"
  },
  {
    "id": "2025-09-29-t3",
    "title": "Task 3 on 2025-09-29",
    "status": "Todo",
    "due": "2025-09-29"
  },
  {
    "id": "2025-09-29-t4",
    "title": "Task 4 on 2025-09-29",
    "status": "Todo",
    "due": "2025-09-29"
  },
  {
    "id": "2025-09-29-t5",
    "title": "Task 5 on 2025-09-29",
    "status": "Todo",
    "due": "2025-09-29"
  },
  {
    "id": "2025-09-30-t1",
    "title": "Task 1 on 2025-09-30",
    "status": "Todo",
    "due": "2025-09-30"
  },
  {
    "id": "2025-09-30-t2",
    "title": "Task 2 on 2025-09-30",
    "status": "Todo",
    "due": "2025-09-30"
  },
  {
    "id": "2025-09-30-t3",
    "title": "Task 3 on 2025-09-30",
    "status": "Todo",
    "due": "2025-09-30"
  },
  {
    "id": "2025-09-30-t4",
    "title": "Task 4 on 2025-09-30",
    "status": "Todo",
    "due": "2025-09-30"
  },
  {
    "id": "2025-09-30-t5",
    "title": "Task 5 on 2025-09-30",
    "status": "Todo",
    "due": "2025-09-30"
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
];
