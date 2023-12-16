export interface ExamQuestion {
    id: number;
    question: string;
    options: string[];
    answer?: string | undefined;
    correctAnswer: string;
}

export const specialExamIds = ["Random 10 From All Exams", "Random 20 From All Exams", "Random All From All Exams"];