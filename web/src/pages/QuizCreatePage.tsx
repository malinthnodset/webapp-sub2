// QuizForm collects the input, this page sends it with useMutation and decides what happens next
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import QuizForm from '../components/QuizForm';
import { quizService } from '../services/quizService';

export default function QuizCreatePage() {    //Decides that the quiz will get created
  const navigate = useNavigate();
  const queryClient = useQueryClient(); //Same instance as in main.tsx

  const mutation = useMutation({     
    mutationFn: quizService.create,     //sends POST /api/quizzes
    onSuccess: () => {     //Only runs when the server anwers OK
      // The dashboard lists every quiz, so its cached data is now outdated
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/dashboard');
    },
  });

  return (
    <div className="mx-auto" style={{ maxWidth: '700px' }}>    {/*Senters all the contents, enforces max width*/}
      <h1>New quiz</h1>
      <QuizForm
        onQuizChanged={(quiz) => mutation.mutate(quiz)}    //When the form is done, start loading the page
        error={mutation.error instanceof Error ? mutation.error.message : null}
        submitting={mutation.isPending}    //Locks the button while it is submitting, stops user from submitting twice
      />
    </div>
  );
}