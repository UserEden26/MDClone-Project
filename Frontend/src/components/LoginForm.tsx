import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormError from './FormError';
import Button from './generic/Button';
import { login } from '../api/queries/login';
import useMutate from '../hooks/useMutate';
import { useNavigate } from 'react-router-dom';
import { loginFromSchema } from '../forms/login.schema';
import { ILogin as ILoginFields } from 'shared/interfaces/auth.interface';

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<ILoginFields>({
        resolver: yupResolver(loginFromSchema),
        mode: 'onChange',
    });

    const navigate = useNavigate();
    const { executeAsync, isError, errorMessage, isSuccess } = useMutate(login);

    const [showRootError, setShowRootError] = useState(false);

    const hasErrors = Object.keys(errors).length > 0;
    const hasErrorsWithoutRoot =
        Object.keys(errors).filter(k => k !== 'root').length > 0;

    useEffect(() => {
        if (isSuccess) {
            navigate('/employees');
        }
    }, [isSuccess, navigate]);

    useEffect(() => {
        if (isError) {
            errorMessage &&
                setError('root', {
                    type: 'network',
                    message: 'One or more fields are wrong.',
                });
            setShowRootError(true);
            const timer = setTimeout(() => {
                setShowRootError(false);
                clearErrors('root');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isError, setError, errorMessage, clearErrors]);

    const onSubmit = (data: ILoginFields) => {
        executeAsync(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="form-group login-form__form-group">
                <input
                    placeholder="Email"
                    className="form-control"
                    id="email"
                    {...register('email')}
                />
                {errors.email && <FormError message={errors.email.message!} />}
            </div>

            <div className="form-group login-form__form-group">
                <input
                    placeholder="Password"
                    className="form-control"
                    type="password"
                    {...register('password')}
                />
                {errors.password && (
                    <FormError message={errors.password.message!} />
                )}
            </div>

            {showRootError && errors.root && (
                <FormError message={errors.root.message!} />
            )}

            <Button
                type="submit"
                disabled={hasErrorsWithoutRoot}
                title={
                    hasErrors
                        ? 'You need to fill the form properly.'
                        : undefined
                }
            >
                Login
            </Button>
        </form>
    );
};

export default LoginForm;
