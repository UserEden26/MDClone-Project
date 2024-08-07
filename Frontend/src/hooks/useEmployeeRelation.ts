import { useQuery } from '@tanstack/react-query';
import { getEmployeeRelations } from '../api/queries/employee-relations';
import useLoadingMouse from './useLoadingMouse';

const useEmployeeRelation = (employeeId: number) => {
    const query = useQuery({
        queryKey: ['employee-relation', employeeId],
        queryFn: async () => await getEmployeeRelations(employeeId),
        retryDelay: 10000,
        refetchInterval: 60 * 1000,
        staleTime: 30 * 1000, // 30 seconds the data count as fresh
    });

    useLoadingMouse(query.isLoading);
    return query;
};

export default useEmployeeRelation;
