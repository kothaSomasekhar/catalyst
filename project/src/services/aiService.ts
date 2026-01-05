const API_KEY = import.meta.env.VITE_GROQ_KEY || '';
const BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface Topic {
    id: number;
    name: string;
    desc: string;
    sub_skills: string[];
    project_milestone: string;
    estimated_hours: number;
    category: 'Mastered' | 'Partial' | 'Critical Gap';
    quiz: {
        question: string;
        options: string[];
        answer_index: number;
    };
}

export interface GapAnalysis {
    mastered: string[];
    partial: string[];
    critical_gap: string[];
}

export interface AutomatedRoadmap {
    title: string;
    readiness_score: number;
    skills: string[]; // High-level skills
    gap_analysis?: GapAnalysis;
    topics: Topic[];
    analysis_summary?: string;
}

export const AIService = {
    generateRoadmap: async (userInput: string): Promise<AutomatedRoadmap> => {
        const prompt = `Create a comprehensive 'Master Architect' career roadmap for: ${userInput}. 
        Return a JSON object following the strict schema provided.`;
        return AIService.callGroq(prompt, false);
    },

    generateRoadmapFromResume: async (resumeText: string, targetJob: string): Promise<AutomatedRoadmap> => {
        const prompt = `Act as a Master Architect Talent Scout. Compare this resume to the role of "${targetJob}".
        1. Perform a deep gap analysis categorized into: Mastered, Partial, Critical Gap.
        2. Calculate a 'Career Readiness Score' (0-100%).
        3. Create a 5-step roadmap targeting ONLY the Partial and Critical Gap areas.
        
        Resume Text: ${resumeText.substring(0, 4000)}`;

        return AIService.callGroq(prompt, true);
    },

    callGroq: async (userPrompt: string, isResume: boolean = false): Promise<AutomatedRoadmap> => {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `You are the Catalyst Master Architect. Return ONLY a JSON object.
                        Structure requirements:
                        {
                          "title": "Path Name",
                          "readiness_score": 85,
                          "skills": ["Broad Skill 1", "Broad Skill 2"],
                          "analysis_summary": "Overall assessment...",
                          "gap_analysis": {
                             "mastered": ["Skill A", "Skill B"],
                             "partial": ["Skill C"],
                             "critical_gap": ["Skill D"]
                          },
                          "topics": [
                            {
                              "id": 1,
                              "name": "Specific Topic",
                              "desc": "Summary...",
                              "category": "Partial" OR "Critical Gap",
                              "sub_skills": ["Concept 1", "Concept 2", "Concept 3"],
                              "project_milestone": "Build a X that does Y...",
                              "estimated_hours": 12,
                              "quiz": {
                                "question": "High-level architectural scenario",
                                "options": ["A", "B", "C", "D"],
                                "answer_index": 0
                              }
                            }
                          ]
                        }
                        
                        CRITICAL INSTRUCTIONS:
                        - If it's a resume analysis, category must be 'Partial' or 'Critical Gap' for all topics.
                        - estimated_hours should be an integer.
                        - project_milestone must be a specific mini-project description.`
                    },
                    { role: "user", content: userPrompt }
                ],
                response_format: { type: "json_object" }
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `Groq Error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        try {
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            const roadmap = JSON.parse(cleanContent) as AutomatedRoadmap;
            localStorage.setItem("current_roadmap", JSON.stringify(roadmap));
            return roadmap;
        } catch (error) {
            console.error("JSON Parse Error:", content);
            throw new Error("AI returned malformed data. Please try again.");
        }
    }
};

export const GeminService = AIService;
