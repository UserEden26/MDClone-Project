import { useEffect } from 'react';

const useLoadingMouse = (isLoading: boolean) => {
    useEffect(() => {
        if (isLoading) {
            document.documentElement.style.setProperty(
                '--cursor-style',
                'wait'
            );
        } else {
            document.documentElement.style.setProperty(
                '--cursor-style',
                'default'
            );
        }

        return () => {
            document.documentElement.style.setProperty(
                '--cursor-style',
                'default'
            );
        };
    }, [isLoading]);
};

export default useLoadingMouse;
