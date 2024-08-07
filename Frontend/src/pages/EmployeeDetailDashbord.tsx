import { useNavigate, useParams } from 'react-router-dom';
import EmployeeStaticDetails from '../components/employeeView/EmployeeStaticDetails';
import Sobordinates from '../components/employeeView/Sobordinates';
import Tasks from '../components/employeeView/Tasks';
import { useEffect } from 'react';

const EmployeeDetailDashbord = () => {
    const { employeeId } = useParams();
    const navigate = useNavigate();

    const numericParam = Number(employeeId);
    useEffect(() => {
        if (isNaN(numericParam) || numericParam <= 0) {
            navigate('/employees');
        }
    }, [numericParam, navigate]);

    return (
        <div className="dashboard-layout">
            <EmployeeStaticDetails employeeId={numericParam} />
            <Tasks employeeId={numericParam} />
            <Sobordinates employeeId={numericParam} />
        </div>
    );
};
export default EmployeeDetailDashbord;
