'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  type Project,
  type Variation,
  mockProjects,
  mockVariations,
} from './mockData';

// ─── Extended Types ───────────────────────────────────────────────────────────

export interface ProjectData extends Project {
  referenceNumber?: string;
  description?: string;
}

export type { Variation };

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const STORAGE_KEY_PROJECTS  = 'vc_projects_v1';
const STORAGE_KEY_VARIATIONS = 'vc_variations_v1';

// ─── Serialization helpers ────────────────────────────────────────────────────

function serializeVariations(variations: Variation[]): string {
  return JSON.stringify(
    variations.map(v => ({
      ...v,
      createdAt: v.createdAt.toISOString(),
      updatedAt: v.updatedAt.toISOString(),
    }))
  );
}

function deserializeVariations(json: string): Variation[] {
  const parsed = JSON.parse(json) as Array<Record<string, unknown>>;
  return parsed.map(v => ({
    ...(v as Omit<Variation, 'createdAt' | 'updatedAt'>),
    createdAt: new Date(v.createdAt as string),
    updatedAt: new Date(v.updatedAt as string),
  }));
}

// ─── Context Interface ────────────────────────────────────────────────────────

interface AppStoreCtx {
  projects: ProjectData[];
  variations: Variation[];
  addProject(
    p: Pick<ProjectData, 'name' | 'client' | 'contractType'> &
      Partial<Pick<ProjectData, 'referenceNumber' | 'description'>>
  ): ProjectData;
  updateProject(id: string, patch: Partial<ProjectData>): void;
  deleteProject(id: string): void;
  addVariation(
    v: Omit<Variation, 'id' | 'createdAt' | 'updatedAt'>
  ): Variation;
  updateVariation(
    id: string,
    patch: Partial<Omit<Variation, 'id' | 'createdAt'>>
  ): void;
  deleteVariation(id: string): void;
  getProjectById(id: string): ProjectData | undefined;
  getVariationsByProjectId(projectId: string): Variation[];
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppStoreContext = createContext<AppStoreCtx | null>(null);

// ─── Load helpers ─────────────────────────────────────────────────────────────

function loadProjects(): ProjectData[] {
  if (typeof window === 'undefined') return mockProjects;
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (stored) return JSON.parse(stored) as ProjectData[];
  } catch {
    // fall through
  }
  return mockProjects;
}

function loadVariations(): Variation[] {
  if (typeof window === 'undefined') return mockVariations;
  try {
    const stored = localStorage.getItem(STORAGE_KEY_VARIATIONS);
    if (stored) return deserializeVariations(stored);
  } catch {
    // fall through
  }
  return mockVariations;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<ProjectData[]>(mockProjects);
  const [variations, setVariations] = useState<Variation[]>(mockVariations);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setProjects(loadProjects());
    setVariations(loadVariations());
    setHydrated(true);
  }, []);

  // Persist projects
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects, hydrated]);

  // Persist variations
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_VARIATIONS, serializeVariations(variations));
    } catch {
      // ignore
    }
  }, [variations, hydrated]);

  // ── CRUD: Projects ──────────────────────────────────────────────────────────

  const addProject = useCallback(
    (
      p: Pick<ProjectData, 'name' | 'client' | 'contractType'> &
        Partial<Pick<ProjectData, 'referenceNumber' | 'description'>>
    ): ProjectData => {
      const project: ProjectData = {
        id: crypto.randomUUID(),
        name: p.name,
        client: p.client,
        contractType: p.contractType,
        referenceNumber: p.referenceNumber,
        description: p.description,
        totalVariationValue: 0,
        approvedValue: 0,
        paidValue: 0,
        atRiskValue: 0,
      };
      setProjects(prev => [...prev, project]);
      return project;
    },
    []
  );

  const updateProject = useCallback(
    (id: string, patch: Partial<ProjectData>) => {
      setProjects(prev =>
        prev.map(p => (p.id === id ? { ...p, ...patch } : p))
      );
    },
    []
  );

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setVariations(prev => prev.filter(v => v.projectId !== id));
  }, []);

  // ── CRUD: Variations ────────────────────────────────────────────────────────

  const addVariation = useCallback(
    (v: Omit<Variation, 'id' | 'createdAt' | 'updatedAt'>): Variation => {
      const now = new Date();
      const variation: Variation = {
        ...v,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      setVariations(prev => [...prev, variation]);
      return variation;
    },
    []
  );

  const updateVariation = useCallback(
    (id: string, patch: Partial<Omit<Variation, 'id' | 'createdAt'>>) => {
      setVariations(prev =>
        prev.map(v =>
          v.id === id ? { ...v, ...patch, updatedAt: new Date() } : v
        )
      );
    },
    []
  );

  const deleteVariation = useCallback((id: string) => {
    setVariations(prev => prev.filter(v => v.id !== id));
  }, []);

  // ── Getters ─────────────────────────────────────────────────────────────────

  const getProjectById = useCallback(
    (id: string) => projects.find(p => p.id === id),
    [projects]
  );

  const getVariationsByProjectId = useCallback(
    (projectId: string) => variations.filter(v => v.projectId === projectId),
    [variations]
  );

  return (
    <AppStoreContext.Provider
      value={{
        projects,
        variations,
        addProject,
        updateProject,
        deleteProject,
        addVariation,
        updateVariation,
        deleteVariation,
        getProjectById,
        getVariationsByProjectId,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppStore(): AppStoreCtx {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider');
  return ctx;
}

// ─── Computed helpers (operate on arbitrary variation arrays) ─────────────────

export function computeTotalValue(variations: Variation[]): number {
  return variations.reduce((s, v) => s + v.value, 0);
}

export function computeApprovedValue(variations: Variation[]): number {
  return variations
    .filter(v => v.status === 'Approved' || v.status === 'Paid')
    .reduce((s, v) => s + v.value, 0);
}

export function computePaidValue(variations: Variation[]): number {
  return variations
    .filter(v => v.status === 'Paid')
    .reduce((s, v) => s + v.value, 0);
}

export function computeAtRiskValue(variations: Variation[]): number {
  return variations
    .filter(v => v.status === 'Captured' || v.status === 'Submitted')
    .reduce((s, v) => s + v.value, 0);
}

export function computeCountByStatus(
  variations: Variation[]
): Record<string, number> {
  return variations.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function computeValueByStatus(
  variations: Variation[]
): Record<string, number> {
  return variations.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] ?? 0) + v.value;
    return acc;
  }, {} as Record<string, number>);
}

export function computeAverageDaysToApproval(variations: Variation[]): number {
  const done = variations.filter(
    v => v.status === 'Approved' || v.status === 'Paid'
  );
  if (done.length === 0) return 0;
  const total = done.reduce((s, v) => {
    const days = Math.floor(
      (v.updatedAt.getTime() - v.createdAt.getTime()) / 86_400_000
    );
    return s + days;
  }, 0);
  return Math.round(total / done.length);
}

export function computeNoticeAlerts(
  variations: Variation[]
): Array<
  Variation & {
    daysSinceCapture: number;
    deadline: Date;
    alertLevel: 'green' | 'amber' | 'red';
  }
> {
  const now = new Date();
  return variations
    .filter(v => v.status === 'Captured')
    .map(v => {
      const daysSinceCapture = Math.floor(
        (now.getTime() - v.createdAt.getTime()) / 86_400_000
      );
      const deadline = new Date(v.createdAt);
      deadline.setDate(deadline.getDate() + 28);
      const alertLevel: 'green' | 'amber' | 'red' =
        daysSinceCapture > 28
          ? 'red'
          : daysSinceCapture > 14
          ? 'amber'
          : 'green';
      return { ...v, daysSinceCapture, deadline, alertLevel };
    })
    .sort((a, b) => b.daysSinceCapture - a.daysSinceCapture);
}
