function InputPass({ label, type, name, value, onChange, placeholder, button, type2, onClick}) {
    return (
        <div>
            <label>
                {label}
            </label>
            <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            />
            <button 
                type={type2}
                onClick={onClick}
            >
                {button}
            </button>
        </div>
    )
}

export default InputPass