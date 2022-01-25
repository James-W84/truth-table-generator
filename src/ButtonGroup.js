function ButtonGroup({ setIsActive, formInputs, addOperator }) {
  return (
    <div
      className="btn-group"
      onClick={() => setIsActive(true)}
      onMouseOver={() => setIsActive(true)}
    >
      <button className="btn" type="button" onClick={addOperator}>
        ¬
      </button>
      <button className="btn" type="button" onClick={addOperator}>
        ∧
      </button>
      <button className="btn" type="button" onClick={addOperator}>
        ∨
      </button>
      <button className="btn" type="button" onClick={addOperator}>
        →
      </button>
      <button className="btn" type="button" onClick={addOperator}>
        ↔
      </button>
    </div>
  );
}

export default ButtonGroup;
