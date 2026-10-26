import styles from './Loading.module.css'

type Props = {
  message?: string
}

export const Loading = ({ message = 'Loading...' }: Props) => {
  return (
    <div className={styles.loading} role='status'>
      <span className={styles.spinner} aria-hidden />
      {message}
    </div>
  )
}
