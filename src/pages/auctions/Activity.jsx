import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Page } from '@atoms/layout'
import { Button } from '@atoms/button'
import { Checkbox } from '@atoms/input'
import { HashToURL } from '@utils'
import { useLocalSettings } from '@context/localSettingsStore'
import { NOTIFICATIONS, NOTIF_TYPES, timeAgo } from '@data/mock-auctions'
import styles from './index.module.scss'

function NotifRow({ notif }) {
  const cover = notif.display_uri
    ? HashToURL(notif.display_uri, 'CDN', { size: 'small' })
    : null

  return (
    <li>
      <Link
        to={`/objkt/${notif.token_id}`}
        className={`${styles.row} ${notif.unread ? '' : styles.read}`}
      >
        {notif.unread && <span className={styles.unreadDot} />}
        {cover ? (
          <img src={cover} alt="" className={styles.thumb} loading="lazy" />
        ) : (
          <div className={styles.thumbFallback}>#{notif.token_id}</div>
        )}
        <div className={styles.rowBody}>
          <span className={styles.rowTitle}>{notif.name}</span>
          <span className={styles.rowSub}>{notif.body}</span>
        </div>
        <span className={styles.rowTime}>{timeAgo(notif.at)}</span>
      </Link>
    </li>
  )
}

export default function AuctionActivity() {
  const [prefs, setPref] = useLocalSettings((st) => [
    st.auctionNotifications,
    st.setAuctionNotification,
  ])
  const [showPrefs, setShowPrefs] = useState(true)

  const enabled = NOTIF_TYPES.filter((t) => prefs[t.key]).map((t) => t.key)
  const visible = NOTIFICATIONS.filter((n) => enabled.includes(n.type))
  const muted = NOTIFICATIONS.length - visible.length

  return (
    <Page title="Auction activity">
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.headline}>Auction activity</h1>
          <Link to="/auctions" className={styles.headerLink}>
            Back to auctions
          </Link>
        </header>

        <p className={styles.prototypeNote}>
          <strong>Prototype.</strong> These are fixed sample events, not live
          data. The part worth testing is the switches — poll #56 commenters
          named objkt&apos;s bot-driven notification flood as the main reason to
          hesitate, so every category here can be turned off independently.
        </p>

        <section className={styles.prefs}>
          <button
            type="button"
            className={styles.prefsToggle}
            onClick={() => setShowPrefs((v) => !v)}
            aria-expanded={showPrefs}
          >
            Notify me about {showPrefs ? '−' : '+'}
          </button>

          {showPrefs && (
            <div className={styles.prefsList}>
              {NOTIF_TYPES.map((t) => (
                <div key={t.key} className={styles.prefRow}>
                  <Checkbox
                    checked={!!prefs[t.key]}
                    onCheck={(v) => setPref(t.key, v)}
                    alt={`click to ${
                      prefs[t.key] ? 'stop' : 'start'
                    } being notified: ${t.label}`}
                    label={t.label}
                  />
                  <span className={styles.prefHint}>
                    {t.hint}
                    {t.spammy && (
                      <span className={styles.prefFlag}> high volume</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {visible.length ? (
          <ul className={styles.list}>
            {visible.map((n) => (
              <NotifRow key={n.id} notif={n} />
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>
            Every category is switched off, so nothing is shown.
          </p>
        )}

        {muted > 0 && (
          <p className={styles.mutedNote}>
            {muted} {muted === 1 ? 'event is' : 'events are'} hidden by your
            settings above.
          </p>
        )}

        <div className={styles.footNote}>
          <Button small fit to="/poll/56">
            Weigh in on poll #56
          </Button>
        </div>
      </div>
    </Page>
  )
}
