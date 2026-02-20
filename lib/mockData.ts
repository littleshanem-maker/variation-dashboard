export interface Project {
  id: string;
  name: string;
  client: string;
  contractType: string;
  totalVariationValue: number; // in cents
  approvedValue: number; // in cents
  paidValue: number; // in cents
  atRiskValue: number; // in cents
}

export interface Variation {
  id: string;
  projectId: string;
  title: string;
  description: string;
  value: number; // in cents
  status: 'Captured' | 'Submitted' | 'Approved' | 'Paid' | 'Disputed';
  createdAt: Date;
  updatedAt: Date;
  instructionSource: string;
  evidenceCount: number; // photos + voice notes
}

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Westgate Tunnel Section 4B',
    client: 'West Gate Tunnel Authority',
    contractType: 'Design & Construct',
    totalVariationValue: 285000000, // $2,850,000
    approvedValue: 195000000, // $1,950,000
    paidValue: 125000000, // $1,250,000
    atRiskValue: 90000000, // $900,000
  },
  {
    id: 'proj-2',
    name: 'Metro Crossing Parkville',
    client: 'Rail Projects Victoria',
    contractType: 'Construction Only',
    totalVariationValue: 145000000, // $1,450,000
    approvedValue: 89000000, // $890,000
    paidValue: 67000000, // $670,000
    atRiskValue: 56000000, // $560,000
  },
  {
    id: 'proj-3',
    name: 'Northern Hospital Mechanical',
    client: 'Northern Health',
    contractType: 'EPC Contract',
    totalVariationValue: 78000000, // $780,000
    approvedValue: 65000000, // $650,000
    paidValue: 52000000, // $520,000
    atRiskValue: 13000000, // $130,000
  },
];

// Mock Variations
export const mockVariations: Variation[] = [
  // Westgate Tunnel Project
  {
    id: 'var-1',
    projectId: 'proj-1',
    title: 'Additional steel reinforcement',
    description: 'Extra rebar required for foundation due to soil conditions discovered during excavation',
    value: 85000000, // $850,000
    status: 'Approved',
    createdAt: new Date('2024-11-15T09:30:00Z'),
    updatedAt: new Date('2024-12-02T14:15:00Z'),
    instructionSource: 'Site Instruction SI-247',
    evidenceCount: 12,
  },
  {
    id: 'var-2',
    projectId: 'proj-1',
    title: 'Traffic management extension',
    description: 'Extended traffic control measures for additional 2 weeks due to weather delays',
    value: 45000000, // $450,000
    status: 'Paid',
    createdAt: new Date('2024-10-22T11:20:00Z'),
    updatedAt: new Date('2024-12-15T16:45:00Z'),
    instructionSource: 'Variation Order VO-089',
    evidenceCount: 8,
  },
  {
    id: 'var-3',
    projectId: 'proj-1',
    title: 'Concrete specification upgrade',
    description: 'Higher grade concrete required for marine environment exposure',
    value: 65000000, // $650,000
    status: 'Submitted',
    createdAt: new Date('2024-12-18T08:45:00Z'),
    updatedAt: new Date('2024-12-20T10:30:00Z'),
    instructionSource: 'Technical Bulletin TB-156',
    evidenceCount: 15,
  },
  {
    id: 'var-4',
    projectId: 'proj-1',
    title: 'Utility relocation costs',
    description: 'Unexpected gas main relocation required for tunnel boring machine path',
    value: 90000000, // $900,000
    status: 'Disputed',
    createdAt: new Date('2024-11-08T14:15:00Z'),
    updatedAt: new Date('2024-12-10T09:20:00Z'),
    instructionSource: 'Site Direction SD-034',
    evidenceCount: 23,
  },
  
  // Metro Crossing Parkville
  {
    id: 'var-5',
    projectId: 'proj-2',
    title: 'Platform extension works',
    description: 'Extension of platform by 20m to accommodate longer trains',
    value: 35000000, // $350,000
    status: 'Approved',
    createdAt: new Date('2024-11-25T10:15:00Z'),
    updatedAt: new Date('2024-12-08T13:45:00Z'),
    instructionSource: 'Design Change DC-078',
    evidenceCount: 9,
  },
  {
    id: 'var-6',
    projectId: 'proj-2',
    title: 'Escalator upgrade',
    description: 'Upgrade to heavy duty escalators for increased capacity',
    value: 28000000, // $280,000
    status: 'Paid',
    createdAt: new Date('2024-10-30T15:30:00Z'),
    updatedAt: new Date('2024-11-22T11:10:00Z'),
    instructionSource: 'Client Request CR-145',
    evidenceCount: 6,
  },
  {
    id: 'var-7',
    projectId: 'proj-2',
    title: 'Fire system enhancement',
    description: 'Additional fire suppression systems required by updated fire code',
    value: 42000000, // $420,000
    status: 'Captured',
    createdAt: new Date('2024-12-21T09:00:00Z'),
    updatedAt: new Date('2024-12-21T09:00:00Z'),
    instructionSource: 'Compliance Notice CN-089',
    evidenceCount: 4,
  },
  {
    id: 'var-8',
    projectId: 'proj-2',
    title: 'Accessibility improvements',
    description: 'Enhanced DDA compliance measures including tactile indicators',
    value: 18000000, // $180,000
    status: 'Approved',
    createdAt: new Date('2024-12-01T12:20:00Z'),
    updatedAt: new Date('2024-12-14T16:30:00Z'),
    instructionSource: 'Audit Finding AF-023',
    evidenceCount: 7,
  },
  {
    id: 'var-9',
    projectId: 'proj-2',
    title: 'Noise barrier extension',
    description: 'Additional 150m of noise barrier due to community concerns',
    value: 22000000, // $220,000
    status: 'Submitted',
    createdAt: new Date('2024-12-16T14:45:00Z'),
    updatedAt: new Date('2024-12-19T10:15:00Z'),
    instructionSource: 'Environmental Direction ED-067',
    evidenceCount: 11,
  },

  // Northern Hospital Mechanical
  {
    id: 'var-10',
    projectId: 'proj-3',
    title: 'HVAC system upgrade',
    description: 'Higher capacity air handling units for COVID-19 compliance',
    value: 32000000, // $320,000
    status: 'Paid',
    createdAt: new Date('2024-11-12T08:30:00Z'),
    updatedAt: new Date('2024-12-05T15:20:00Z'),
    instructionSource: 'Health Directive HD-234',
    evidenceCount: 8,
  },
  {
    id: 'var-11',
    projectId: 'proj-3',
    title: 'Medical gas redundancy',
    description: 'Duplicate medical gas systems for critical care areas',
    value: 25000000, // $250,000
    status: 'Approved',
    createdAt: new Date('2024-12-03T11:45:00Z'),
    updatedAt: new Date('2024-12-12T09:30:00Z'),
    instructionSource: 'Safety Requirement SR-156',
    evidenceCount: 5,
  },
  {
    id: 'var-12',
    projectId: 'proj-3',
    title: 'Emergency power upgrade',
    description: 'Increased generator capacity for new MRI equipment',
    value: 18000000, // $180,000
    status: 'Captured',
    createdAt: new Date('2024-12-20T13:15:00Z'),
    updatedAt: new Date('2024-12-20T13:15:00Z'),
    instructionSource: 'Equipment Specification ES-089',
    evidenceCount: 3,
  },
  {
    id: 'var-13',
    projectId: 'proj-3',
    title: 'Water treatment enhancement',
    description: 'Upgraded water filtration for dialysis unit requirements',
    value: 8000000, // $80,000
    status: 'Submitted',
    createdAt: new Date('2024-12-17T10:00:00Z'),
    updatedAt: new Date('2024-12-18T14:30:00Z'),
    instructionSource: 'Medical Requirement MR-045',
    evidenceCount: 6,
  },
];

// Helper functions
export function getProjectById(id: string): Project | undefined {
  return mockProjects.find(p => p.id === id);
}

export function getVariationsByProjectId(projectId: string): Variation[] {
  return mockVariations.filter(v => v.projectId === projectId);
}

export function getAllVariations(): Variation[] {
  return mockVariations;
}

export function getAllProjects(): Project[] {
  return mockProjects;
}

export function getVariationCountByStatus(): Record<string, number> {
  return mockVariations.reduce((acc, variation) => {
    acc[variation.status] = (acc[variation.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function getVariationValueByStatus(): Record<string, number> {
  return mockVariations.reduce((acc, variation) => {
    acc[variation.status] = (acc[variation.status] || 0) + variation.value;
    return acc;
  }, {} as Record<string, number>);
}

export function getTotalValue(): number {
  return mockVariations.reduce((sum, variation) => sum + variation.value, 0);
}

export function getApprovedValue(): number {
  return mockVariations
    .filter(v => v.status === 'Approved' || v.status === 'Paid')
    .reduce((sum, variation) => sum + variation.value, 0);
}

export function getPaidValue(): number {
  return mockVariations
    .filter(v => v.status === 'Paid')
    .reduce((sum, variation) => sum + variation.value, 0);
}

export function getAtRiskValue(): number {
  return mockVariations
    .filter(v => v.status === 'Captured' || v.status === 'Submitted')
    .reduce((sum, variation) => sum + variation.value, 0);
}

export function getAverageDaysToApproval(): number {
  const approvedVariations = mockVariations.filter(
    v => v.status === 'Approved' || v.status === 'Paid'
  );
  
  if (approvedVariations.length === 0) return 0;
  
  const totalDays = approvedVariations.reduce((sum, variation) => {
    const days = Math.floor(
      (variation.updatedAt.getTime() - variation.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    return sum + days;
  }, 0);
  
  return Math.round(totalDays / approvedVariations.length);
}

export function getRecentActivity(): Variation[] {
  return [...mockVariations]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 10);
}

export function getNoticeAlerts(): Array<Variation & { daysSinceCapture: number; deadline: Date; alertLevel: 'green' | 'amber' | 'red' }> {
  const now = new Date();
  const unsubmittedVariations = mockVariations.filter(v => v.status === 'Captured');
  
  return unsubmittedVariations.map(variation => {
    const daysSinceCapture = Math.floor(
      (now.getTime() - variation.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const deadline = new Date(variation.createdAt);
    deadline.setDate(deadline.getDate() + 28);
    
    let alertLevel: 'green' | 'amber' | 'red' = 'green';
    if (daysSinceCapture > 28) {
      alertLevel = 'red';
    } else if (daysSinceCapture > 14) {
      alertLevel = 'amber';
    }
    
    return {
      ...variation,
      daysSinceCapture,
      deadline,
      alertLevel,
    };
  }).sort((a, b) => b.daysSinceCapture - a.daysSinceCapture);
}

// Format currency helper
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatCurrencyCompact(cents: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}