import { QuizQuestion } from '../types';

export const REVIEW_WEEK_1_QUESTIONS: QuizQuestion[] = [
    {
        id: 'q1',
        category: 'week1',
        question: "Wat is een 'prompt'?",
        options: [
            { id: 'q1-opt1', text: "Een commando voor de AI", correct: true },
            { id: 'q1-opt2', text: "Een soort computervirus", correct: false },
            { id: 'q1-opt3', text: "De naam van de robot", correct: false }
        ]
    },
    {
        id: 'q2',
        category: 'week1',
        question: "Welke tool gebruik je voor presentaties?",
        options: [
            { id: 'q2-opt1', text: "Word Wizard", correct: false },
            { id: 'q2-opt2', text: "Slide Specialist", correct: true },
            { id: 'q2-opt3', text: "Print Pro", correct: false }
        ]
    },
    {
        id: 'q3',
        category: 'week1',
        question: "Hoe maak je een AI-afbeelding?",
        options: [
            { id: 'q3-opt1', text: "Je tekent het zelf", correct: false },
            { id: 'q3-opt2', text: "Je beschrijft het met tekst", correct: true },
            { id: 'q3-opt3', text: "Je print een foto uit", correct: false }
        ]
    },
    {
        id: 'q4',
        category: 'week1',
        question: "Mag je zomaar alles kopiëren van internet?",
        options: [
            { id: 'q4-opt1', text: "Ja, alles is gratis", correct: false },
            { id: 'q4-opt2', text: "Nee, let op auteursrecht", correct: true },
            { id: 'q4-opt3', text: "Alleen als niemand kijkt", correct: false }
        ]
    },
    {
        id: 'q5',
        category: 'week1',
        question: "Wat betekent AI?",
        options: [
            { id: 'q5-opt1', text: "Alle Informatie", correct: false },
            { id: 'q5-opt2', text: "Artificiële Intelligentie", correct: true },
            { id: 'q5-opt3', text: "Appel IJs", correct: false }
        ]
    }
];
