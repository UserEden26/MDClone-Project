import { ICreateTask, IMinimazedTask } from 'shared/interfaces/task.interface';
import { IReturnPagination } from 'shared/interfaces/pagination.interface';
import { axiosInstance } from '../axiosConfig';
import { FrontendPaginationType } from '../../interfaces/frontendPagination.interface';

const taskPrefix = 'task';

export const createTask = async (task: ICreateTask) => {
    const response = await axiosInstance.post(taskPrefix, task);
    return response.data;
};

export const getTasks = async ({ forEmp, page }: FrontendPaginationType) => {
    const response = await axiosInstance.get<IReturnPagination<IMinimazedTask>>(
        `${taskPrefix}`,
        {
            params: {
                page,
                forEmp,
            },
        }
    );
    return response.data;
};
