import { useEffect, useReducer } from "react";
import "./App.css";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Start from "./Start";
import NextQuestion from "./NextButton";
import Progress from "./Progress";
import Finished from "./Finished";
import Timer from "./Timer";

const initialState = {
  questions: [],
  curstatus: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};
const SECS_PER_QUESTION = 30;

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, curstatus: "ready" };
    case "dataError":
      return { ...state, curstatus: "Error" };
    case "start":
      return {
        ...state,
        curstatus: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "finish":
      return {
        ...state,
        curstatus: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        curstatus: "ready",
      };
    // return {
    //   ...state,
    //   points: 0,
    //   highscore: 0,
    //   answer: null,
    //   index: 0,
    // };
    case "timer":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        curstatus: state.secondsRemaining === 0 ? "finished" : state.curstatus,
      };

    default:
      throw new Error("Action unknown");
  }
}
export default function App() {
  const [
    {
      questions,
      curstatus,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxTotalPoints = questions.reduce((pre, cur) => pre + cur.points, 0);
  useEffect(function () {
    // const res = fetch("http://localhost:8000/questions");
    // const data = res.json();
    // console.log(data);
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataError" }));
  }, []);
  return (
    <div>
      <Header />

      <Main>
        {curstatus === "loading" && <Loader />}
        {curstatus === "Error" && <Error />}
        {curstatus === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {curstatus === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              maxTotalPoints={maxTotalPoints}
              points={points}
              answer={answer}
            />
            <Start
              question={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />
            <footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextQuestion
                dispatch={dispatch}
                answer={answer}
                numQuestions={numQuestions}
                index={index}
              />
            </footer>
          </>
        )}
        {curstatus === "finished" && (
          <Finished
            points={points}
            maxTotalPoints={maxTotalPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
