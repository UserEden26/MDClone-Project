import { IEmployeeWithoutPassword } from 'shared/interfaces/employee.interface';
import { IReturnPagination } from 'shared/interfaces/pagination.interface';
import { axiosInstance } from '../axiosConfig';
import { FrontendPaginationType } from '../../interfaces/frontendPagination.interface';

const employeePrefix = 'employee';

export const getEmployeeDataById = async <T>(id: number) => {
    const response = await axiosInstance.get<T>(`${employeePrefix}/${id}`);
    return response.data;
};

export const getEmployees = async ({ page }: FrontendPaginationType) => {
    const response = await axiosInstance.get<
        IReturnPagination<IEmployeeWithoutPassword>
    >(employeePrefix, {
        params: { page },
    });
    return response.data;
};
