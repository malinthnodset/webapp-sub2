// Quiz DTOs — based on the Quiz model from Subapp 1.
// Notice: CorrectAnswer is NOT in QuizQuestionDto, so students can't read the answers in the browser.

export interface QuizDto {
  id: number;
  title: string;
  description: string | null; // "string?" in C# becomes "string | null"
  courseId: number;
  courseName: string;
  questionCount: number;
}

export interface QuizQuestionDto {
  id: number;
  prompt: string;
  points: number;
  order: number;
}

// A quiz with its questions, for the "take-quiz" page
export interface QuizForTakingDto {
  id: number;
  title: string;
  description: string | null;   //null when the quiz has no description
  courseCode: string;   //e.g. "ITPE3200"
  questions: QuizQuestionDto[];   //list of questions, each one a QuizQuestionDto, excludes the correct answer
}

// Send when a teacher creates or edits a question
export interface CreateQuestionDto {    //has no ID because the database creates it
  prompt: string;
  correctAnswer: string;    //included here so the teacher can input the correct answer, students does not have access
  points: number;
}

// One question inside CreateQuizDto, sent when a teacher creates or edits a quiz
export interface CreateQuizDto {
  title: string;
  description: string | null;  //null when the quiz has no description
  courseId: number;
  questions: CreateQuestionDto[];   //list of questions, each one a CreateQuestionDto
}