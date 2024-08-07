import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from 'react-router-dom';
import Layout from './layout/Layout';
import Login from './pages/Login';
import Employees from './pages/Employees';
import './scss/main.scss';
import EmployeeDetailDashbord from './pages/EmployeeDetailDashbord';
import ErrorBountry from './ErrorBountry';

function App() {
    const router = createBrowserRouter(
        [
            {
                path: '/',
                element: (
                    <ErrorBountry>
                        <Layout />,
                    </ErrorBountry>
                ),
                children: [
                    {
                        path: 'login',
                        element: <Login />,
                    },
                    {
                        path: 'employees',
                        element: <Employees />,
                    },
                    {
                        path: 'employees/:employeeId',
                        element: <EmployeeDetailDashbord />,
                    },
                    {
                        path: '*',
                        element: <Navigate to={'/login'} />,
                    },
                ],
            },
            {
                index: true,
                element: <Navigate to="/employees" replace />,
            },
        ],
        { basename: '/' }
    );
    return <RouterProvider router={router} />;
}

export default App;
