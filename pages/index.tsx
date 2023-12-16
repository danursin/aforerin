import { Button, Form, Grid, Header, Message, Segment, SemanticCOLORS } from "semantic-ui-react";
import { CSSProperties, useEffect, useState } from "react";

import Exam from "../components/Exam";
import { ExamQuestion } from "../types";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import SimpleLoader from "../components/SimpleLoader";
import { getExamOptions } from "../services/fileService";
import { toast } from "react-toastify";

interface HomeProps {
    examIds: string[];
}

const Home: React.FC<HomeProps> = ({ examIds }) => {
    const [selectedExamId, setSelectedExamId] = useState<string>(examIds[0]);
    const [questions, setQuestions] = useState<ExamQuestion[]>();
    const [localQuestions, setLocalQuestions] = useState<ExamQuestion[]>();
    const [incorrectAnswers, setIncorrectAnswers] = useState<ExamQuestion[]>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            await fetchExamQuestions(selectedExamId);
        })();
    }, [selectedExamId]);

    const fetchExamQuestions = async (id: string) => {
        setLoading(true);
        setLocalQuestions(undefined);
        setQuestions(undefined);
        setIncorrectAnswers(undefined);
        const response = await fetch("/api/exam?examId=" + encodeURIComponent(id));
        if (!response.ok) {
            toast.error("Failed to load exam!");
            return;
        }
        const { questions: data } = (await response.json()) as { questions: ExamQuestion[] };
        setLocalQuestions(data);
        setQuestions(data);
        setIncorrectAnswers(undefined);
        setLoading(false);
    };

    const handleSubmit = () => {
        if (!localQuestions) {
            toast.error("No questions loaded!");
            return;
        }
        const incorrect = localQuestions.filter((q) => q.answer !== q.correctAnswer);
        setIncorrectAnswers(incorrect);
        setLocalQuestions(incorrect);
        window.scrollTo(0, 0);
    };

    const handleReset = () => {
        if (!questions) {
            toast.error("No questions loaded!");
            return;
        }
        setIncorrectAnswers(undefined);
        setLocalQuestions(questions.map((q) => ({ ...q, answer: undefined })));
    };

    const handleAnswerSelect = (index: number, answer: string) => {
        setLocalQuestions((prevQuestions) => {
            if (!prevQuestions) return prevQuestions;
            const newQuestions = [...prevQuestions];
            newQuestions[index].answer = answer;
            return newQuestions;
        });
    };

    return (
        <Layout>
            <Grid textAlign="left" columns={1}>
                <Grid.Column>
                    <Header content={selectedExamId} icon="file alternate outline" />
                    <Form>
                        <Form.Field
                            control="select"
                            required
                            value={selectedExamId}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedExamId(e.target.value)}
                        >
                            {examIds.map((id) => (
                                <option key={id} value={id}>
                                    {id}
                                </option>
                            ))}
                        </Form.Field>
                    </Form>
                </Grid.Column>
                <Grid.Column>
                    {!!incorrectAnswers && (
                        <Message success={!incorrectAnswers.length} warning={!!incorrectAnswers.length}>
                            <Message.Content>
                                <Message.Header>{!incorrectAnswers.length ? "Perfect!" : "Almost there!"}</Message.Header>
                                {!incorrectAnswers.length && "You got everything right! You're amazing!"}
                                {!!incorrectAnswers.length &&
                                    `You had ${incorrectAnswers.length} incorrect answer${
                                        incorrectAnswers.length > 1 ? "s" : ""
                                    }. Try just those again for practice!`}
                            </Message.Content>
                        </Message>
                    )}

                    {loading && <SimpleLoader />}
                    {!!localQuestions && (
                        <Form onSubmit={() => handleSubmit()}>
                            {localQuestions.map((q, i) => {
                                const { id, question, options, answer } = q;
                                let color: SemanticCOLORS | undefined;
                                return (
                                    <Segment key={id} color={color}>
                                        <Form.Group grouped>
                                            <Form.Field>
                                                <label>
                                                    Question {i + 1}: {question}
                                                </label>
                                            </Form.Field>
                                            {options.map((option) => {
                                                const labelStyles: CSSProperties = {};
                                                return (
                                                    <Form.Field key={option} required>
                                                        <Form.Radio
                                                            label={<label style={labelStyles}>{option}</label>}
                                                            checked={answer === option}
                                                            value={option}
                                                            onChange={() => handleAnswerSelect(i, option)}
                                                        />
                                                    </Form.Field>
                                                );
                                            })}
                                        </Form.Group>
                                    </Segment>
                                );
                            })}
                            <Form.Group widths="equal">
                                <Form.Button content="Reset" fluid type="button" color="grey" basic icon="refresh" onClick={handleReset} />
                                <Form.Button content="Submit" fluid type="submit" color="blue" icon="save" />
                            </Form.Group>
                        </Form>
                    )}
                </Grid.Column>
            </Grid>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    const examIds = await getExamOptions();
    return {
        props: {
            examIds
        }
    };
};

export default Home;
