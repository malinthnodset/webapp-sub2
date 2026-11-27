//Shows the question, collects answers and submits them
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { quizService } from "../services/quizService";
import type { QuizForTakingDto } from "../types/quiz";


function TakeQuizPage() {
  //1. Read quiz id from the URL
  const { id } = useParams();
  const quizId = Number(id);
  const navigate = useNavigate();

  //2. State: what the page remembers between renders
  const [quiz, setQuiz] = useState<QuizForTakingDto | null>(null);  //null = null until the quiz has loaded
  const [answers, setAnswers] = useState<Record<number, string>>({});   //questionId is bound to the answer
  const [missing, setMissing] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //3. Load the quiz when the page opens
  useEffect(() => {
    quizService
      .getForTaking(quizId)
      .then(setQuiz)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [quizId]);

  //4. Validate the form and submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); //Stops the browser from reloading the page
    if (!quiz) return;  //Stops if the quiz hasn't loaded

    //Client-side validation, every question needs and answer
    const empty = quiz.questions.filter((q) => !answers[q.id]?.trim()).map((q) => q.id);
    setMissing(empty);
    if (empty.length > 0) return;

    //locks the button so the quiz can't be sent in twice in the same session
    setSubmitting(true);
    try {
      const result = await quizService.submit({
        quizId,
        answers: quiz.questions.map((q) => ({
          quizQuestionId: q.id,
          submittedAnswer: answers[q.id].trim(),
        })),
      });

      //Go to the result page and bring the results along, so it doesn't need a new request
      navigate(`/quizzes/${quizId}/result`, { state: result });
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  //5. What to show: conditional rendering
  if (loading) return <p>Loading quiz...</p>;
  if (!quiz) return <div className="alert alert-danger">{error ?? 'Quiz not found.'}</div>;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="text-muted mb-1">{quiz.courseName}</p>
      <h1>{quiz.title}</h1>
      {quiz.description && <p>{quiz.description}</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {quiz.questions.map((q, i) => {
        const isMissing = missing.includes(q.id);
        return (
          <div key={q.id} className="mb-3">
            <label htmlFor={`q-${q.id}`} className="form-label">
              {i + 1}. {q.prompt} <small>({q.points} p)</small>
            </label>
            <input
              id={`q-${q.id}`}
              className={`form-control ${isMissing ? 'is-invalid' : ''}`}
              value={answers[q.id] ?? ''}
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            />
            {isMissing && <div className="invalid-feedback">Please answer this question.</div>}
          </div>
        );
      })}

      <button type="submit" className="btn btn-dark" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit answers'}
      </button>
    </form>
  );
}

export default TakeQuizPage;