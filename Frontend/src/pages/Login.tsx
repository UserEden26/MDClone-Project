import Button from '../components/generic/Button';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const navigate = useNavigate();
    return (
        <div className="login">
            <h2>Login</h2>
            <LoginForm />
            <Button onClick={() => navigate('/employees')}>Employees</Button>
        </div>
    );
};

export default Login;
