/**
 * PROTOTYPE DATA — Teia poll #56 ("Should Teia incorporate the ability of
 * artists to have auctions on artworks?").
 *
 * Nothing here touches the chain. These are fixed fixtures so the community can
 * click through a working auction flow and react to it before anyone commits to
 * writing contracts. Every piece referenced below is a real Teia OBJKT under a
 * Creative Commons license.
 */

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const now = Date.now()

/** Teia's marketplace fee, shown on each lot — see poll comments on treasury fees. */
export const TEIA_FEE_PERCENT = 2.5

export const AUCTIONS = [
  {
    id: 'a1',
    token_id: '884625',
    name: 'Border',
    artist: 'abbasrahmani',
    display_uri: 'ipfs://QmW1a9cDPzfPLRVTWBCxRnKW5Hu257EqnwJzmznK6kg1W4',
    rights: 'cc-by-nc-4.0',
    reserve: 12,
    topBid: 24,
    topBidder: 'havin',
    bidCount: 7,
    endsAt: now + 2 * HOUR + 14 * MINUTE,
    youAreTopBidder: false,
    youBid: true,
  },
  {
    id: 'a2',
    token_id: '884596',
    name: 'White Cloud',
    artist: 'havin',
    display_uri: 'ipfs://QmPWQMpgRKf5NKMqsE8569V1AbHVsL69niPFSrTPpgXLHV',
    rights: 'cc-by-nc-4.0',
    reserve: 8,
    topBid: 8,
    topBidder: null,
    bidCount: 0,
    endsAt: now + 19 * HOUR,
    youAreTopBidder: false,
    youBid: false,
  },
  {
    id: 'a3',
    token_id: '884588',
    name: 'Residual Heat',
    artist: 'notsopeculiar',
    display_uri: 'ipfs://QmaH1XAZNXGvHJWSraGj3HhLmFwV8MrFe3KmWgG9enWon3',
    rights: 'cc-by-4.0',
    reserve: 30,
    topBid: 61,
    topBidder: 'you',
    bidCount: 12,
    endsAt: now + 41 * MINUTE,
    youAreTopBidder: true,
    youBid: true,
  },
  {
    id: 'a4',
    token_id: '884470',
    name: 'Lmao',
    artist: 'ffmec.tez',
    display_uri: 'ipfs://QmaVDTn5e9vdkrXGfTB39skmxhndv57naUYjvdxmx3FVPm',
    rights: 'cc-by-4.0',
    reserve: 5,
    topBid: 9.5,
    topBidder: 'shitlab',
    bidCount: 3,
    endsAt: now + 3 * DAY,
    youAreTopBidder: false,
    youBid: false,
  },
  {
    id: 'a5',
    token_id: '884391',
    name: 'Haze and Senseless Act',
    artist: 'rangga_purnama_aji',
    display_uri: 'ipfs://QmV6VA57EtKDfkKV1SbyurYCh4GxMnwfNd1k7NxpkQDyU2',
    rights: 'cc-by-4.0',
    reserve: 20,
    topBid: 20,
    topBidder: null,
    bidCount: 0,
    endsAt: now + 5 * DAY,
    youAreTopBidder: false,
    youBid: false,
  },
  {
    id: 'a6',
    token_id: '884382',
    name: 'fiesta moskona',
    artist: 'shitlab',
    display_uri: 'ipfs://QmcP9jJiqWKPxGM8g4CrLJqFg4wUi2VJe2CNNTBFYSRqXL',
    rights: 'cc-by-sa-4.0',
    reserve: 15,
    topBid: 44,
    topBidder: 'abbasrahmani',
    bidCount: 21,
    endsAt: now - 3 * HOUR,
    settled: true,
    youAreTopBidder: false,
    youBid: true,
  },
]

/**
 * The notification categories. `spammy` marks the firehose channel that poll
 * commenters singled out as the reason objkt's notifications are unusable —
 * it ships off by default.
 */
export const NOTIF_TYPES = [
  {
    key: 'outbid',
    label: 'You were outbid',
    hint: 'Someone placed a higher bid than yours.',
    spammy: false,
  },
  {
    key: 'ending',
    label: 'Auction ending soon',
    hint: 'A lot you bid on is about to close.',
    spammy: false,
  },
  {
    key: 'bidOnYours',
    label: 'New bid on your auction',
    hint: "Someone bid on a piece you're selling.",
    spammy: false,
  },
  {
    key: 'settled',
    label: 'Auction settled',
    hint: 'A lot you bought or sold has closed.',
    spammy: false,
  },
  {
    key: 'newAuction',
    label: 'New auction from anyone',
    hint: 'Every new lot on Teia. This is the firehose — off by default.',
    spammy: true,
  },
]

export const NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'outbid',
    token_id: '884625',
    name: 'Border',
    display_uri: 'ipfs://QmW1a9cDPzfPLRVTWBCxRnKW5Hu257EqnwJzmznK6kg1W4',
    body: 'havin outbid you at 24 ꜩ',
    at: now - 11 * MINUTE,
    unread: true,
  },
  {
    id: 'n2',
    type: 'ending',
    token_id: '884588',
    name: 'Residual Heat',
    display_uri: 'ipfs://QmaH1XAZNXGvHJWSraGj3HhLmFwV8MrFe3KmWgG9enWon3',
    body: 'Ends in 41 minutes — you hold the top bid',
    at: now - 34 * MINUTE,
    unread: true,
  },
  {
    id: 'n3',
    type: 'bidOnYours',
    token_id: '884470',
    name: 'Lmao',
    display_uri: 'ipfs://QmaVDTn5e9vdkrXGfTB39skmxhndv57naUYjvdxmx3FVPm',
    body: 'shitlab bid 9.5 ꜩ on your auction',
    at: now - 2 * HOUR,
    unread: true,
  },
  {
    id: 'n4',
    type: 'newAuction',
    token_id: '884391',
    name: 'Haze and Senseless Act',
    display_uri: 'ipfs://QmV6VA57EtKDfkKV1SbyurYCh4GxMnwfNd1k7NxpkQDyU2',
    body: 'rangga_purnama_aji opened an auction',
    at: now - 3 * HOUR,
    unread: false,
  },
  {
    id: 'n5',
    type: 'settled',
    token_id: '884382',
    name: 'fiesta moskona',
    display_uri: 'ipfs://QmcP9jJiqWKPxGM8g4CrLJqFg4wUi2VJe2CNNTBFYSRqXL',
    body: 'Sold to abbasrahmani for 44 ꜩ',
    at: now - 3 * HOUR,
    unread: false,
  },
  {
    id: 'n6',
    type: 'newAuction',
    token_id: '884596',
    name: 'White Cloud',
    display_uri: 'ipfs://QmPWQMpgRKf5NKMqsE8569V1AbHVsL69niPFSrTPpgXLHV',
    body: 'havin opened an auction',
    at: now - 6 * HOUR,
    unread: false,
  },
  {
    id: 'n7',
    type: 'newAuction',
    token_id: '884470',
    name: 'Lmao',
    display_uri: 'ipfs://QmaVDTn5e9vdkrXGfTB39skmxhndv57naUYjvdxmx3FVPm',
    body: 'ffmec.tez opened an auction',
    at: now - 9 * HOUR,
    unread: false,
  },
  {
    id: 'n8',
    type: 'outbid',
    token_id: '884382',
    name: 'fiesta moskona',
    display_uri: 'ipfs://QmcP9jJiqWKPxGM8g4CrLJqFg4wUi2VJe2CNNTBFYSRqXL',
    body: 'abbasrahmani outbid you at 44 ꜩ',
    at: now - 1 * DAY,
    unread: false,
  },
]

/** "2h 14m", "41m", "ended" — plain, no ticking drama. */
export function timeLeft(endsAt) {
  const ms = endsAt - Date.now()
  if (ms <= 0) return 'ended'
  const d = Math.floor(ms / DAY)
  const h = Math.floor((ms % DAY) / HOUR)
  const m = Math.floor((ms % HOUR) / MINUTE)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

/** "11 minutes ago" in the shortest form that still reads. */
export function timeAgo(at) {
  const ms = Date.now() - at
  const m = Math.floor(ms / MINUTE)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(ms / HOUR)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(ms / DAY)}d ago`
}
