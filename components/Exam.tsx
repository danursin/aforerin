import { Form, Segment, SemanticCOLORS } from "semantic-ui-react";
import React, { CSSProperties, useCallback, useState } from "react";

import { ExamQuestion } from "../types";

interface ExamProps {
    questions: ExamQuestion[];
    onSubmit: (answers: ExamQuestion[]) => void;
    onReset: () => void;
}

const Exam: React.FC<ExamProps> = ({ questions, onSubmit, onReset }) => {
    const [localQuestions, setLocalQuestions] = useState<ExamQuestion[]>(questions);

    const handleAnswerSelect = useCallback((index: number, answer: string) => {
        setLocalQuestions((prevQuestions) => {
            const newQuestions = [...prevQuestions];
            newQuestions[index].answer = answer;
            return newQuestions;
        });
    }, []);

    const handleSubmit = useCallback(() => {
        onSubmit(localQuestions);
        window.scrollTo(0, 0);
    }, [localQuestions, onSubmit]);

    return (
        <Form onSubmit={handleSubmit}>
            {localQuestions.map((q, i) => {
                const { id, question, options, answer, correctAnswer } = q;
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
                <Form.Button content="Reset" fluid type="button" color="grey" basic icon="refresh" onClick={onReset} />
                <Form.Button content="Submit" fluid type="submit" color="blue" icon="save" />
            </Form.Group>
        </Form>
    );
};

export default Exam;
