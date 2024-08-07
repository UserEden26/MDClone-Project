interface IFormError {
    message: string;
}

const FormError = (props: IFormError) => {
    const { message } = props;
    return <p className="alert alert-danger">{message}</p>;
};

export default FormError;
