import { ILogin, ILoginResponse } from 'shared/interfaces/auth.interface';
import { axiosInstance } from '../axiosConfig';

const authPrefix = 'auth';

export const login = async (body: ILogin) => {
    const response = await axiosInstance.post<ILoginResponse>(
        `${authPrefix}/login`,
        body
    );
    return response.data;
};
