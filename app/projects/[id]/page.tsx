'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProjectById, getVariationsByProjectId, formatCurrency, type Variation } from '@/lib/mockData';

type SortField = 'title' | 'value' | 'status' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

const statusOrder = {
  'Captured': 1,
  'Submitted': 2,
  'Approved': 3,
  'Paid': 4,
  'Disputed': 5,
};

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const project = getProjectById(projectId);
  const variations = getVariationsByProjectId(projectId);

  const sortedVariations = useMemo(() => {
    return [...variations].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'value':
          aValue = a.value;
          bValue = b.value;
          break;
        case 'status':
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'updatedAt':
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
        default:
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [variations, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getStatusLifecycle = (variation: Variation) => {
    const stages = ['Captured', 'Submitted', 'Approved', 'Paid'];
    const currentIndex = stages.indexOf(variation.status);
    const isDisputed = variation.status === 'Disputed';

    if (isDisputed) {
      return (
        <div className="flex items-center gap-2">
          <div className="text-status-disputed text-sm">⚠️ Disputed</div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {stages.map((stage, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={stage} className="flex items-center gap-1">
              <div 
                className={`w-3 h-3 rounded-full ${
                  isActive 
                    ? isCurrent 
                      ? 'bg-accent ring-2 ring-accent/30' 
                      : 'bg-green-500'
                    : 'bg-gray-600'
                }`}
              />
              <span className={`text-xs ${
                isActive ? 'text-white' : 'text-gray-400'
              }`}>
                {stage}
              </span>
              {index < stages.length - 1 && (
                <div className={`w-4 h-px ${
                  isActive ? 'bg-green-500' : 'bg-gray-600'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
              <Link 
                href="/"
                className="text-accent hover:text-accent/80 transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const approvalPercentage = project.totalVariationValue > 0 
    ? Math.round((project.approvedValue / project.totalVariationValue) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/"
              className="text-accent hover:text-accent/80 transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {project.name}
                </h1>
                <div className="flex items-center gap-6 text-gray-300">
                  <div>
                    <span className="text-gray-400">Client:</span> {project.client}
                  </div>
                  <div>
                    <span className="text-gray-400">Contract:</span> {project.contractType}
                  </div>
                  <div>
                    <span className="text-gray-400">Variations:</span> {variations.length}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Project Stats */}
            <div className="grid grid-cols-4 gap-6">
              <div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(project.totalVariationValue)}
                </div>
                <div className="text-gray-400">Total Value</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(project.approvedValue)}
                </div>
                <div className="text-gray-400">Approved ({approvalPercentage}%)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-400">
                  {formatCurrency(project.paidValue)}
                </div>
                <div className="text-gray-400">Paid</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {formatCurrency(project.atRiskValue)}
                </div>
                <div className="text-gray-400">At Risk</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Project Approval Progress</span>
                <span>{approvalPercentage}% approved</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-accent to-green-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${approvalPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Variations Table */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Project Variations</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th 
                    className="text-left py-3 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleSort('title')}
                  >
                    Variation {getSortIcon('title')}
                  </th>
                  <th 
                    className="text-right py-3 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleSort('value')}
                  >
                    Value {getSortIcon('value')}
                  </th>
                  <th 
                    className="text-center py-3 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleSort('status')}
                  >
                    Status {getSortIcon('status')}
                  </th>
                  <th className="text-center py-3 text-gray-300 font-medium">
                    Lifecycle
                  </th>
                  <th 
                    className="text-center py-3 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleSort('createdAt')}
                  >
                    Created {getSortIcon('createdAt')}
                  </th>
                  <th 
                    className="text-center py-3 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleSort('updatedAt')}
                  >
                    Updated {getSortIcon('updatedAt')}
                  </th>
                  <th className="text-center py-3 text-gray-300 font-medium">
                    Evidence
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedVariations.map((variation) => (
                  <tr key={variation.id} className="border-b border-border/50 hover:bg-card/50">
                    <td className="py-4">
                      <div className="font-medium text-white mb-1">
                        {variation.title}
                      </div>
                      <div className="text-sm text-gray-400 max-w-md">
                        {variation.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {variation.instructionSource}
                      </div>
                    </td>
                    <td className="py-4 text-right font-medium text-white">
                      {formatCurrency(variation.value)}
                    </td>
                    <td className="py-4 text-center">
                      <span className={`status-badge status-${variation.status.toLowerCase()}`}>
                        {variation.status === 'Captured' ? 'Draft' : variation.status}
                      </span>
                    </td>
                    <td className="py-4">
                      {getStatusLifecycle(variation)}
                    </td>
                    <td className="py-4 text-center text-gray-300">
                      {formatDate(variation.createdAt)}
                    </td>
                    <td className="py-4 text-center text-gray-300">
                      {formatDate(variation.updatedAt)}
                    </td>
                    <td className="py-4 text-center">
                      <span className="bg-accent/20 text-accent px-2 py-1 rounded text-sm">
                        {variation.evidenceCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {variations.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No variations found for this project.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}