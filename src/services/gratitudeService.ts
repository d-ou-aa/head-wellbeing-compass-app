
export interface GratitudeEntry {
  date: string;
  entries: string[];
}

export const saveGratitudeEntry = (entries: string[]) => {
  const today = new Date().toISOString().split('T')[0];
  const storedEntries = localStorage.getItem('gratitudeEntries');
  const allEntries: GratitudeEntry[] = storedEntries ? JSON.parse(storedEntries) : [];
  
  // Check if we already have an entry for today
  const existingEntryIndex = allEntries.findIndex(entry => entry.date === today);
  
  if (existingEntryIndex >= 0) {
    allEntries[existingEntryIndex].entries = entries;
  } else {
    allEntries.push({ date: today, entries });
  }
  
  localStorage.setItem('gratitudeEntries', JSON.stringify(allEntries));
  return { date: today, entries };
};

export const getGratitudeEntries = (): GratitudeEntry[] => {
  const storedEntries = localStorage.getItem('gratitudeEntries');
  return storedEntries ? JSON.parse(storedEntries) : [];
};
