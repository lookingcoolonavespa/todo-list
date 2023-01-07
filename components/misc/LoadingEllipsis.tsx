import React from 'react';

import styles from '../../styles/LoadingEllipsis.module.css';

interface Props {
  size: string;
}

const LoadingEllipsis = ({ size }: Props) => {
  return (
    <div
      className={
        size
          ? `${styles['lds-ellipsis']} ${styles[size]}`
          : styles['lds-ellipsis']
      }
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingEllipsis;
