import React from "react";

//从Register接收到的props
function FormRow({ type, name, value, handleChange, labelText }) {
//   console.log(type, name);
  return (
    <div>
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
        className="form-input"
      />
    </div>
  );
}

export default FormRow;
