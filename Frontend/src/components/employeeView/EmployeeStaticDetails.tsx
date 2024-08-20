import DescriptionWithValue from '../generic/DescriptionWithValue';
import Button from '../generic/Button';
import Popup from '../Popup';
import { useState } from 'react';
import ReportForm from '../ReportForm';
import { IEmployeeId } from '../../interfaces/employeeId.interface';
import useEmployeeRelation from '../../hooks/useEmployeeRelation';
import useMyData from '../../hooks/useMyData';

const EmployeeStaticDetails = ({ employeeId }: IEmployeeId) => {
    const { data, isFetched, isLoading } = useEmployeeRelation(employeeId);
    const [employeeIdForPopup, setEmployeeIdForPopup] = useState(0);
    const closePopup = () => setEmployeeIdForPopup(0);
    const myData = useMyData();

    const canSendReport = Boolean(
        data && data.manager && myData && myData.employeeId == data.employeeId
    );

    if (isLoading) return <p>loading...</p>;
    return (
        <>
            {isFetched && data != undefined && (
                <div className="static-detailes">
                    <div className="static-detailes__picture">
                        <img></img>
                    </div>
                    <div className="static-detailes__descriptions">
                        <DescriptionWithValue
                            description="Name"
                            value={`${data.employeeName} ${data.employeeLastName}`}
                        />
                        <DescriptionWithValue
                            description="Position"
                            value={data.position}
                        />
                        <p className="black-line"></p>
                        <DescriptionWithValue
                            description="Manager"
                            value={
                                data.manager
                                    ? `  ${data.manager.employeeName} ${data.manager.employeeLastName}`
                                    : 'No Manager'
                            }
                            button={
                                <>
                                    {data.manager && (
                                        <Button
                                            styleType={
                                                canSendReport
                                                    ? 'primary'
                                                    : 'dannger'
                                            }
                                            title={
                                                !canSendReport
                                                    ? 'You are not this manager employee'
                                                    : ''
                                            }
                                            disabled={!canSendReport}
                                            onClick={() =>
                                                canSendReport &&
                                                setEmployeeIdForPopup(
                                                    data.manager!.employeeId
                                                )
                                            }
                                        >
                                            Report
                                        </Button>
                                    )}
                                </>
                            }
                        />
                    </div>
                </div>
            )}
            <Popup isOpen={employeeIdForPopup != 0} onClose={closePopup}>
                <ReportForm
                    employeeId={employeeIdForPopup}
                    setClosePopUp={closePopup}
                />
            </Popup>
        </>
    );
};

export default EmployeeStaticDetails;
