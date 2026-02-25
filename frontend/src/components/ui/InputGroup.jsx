function InputGroup({ label, type, name, value, onChange, placeholder}) {
    return (
        <div style={{ marginBottom: '1px' }}>
            <label className="custom-label">
                {label}
            </label>
            <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="custom-input"
            />
        </div>
    )
}

export default InputGroup