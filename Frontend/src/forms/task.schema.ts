import * as Yup from 'yup';

export const taskFromSchema = Yup.object().shape({
    taskText: Yup.string()
        .required('Task text is required.')
        .min(4, 'Task text must be at least 4 characters.'),
    dueDate: Yup.string() // Changed to string schema
        .required('Due date is required.')
        .test('is-future', 'Due date cannot be in the past.', value => {
            return new Date(value) >= new Date(new Date().toDateString());
        }),
    time: Yup.string()
        .required('Time is required.')
        .test('is-future', 'Time cannot be in the past.', function (value) {
            const { dueDate } = this.parent;
            if (!dueDate || !value) return true;
            const dateTime = new Date(`${dueDate}T${value}`);
            return dateTime > new Date();
        }),
});
