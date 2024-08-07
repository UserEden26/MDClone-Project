import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import useLoadingMouse from './useLoadingMouse';
import { AxiosError } from 'axios';

const useMutate = <TData = unknown, TError = AxiosError, TVariables = void>(
    fn: (variables: TVariables) => Promise<TData>,
    options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) => {
    const mutation = useMutation<TData, TError, TVariables>({
        mutationFn: fn,
        ...options,
    });

    useLoadingMouse(mutation.isPending);

    return {
        execute: mutation.mutate,
        executeAsync: mutation.mutateAsync,
        ...mutation,
        errorMessage: (mutation.error as any)?.response?.data?.message,
    };
};

export default useMutate;
