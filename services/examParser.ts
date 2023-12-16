import { ExamQuestion } from '../types';
import { load } from 'cheerio';

export function getExamQuestions(html: string): ExamQuestion[] {
    // Parse the HTML
    const $ = load(html);

    // Find the div with id "questions"
    const questionsDiv = $("#questions");

    // Initialize an empty array to store the questions
    let questions: ExamQuestion[] = [];

    // Iterate over each question
    questionsDiv.find(".question_holder").each((i, el) => {
        // Extract the question text
        const questionText = $(el).find(".question_text").text().replace(/\s+/g, " ");

        // Extract question number
        const questionNumber = +$(el).find(".question_name").text().split(" ")[1];

        // Initialize an empty array to store the options
        let options: string[] = [];

        let correct_answer: string | undefined;;
        // Iterate over each option
        $(el)
            .find(".answer")
            .each((i, optionEl) => {
                // Extract the option text
                const optionText = $(optionEl).find(".answer_text").text().replace(/\s+/g, " ");

                // Add the option to the array
                options.push(optionText);

                if ($(optionEl).hasClass("correct_answer")) {
                    correct_answer = optionText;
                }
            });

        if (!correct_answer) {
            throw new Error("No correct answer found");
        }

        // Store the question information in an object
        const question: ExamQuestion = {
            id: questionNumber,
            question: questionText,
            options: options,
            correctAnswer: correct_answer
        };

        // Add the question to the array
        questions.push(question);
    });

    return questions;
}