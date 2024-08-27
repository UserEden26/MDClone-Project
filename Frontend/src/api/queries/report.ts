import { ICreateReport } from 'shared/interfaces/report.interface';
import { axiosInstance } from '../axiosConfig';

const reportPrefix = 'report';

export const createReport = async (report: ICreateReport) => {
    const response = await axiosInstance.post(`${reportPrefix}`, report);
    return response.data;
};

export const getMyReports = async () => {
    const response = await axiosInstance.get(`${reportPrefix}/my-reports`);
    return response.data;
};
