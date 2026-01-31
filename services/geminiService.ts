
import { GoogleGenAI } from "@google/genai";

// Fixed: Using process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFortuneMessage = async (prizeLabel: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a representative for Giorgio Armani. 
      The user just won an "Armani Voucher" senilai ${prizeLabel}. 
      Give them a short, sophisticated message (max 2 sentences) in Indonesian.
      The message MUST align with this sentiment: "Selamat atas pencapaian istimewa Anda meraih Armani Voucher senilai ${prizeLabel}. Ini adalah bentuk apresiasi kami terhadap dedikasi anda."
      Keep the tone very formal, luxurious, and refined.`,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || `Selamat atas pencapaian istimewa Anda meraih Armani Voucher senilai ${prizeLabel}. Ini adalah bentuk apresiasi kami terhadap dedikasi anda.`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Selamat atas pencapaian istimewa Anda meraih Armani Voucher senilai ${prizeLabel}. Ini adalah bentuk apresiasi kami terhadap dedikasi anda.`;
  }
};
