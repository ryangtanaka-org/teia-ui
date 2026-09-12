import { Link } from 'react-router-dom'
import styles from './index.module.scss'

/**
 * Site-wide marker for the auctions prototype deploy (poll #56).
 *
 * This build is a pixel-identical copy of Teia pointed at MAINNET, shared with
 * people who arrive from a poll link. Without a permanent marker they have no
 * way to tell it apart from teia.art. Deliberately not dismissible — the whole
 * point is that it is still visible on whichever page they wander onto.
 */
export const PrototypeBanner = () => (
  <div className={styles.banner} role="note">
    <span className={styles.tag}>Prototype</span>
    <span className={styles.text}>
      Unofficial build for{' '}
      <Link to="/poll/56" className={styles.link}>
        poll #56
      </Link>
      . Auctions are mock-ups — no bid is real. Everything else is live mainnet:
      real wallets, real tez.
    </span>
  </div>
)

export default PrototypeBanner
