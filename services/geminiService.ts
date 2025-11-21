import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FAST = 'gemini-2.5-flash';

export const generateJobDescription = async (title: string, keywords: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Create a professional, tech-focused job description for a "${title}" at a company named "Supalai Tech". 
      Keywords/Focus: ${keywords}. 
      Format: Use Markdown. Include Responsibilities, Requirements, and Why Join Us. Keep it concise.`,
    });
    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("Gemini Gen Error:", error);
    return "Error generating content. Please check your API Key.";
  }
};

export const analyzeResume = async (resumeText: string, jobTitle: string): Promise<{ score: number; detailedScore: { technical: number, experience: number, softSkills: number, education: number }; summary: string; skills: string[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `You are an expert HR AI Recruiter. Analyze this resume text for the position of "${jobTitle}".
      
      Resume Text:
      "${resumeText}"

      Evaluate based on 4 criteria (0-100):
      1. Technical: Coding skills, tools, hard skills relevance.
      2. Experience: Years of work, project depth.
      3. Soft Skills: Leadership, communication (inferred).
      4. Education: Degree relevance and certifications.

      Return a JSON object with:
      - score: integer (Overall Average 0-100)
      - detailedScore: Object containing { technical, experience, softSkills, education }
      - summary: string (Analysis summary)
      - skills: array of strings (extracted key skills)
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            detailedScore: {
              type: Type.OBJECT,
              properties: {
                technical: { type: Type.INTEGER },
                experience: { type: Type.INTEGER },
                softSkills: { type: Type.INTEGER },
                education: { type: Type.INTEGER },
              }
            },
            summary: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Resume Analysis Error:", error);
    return { 
      score: 0, 
      detailedScore: { technical: 0, experience: 0, softSkills: 0, education: 0 },
      summary: "Analysis failed.", 
      skills: [] 
    };
  }
};

export const generateInterviewEmail = async (candidateName: string, position: string, date: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Write a polite, professional email invitation for a job interview.
      Candidate: ${candidateName}
      Position: ${position}
      Company: Supalai Tech
      Proposed Time: ${date}
      Tone: Professional and welcoming.
      Keep it brief.`,
    });
    return response.text || "Error generating email.";
  } catch (error) {
    return "Could not generate email template.";
  }
};

export const generateInterviewReport = async (candidateName: string, position: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `You are an HR Manager. The candidate ${candidateName} has passed the interview for ${position}.
      Generate a formal "Interview Evaluation Report".
      
      Structure:
      1. **Executive Summary**: Brief recommendation.
      2. **Technical Assessment**: Simulated feedback on coding skills (assume positive).
      3. **Behavioral Fit**: Cultural alignment.
      4. **Final Verdict**: Highly Recommended.
      
      Format: Markdown. Keep it professional.`,
    });
    return response.text || "Error generating report.";
  } catch (error) {
    return "Could not generate report.";
  }
};