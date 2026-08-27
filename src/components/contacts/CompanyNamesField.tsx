'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CompanyNamesFieldProps {
  id: string;
  label: string;
  placeholder: string;
  addLabel: string;
  emptyLabel: string;
  companyNames: string[];
  disabled?: boolean;
  onChange: (companyNames: string[]) => void;
}

export function CompanyNamesField({
  id,
  label,
  placeholder,
  addLabel,
  emptyLabel,
  companyNames,
  disabled = false,
  onChange,
}: CompanyNamesFieldProps) {
  const [draft, setDraft] = useState('');

  const addCompanyName = () => {
    const normalized = draft.trim();

    if (!normalized || companyNames.some((companyName) => companyName === normalized)) {
      return;
    }

    onChange([...companyNames, normalized]);
    setDraft('');
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addCompanyName();
            }
          }}
        />
        <Button type="button" variant="outline" disabled={disabled} onClick={addCompanyName}>
          <Plus className="mr-2 size-4" />
          {addLabel}
        </Button>
      </div>

      {companyNames.length ? (
        <div className="flex flex-wrap gap-2">
          {companyNames.map((companyName) => (
            <div
              key={companyName}
              className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-sm"
            >
              <span>{companyName}</span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(companyNames.filter((value) => value !== companyName))}
                className="text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={`${label}: ${companyName}`}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border/60 px-3 py-4 text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}
