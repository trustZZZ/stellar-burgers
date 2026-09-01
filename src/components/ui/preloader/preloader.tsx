import React from 'react';
import styles from './preloader.module.css';

export const Preloader = () => (
  <div data-testid='loader' className={styles.preloader}>
    <div className={styles.preloader_circle} />
  </div>
);
