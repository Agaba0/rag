import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY; 
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Function to generate flashcards and quizzes
export const genarateFlashCard = async (prompt) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "generate 10 question for the flashcard, make it basic",
  });

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  try {
    const result = await chatSession.sendMessage(prompt);
    const responseText = await result.response.text(); // Get the generated text from the AI

    // Parse the text into flashcards
    const flashcards = parseFlashcards(responseText);
    return flashcards;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error; 
  }
};

const parseFlashcards = (text) => {
  const flashcards = [];
  const questionAnswerPairs = text.split('**Flashcard'); // Split by Flashcard markers

  questionAnswerPairs.forEach((pair) => {
    const questionMatch = pair.match(/\*\*Question:\*\* (.+)/); // Extract the question
    const answerMatch = pair.match(/\*\*Answer:\*\* (.+)/); // Extract the answer

    if (questionMatch && answerMatch) {
      flashcards.push({
        question: questionMatch[1].trim(),
        answer: answerMatch[1].trim(),
      });
    }
  });

  return flashcards;
};


export const generateFlashcardsAndQuizzes = async (prompt) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "summarize the content of the file given by the user",
  });

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  try {
    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw error; 
  }
};

export const generateQuestion = async (prompt) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "generate 10 questions and the answers",
  });

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  try {
    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw error; 
  }
};