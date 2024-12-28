
export default function SimpleButton({children,onClickFunction, style, props})
{

    return (
    <button style={style}
        onClick={onClickFunction}
        {...props}
    >
        {children}    
    </button>
    );
}