/**
 * Smart Career Coach Memory Service
 * Persists long-term candidate insights in localStorage across sessions.
 */

const MEMORY_STORAGE_KEY = 'ai_career_coach_memory_v1';

const defaultMemory = {
  targetRole: 'Full-Stack Software Engineer',
  highestAtsScore: null,
  lastAtsScore: null,
  topSkillGaps: [],
  completedInterviewsCount: 0,
  rememberedInsights: [
    "Targeting Full-Stack Software Engineering roles.",
    "Prefers metrics-driven resume bullet points."
  ],
  lastUpdated: new Date().toISOString()
};

export function getCareerMemory() {
  try {
    const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
    if (!raw) return defaultMemory;
    return { ...defaultMemory, ...JSON.parse(raw) };
  } catch (e) {
    return defaultMemory;
  }
}

export function updateCareerMemory(updates) {
  try {
    const current = getCareerMemory();
    const updated = {
      ...current,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Failed to save memory:', e);
    return defaultMemory;
  }
}

export function addInsightToMemory(insight) {
  const current = getCareerMemory();
  if (!current.rememberedInsights.includes(insight)) {
    const updatedInsights = [insight, ...current.rememberedInsights].slice(0, 6);
    return updateCareerMemory({ rememberedInsights: updatedInsights });
  }
  return current;
}

export function clearCareerMemory() {
  localStorage.removeItem(MEMORY_STORAGE_KEY);
  return defaultMemory;
}
