//Shows the score, per-question feedback and gamification rewards after a quiz.

import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { quizService } from "../services/quizService";
import type { QuizResultDto } from "../types/attempt";

function QuizResultPage() {
  //1. Read the quizId from the URL and the result passed from TakeQuizPage
  const { id } = useParams();
  const quizId = Number(id);
  const location = useLocation();
  const passedResult = location.state as QuizResultDto | null; //null if the page is opened directly or reloaded

  //2. State: start with the passed result of we have one
  const [result, setResult] = useState<QuizResultDto | null>(passedResult);
  const [loading, setLoading] = useState(!passedResult);  //only load if nothing was passed
  const [error, setError] = useState<string | null>(null);

  //3. Fetch the last result only if it wasnt't passed along
  useEffect(() => {
    if (result) return; //if the result is there, then no request needed

    quizService
      .getLatestResult(quizId)
      .then(setResult)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [quizId, result]);

  //4. What to show
  if (loading) return <p>Loading result...</p>   //Loading message
  if (!result) {
    return (
      <div>
        <div className="alert alert-danger">{error ?? 'No result found.'}</div>
        <Link to={`/quizzes/${quizId}/take`} className="btn btn-dark">Take the quiz</Link>   {/*Button to redirect to the quiz*/}
      </div>
    );
  }

  //Short message based on score
  //TODO: agree on exact scores based on points
  const message =
    result.percentage === 100 ? 'Perfect score!' :
      result.percentage >= 50 ? 'Good job!' :
        'Keep practising!';

  return (
    <div>
      <p className="text-muted mb-1">Result</p>
      <h1>{result.quizTitle}</h1>

      {/*Score summary*/}
      <div className="mb-4">
        <p className="display-5 mb-0">{result.percentage}%</p>
        <p className="mb-1">
          {result.pointsEarned} of {result.maximumPoints} points · {result.correctAnswers} of {result.totalQuestions} correct
        </p>
        <p className="fw-bold">{message}</p>
        <small className="text-muted">
          Completed {new Date(result.completedAt).toLocaleString('nb-NO')}   {/*Translates the timestamp into Norwegian time*/}
        </small>
      </div>

      {/* Gamification: only shown when something was unlocked */}
      {result.catJustFreed && (
        <div className="alert alert-success">The cat is out of the box! Keep taking quizzes to decorate the room!</div>
      )}
      {result.newFurnitureName && (
        <div className="alert alert-success">New furniture unlocked: <strong>{result.newFurnitureName}!</strong></div>
      )}

      {/* Feedback per question */}
      <h2 className="h4">Your answers</h2>
      <ul className="list-unstyled">
        {result.feedback.map((f, i) => (
          <li key={f.quizQuestionId} className={`p-3 mb-2 border rounded ${f.isCorrect ? 'border-success' : 'border-danger'}`}>  {/*Gives a green or red border around the answer based on whether it is correct or not*/}
            <p className="mb-1">
              <span aria-hidden="true">{f.isCorrect ? '✓' : '✗'}</span> {i + 1}. {f.prompt} {/*If answer is correct: checkmark. If not: X*/}
            </p>
            <p className="mb-0">
              Your answer: <strong>{f.submittedAnswer || '(no answer)'}</strong> · {f.pointsAwarded} p
            </p>
            {/*Only show the correct answer when the student got it wrong*/}
            {!f.isCorrect && (
              <p className="mb-0 text-success">Correct answer: <strong>{f.correctAnswer}</strong></p>
            )}
          </li>
        ))}
      </ul>

      {/* Navigation */}
      <div className="d-flex gap-2">
        <Link to={`/quizzes/${quizId}/take`} className="btn btn-dark">Try again</Link>  {/*Button to restart the quiz/make another attempt*/}
        <Link to="/" className="btn btn-outline-dark">Back to home</Link>
      </div>
    </div>
  );
}

export default QuizResultPage;


