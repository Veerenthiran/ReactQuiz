import { useReducer } from "react";

const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case "dec":
      return { ...state, count: state.count - state.step };
    case "inc":
      return { ...state, count: state.count + state.step };
    case "defcou":
      return { ...state, count: action.payload };
    case "defstep":
      return { ...state, step: action.payload };
    case "reset":
      return initialState;

    default:
      throw new Error("unknown aciton");
  }

  //   if (action.type === "inc") return state + 1;
  //   if (action.type === "dec") return state - 1;
  //   if (action.type === "defcou") return action.payload;
  //   if (action.type === "reset") return action.payload;
}

export default function DateMy() {
  //   const [count, setCount] = useState(0);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { count, step } = state;
  //   const [step, setStep] = useState(1);

  const date = new Date("june 21 2026");
  date.setDate(date.getDate() + count);

  const dec = function () {
    dispatch({ type: "dec" });
    // setCount((count) => count - step);
  };
  const inc = function () {
    dispatch({ type: "inc" });
    // setCount((count) => count + step);
  };
  const defineCount = function (e) {
    dispatch({ type: "defcou", payload: Number(e.target.value) });
    // setCount(Number(e.target.value));
  };
  const defineStep = function (e) {
    dispatch({ type: "defstep", payload: Number(e.target.value) });
    // setStep(Number(e.target.value));
  };
  const reset = function () {
    dispatch({ type: "reset" });
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>
      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>
      <p>{date.toDateString()}</p>
      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
