import { Button, Grid, Header, Message } from "semantic-ui-react";

import Exam from "../components/Exam";
import { ExamQuestion } from "../types";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import { getExamHtml } from "../services/fileService";
import { getExamQuestions } from "../services/examParser";
import { useState } from "react";

interface Exam1Props {
    questions: ExamQuestion[];
}

const Exam1: React.FC<Exam1Props> = ({ questions }) => {
    const [localQuestions, setLocalQuestions] = useState<ExamQuestion[]>(questions);
    const [incorrectAnswers, setIncorrectAnswers] = useState<ExamQuestion[]>();

    const handleSubmit = (answers: ExamQuestion[]) => {
        const incorrect = answers.filter((a) => a.answer !== a.correctAnswer);
        setIncorrectAnswers(incorrect);
    };

    const handleReset = () => {
        setIncorrectAnswers(undefined);
        setLocalQuestions(questions.map((q) => ({ ...q, answer: undefined })));
    };

    return (
        <Layout>
            <Grid textAlign="left" columns={1}>
                <Grid.Column>
                    <Header content="Exam 1" icon="file alternate outline" />
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

                    {incorrectAnswers && <Exam questions={incorrectAnswers} onSubmit={handleSubmit} onReset={handleReset} />}
                    {!incorrectAnswers && <Exam questions={localQuestions} onSubmit={handleSubmit} onReset={handleReset} />}
                </Grid.Column>
            </Grid>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps<Exam1Props> = async () => {
    const html = await getExamHtml("exam1.html");
    const questions = getExamQuestions(html);
    return {
        props: {
            questions
        }
    };
};

export default Exam1;
