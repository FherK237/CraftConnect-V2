import './InputPass.css';
function InputPass({ label, type, name, value, onChange, placeholder, button, type2, onClick}) {
    return (
        <div className="form-group">
            <label className="custom-label">
                {label}
            </label>
            <div className="input-pass-wrapper">
                <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="custom-input input-with-icon"
                />
            <button 
                type="button" 
                onClick={onClick} 
                className="btn-toggle-pass"
                title={type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña'}
            >
                <span className="material-icons-outlined" style={{color:'black'}}>{button}</span>
            </button>

            </div>


        </div>
    )
}

export default InputPass