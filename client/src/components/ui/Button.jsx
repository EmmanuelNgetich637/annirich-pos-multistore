import "./Button.css";

function Button({
    children,
    variant = "primary",
    size = "md",
    type = "button",
    disabled = false,
    onClick,
    icon,
}) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`btn btn-${variant} btn-${size}`}
        >
            {icon && (
                <span className="btn-icon">
                    {icon}
                </span>
            )}

            <span>{children}</span>
        </button>
    );
}

export default Button;