import { GoogleGenAI } from "@google/genai";
import type { SamarthResponse, Source } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export const askSamarth = async (question: string): Promise<SamarthResponse> => {
  const prompt = `
    You are 'Project Samarth', an intelligent Q&A system for Indian agricultural and climate data. 
    Your goal is to answer user questions accurately by synthesizing up-to-date information from the web.
    You MUST ONLY use official Indian government websites (e.g., domains ending in .gov.in or .nic.in) as sources. Do not use any third-party websites like news articles, private blogs, or Wikipedia.

    For every piece of information you provide, your response will be grounded with source citations from these government websites. If you cannot find the information on a government website, state that the information is not available from official sources.

    Structure your answer in the following markdown format:

    ## Analysis
    [Provide a detailed, multi-paragraph analysis answering the user's question based ONLY on information from Indian government websites.]

    ## Key Insights
    [Provide a list of 2-4 key bullet points summarizing the main findings from the analysis. Each point should be on a new line and start with a '*' or '-'.]

    ---
    User Question: "${question}"
    ---

    Provide your response following the structure above. Do not include the user question in your response.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        temperature: 0.2,
      },
    });

    const text = response.text.trim();

    // Parse response text
    const analysisRegex = /##\s*Analysis\s*([\s\S]*?)(?=##\s*Key Insights|$)/i;
    const insightsRegex = /##\s*Key Insights\s*([\s\S]*)/i;

    const analysisMatch = text.match(analysisRegex);
    const insightsMatch = text.match(insightsRegex);

    let analysis = analysisMatch ? analysisMatch[1].trim() : text;
    let summaryPoints: string[] = [];

    if (insightsMatch) {
      summaryPoints = insightsMatch[1]
        .trim()
        .split(/\r?\n/)
        .map(s => s.replace(/^[*-]\s*/, '').trim())
        .filter(Boolean);
      
      if (!analysisMatch && text.includes(insightsMatch[0])) {
        analysis = text.substring(0, text.indexOf(insightsMatch[0])).trim();
      }
    }
    
    if (!analysis && !summaryPoints.length) {
        analysis = text;
    }


    // Extract sources from grounding metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources: Source[] = groundingChunks
      .filter((chunk: any): chunk is GroundingChunk => chunk.web && chunk.web.uri)
      .map((chunk: GroundingChunk) => ({
        sourceName: chunk.web.title || new URL(chunk.web.uri).hostname,
        description: chunk.web.uri,
      }));
      
    // Deduplicate sources based on URI
    const uniqueSources = Array.from(new Map(sources.map(s => [s.description, s])).values());

    return {
      analysis,
      summaryPoints,
      sources: uniqueSources,
    };

  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("Your API key is not valid. Please check your configuration.");
    }
    throw new Error("Failed to get a valid response from the AI model. The model may be unable to find relevant information for your query.");
  }
};