export type McqQuestion = {
  question: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
};

export type McqSet = {
  title: string;
  questions: McqQuestion[];
};

export const mcqSets: McqSet[] = [
  {
    title: "Set 1",
    questions: [
      {
        question: "What does HTML stand for?",
        options: [
          "Hyper Trainer Marking Language",
          "Hyper Text Markup Language",
          "Hyper Text Marketing Language",
          "Hyper Text Markup Leveler",
        ],
        answer: 1,
      },
      {
        question: "Which language runs in a web browser?",
        options: ["Java", "C", "Python", "JavaScript"],
        answer: 3,
      },
      {
        question: "What does CSS stand for?",
        options: [
          "Cascading Style Sheets",
          "Colorful Style Sheets",
          "Computer Style Sheets",
          "Creative Style Sheets",
        ],
        answer: 0,
      },
      {
        question: "Which HTML tag is used to define an internal style sheet?",
        options: ["<css>", "<script>", "<style>", "<link>"],
        answer: 2,
      },
      {
        question: "Which of the following is a JavaScript framework?",
        options: ["Laravel", "Django", "React", "Flask"],
        answer: 2,
      },
    ],
  },
  {
    title: "Set 2",
    questions: [
      {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: 2,
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: 1,
      },
      {
        question: "Who wrote the play 'Romeo and Juliet'?",
        options: [
          "Charles Dickens",
          "William Shakespeare",
          "Mark Twain",
          "Leo Tolstoy",
        ],
        answer: 1,
      },
      {
        question: "What is the largest ocean on Earth?",
        options: [
          "Atlantic Ocean",
          "Indian Ocean",
          "Arctic Ocean",
          "Pacific Ocean",
        ],
        answer: 3,
      },
      {
        question: "How many continents are there on Earth?",
        options: ["5", "6", "7", "8"],
        answer: 2,
      },
    ],
  },
  {
    title: "Set 3",
    questions: [
      {
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "O2", "NaCl"],
        answer: 0,
      },
      {
        question: "What force keeps us on the ground?",
        options: ["Magnetism", "Friction", "Gravity", "Tension"],
        answer: 2,
      },
      {
        question: "How many bones are in the adult human body?",
        options: ["186", "206", "226", "246"],
        answer: 1,
      },
      {
        question: "What gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Nitrogen", "Hydrogen", "Carbon Dioxide"],
        answer: 3,
      },
      {
        question: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Body"],
        answer: 2,
      },
    ],
  },
];
