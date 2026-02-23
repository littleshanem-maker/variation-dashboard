import { createClient } from '@supabase/supabase-js';

// Placeholder Supabase configuration
// TODO: Replace with actual credentials when ready for production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Real-time subscription setup (commented out for now)
// Uncomment when Supabase is configured and ready

/*
// Subscribe to variation changes
export function subscribeToVariations(callback: (payload: any) => void) {
  return supabase
    .channel('variations')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'variations',
      },
      callback
    )
    .subscribe();
}

// Subscribe to project changes  
export function subscribeToProjects(callback: (payload: any) => void) {
  return supabase
    .channel('projects')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'projects',
      },
      callback
    )
    .subscribe();
}

// Fetch live data from Supabase
export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      variations (*)
    `);

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data;
}

export async function fetchVariations() {
  const { data, error } = await supabase
    .from('variations')
    .select(`
      *,
      projects (
        name,
        client
      )
    `)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching variations:', error);
    return [];
  }

  return data;
}

export async function fetchProjectById(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      variations (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data;
}
*/

// Type definitions for Supabase tables
// These should match your actual database schema

export interface SupabaseProject {
  id: string;
  name: string;
  client: string;
  contract_type: string;
  total_variation_value: number;
  approved_value: number;
  paid_value: number;
  at_risk_value: number;
  created_at: string;
  updated_at: string;
}

export interface SupabaseVariation {
  id: string;
  project_id: string;
  title: string;
  description: string;
  value: number;
  status: 'Captured' | 'Submitted' | 'Approved' | 'Paid' | 'Disputed';
  created_at: string;
  updated_at: string;
  instruction_source: string;
  evidence_count: number;
}