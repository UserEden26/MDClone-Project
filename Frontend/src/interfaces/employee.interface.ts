export interface IEmployee {
    employeeId: number;
    employeeLastName: string;
    employeeName: string;
    position: string;
    email: string;
    hashedPassword: string;
}

export type IEmployeeWithoutPassword = Omit<IEmployee, 'hashedPassword'>;

export interface IEmployeeExternal {
    manager: IEmployeeWithoutPassword | null;
    managedEmployees: IEmployeeWithoutPassword[] | [];
}

export type ReturnEmployeeType = IEmployeeExternal & IEmployee;
