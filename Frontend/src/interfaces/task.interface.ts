export interface ICreateTask {
    employeeId: number;
    taskText: string;
    dueDate: string;
    assignDate: string;
}

export interface IMinimazedTask {
    taskId: number;
    assignDate: string; // date
    taskText: string;
    dueDate: string; //date
}
