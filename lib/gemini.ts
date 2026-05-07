import { GoogleGenAI, Type } from "@google/genai";
import 'server-only';

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY on server environment');
  }

  return new GoogleGenAI({ apiKey });
}

export async function processFinancialInput(input: string) {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: `Process the following financial transaction description and return a JSON object with a list of transactions.

    Description: "${input}"

    Balance current session context:
    - If user says "Peguei X para pagar Y", create an "entrada" of X (status: "pago") and a "saida" of Y (status: "pendente").

    The output must strictly follow this structure:
    {
      "transactions": [
        {
          "descricao": string,
          "valorOriginal": number,
          "valorFinal": number,
          "dataVencimento": string (ISO format),
          "categoria": string,
          "tipo": "entrada" | "saida",
          "status": "pendente" | "pago" | "historico",
          "saldoMutation": number
        }
      ]
    }
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          transactions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                descricao: { type: Type.STRING },
                valorOriginal: { type: Type.NUMBER },
                valorFinal: { type: Type.NUMBER },
                dataVencimento: { type: Type.STRING },
                categoria: { type: Type.STRING },
                tipo: { type: Type.STRING, enum: ["entrada", "saida"] },
                status: { type: Type.STRING, enum: ["pendente", "pago", "historico"] },
                saldoMutation: { type: Type.NUMBER }
              },
              required: ["descricao", "valorOriginal", "valorFinal", "dataVencimento", "categoria", "tipo", "status", "saldoMutation"]
            }
          }
        },
        required: ["transactions"]
      }
    }
  });

  return JSON.parse(response.text()).transactions;
}
