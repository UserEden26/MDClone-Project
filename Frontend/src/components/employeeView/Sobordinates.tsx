import { useState } from 'react';
import BorderContent from '../generic/BorderContent';
import Button from '../generic/Button';
import Popup from '../Popup';
import TaskForm from '../TaskForm';
import { IEmployeeId } from '../../interfaces/employeeId.interface';
import useEmployeeRelation from '../../hooks/useEmployeeRelation';
import useMyData from '../../hooks/useMyData';

const Sobordinates = ({ employeeId }: IEmployeeId) => {
    const { data, isLoading, isFetched } = useEmployeeRelation(employeeId);
    const myData = useMyData();
    const [employeeIdForPopup, setEmployeeIdForPopup] = useState(0);

    const closePopup = () => setEmployeeIdForPopup(0);
    if (isLoading && !isFetched) return <div>Loading...</div>;
    return (
        <>
            {data && data?.managedEmployees.length == 0 ? (
                <p>no Sobordinates</p>
            ) : (
                <BorderContent title={{ value: 'My Sobordinates' }}>
                    <ul className="list-group">
                        {data!.managedEmployees.map(emp => (
                            <li
                                className="list-group-item flex-spread"
                                key={`sobordinate-${emp.employeeId}`}
                            >
                                <p>
                                    {emp.employeeName} {emp.employeeLastName}
                                </p>
                                <p>{emp.position}</p>
                                {employeeId === myData?.employeeId && (
                                    <Button
                                        onClick={() =>
                                            setEmployeeIdForPopup(
                                                emp.employeeId
                                            )
                                        }
                                    >
                                        Add task
                                    </Button>
                                )}
                            </li>
                        ))}
                    </ul>
                </BorderContent>
            )}

            <Popup isOpen={employeeIdForPopup != 0} onClose={closePopup}>
                <TaskForm
                    employeeId={employeeIdForPopup}
                    setClosePopUp={closePopup}
                />
            </Popup>
        </>
    );
};

export default Sobordinates;
