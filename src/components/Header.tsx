import { useNavigate } from 'react-router-dom'
import styles from '../styles/Header.module.css'

const Header = () => {

    const navigate = useNavigate()
    
    const onMainClick = () => {
        navigate('/')
    }
    const onHistoryClick = () => {
        navigate('/history')
    }

  return (
    <div className={styles.Header}>
        <div className={styles.mainLink} onClick={onMainClick}>მთავარი</div>
        <div className={styles.historyLink} onClick={onHistoryClick}>ისტორია</div>
    </div>
  )
}

export default Header