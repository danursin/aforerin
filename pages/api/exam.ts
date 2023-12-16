import { NextApiRequest, NextApiResponse } from "next";

import { ExamQuestion } from "../../types";
import { getExamHtml } from "../../services/fileService";
import { getExamQuestions } from "../../services/examParser";

export default async function handler(_req: NextApiRequest, res: NextApiResponse<{ questions: ExamQuestion[] } | string>) {
    try {
        const examId = _req.query.examId as string;
        const html = await getExamHtml(examId);
        const questions = getExamQuestions(html);
        const result = { questions };
        res.json(result);
    } catch(err){   
        res.status(500).send((err as Error).message);
    }
}