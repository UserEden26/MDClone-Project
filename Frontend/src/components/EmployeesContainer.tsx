import { Fragment } from 'react/jsx-runtime';
import { getEmployees } from '../api/queries/employee';
import useFetchPages from '../hooks/useFethPages';
import EmployeeConcise from './EmployeeConcise';
import Button from './generic/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const EmployeesContainer = () => {
    const {
        data,
        isFetched,
        hasNextPage,
        refetch,
        fetchNextPage,
        isFetchingNextPage,
        isError,
    } = useFetchPages(
        [getEmployees.name],
        getEmployees,
        {},
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: 2 * 60 * 1000,
        }
    );
    const navigate = useNavigate();
    const [tries, setTries] = useState(1);

    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    };

    if (isError)
        return (
            <>
                <Button onClick={() => navigate('/login')}>Login</Button>
                {tries < 3 && (
                    <Button
                        onClick={() => {
                            setTries(tries + 1);
                            refetch();
                        }}
                    >
                        Retry
                    </Button>
                )}
            </>
        );

    return (
        <>
            {isFetched &&
                data?.pages[0].total != 0 &&
                data?.pages.map((page, i) => (
                    <Fragment key={`allEmployees-${i}`}>
                        {page.data.map(d => (
                            <EmployeeConcise
                                key={d.employeeId}
                                id={d.employeeId}
                                lastName={d.employeeLastName}
                                name={d.employeeName}
                                position={d.position}
                            />
                        ))}
                    </Fragment>
                ))}
            {hasNextPage && (
                <Button
                    type="button"
                    styleType="primary"
                    onClick={loadMore}
                    disabled={isFetchingNextPage}
                >
                    {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                </Button>
            )}
        </>
    );
};

export default EmployeesContainer;
