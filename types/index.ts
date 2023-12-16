export interface ExamQuestion {
    id: number;
    question: string;
    options: string[];
    answer?: string | undefined;
    correctAnswer: string;
}
