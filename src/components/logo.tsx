import Image from 'next/image';
import styles from './logo.module.scss';

export default function Logo() {
  return (
    <div className={styles.logo}>
      <Image
        src="/logo-light.svg"
        alt="Logo"
        width={40}
        height={40}
        className={styles.light}
      />

      <Image
        src="/logo-dark.svg"
        alt="Logo"
        width={40}
        height={40}
        className={styles.dark}
      />
    </div>
  );
}