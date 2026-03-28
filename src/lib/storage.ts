const STORAGE_KEYS = {
  clients: "musa:clients",
  briefs: "musa:briefs",
  copyHistory: "musa:copy-history",
  preferences: "musa:preferences",
  activities: "musa:activities",
} as const;

const LIMITS = {
  briefs: 50,
  copyHistory: 100,
  activities: 50,
};

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full — silently fail
  }
}

export const storage = {
  keys: STORAGE_KEYS,
  limits: LIMITS,
  get: getItem,
  set: setItem,

  appendWithLimit<T>(key: string, item: T, limit: number): void {
    const items = getItem<T[]>(key, []);
    items.unshift(item);
    if (items.length > limit) items.length = limit;
    setItem(key, items);
  },

  remove(key: string, id: string): void {
    const items = getItem<{ id: string }[]>(key, []);
    setItem(key, items.filter(i => i.id !== id));
  },

  exportAll(): string {
    const data: Record<string, unknown> = {};
    for (const [name, key] of Object.entries(STORAGE_KEYS)) {
      data[name] = getItem(key, null);
    }
    return JSON.stringify(data, null, 2);
  },

  importAll(json: string): void {
    const data = JSON.parse(json);
    for (const [name, key] of Object.entries(STORAGE_KEYS)) {
      if (data[name] !== undefined) {
        setItem(key, data[name]);
      }
    }
  },
};
