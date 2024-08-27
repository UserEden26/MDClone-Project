import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormError from './FormError';
import Button from './generic/Button';
import useMutate from '../hooks/useMutate';
import { reportFromSchema } from '../forms/report.schema';
import { createReport } from '../api/queries/report';
import { useEffect } from 'react';
import { ICreateReport } from 'shared/interfaces/report.interface';

interface IReportForm {
    setClosePopUp: () => void;
    employeeId: number;
}

type IReportFormFields = Pick<ICreateReport, 'reportText'>;

const ReportForm = (props: IReportForm) => {
    const { setClosePopUp, employeeId } = props;
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IReportFormFields>({
        resolver: yupResolver(reportFromSchema),
        mode: 'onChange',
        defaultValues: {
            reportText: '',
        },
    });
    const { executeAsync, isError, errorMessage, isSuccess } =
        useMutate(createReport);

    useEffect(() => {
        if (isSuccess) alert('Success!');
    }, [isSuccess]);

    const hasErrors = Object.keys(errors).length > 0;

    const onSubmit = (data: IReportFormFields) => {
        const { reportText } = data;
        executeAsync({
            employeeId,
            reportText,
            reportDate: new Date().toISOString(),
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <Controller
                    name="reportText"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            placeholder="Report Text"
                            className="form-control"
                        />
                    )}
                />
                {errors.reportText && (
                    <FormError message={errors.reportText.message!} />
                )}
            </div>
            {isError && <FormError message={errorMessage!} />}

            <Button
                type="submit"
                disabled={hasErrors || isError}
                className="blocked"
                title={hasErrors ? 'Please fill the form properly.' : undefined}
            >
                Create Report
            </Button>
            <Button onClick={setClosePopUp}>Cancle</Button>
        </form>
    );
};

export default ReportForm;
