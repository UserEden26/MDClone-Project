import React from 'react';
import { getTasks } from '../../api/queries/task';
import BorderContent from '../generic/BorderContent';
import Button from '../generic/Button';
import useFethPages from '../../hooks/useFethPages';
import { IEmployeeId } from '../../interfaces/employeeId.interface';
import { IMinimazedTask } from '../../interfaces/task.interface';
import { formatDate } from '../../utils/timeFormatter';

const Tasks = ({ employeeId }: IEmployeeId) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useFethPages<IMinimazedTask>(
        ['tasks', employeeId],
        getTasks,
        { forEmp: employeeId },
        {
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        }
    );

    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>An error occurred</div>;

    return (
        <>
            {data?.pages[0].total == 0 ? (
                <p>no tasks</p>
            ) : (
                <BorderContent title={{ value: 'My Tasks' }}>
                    <ul className="list-group">
                        {data?.pages.map((page, i) => (
                            <React.Fragment key={`taskPage-${i}`}>
                                {page.data.map(task => (
                                    <li
                                        className="list-group-item task-details"
                                        key={`task-${task.taskId}`}
                                    >
                                        <p>{task.taskText}</p>{' '}
                                        <p>{formatDate(task.dueDate)}</p>
                                    </li>
                                ))}
                            </React.Fragment>
                        ))}
                    </ul>
                    {hasNextPage && (
                        <Button
                            onClick={loadMore}
                            disabled={isFetchingNextPage}
                        >
                            {isFetchingNextPage
                                ? 'Loading more...'
                                : 'Load More'}
                        </Button>
                    )}
                </BorderContent>
            )}
        </>
    );
};

export default Tasks;
