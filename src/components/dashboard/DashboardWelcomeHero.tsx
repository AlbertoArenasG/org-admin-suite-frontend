import type { ComponentType } from 'react';
import {
  Activity,
  Atom,
  Beaker,
  Box,
  Cable,
  CircuitBoard,
  Cpu,
  Crosshair,
  Database,
  FlaskConical,
  Gauge,
  Microscope,
  Network,
  Orbit,
  Ruler,
  ScanLine,
  Settings2,
  Waves,
} from 'lucide-react';

import styles from './DashboardWelcomeHero.module.css';

type AmbientIcon = {
  Icon: ComponentType<{ className?: string }>;
  className: string;
  depth: 'far' | 'mid' | 'near';
};

const ambientIcons: AmbientIcon[] = [
  { Icon: Microscope, className: styles.iconMicroscope, depth: 'near' },
  { Icon: CircuitBoard, className: styles.iconCircuit, depth: 'far' },
  { Icon: FlaskConical, className: styles.iconFlask, depth: 'mid' },
  { Icon: Atom, className: styles.iconAtom, depth: 'near' },
  { Icon: Gauge, className: styles.iconGauge, depth: 'far' },
  { Icon: Ruler, className: styles.iconRuler, depth: 'mid' },
  { Icon: ScanLine, className: styles.iconScan, depth: 'far' },
  { Icon: Orbit, className: styles.iconOrbit, depth: 'mid' },
  { Icon: Beaker, className: styles.iconBeaker, depth: 'near' },
  { Icon: Crosshair, className: styles.iconCrosshair, depth: 'far' },
  { Icon: Activity, className: styles.iconActivity, depth: 'mid' },
  { Icon: Box, className: styles.iconBox, depth: 'far' },
  { Icon: Cable, className: styles.iconCable, depth: 'near' },
  { Icon: Cpu, className: styles.iconCpu, depth: 'mid' },
  { Icon: Database, className: styles.iconDatabase, depth: 'far' },
  { Icon: Network, className: styles.iconNetwork, depth: 'near' },
  { Icon: Settings2, className: styles.iconSettings, depth: 'mid' },
  { Icon: Waves, className: styles.iconWaves, depth: 'far' },
];

interface DashboardWelcomeHeroProps {
  description: string;
  eyebrow: string;
  name: string;
  title: string;
}

export function DashboardWelcomeHero({
  description,
  eyebrow,
  name,
  title,
}: DashboardWelcomeHeroProps) {
  return (
    <section aria-labelledby="dashboard-welcome-title" className={styles.hero}>
      <div aria-hidden="true" className={styles.ambientLayer}>
        <span className={styles.meshOne} />
        <span className={styles.meshTwo} />
        {ambientIcons.map(({ Icon, className, depth }) => (
          <Icon className={`${styles.icon} ${styles[depth]} ${className}`} key={className} />
        ))}
      </div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 id="dashboard-welcome-title" className={styles.title}>
          {title}, <span>{name}</span>.
        </h1>
        <p className={styles.description}>{description}</p>
      </div>
    </section>
  );
}
