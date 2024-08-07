import * as Yup from 'yup';

export const reportFromSchema = Yup.object().shape({
    reportText: Yup.string()
        .required('reportText is required.')
        .min(4, 'reportText must be at least 4 characters.'),
});
