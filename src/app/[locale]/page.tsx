import DailyQuestion from '@/src/features/questions/components/DailyQuestion'
import styles from './page.module.scss'

export default function Home() {
  return (
    <div className={styles.container}>
      <DailyQuestion />
    </div>
  );
}