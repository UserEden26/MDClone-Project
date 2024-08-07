import classNames from 'classnames';

type ButtonType = 'button' | 'submit' | 'reset';

interface IButton {
    onClick?: () => any;
    className?: string;
    styleType?: 'primary' | 'secondary' | 'success' | 'dannger';
    type?: ButtonType;
    children: React.ReactNode;
    disabled?: boolean;
    title?: string;
}

const Button = (props: IButton) => {
    const {
        onClick,
        className,
        styleType = 'primary',
        type = 'button',
        children,
        disabled,
        title,
    } = props;
    const isDisabled = disabled ?? false;
    return (
        <button
            className={classNames(
                'btn',
                `btn-${styleType}`,
                className,
                isDisabled && 'blocked'
            )}
            onClick={!isDisabled ? onClick : undefined}
            type={type}
            disabled={isDisabled}
            title={title}
        >
            {children}
        </button>
    );
};

export default Button;
