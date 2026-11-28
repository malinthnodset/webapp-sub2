// The form only collects and checks the input. The page decides what happens with it
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Form, Button, Alert } from 'react-bootstrap';
import * as courseService from '../services/courseService';
import type { CourseDto } from '../types/course';
import type { CreateQuizDto } from '../types/quiz';

//One question while it is being edited in the form 
interface QuestionInput {
    key: number;  //only exists in the browser, removed before sending
    prompt: string;
    correctAnswer: string;
    points: number;
}

//Form for creating *and* updating 
interface QuizFormProps {
    onQuizChanged: (quiz: CreateQuizDto) => void; //Called with the finished form, the page decides what happend, create or update
    quizId?: number;     //Set when editing, undefined when creating
    initialValues?: CreateQuizDto;  //The current quiz (WITH correct answers) when editing
    error?: string | null;    //Error from the server, shown in an Alert
    submitting?: boolean;    //True while the request is in progress
}

//Gives every new question row a unique key
let nextKey = 1;
const emptyQuestion = (): QuestionInput => ({ key: nextKey++, prompt: '', correctAnswer: '', points: 1 });




//The form component. Props are taken out of the object right away (deconstructing)
export default function QuizForm({
    onQuizChanged,
    quizId,
    initialValues,
    error = null,   //Null if the page doesn't pass an error
    submitting = false,   //False if the page doesn't pass an error
}: QuizFormProps) {
    const navigate = useNavigate();

    //Courses for the dropdown
    const coursesQuery = useQuery<CourseDto[], Error>({
        queryKey: ['courses'],
        queryFn: courseService.fetchCourses,
    });
    const courses = coursesQuery.data ?? []; //Empty list while loading

    //Form state (local UI state → useState). Starts from initialValues when editing.
    const [title, setTitle] = useState<string>(initialValues?.title ?? '');
    const [description, setDescription] = useState<string>(initialValues?.description ?? '');
    const [courseId, setCourseId] = useState<number>(initialValues?.courseId ?? 0); //0 if no course is chosen yet
    const [questions, setQuestions] = useState<QuestionInput[]>(() =>
        initialValues
            ? initialValues.questions.map((q) => ({ ...q, key: nextKey++ })) // Editing: give existing questions a key
            : [emptyQuestion(), emptyQuestion(), emptyQuestion()],         //Creating: start with 3 empty questions, like Subapp 1
    );




    //Helpers for the dynamic question list
    const addQuestion = () => setQuestions([...questions, emptyQuestion()]);   //Every old question, plus an empty one at the end

    const removeQuestion = (key: number) => setQuestions(questions.filter((q) => q.key !== key));   //Keep all questions without the one with this key

    //Changes one or more fields of one question
    const updateQuestion = (key: number, changes: Partial<QuestionInput>) =>    //Go through all questions. If it is this question, make a copy with the changes. Else keep it
        setQuestions(questions.map((q) => (q.key === key ? { ...q, ...changes } : q)));

    const onCancel = () => {
        navigate(-1); //Go back one step in the browser history
    };





    //Used for submitting the form
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault(); //Stops the browser from reloading the page

        //The browser has already checked required, maxLength, min/max etc. before this runs
        const quiz: CreateQuizDto = {
            title: title.trim(),
            description: description.trim() || null, //An empty description is sent as null
            courseId,
            //"Key" is removed here, it only exists in the browser
            questions: questions.map((q) => ({
                prompt: q.prompt.trim(),
                correctAnswer: q.correctAnswer.trim(),
                points: q.points,
            })),
        };
        onQuizChanged(quiz);
    };



    //What the form shows, built with React-bootstrap
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formQuizTitle" className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="e.g. MVC basics"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    // Client-side input validation, same rules as [Required] and [StringLength(200)] in CreateQuizDto.cs
                    required
                    maxLength={200}
                    pattern=".*\S.*"
                    title="The quiz must have a title (max 200 characters)."
                    disabled={submitting}
                />
            </Form.Group>

            <Form.Group controlId="formQuizDescription" className="mb-3">
                <Form.Label>
                    Description <small className="text-muted">(optional)</small>
                </Form.Label>
                <Form.Control
                    as="textarea"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={2000}
                    disabled={submitting}
                />
            </Form.Group>

            <Form.Group controlId="formQuizCourse" className="mb-4">
                <Form.Label>Course</Form.Label>
                <Form.Select
                    value={courseId || ''}
                    onChange={(e) => setCourseId(Number(e.target.value))}
                    required // the empty first option doesn't count as a choice
                    disabled={submitting || coursesQuery.isLoading}
                >
                    <option value="">{coursesQuery.isLoading ? 'Loading courses...' : 'Choose a course'}</option>
                    {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.code} – {c.name}
                        </option>
                    ))}
                </Form.Select>
                {coursesQuery.isError && (
                    <Form.Text className="text-danger">Could not load courses: {coursesQuery.error.message}</Form.Text>
                )}
            </Form.Group>





            <h2 className="h5">Questions ({questions.length})</h2>

            {questions.map((q, i) => (
                <fieldset key={q.key} className="border rounded p-3 mb-3">
                    <legend className="h6">Question {i + 1}</legend>

                    <Form.Group controlId={`formPrompt-${q.key}`} className="mb-2">
                        <Form.Label>Question text</Form.Label>
                        <Form.Control
                            type="text"
                            value={q.prompt}
                            onChange={(e) => updateQuestion(q.key, { prompt: e.target.value })}
                            required
                            maxLength={250}
                            pattern=".*\S.*"
                            title="Write the question (max 250 characters)."
                            disabled={submitting}
                        />
                    </Form.Group>

                    <div className="row g-2 mb-2">
                        <Form.Group controlId={`formAnswer-${q.key}`} className="col-sm-9">
                            <Form.Label>Correct answer</Form.Label>
                            <Form.Control
                                type="text"
                                value={q.correctAnswer}
                                onChange={(e) => updateQuestion(q.key, { correctAnswer: e.target.value })}
                                required
                                maxLength={250}
                                pattern=".*\S.*"
                                title="Write the correct answer (max 250 characters)."
                                disabled={submitting}
                            />
                        </Form.Group>

                        <Form.Group controlId={`formPoints-${q.key}`} className="col-sm-3">
                            <Form.Label>Points</Form.Label>
                            <Form.Control
                                type="number"
                                value={q.points}
                                onChange={(e) => updateQuestion(q.key, { points: Number(e.target.value) })}
                                // Same rule as [Range(0, 10)] in CreateQuizDto.cs
                                required
                                min={0}
                                max={10}
                                step={0.5}
                                title="Points must be between 0 and 10."
                                disabled={submitting}
                            />
                        </Form.Group>
                    </div>

                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeQuestion(q.key)}
                        disabled={submitting || questions.length === 1} // a quiz needs at least one question
                    >
                        Remove question
                    </Button>
                </fieldset>
            ))}

            <Button variant="outline-secondary" onClick={addQuestion} className="d-block mb-4" disabled={submitting}>
                + Add question
            </Button>

            {error && <Alert variant="danger">{error}</Alert>}

            <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : quizId ? 'Update quiz' : 'Create quiz'}
            </Button>
            <Button variant="secondary" onClick={onCancel} className="ms-2" disabled={submitting}>
                Cancel
            </Button>
        </Form>
    );
}