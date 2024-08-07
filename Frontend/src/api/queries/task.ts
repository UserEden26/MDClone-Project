import {
    IPagination,
    IReturnPagination,
} from '../../interfaces/pagination.interface';
import { ICreateTask, IMinimazedTask } from '../../interfaces/task.interface';
import { axiosInstance } from '../axiosConfig';

const taskPrefix = 'task';

export const createTask = async (task: ICreateTask) => {
    const response = await axiosInstance.post(taskPrefix, task);
    return response.data;
};

export const getTasks = async ({ forEmp, page }: IPagination) => {
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
