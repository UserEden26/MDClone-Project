import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormError from './FormError';
import Button from './generic/Button';
import useMutate from '../hooks/useMutate';
import { createTask } from '../api/queries/task';
import { taskFromSchema } from '../forms/task.schema';
import { useEffect } from 'react';
import { ICreateTask } from 'shared/interfaces/task.interface';

type TaskFormFieldsType = Pick<ICreateTask, 'taskText'> & {
    dueDate: string;
    time: string;
};

interface ITaskForm {
    setClosePopUp: () => void;
    employeeId: number;
}

const TaskForm = (props: ITaskForm) => {
    const { setClosePopUp, employeeId } = props;
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskFormFieldsType>({
        resolver: yupResolver(taskFromSchema),
        mode: 'onChange',
        defaultValues: {
            taskText: '',
            dueDate: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().slice(0, 5),
        },
    });
    const { executeAsync, isError, errorMessage, isSuccess } =
        useMutate(createTask);

    const hasErrors = Object.keys(errors).length > 0;

    useEffect(() => {
        if (isSuccess) {
            setClosePopUp();
        }
    }, [isSuccess, setClosePopUp]);

    const onSubmit = (data: TaskFormFieldsType) => {
        const { dueDate, taskText, time } = data;
        executeAsync({
            dueDate: new Date(`${dueDate}T${time}:00Z`).toISOString(),
            assignDate: new Date().toISOString(),
            employeeId,
            taskText,
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <Controller
                    name="taskText"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            placeholder="Task Text"
                            className="form-control"
                        />
                    )}
                />
                {errors.taskText && (
                    <FormError message={errors.taskText.message!} />
                )}
            </div>

            <div className="form-group">
                <Controller
                    name="dueDate"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="date"
                            className="form-control"
                        />
                    )}
                />
                {errors.dueDate && (
                    <FormError message={errors.dueDate.message!} />
                )}
            </div>

            <div className="form-group">
                <Controller
                    name="time"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="time"
                            className="form-control"
                        />
                    )}
                />
                {errors.time && <FormError message={errors.time.message!} />}
            </div>
            {isError && <FormError message={errorMessage!} />}

            <Button
                type="submit"
                disabled={hasErrors || isError}
                title={hasErrors ? 'Please fill the form properly.' : undefined}
            >
                Create Task
            </Button>
            <Button onClick={setClosePopUp}>Cancle</Button>
        </form>
    );
};

export default TaskForm;
