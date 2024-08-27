import {
    QueryKey,
    UseInfiniteQueryOptions,
    useInfiniteQuery,
    InfiniteData,
} from '@tanstack/react-query';
import useLoadingMouse from './useLoadingMouse';
import { IReturnPagination } from 'shared/interfaces/pagination.interface';
import { FrontendPaginationType } from '../interfaces/frontendPagination.interface';

export const useFetchPages = <T>(
    queryKey: QueryKey,
    queryFn: (args: FrontendPaginationType) => Promise<IReturnPagination<T>>,
    args: FrontendPaginationType,
    options?: Omit<
        UseInfiniteQueryOptions<
            IReturnPagination<T>,
            Error,
            InfiniteData<IReturnPagination<T>>,
            IReturnPagination<T>,
            QueryKey,
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >
) => {
    const query = useInfiniteQuery<
        IReturnPagination<T>,
        Error,
        InfiniteData<IReturnPagination<T>>,
        QueryKey,
        number
    >({
        queryKey,
        queryFn: ({ pageParam }) => queryFn({ ...args, page: pageParam }),
        initialPageParam: 1,
        getNextPageParam: lastPage =>
            lastPage.page < Math.ceil(lastPage.total / lastPage.limit)
                ? lastPage.page + 1
                : undefined,
        ...options,
    });
    useLoadingMouse(query.isLoading || query.isFetchingNextPage);
    return query;
};

export default useFetchPages;
