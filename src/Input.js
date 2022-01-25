function Input({ inputNum, formInputs, handleChange }) {
  return (
    <article className="input-group">
      <div className="label-container">
        <label>Name of input #{inputNum}: </label>
      </div>
      <input
        type="text"
        name={`input${inputNum}`}
        maxLength="1"
        value={formInputs[`input${inputNum}`] || ""}
        onChange={(e) => handleChange(e)}
        required
      ></input>
    </article>
  );
}

export default Input;
