import { ExamQuestion, specialExamIds } from "../../types";
import { NextApiRequest, NextApiResponse } from "next";
import { getExamHtml, getExamOptions } from "../../services/fileService";

import { getExamQuestions } from "../../services/examParser";

export default async function handler(_req: NextApiRequest, res: NextApiResponse<{ questions: ExamQuestion[] } | string>) {
    try {
        const examId = _req.query.examId as string;

        if (!examId) {
            throw new Error("No examId provided");
        }

        if(specialExamIds.includes(examId)){
            const questions: ExamQuestion[] = [];
            const examOptions = await getExamOptions();
            await Promise.all(examOptions.map(async (examOption) => {
                const html = await getExamHtml(examOption);
                const examQuestions = getExamQuestions(html);
                questions.push(...examQuestions);
            }));
            if(examId === "Random 10 From All Exams"){
                questions.sort(() => Math.random() - 0.5);
                questions.splice(10);
            } else if (examId === "Random 20 From All Exams"){
                questions.sort(() => Math.random() - 0.5);
                questions.splice(20);
            } else {
                // Random All From All Exams
                questions.sort(() => Math.random() - 0.5);
            }
            const result = { questions };
            res.json(result);
        } else {
            const html = await getExamHtml(examId);
            const questions = getExamQuestions(html);
            const result = { questions };
            res.json(result);
        }
        
    } catch(err){   
        res.status(500).send((err as Error).message);
    }
}