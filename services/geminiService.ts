import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDescription = async (itemName: string, category: string, keywords: string): Promise<string> => {
  try {
    const prompt = `
      Atue como um especialista em marketing e copywriting.
      Escreva uma descrição atraente, profissional e curta (máximo 300 caracteres) para um item de cadastro.
      
      Nome do Item: ${itemName}
      Categoria: ${category}
      Detalhes/Tags: ${keywords}
      
      A resposta deve ser apenas o texto da descrição, em Português do Brasil. Sem aspas.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Não foi possível gerar a descrição.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Erro ao conectar com a IA. Tente novamente.";
  }
};