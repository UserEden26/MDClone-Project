import {
    QueryKey,
    QueryFunction,
    UseQueryOptions,
    useQuery,
} from '@tanstack/react-query';
import useLoadingMouse from './useLoadingMouse';

const useFetch = <T>(
    queryKey: QueryKey,
    queryFn: QueryFunction<T>,
    options?: Omit<
        UseQueryOptions<T, Error, T, QueryKey>,
        'queryKey' | 'queryFn'
    >
) => {
    const query = useQuery<T, Error>({
        queryKey,
        queryFn,
        ...options,
    });
    useLoadingMouse(query.isLoading);
    return query;
};

export default useFetch;
