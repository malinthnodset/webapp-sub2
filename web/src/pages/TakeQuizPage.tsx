//Shows the questions, collects answers and submits them.
//Server data (the quiz, submitting) is handled by TanStack Query, form input is local useState.

import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { quizService } from '../services/quizService';
import type { QuizForTakingDto } from '../types/quiz';
import type { QuizResultDto, SubmitQuizDto } from '../types/attempt';

function TakeQuizPage() {
  //1. Read quiz id from the URL
  const { id } = useParams();
  const quizId = Number(id);
  const navigate = useNavigate();

  //2. Fetch the quiz: TanStack Query gives us data, isLoading and error
  const { data: quiz, isLoading, error } = useQuery<QuizForTakingDto, Error>({
    queryKey: ['quiz', quizId], // unique name for this data, used for caching
    queryFn: () => quizService.getForTaking(quizId),
  });

  //3. Submit the answers: useMutation is for requests that change data on the server
  const submitMutation = useMutation<QuizResultDto, Error, SubmitQuizDto>({
    mutationFn: quizService.submit,
    // Runs when the server has answered: go to the result page and bring the result along
    onSuccess: (result) => navigate(`/quizzes/${quizId}/result`, { state: result }),
  });

  //4. Local form state: what the student types, and which questions are unanswered
  const [answers, setAnswers] = useState<Record<number, string>>({}); // questionId → answer
  const [missing, setMissing] = useState<number[]>([]);

  //5. Validate the form and submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // stops the browser from reloading the page
    if (!quiz) return; // stop if the quiz hasn't loaded

    // Client-side validation: every question needs an answer
    const empty = quiz.questions.filter((q) => !answers[q.id]?.trim()).map((q) => q.id);
    setMissing(empty);
    if (empty.length > 0) return;

    submitMutation.mutate({
      quizId,
      answers: quiz.questions.map((q) => ({
        quizQuestionId: q.id,
        submittedAnswer: answers[q.id].trim(),
      })),
    });
  };

  //6. What to show: conditional rendering
  if (isLoading) return <p>Loading quiz...</p>;
  if (error || !quiz) {
    return <div className="alert alert-danger">{error?.message ?? 'Quiz not found.'}</div>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="text-muted mb-1">{quiz.courseName}</p>
      <h1>{quiz.title}</h1>
      {quiz.description && <p>{quiz.description}</p>}

      {/* Error from submitting (e.g. the server is down) */}
      {submitMutation.error && (
        <div className="alert alert-danger">{submitMutation.error.message}</div>
      )}

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

      <button type="submit" className="btn btn-dark" disabled={submitMutation.isPending}>
        {submitMutation.isPending ? 'Submitting...' : 'Submit answers'}
      </button>
    </form>
  );
}

export default TakeQuizPage;