import { useEffect, useState } from "react";
import ButtonGroup from "./ButtonGroup";

function Output({ outputNum, formInputs, handleChange, addOperator }) {
  const [isActive, setIsActive] = useState(false);
  // const [value, setValue] = useState("");

  const hideButtonGroup = (e) => {
    if (
      e.target.className !== "btn" &&
      e.target.className !== "btn-group" &&
      e.target.name !== `output${outputNum}`
    )
      setIsActive(false);
  };

  useEffect(() => {
    document
      .querySelector("body")
      .addEventListener("click", (e) => hideButtonGroup(e));
    return function cleanupListener() {
      document
        .querySelector("body")
        .removeEventListener("click", (e) => hideButtonGroup(e));
    };
  }, [isActive]);

  // useEffect(() => {
  //   document.getElementById(`output${outputNum}`).querySelector("input").value =
  //     value;
  // }, [value]);

  return (
    <article className="input-group" id={`output${outputNum}`}>
      <div className="label-container">
        <label>Statement #{outputNum}: </label>
      </div>
      {isActive && (
        <ButtonGroup
          setIsActive={setIsActive}
          formInputs={formInputs}
          addOperator={addOperator}
        />
      )}
      <input
        type="text"
        name={`output${outputNum}`}
        value={formInputs[`output${outputNum}`] || ""}
        onClick={() => setIsActive(true)}
        onChange={(e) => {
          setIsActive(true);
          handleChange(e);
        }}
        required
      ></input>
    </article>
  );
}

export default Output;
