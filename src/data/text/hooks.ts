// SWR hooks for Teia Text feeds.

import useSWR from 'swr'
import { request } from 'graphql-request'
import { TEIA_MULTISIG_BLOG_TAG } from '@constants'
import { useModerators } from '@data/roles'
import { useMultisigAddresses } from '@data/swr'
import laggy from '@utils/swr-laggy-middleware'
import {
  TEXT_POSTS_QUERY,
  TEXT_POSTS_BY_ARTIST_QUERY,
  OFFICIAL_TEXT_POSTS_QUERY,
} from './queries'

const GRAPHQL_API = import.meta.env.VITE_TEIA_GRAPHQL_API

const FEED_OPTIONS = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  use: [laggy],
}

/** Community feed: the latest posts from anyone. */
export function useTextPosts(limit = 100) {
  return useSWR<any>(
    ['text-community'],
    () => request(GRAPHQL_API, TEXT_POSTS_QUERY, { limit }),
    FEED_OPTIONS
  )
}

/** One author's posts (profile Text tab, Your Posts). */
export function useTextPostsByArtist(address?: string) {
  return useSWR<any>(
    address ? ['text-posts-by-artist', address] : null,
    () => request(GRAPHQL_API, TEXT_POSTS_BY_ARTIST_QUERY, { address }),
    FEED_OPTIONS
  )
}

/** Bulletin feed: tagged posts from multisig members and moderators. */
export function useOfficialTextPosts(limit = 100) {
  const multisigAddresses: string[] = useMultisigAddresses()
  const { data: moderators } = useModerators()
  const addresses = [...new Set([...multisigAddresses, ...(moderators || [])])]
  return useSWR<any>(
    addresses.length > 0 ? ['text-official', addresses] : null,
    () =>
      request(GRAPHQL_API, OFFICIAL_TEXT_POSTS_QUERY, {
        addresses,
        tag: TEIA_MULTISIG_BLOG_TAG,
        limit,
      }),
    FEED_OPTIONS
  )
}
