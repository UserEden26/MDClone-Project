import { useQuery } from '@tanstack/react-query';
import { getMyOptions } from '../api/queries/employee-relations';

const useMyData = () => {
    const { data } = useQuery({
        queryKey: ['my-data'],
        queryFn: async () => getMyOptions(),
        refetchInterval: 60 * 1000,
        staleTime: 30 * 1000,
    });

    return data;
};

export default useMyData;
