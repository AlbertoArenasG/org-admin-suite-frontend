interface CompanyNamesChipsProps {
  companyNames: string[];
  emptyLabel?: string;
}

export function CompanyNamesChips({ companyNames, emptyLabel = '—' }: CompanyNamesChipsProps) {
  if (!companyNames.length) {
    return <span className="text-sm text-muted-foreground">{emptyLabel}</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {companyNames.map((companyName) => (
        <span
          key={companyName}
          className="rounded-full border border-border/60 bg-card/70 px-2.5 py-1 text-xs text-foreground"
        >
          {companyName}
        </span>
      ))}
    </div>
  );
}
