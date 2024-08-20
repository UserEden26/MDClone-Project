import {
    IEmployeeExternal,
    IEmployeeWithoutPassword,
} from '../../interfaces/employee.interface';
import { axiosInstance } from '../axiosConfig';

const employeePrefix = 'employees-relations';

export const getEmployeeRelations = async (employeeId: number) => {
    const response = await axiosInstance.get<
        IEmployeeWithoutPassword & IEmployeeExternal
    >(`${employeePrefix}/${employeeId}`);
    return response.data;
};

export const getMyOptions = async () => {
    const response = await axiosInstance.get<
        IEmployeeWithoutPassword & IEmployeeExternal
    >(`${employeePrefix}/me`);
    return response.data;
};
