import Link from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <Link key="header" href="/">
        <img src="assets/logos/logo.svg" alt="logo" />
      </Link>
    </header>
  );
}
