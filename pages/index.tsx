import { Button, Form, Grid, Header, Message } from "semantic-ui-react";
import { useEffect, useState } from "react";

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

    const handleSubmit = (answers: ExamQuestion[]) => {
        const incorrect = answers.filter((a) => a.answer !== a.correctAnswer);
        setIncorrectAnswers(incorrect);
    };

    const handleReset = () => {
        if (!questions) {
            toast.error("No questions loaded!");
            return;
        }
        setIncorrectAnswers(undefined);
        setLocalQuestions(questions.map((q) => ({ ...q, answer: undefined })));
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
                                    `You had ${incorrectAnswers.length} incorrect answers. Try just those again for practice!`}

                                <br />

                                <Button type="button" content="Start Over" onClick={handleReset} />
                            </Message.Content>
                        </Message>
                    )}

                    {loading && <SimpleLoader />}
                    {!!localQuestions && (
                        <>
                            {incorrectAnswers && <Exam questions={incorrectAnswers} onSubmit={handleSubmit} onReset={handleReset} />}
                            {!incorrectAnswers && <Exam questions={localQuestions} onSubmit={handleSubmit} onReset={handleReset} />}
                        </>
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
