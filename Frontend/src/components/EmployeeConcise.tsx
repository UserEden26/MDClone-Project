import { useNavigate } from 'react-router-dom';
import Button from './generic/Button';

interface IEmployeeConcise {
    id: number;
    name: string;
    lastName: string;
    position: string;
}

const EmployeeConcise = (props: IEmployeeConcise) => {
    const { id, name, lastName, position } = props;
    const fullName = `${name} ${lastName}`;
    const navigate = useNavigate();
    return (
        <div className="employees__employee">
            <p title={fullName}>{fullName}</p>
            <p title={position}>{position}</p>
            <Button
                className="employees__employee__button"
                onClick={() => navigate(`/employees/${id}`)}
            >
                View Details
            </Button>
        </div>
    );
};

export default EmployeeConcise;
