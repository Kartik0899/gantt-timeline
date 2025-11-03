export interface Lane {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  name: string;
  laneId: string;
  start: string;
  end: string;
  assignee: string;
  deps: string[];
}

export interface TimelineData {
  lanes: Lane[];
  tasks: Task[];
}

