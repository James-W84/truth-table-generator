import { useEffect, useState } from "react";
import "./App.css";
import Input from "./Input";
import Output from "./Output";

function App() {
  const [numInputs, setNumInputs] = useState(0);
  const [inputArr, setInputArr] = useState([]);

  const [numOutputs, setNumOutputs] = useState(0);
  const [outputArr, setOutputArr] = useState([]);

  // const [inputs, setInputs] = useState([]);
  // const [arguments, setArguments] = useState([]);

  const [formInputs, setFormInputs] = useState({});

  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    document.title = "Truth Table Generator";
  }, []);

  useEffect(() => {
    let tempArr = [];
    for (let i = 1; i <= numInputs; i++) {
      tempArr.push(i);
    }
    setInputArr(tempArr);
  }, [numInputs]);

  useEffect(() => {
    let tempArr = [];
    for (let i = 1; i <= numOutputs; i++) {
      tempArr.push(i);
    }
    setOutputArr(tempArr);
  }, [numOutputs]);

  const handleChange = (e) => {
    // console.log(e);
    const name = e.target.name;
    const value = e.target.value;
    setFormInputs((values) => ({ ...values, [name]: value }));
  };

  const addOperator = (e) => {
    const name =
      e.target.parentElement.parentElement.querySelector("input").name;
    let value = "";
    formInputs[name] === undefined
      ? (value = e.target.innerHTML)
      : (value = formInputs[name] + e.target.innerHTML);
    setFormInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = () => {
    setIsCalculating(true);
  };

  if (!isCalculating) {
    return (
      <section className="container">
        <h1>Truth Table Generator</h1>
        <div className="truth-table-form">
          <form onSubmit={handleSubmit}>
            <article className="input-group">
              <div className="label-container">
                <label>Number of inputs:</label>
              </div>
              <input
                type="number"
                step="1"
                name="numInputs"
                min="1"
                onChange={(e) =>
                  e.target.value > -1 && setNumInputs(e.target.value)
                }
                required
              ></input>
            </article>
            {inputArr.map((i) => {
              return (
                <Input
                  inputNum={i}
                  formInputs={formInputs}
                  handleChange={handleChange}
                ></Input>
              );
            })}
            <article className="input-group">
              <div className="label-container">
                <label>Number of outputs:</label>
              </div>
              <input
                type="number"
                step="1"
                name="numOutputs"
                min="1"
                onChange={(e) =>
                  e.target.value > -1 && setNumOutputs(e.target.value)
                }
                required
              ></input>
            </article>
            <div id="argumentInputs">
              {outputArr.map((i) => {
                return (
                  <Output
                    outputNum={i}
                    formInputs={formInputs}
                    handleChange={handleChange}
                    addOperator={addOperator}
                  ></Output>
                );
              })}
            </div>
            <div className="submit-container">
              <button className="submit-btn" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  } else {
    const numCols = numInputs + numOutputs;
    const numRows = Math.pow(2, numInputs);
    const header = Object.values(formInputs);
    const inputs = header.slice(0, numInputs);
    const outputs = header.slice(numInputs);
    let validOutputs = true;

    const checkBrackets = (arr, message) => {
      let val = 0;
      arr.forEach((el) => {
        if (el === "(") val++;
        else if (el === ")") val--;
        if (val < 0) {
          message.msg = "mismatched brackets";
          return false;
        }
      });

      return val === 0;
    };

    const checkOperators = (arr, message) => {
      let regex = new RegExp("[¬∧∨→↔]");
      if (regex.test(arr[arr.length - 1])) {
        message.msg = "last character cannot be an operator";
        return false;
      }
      for (let i = 0; i < arr.length - 1; i++) {
        if (
          regex.test(arr[i]) &&
          regex.test(arr[i + 1]) &&
          !(arr[i + 1] === "¬" && arr[i] !== "¬")
        ) {
          message.msg = "operator must be followed by a variable input";
          return false;
        }
      }
      return true;
    };

    const findMatchingBracket = (arr) => {
      let val = 0;
      let idx = -1;
      let isOpen = false;
      arr.forEach((el, i) => {
        if (el === "(") {
          val++;
          isOpen = true;
        } else if (el === ")") {
          val--;
        }
        if (val === 0 && isOpen) {
          idx = i;
          val = arr.length + 1;
        }
      });
      return idx;
    };

    let a = 3;

    const evaluate = (arg) => {
      // console.log(arg.join(", "));
      if (arg.length === 1) {
        return arg[0];
      } else {
        if (arg.indexOf("(") > -1) {
          let idx = arg.indexOf("(");
          let temp = arg.slice(0, idx);

          temp.push(evaluate(arg.slice(idx + 1, findMatchingBracket(arg))));
          console.log(arg.slice(findMatchingBracket(arg) + 1));
          temp = temp.concat(arg.slice(findMatchingBracket(arg) + 1));
          console.log(Array.isArray(temp));
          return evaluate(temp);
        } else if (arg.indexOf("¬") > -1) {
          let idx = arg.indexOf("¬");
          let temp = [];
          if (idx > 0) temp = temp.concat(arg.slice(0, idx));
          temp.push(!arg[idx + 1]);
          temp = temp.concat(arg.slice(idx + 2));
          return evaluate(temp);
        } else if (arg.indexOf("∧") > -1) {
          let idx = arg.indexOf("∧");
          let temp = arg.slice(0, idx - 1);
          temp.push(arg[idx - 1] && arg[idx + 1]);
          temp = temp.concat(arg.slice(idx + 2));
          return evaluate(temp);
        } else if (arg.indexOf("∨") > -1) {
          let idx = arg.indexOf("∨");
          let temp = arg.slice(0, idx - 1);
          temp.push(arg[idx - 1] || arg[idx + 1]);
          temp = temp.concat(arg.slice(idx + 2));
          return evaluate(temp);
        } else if (arg.indexOf("→") > -1) {
          let idx = arg.indexOf("→");
          let temp = arg.slice(0, idx - 1);
          let input1 = arg[idx - 1];
          let input2 = arg[idx + 1];
          let addition = false;
          if (!input1 || input2) addition = true;
          temp.push(addition);
          temp = temp.concat(arg.slice(idx + 2));
          return evaluate(temp);
        } else if (arg.indexOf("↔") > -1) {
          let idx = arg.indexOf("↔");
          let temp = arg.slice(0, idx - 1);
          temp.push(arg[idx - 1] === arg[idx + 1]);
          temp = temp.concat(arg.slice(idx + 2));
          return evaluate(temp);
        }
      }
    };

    let message = { msg: "invalid characters in statements" };
    outputs.forEach((output, index) => {
      outputs[index] = output.replaceAll(" ", "");
      let regex = new RegExp("[^" + inputs.join("") + "¬∧∨→↔() " + "]").test(
        output
      );

      if (
        regex ||
        !checkBrackets(Array.from(output), message) ||
        !checkOperators(Array.from(output), message)
      )
        validOutputs = false;
    });

    if (!validOutputs) {
      return (
        <section className="refresh">
          <h1>invalid argument:</h1>
          <p>{message.msg}</p>
          <button
            className="refresh-btn"
            onClick={() => {
              window.location.reload();
            }}
          >
            Refresh Page
          </button>
        </section>
      );
    }

    let dataset = [];

    for (let i = 0; i < numRows; i++) {
      dataset.push([]);
    }

    for (let j = 0; j < numInputs; j++) {
      let data = "T";
      let sliceLength = numRows / Math.pow(2, j + 1);
      for (let i = 0; i < numRows; i++) {
        dataset[i].push(data);
        if ((i + 1) % sliceLength === 0) {
          data === "T" ? (data = "F") : (data = "T");
        }
      }
    }

    let args = [];
    for (let j = 0; j < numOutputs; j++) {
      let temp = Array.from(outputs[j]);
      args.push(temp);
    }

    args.forEach((arg, idx) => {
      for (let i = 0; i < numRows; i++) {
        let temp = [];
        arg.forEach((el) => {
          if (inputs.includes(el)) {
            let letter = dataset[i][inputs.indexOf(el)];
            temp.push(letter === "T");
          } else {
            temp.push(el);
          }
        });
        dataset[i].push(evaluate(temp) ? "T" : "F");
        console.log("finished row");
      }
    });

    return (
      <>
        <h1>Truth Table</h1>
        <table id="truth-table">
          <thead>
            <tr>
              {header.map((el) => {
                return <th>{el}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {dataset.map((row) => {
              return (
                <tr>
                  {row.map((data) => {
                    return <td>{data}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  }
}

export default App;
