import * as Yup from 'yup';

export const loginFromSchema = Yup.object().shape({
    email: Yup.string()
        .required('Email is required.')
        .email('Please enter a valid email address.')
        .min(6, 'Email must be at least 6 characters.'),
    password: Yup.string()
        .required('Password is required.')
        .min(8, 'Password must be at least 8 characters.')
        .max(20, 'Password must be under 20 characters.'),
});
