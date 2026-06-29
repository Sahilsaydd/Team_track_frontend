export interface DashboardResponse {

    summary: Summary;

    task_status: TaskStatus;

    role_distribution: RoleDistribution;

    group_performance: GroupPerformance[];

    top_employees: TopEmployee[];

    workload: Workload[];

    overdue_tasks: OverdueTask[];

}

export interface Summary {

    users: number;

    admins: number;

    employees: number;

    groups: number;

    active_tasks: number;

    completed_today: number;

    pending_reviews: number;

    overdue_tasks: number;

}

export interface TaskStatus {

    todo: number;

    in_progress: number;

    submitted: number;

    completed: number;

    needs_revision: number;

}

export interface RoleDistribution {

    super_admin: number;

    admin: number;

    employee: number;

}

export interface GroupPerformance {

    group_id: number;

    group_name: string;

    leader: string;

    total_tasks: number;

    completed_tasks: number;

    progress: number;

}

export interface TopEmployee {

    employee_id: number;

    employee_name: string;

    completed_tasks: number;

}

export interface Workload {

    employee_id: number;

    employee_name: string;

    pending_tasks: number;

}

export interface OverdueTask {

    task: string;

    employee: string;

    deadline: string;

}