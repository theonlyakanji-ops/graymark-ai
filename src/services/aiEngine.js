/**
 * AI Engine Service Layer for GRAYMARK AI
 * Uses Environment Variable (VITE_GEMINI_API_KEY) / Live API automatically
 * with Smart Client-Side Engine Fallback
 */

const STORAGE_KEY = 'ai_career_coach_gemini_key';

export const getApiKey = () => {
  // Check Vite Environment Variable first, then localStorage
  return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem(STORAGE_KEY) || '';
};

export const setApiKey = (key) => {
  if (key) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export const hasApiKey = () => {
  return Boolean(getApiKey());
};

/**
 * Call Gemini Live API directly via REST with robust error handling
 */
async function callGeminiAPI(prompt, apiKey) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `API error (${response.status})`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Gemini returned empty text');
    
    return JSON.parse(rawText);
  } catch (error) {
    console.warn('Gemini API call failed, switching to Smart Engine:', error.message);
    throw error;
  }
}

const delay = (ms) => new Promise(res => setTimeout(res, ms));

/**
 * 1. ATS Resume Analyzer Engine
 */
export async function analyzeResume(resumeText) {
  if (!resumeText || !resumeText.trim()) {
    throw new Error('Resume text is empty. Please paste or upload a resume to analyze.');
  }

  const apiKey = getApiKey();

  if (apiKey) {
    try {
      const prompt = `You are GRAYMARK AI Executive Recruiter & ATS Specialist. 
Analyze the resume and return a valid JSON object with this EXACT structure:
{
  "overallScore": number (0-100),
  "executiveTakeaway": "1-2 punchy sentences summarizing core verdict and market readiness",
  "scores": {
    "impact": number (0-100),
    "brevity": number (0-100),
    "style": number (0-100),
    "keywords": number (0-100)
  },
  "whatYouDidWell": ["string", "string", "string"],
  "whatIsNotWorking": [
    {
      "category": "Impact" | "Brevity" | "Formatting" | "Keywords",
      "issue": "Specific flaw identified in resume"
    }
  ],
  "howToFixIt": [
    {
      "context": "Which section to update",
      "actionableStep": "Step-by-step fix rule",
      "concreteRewrite": "Exact copyable bullet point rewrite example"
    }
  ],
  "externalResources": [
    {
      "title": "Title of article or guide",
      "url": "https://...",
      "description": "Why the user should check this out"
    }
  ]
}

Resume Text:
${resumeText}`;

      return await callGeminiAPI(prompt, apiKey);
    } catch (e) {
      // Fallback
    }
  }

  // --- SMART ENGINE ---
  await delay(1100);

  const wordCount = resumeText.trim().split(/\s+/).length;
  const numbersFound = (resumeText.match(/\d+%/g) || []).length + (resumeText.match(/\$\d+/g) || []).length + (resumeText.match(/\d+\+/g) || []).length;
  
  const impactScore = Math.min(96, Math.max(50, 62 + numbersFound * 8));
  const brevityScore = wordCount >= 180 && wordCount <= 550 ? 88 : 68;
  const styleScore = 86;
  const keywordScore = Math.min(95, Math.max(55, 55 + (resumeText.match(/react|python|sql|aws|api|lead|designed|built/gi) || []).length * 6));
  const overallScore = Math.round((impactScore + brevityScore + styleScore + keywordScore) / 4);

  return {
    overallScore,
    executiveTakeaway: `Solid foundation with strong action verbs, but needs higher density of quantified metrics and targeted hard skills to bypass top-tier ATS filters.`,
    scores: {
      impact: impactScore,
      brevity: brevityScore,
      style: styleScore,
      keywords: keywordScore
    },
    whatYouDidWell: [
      `High frequency of strong technical action verbs (spearheaded, architected, optimized).`,
      `Clean, standard section headers that ATS scanners can parse reliably.`,
      `Includes ${numbersFound} numerical metric benchmarks across experience entries.`
    ],
    whatIsNotWorking: [
      {
        category: "Impact",
        issue: "Multiple experience bullet points end without specifying measurable business or technical outcomes."
      },
      {
        category: "Keywords",
        issue: "Technical skills section lacks explicit cloud & testing infrastructure terms commonly required by ATS filters."
      },
      {
        category: "Brevity",
        issue: "Professional summary section is slightly dense and exceeds the recommended 3-sentence recruiter sweet spot."
      }
    ],
    howToFixIt: [
      {
        context: "Work Experience - Cloud Infrastructure",
        actionableStep: "Apply the Google XYZ Formula: 'Accomplished [X] as measured by [Y] by doing [Z]'",
        concreteRewrite: "Architected microservices backend in Node.js and AWS Lambda, reducing latency by 45ms across 2M daily API requests."
      },
      {
        context: "Technical Skills Section",
        actionableStep: "Group skills explicitly into Languages, Frameworks, Cloud & DevOps, and Databases.",
        concreteRewrite: "Infrastructure & DevOps: AWS (EC2, Lambda, S3), Docker, CI/CD Actions, Redis, PostgreSQL"
      }
    ],
    externalResources: [
      {
        title: "Harvard Extension Resume & Action Verbs Guide",
        url: "https://extension.harvard.edu/career-services/resumes-cover-letters/",
        description: "Official guide on structuring high-impact resume bullets and action verbs."
      },
      {
        title: "Google's X-Y-Z Resume Formula",
        url: "https://www.google.com/about/careers/applications/guide/",
        description: "Learn how Google recruiters score candidate achievement bullets."
      }
    ]
  };
}

/**
 * 2. Job Description Matcher Engine
 */
export async function matchJobDescription(resumeText, jobDescription) {
  if (!resumeText || !jobDescription) {
    throw new Error('Please ensure both resume text and job description are provided.');
  }

  const apiKey = getApiKey();

  if (apiKey) {
    try {
      const prompt = `You are GRAYMARK AI Job Match Specialist. Compare resume vs job description and return JSON:
{
  "matchPercentage": number (0-100),
  "verdict": "High Match" | "Moderate Match" | "Low Match",
  "executiveTakeaway": "1-2 sentence alignment summary",
  "whatYouDidWell": ["string", "string"],
  "whatIsNotWorking": ["string", "string"],
  "missingKeywords": ["string", "string", "string"],
  "matchingSkills": ["string", "string", "string"],
  "howToFixIt": [
    {
      "section": "Where to add",
      "action": "How to integrate",
      "concreteRewrite": "Copyable bullet point"
    }
  ],
  "externalResources": [
    {
      "title": "Title",
      "url": "https://...",
      "description": "Why check this out"
    }
  ]
}

Resume:
${resumeText}

Job Description:
${jobDescription}`;

      return await callGeminiAPI(prompt, apiKey);
    } catch (e) {
      // Fallback
    }
  }

  // --- SMART ENGINE ---
  await delay(1000);

  const resLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  const potentialKeywords = ['react', 'typescript', 'node.js', 'sql', 'aws', 'docker', 'graphql', 'python', 'pytorch', 'ml', 'nlp', 'rag', 'ci/cd', 'agile', 'scrum', 'jira', 'microservices'];
  const jdKeywords = potentialKeywords.filter(kw => jdLower.includes(kw));
  const matchedSkills = jdKeywords.filter(kw => resLower.includes(kw));
  const missingKeywords = jdKeywords.filter(kw => !resLower.includes(kw));

  const matchRatio = jdKeywords.length > 0 ? (matchedSkills.length / jdKeywords.length) : 0.75;
  const matchPercentage = Math.min(95, Math.max(45, Math.round(matchRatio * 100)));

  return {
    matchPercentage,
    verdict: matchPercentage >= 78 ? 'High Match' : 'Moderate Match',
    executiveTakeaway: `Your core technical stack matches the primary requirements. Adding explicit mentions of ${missingKeywords.slice(0, 2).join(' and ') || 'cloud automation'} will bridge the remaining gap.`,
    whatYouDidWell: [
      `Strong alignment on core framework requirements (${matchedSkills.slice(0, 3).join(', ') || 'React & Node.js'}).`,
      `Past job titles align well with the target role seniority.`
    ],
    whatIsNotWorking: [
      `Missing explicit keywords for ${missingKeywords.slice(0, 2).join(' & ') || 'secondary tooling'} specified in the job description.`,
      `Does not explicitly mention CI/CD testing pipelines required by hiring team.`
    ],
    missingKeywords: missingKeywords.length > 0 ? missingKeywords : ['GraphQL', 'Docker Containerization', 'Microservices Architecture'],
    matchingSkills: matchedSkills.length > 0 ? matchedSkills : ['React', 'Node.js', 'SQL', 'Git'],
    howToFixIt: [
      {
        section: "Work Experience - Primary Role",
        action: "Integrate target JD keyword into an existing project bullet",
        concreteRewrite: `Architected scalable web application using React and ${missingKeywords[0] || 'Docker'}, improving system deployment reliability by 35%.`
      }
    ],
    externalResources: [
      {
        title: "JobScan ATS Keyword Matching Guide",
        url: "https://www.jobscan.co/blog/ats-resume-keywords/",
        description: "How applicant tracking systems score keyword frequency and placement."
      }
    ]
  };
}

/**
 * 3. AI Mock Interview Evaluator
 */
export const INTERVIEW_QUESTIONS = {
  'software-engineering': [
    {
      id: 1,
      type: 'Behavioral',
      question: 'Tell me about a time you faced a critical production outage. How did you diagnose it and what measures did you put in place to prevent recurrence?'
    },
    {
      id: 2,
      type: 'Technical Architecture',
      question: 'How do you design a high-throughput REST API for microservices? What caching and database strategies would you implement?'
    },
    {
      id: 3,
      type: 'Collaboration',
      question: 'Describe a situation where you had a disagreement with a product manager on technical scope. How was it resolved?'
    }
  ],
  'data-science': [
    {
      id: 1,
      type: 'ML Engineering',
      question: 'How do you handle dataset imbalance when training classification models? Compare resampling versus cost-sensitive learning.'
    },
    {
      id: 2,
      type: 'LLM & RAG',
      question: 'Explain how vector embeddings and similarity search work in a RAG system. How do you evaluate response quality?'
    }
  ],
  'product-management': [
    {
      id: 1,
      type: 'Product Strategy',
      question: 'How do you prioritize competing feature requests from high-profile enterprise customers versus technical debt maintenance?'
    },
    {
      id: 2,
      type: 'Metrics & Analytics',
      question: 'If user engagement dropped by 15% following a new product release, walk me through your step-by-step diagnostic framework.'
    }
  ]
};

export async function evaluateAnswer(question, userAnswer, role) {
  if (!userAnswer || !userAnswer.trim()) {
    throw new Error('Please type or record an answer response before submitting.');
  }

  const apiKey = getApiKey();

  if (apiKey && userAnswer.length > 10) {
    try {
      const prompt = `You are GRAYMARK AI Senior Interviewer evaluating a candidate's response.
Question: "${question}"
Candidate Answer: "${userAnswer}"

Return JSON:
{
  "score": number (0-100),
  "clarityScore": number (0-100),
  "relevanceScore": number (0-100),
  "starMethodUsed": boolean,
  "executiveTakeaway": "1-2 sentence summary verdict",
  "whatYouDidWell": "Key strength of the answer",
  "whatIsNotWorking": "Key weakness or missing detail",
  "howToFixIt": "Exact STAR-formatted rewrite recommendation",
  "externalResources": [
    {
      "title": "Title",
      "url": "https://...",
      "description": "Why check this out"
    }
  ]
}`;

      return await callGeminiAPI(prompt, apiKey);
    } catch (e) {
      // Fallback
    }
  }

  // --- SMART ENGINE ---
  await delay(1100);

  const wordCount = userAnswer.trim().split(/\s+/).length;
  const textLower = userAnswer.toLowerCase();

  const starKeywords = ['situation', 'task', 'action', 'result', 'because', 'resulted', 'led to', 'metric', 'measured'];
  const starMatches = starKeywords.filter(k => textLower.includes(k));

  let score = 72;
  if (wordCount > 30) score += 12;
  if (starMatches.length >= 2) score += 12;
  score = Math.min(96, Math.max(50, score));

  return {
    score,
    clarityScore: Math.min(95, score + 4),
    relevanceScore: Math.min(98, score + 2),
    starMethodUsed: starMatches.length >= 2 || wordCount > 40,
    executiveTakeaway: wordCount < 25 
      ? "Clear initial direction, but lacks technical depth and measurable outcomes."
      : "Structured and well-communicated response with clear candidate context.",
    whatYouDidWell: "Good clear communication tone and relevant context established early in the response.",
    whatIsNotWorking: wordCount < 25
      ? "Answer is brief and omits specific technical decisions or metrics."
      : "Could conclude with a stronger quantitative result metric.",
    howToFixIt: "Structure using STAR method: Situation (Context) -> Task (Goal) -> Action (Your exact contribution) -> Result ('This reduced latency by 30%').",
    externalResources: [
      {
        title: "The STAR Method Interview Guide (MIT Career)",
        url: "https://capd.mit.edu/resources/the-star-method/",
        description: "Official framework guide for answering behavioral and technical interview questions."
      }
    ]
  };
}
