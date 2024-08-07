import { IEmployeeWithoutPassword } from '../../interfaces/employee.interface';
import {
    IPagination,
    IReturnPagination,
} from '../../interfaces/pagination.interface';
import { axiosInstance } from '../axiosConfig';

const employeePrefix = 'employee';

export const getEmployeeDataById = async <T>(id: number) => {
    const response = await axiosInstance.get<T>(`${employeePrefix}/${id}`);
    return response.data;
};

export const getEmployees = async ({ page }: IPagination) => {
    const response = await axiosInstance.get<
        IReturnPagination<IEmployeeWithoutPassword>
    >(employeePrefix, {
        params: { page },
    });
    return response.data;
};
