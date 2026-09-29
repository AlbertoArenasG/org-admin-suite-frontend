'use client';

import type { CSSProperties } from 'react';

import styles from './ReactBitsFolder.module.css';

export type ReactBitsFolderProps = {
  exposeContents?: boolean;
  hasContents: boolean;
  open: boolean;
  size?: number;
  showContents: boolean;
};

/**
 * Presentational adaptation of React Bits Folder.
 * The product host owns interaction, focus, and accessible semantics.
 */
export function ReactBitsFolder({
  exposeContents = false,
  hasContents,
  open,
  size = 40,
  showContents,
}: ReactBitsFolderProps) {
  const style = {
    '--react-bits-folder-height': `${Math.round(size * 0.8)}px`,
    '--react-bits-folder-width': `${size}px`,
  } as CSSProperties;

  return (
    <span
      aria-hidden="true"
      className={styles.root}
      data-expose-contents={exposeContents && hasContents && open}
      data-open={open}
      data-show-contents={showContents}
      style={style}
    >
      <span className={styles.back}>
        {hasContents ? (
          <>
            <span className={`${styles.paper} ${styles.paperFirst}`} />
            <span className={`${styles.paper} ${styles.paperSecond}`} />
            <span className={`${styles.paper} ${styles.paperThird}`} />
          </>
        ) : null}
        <span className={styles.tab} />
        <span className={styles.front} />
        <span className={styles.frontRight} />
      </span>
    </span>
  );
}
