interface IDescriptionWithValue {
    description: string;
    value: string;
    button?: React.ReactElement;
    className?: string;
}

const DescriptionWithValue = (props: IDescriptionWithValue) => {
    const { description, value, className, button } = props;
    return (
        <div className={className ? className : 'flex-spread'}>
            <p>{description}:</p>
            <strong>{value}</strong>
            {button ?? button}
        </div>
    );
};

export default DescriptionWithValue;
