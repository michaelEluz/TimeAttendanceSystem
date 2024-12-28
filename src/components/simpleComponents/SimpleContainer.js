
export default function SimpleContainer({children, style})
{
    return (
        <div style={style}>
            {children}
        </div>
    );
}