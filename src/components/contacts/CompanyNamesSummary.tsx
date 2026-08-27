'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CompanyNamesSummaryProps {
  companyNames: string[];
  className?: string;
}

export function CompanyNamesSummary({ companyNames, className }: CompanyNamesSummaryProps) {
  if (!companyNames.length) {
    return null;
  }

  const [firstCompany] = companyNames;
  const remainingCount = companyNames.length - 1;
  const summary = remainingCount > 0 ? `${firstCompany} +${remainingCount}` : firstCompany;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`cursor-default truncate text-xs text-muted-foreground ${className ?? ''}`}
        >
          {summary}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" align="start" className="max-w-64">
        <ul className="space-y-1">
          {companyNames.map((companyName) => (
            <li key={companyName}>{companyName}</li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  );
}
