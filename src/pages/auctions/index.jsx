import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Page } from '@atoms/layout'
import { Button } from '@atoms/button'
import { HashToURL } from '@utils'
import { AUCTIONS, TEIA_FEE_PERCENT, timeLeft } from '@data/mock-auctions'
import styles from './index.module.scss'

const FILTERS = [
  { key: 'live', label: 'Live' },
  { key: 'mine', label: 'Bids you placed' },
  { key: 'ended', label: 'Ended' },
]

function Lot({ auction, onBid }) {
  const cover = auction.display_uri
    ? HashToURL(auction.display_uri, 'CDN', { size: 'small' })
    : null
  const remaining = timeLeft(auction.endsAt)
  const ended = remaining === 'ended'

  return (
    <li className={styles.lot}>
      <Link to={`/objkt/${auction.token_id}`} className={styles.lotCover}>
        {cover ? (
          <img src={cover} alt={auction.name} loading="lazy" />
        ) : (
          <span className={styles.coverFallback}>#{auction.token_id}</span>
        )}
      </Link>

      <div className={styles.lotBody}>
        <div className={styles.lotHead}>
          <Link to={`/objkt/${auction.token_id}`} className={styles.lotName}>
            {auction.name}
          </Link>
          <span className={styles.lotArtist}>{auction.artist}</span>
        </div>

        <dl className={styles.lotStats}>
          <div>
            <dt>{auction.bidCount ? 'Top bid' : 'Reserve'}</dt>
            <dd className={styles.price}>
              {auction.bidCount ? auction.topBid : auction.reserve} ꜩ
            </dd>
          </div>
          <div>
            <dt>Bids</dt>
            <dd>{auction.bidCount}</dd>
          </div>
          <div>
            <dt>{ended ? 'Closed' : 'Ends in'}</dt>
            <dd className={ended ? '' : styles.remaining}>{remaining}</dd>
          </div>
        </dl>

        <div className={styles.lotFoot}>
          <span className={styles.license}>{auction.rights}</span>
          {auction.youAreTopBidder && !ended && (
            <span className={styles.tagTop}>You hold the top bid</span>
          )}
          {auction.youBid && !auction.youAreTopBidder && !ended && (
            <span className={styles.tagOutbid}>Outbid</span>
          )}
          {ended && auction.settled && (
            <span className={styles.tagSettled}>
              Settled — {auction.topBid} ꜩ to {auction.artist}
            </span>
          )}
        </div>
      </div>

      <div className={styles.lotAction}>
        {ended ? (
          <span className={styles.endedNote}>Auction closed</span>
        ) : (
          <>
            <Button small fit onClick={() => onBid(auction)}>
              Place bid
            </Button>
            <span className={styles.feeNote}>
              {TEIA_FEE_PERCENT}% fee to the Teia treasury
            </span>
          </>
        )}
      </div>
    </li>
  )
}

export default function Auctions() {
  const [filter, setFilter] = useState('live')
  const [bidding, setBidding] = useState(null)

  const lots = AUCTIONS.filter((a) => {
    const ended = timeLeft(a.endsAt) === 'ended'
    if (filter === 'live') return !ended
    if (filter === 'ended') return ended
    return a.youBid
  })

  return (
    <Page title="Auctions">
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.headline}>Auctions</h1>
          <Link to="/auctions/activity" className={styles.headerLink}>
            Auction activity
          </Link>
        </header>

        <p className={styles.prototypeNote}>
          <strong>Prototype.</strong> Nothing here touches the chain — no bid is
          real and no tez moves. It exists so the community can try an auction
          flow before deciding on{' '}
          <Link to="/poll/56" className={styles.inlineLink}>
            poll #56
          </Link>
          . Feedback on the poll thread is the point.
        </p>

        <nav className={styles.filters} aria-label="Filter auctions">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              className={`${styles.chip} ${
                filter === f.key ? styles.chip_active : ''
              }`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </nav>

        {lots.length ? (
          <ul className={styles.lots}>
            {lots.map((a) => (
              <Lot key={a.id} auction={a} onBid={setBidding} />
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Nothing here yet.</p>
        )}

        {bidding && (
          <div
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-label={`Place a bid on ${bidding.name}`}
          >
            <div className={styles.sheetInner}>
              <h2 className={styles.sheetTitle}>Place a bid</h2>
              <p className={styles.sheetBody}>
                <strong>{bidding.name}</strong> by {bidding.artist}. The current{' '}
                {bidding.bidCount ? 'top bid' : 'reserve'} is{' '}
                {bidding.bidCount ? bidding.topBid : bidding.reserve} ꜩ.
              </p>
              <p className={styles.sheetWarn}>
                This prototype stops here. A real bid would sign a Tezos
                transaction — that contract does not exist yet, and building it
                is exactly what poll #56 is deciding.
              </p>
              <div className={styles.sheetActions}>
                <Button small fit onClick={() => setBidding(null)}>
                  Close
                </Button>
                <Link to="/poll/56" className={styles.inlineLink}>
                  Weigh in on poll #56
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Page>
  )
}
