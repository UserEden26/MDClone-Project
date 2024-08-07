import { useState } from 'react';
import BorderContent from '../generic/BorderContent';
import Button from '../generic/Button';
import Popup from '../Popup';
import TaskForm from '../TaskForm';
import { IEmployeeId } from '../../interfaces/employeeId.interface';
import useEmployeeRelation from '../../hooks/useEmployeeRelation';
import useMyData from '../../hooks/useMyData';
import { IEmployeeWithoutPassword } from '../../interfaces/employee.interface';

const Sobordinates = ({ employeeId }: IEmployeeId) => {
    const { data, isLoading, isFetched } = useEmployeeRelation(employeeId);
    const [employeeIdForPopup, setEmployeeIdForPopup] = useState(0);
    const myData = useMyData();

    const findMatch = (data: IEmployeeWithoutPassword[], b: number) => {
        return data.findIndex(f => f.employeeId == b);
    };

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
                                <Button
                                    disabled={
                                        myData &&
                                        findMatch(
                                            myData.managedEmployees,
                                            emp.employeeId
                                        ) != -1
                                    }
                                    onClick={() =>
                                        setEmployeeIdForPopup(emp.employeeId)
                                    }
                                >
                                    Add task
                                </Button>
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
