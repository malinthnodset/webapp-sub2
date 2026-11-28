//Update a quiz
//1. First loads the quiz WITH correct answers (useQuery), 2. then shows QuizForm filled in, 3. then saves (useMutation).
import { useNavigate, useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Spinner } from 'react-bootstrap';
import QuizForm from '../components/QuizForm';
import { quizService } from '../services/quizService';
import type { CreateQuizDto } from '../types/quiz';

export default function QuizUpdatePage() {
  const { id } = useParams<{ id: string }>(); //From the URL: /quizzes/:id/edit
  const quizId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  //1. Load the quiz the teacher wants to edit
  const quizQuery = useQuery<CreateQuizDto, Error>({
    //Separate key from ['quiz', id] in TakeQuizPage, this version HAS the correct answers
    queryKey: ['quiz-edit', quizId],
    queryFn: () => quizService.getForEdit(quizId),
    enabled: !!id,  //Turns Id into true or false, Don't fetch before the id is known
    retry: false,   //If not found, don't retry
  });


  // 2. Save the changes
  const mutation = useMutation({
    mutationFn: (quiz: CreateQuizDto) => quizService.update(quizId, quiz),
    onSuccess: () => {
      //Everything that shows this quiz is now outdated
      queryClient.invalidateQueries({ queryKey: ['quiz-edit', quizId] });
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] }); //The take-quiz page
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/dashboard');
    },
  });


  // 3.What to show
  if (quizQuery.isLoading) return <Spinner animation="border" role="status" className="d-block mx-auto" />;
  if (quizQuery.isError) return <Alert variant="danger">Failed to load the quiz: {quizQuery.error.message}</Alert>;
  if (!quizQuery.data) return <p>No quiz found.</p>;

  return (
    <div className="mx-auto" style={{ maxWidth: '700px' }}>
      <h1>Edit {quizQuery.data.title}</h1>
      <QuizForm
        onQuizChanged={(quiz) => mutation.mutate(quiz)}
        quizId={quizId}
        initialValues={quizQuery.data}
        error={mutation.error instanceof Error ? mutation.error.message : null}
        submitting={mutation.isPending}
      />
    </div>
  );
}