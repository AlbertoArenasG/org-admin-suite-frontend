'use client';

import { useEffect, useRef, useState, type UIEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, MoreHorizontal, TableProperties } from 'lucide-react';
import { DashboardPageContentScroller } from '@/components/dashboard-shell';
import { DashboardPlaygroundFrame } from '@/components/playground/DashboardPlaygroundFrame';
import { Button } from '@/components/ui/button';

const records = Array.from({ length: 36 }, (_, index) => ({
  id: String(index + 1).padStart(4, '0'),
  service: index % 3 === 0 ? 'Calibración anual' : 'Mantenimiento preventivo',
  customer: index % 2 === 0 ? 'Laboratorio Metrológico Eléctrica' : 'Bosch México',
  status: index % 4 === 0 ? 'Atención' : 'En tiempo',
  updated: `${12 + (index % 15)} sept 2026`,
}));

export function StickyCollapsiblePageHeaderPlayground() {
  const pageHeaderRef = useRef<HTMLElement>(null);
  const [threshold, setThreshold] = useState(Number.POSITIVE_INFINITY);
  const [isCompact, setIsCompact] = useState(false);
  const reduceMotion = useReducedMotion();
  const compactTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const };

  useEffect(() => {
    const pageHeader = pageHeaderRef.current;

    if (!pageHeader) {
      return;
    }

    const updateThreshold = () => {
      setThreshold(Math.max(0, pageHeader.offsetHeight - 56));
    };

    updateThreshold();
    const observer = new ResizeObserver(updateThreshold);
    observer.observe(pageHeader);

    return () => observer.disconnect();
  }, []);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    setIsCompact(event.currentTarget.scrollTop >= threshold);
  };

  return (
    <DashboardPlaygroundFrame
      scrollMode="page-composition"
      childrenArePageComposition
      pageCompositionProps={{ onScroll: handleScroll }}
      segments={[
        { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
        { label: 'Dashboard Playground', href: '/dashboard-playground' },
        { label: 'Sticky page header' },
      ]}
    >
      <header ref={pageHeaderRef} className="border-b border-border/70 px-5 py-7 sm:px-7 sm:py-9">
        <p className="text-xs font-semibold tracking-[0.1em] text-[var(--secondary-700)] uppercase">
          Operación · Vista de tabla
        </p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Registros de servicio
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Ejemplo neutral para validar la convivencia entre un encabezado amplio y su contexto
              compacto durante el scroll.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground">
                36 registros
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700">
                Operación activa
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Exportar</Button>
            <Button>
              <ArrowUpRight className="size-4" aria-hidden="true" />
              Nuevo registro
            </Button>
          </div>
        </div>
      </header>

      <motion.header
        aria-hidden={!isCompact}
        className={`sticky top-0 z-20 -mb-14 hidden h-14 items-center border-b border-border/80 bg-background/95 px-5 backdrop-blur-sm sm:px-7 md:flex ${
          isCompact ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        animate={{
          opacity: isCompact ? 1 : 0,
          y: isCompact ? 0 : -10,
          boxShadow: isCompact ? '0 10px 24px rgba(15, 23, 42, 0.08)' : '0 0 0 rgba(0, 0, 0, 0)',
        }}
        transition={compactTransition}
      >
        <motion.div
          className="flex min-w-0 flex-1 items-center gap-3"
          animate={{ opacity: isCompact ? 1 : 0, x: isCompact ? 0 : -6 }}
          transition={{ ...compactTransition, delay: reduceMotion ? 0 : 0.03 }}
        >
          <TableProperties
            className="size-4 shrink-0 text-[var(--secondary-600)]"
            aria-hidden="true"
          />
          <p className="truncate text-sm font-semibold">Registros de servicio</p>
          <motion.span
            className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 sm:inline-flex"
            animate={{ opacity: isCompact ? 1 : 0, scale: isCompact ? 1 : 0.94 }}
            transition={{ ...compactTransition, delay: reduceMotion ? 0 : 0.08 }}
          >
            Operación activa
          </motion.span>
        </motion.div>
        <motion.div
          animate={{ opacity: isCompact ? 1 : 0, x: isCompact ? 0 : 8 }}
          transition={{ ...compactTransition, delay: reduceMotion ? 0 : 0.06 }}
        >
          <Button size="sm" tabIndex={isCompact ? 0 : -1}>
            Nuevo registro
          </Button>
        </motion.div>
      </motion.header>

      <DashboardPageContentScroller className="px-5 py-5 sm:px-7">
        <div className="rounded-xl border border-border/80 bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Contenido operativo</p>
              <p className="mt-1 text-sm text-muted-foreground">
                La tabla representa el contenido que continúa bajo el header compacto.
              </p>
            </div>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="size-4" aria-hidden="true" />
              Opciones
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="border-b border-border/70 bg-muted/35 text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Folio</th>
                  <th className="px-4 py-3">Servicio</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Actualizado</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-4 font-medium">{record.id}</td>
                    <td className="px-4 py-4">{record.service}</td>
                    <td className="max-w-64 truncate px-4 py-4 text-muted-foreground">
                      {record.customer}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={
                          record.status === 'En tiempo'
                            ? 'rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700'
                            : 'rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700'
                        }
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{record.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardPageContentScroller>
    </DashboardPlaygroundFrame>
  );
}
