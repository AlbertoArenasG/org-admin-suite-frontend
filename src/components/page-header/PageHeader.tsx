import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PageHeaderProps = Omit<ComponentPropsWithoutRef<'header'>, 'title'> & {
  title: ReactNode;
  titleAs?: 1 | 2 | 3;
  eyebrow?: ReactNode;
  description?: ReactNode;
  metadata?: ReactNode;
  actions?: ReactNode;
  actionsPlacement?: 'end' | 'title';
};

export function PageHeader({
  title,
  titleAs = 1,
  eyebrow,
  description,
  metadata,
  actions,
  actionsPlacement = 'end',
  className,
  ...props
}: PageHeaderProps) {
  const Title = `h${titleAs}` as 'h1' | 'h2' | 'h3';

  return (
    <header className={cn('dashboard-page-header', className)} {...props}>
      <div className="min-w-0 flex-1">
        {eyebrow ? <p className="dashboard-page-header__eyebrow">{eyebrow}</p> : null}
        {actions && actionsPlacement === 'title' ? (
          <div className="dashboard-page-header__title-row">
            <Title className="dashboard-page-header__title">{title}</Title>
            <div className="dashboard-page-header__actions dashboard-page-header__actions--inline">
              {actions}
            </div>
          </div>
        ) : (
          <Title className="dashboard-page-header__title">{title}</Title>
        )}
        {description ? <p className="dashboard-page-header__description">{description}</p> : null}
        {metadata ? <div className="dashboard-page-header__metadata">{metadata}</div> : null}
      </div>
      {actions && actionsPlacement === 'end' ? (
        <div className="dashboard-page-header__actions">{actions}</div>
      ) : null}
    </header>
  );
}
