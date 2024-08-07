interface IBorderContent {
    title?: {
        value: string;
        className?: string;
    };
    children: React.ReactNode;
}

const BorderContent = (props: IBorderContent) => {
    const { title, children } = props;
    return (
        <section className="section">
            {title?.value && (
                <h4 className={title.className && title.className}>
                    {title.value}
                </h4>
            )}
            <div className="section__content">{children}</div>
        </section>
    );
};

export default BorderContent;
