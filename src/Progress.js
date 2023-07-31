function Progress({ index, numQuestions, maxTotalPoints, points, answer }) {
  return (
    <header className="progress">
      <p>
        Question <strong>{index + 1}</strong>/{numQuestions}
      </p>
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      {/* //answer !==null is there is no answer it is false so the value is 0 but
      it is answer it is true so value is 1 */}
      <p>
        <strong>{points}</strong> /{maxTotalPoints}
      </p>
    </header>
  );
}

export default Progress;
