export default function SimpleInput({style,type,value, onChangeFunction, placeholder,props})
{
    function onValueChange(e) {
        onChangeFunction?.(e.target.value)
    }

    return (
        <input
            {...props}
            type={type}
            style={style}
            value={value}
            onChange={onValueChange}
            placeholder={placeholder}
        />
    );
}