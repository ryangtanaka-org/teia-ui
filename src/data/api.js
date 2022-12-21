import { HEN_CONTRACT_FA2 } from '@constants'
const axios = require('axios')

export const BaseTokenFieldsFragment = `
fragment baseTokenFields on tokens {
  fa2_address
  token_id
  name
  description
  editions
  minted_at
  thumbnail_uri
  display_uri
  artifact_uri
  metadata_uri
  artist_address
  artist_profile {
    name
    is_split
  }
  teia_meta {
    accessibility
    content_rating
    is_signed
    preview_uri
  }
  royalties
  mime_type
  price
  royalty_receivers {
    receiver_address
    royalties
  }
}
`

export async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(process.env.REACT_APP_TEIA_GRAPHQL_API, {
    method: 'POST',
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  })

  return await result.json()
}

export const getCollabsForAddress = `query GetCollabs($address: String!) {
  split_contracts: teia_split_contracts(where: {_or: [{administrator_address: {_eq: $address}}, {shareholders: {shareholder_address: {_eq: $address}}}]}) {
    contract_address
    contract_profile {
      name
      metadata {
        data
      }
    }
    administrator_address
    shareholders {
      shareholder_address
      shareholder_profile {
        name
      }
      shares
      holder_type
    }
  }
}`

export const getNameForAddress = `query GetNameForAddress($address: String!) {
  teia_users(where: {user_address: {_eq: $address}}) {
    name
  }
}`

// TODO: add all supported event types
const query_objkt = `
${BaseTokenFieldsFragment}
query objkt($id: String!) {
  tokens_by_pk(fa2_address: "${HEN_CONTRACT_FA2}", token_id: $id) {
    ...baseTokenFields
    artist_profile {
      name
      is_split
      split_contract {
        administrator_address
        shareholders {
          shareholder_address
          shareholder_profile {
            user_address
            name
          }
          holder_type
          shares
        }
      }
    }
    signatures {
      shareholder_address
    }
    rights
    right_uri
    listings(where: {status: {_eq: "active"}}, order_by: {price: asc}) {
      type
      contract_address
      amount
      amount_left
      swap_id
      ask_id
      offer_id
      price
      start_price
      end_price
      seller_address
      seller_profile {
        name
      }
      status
    }
    holdings(where: {amount: {_gt: "0"}}) {
      holder_address
      amount
      holder_profile {
        name
      }
    }
    tags {
      tag
    }
    events(where: { _or: [{ implements: {_eq: "SALE"} }, { type: {_in: ["HEN_MINT", "TEIA_SWAP", "HEN_SWAP", "HEN_SWAP_V2", "VERSUM_SWAP", "FA2_TRANSFER"]} }]}, order_by: [{level: desc}, {opid: desc}]) {
      timestamp
      implements
      ophash
      id
      type
      price
      amount
      editions
      seller_address
      seller_profile {
        name
      }
      buyer_address
      buyer_profile {
        name
      }
      from_address
      from_profile {
        name
      }
      to_address
      to_profile {
        name
      }
    }
  }
}
`

export async function getUser(addressOrName, type = 'user_address') {
  const { data } = await fetchGraphQL(
    `
  query addressQuery($addressOrName: String!) {
    teia_users(where: { ${type}: {_eq: $addressOrName}}) {
      user_address
      name
      metadata {
        data
      }
    }
  }
  `,
    'addressQuery',
    {
      addressOrName,
    }
  )

  return data && data.teia_users && data.teia_users.length
    ? data.teia_users[0]
    : null
}

export async function fetchCollabCreations(addressOrSubjkt, type = 'address') {
  const { data } = await fetchGraphQL(
    `
    ${BaseTokenFieldsFragment}
    query GetCollabCreations($addressOrSubjkt: String!) {
      tokens(where: {${
        type === 'address'
          ? `artist_address: {_eq: $addressOrSubjkt}`
          : `artist_profile: {name: {_eq: $addressOrSubjkt }}`
      }, editions: {_gt: "0"}}, order_by: {token_id: desc}) {
        ...baseTokenFields
        tags {
          tag
        }
      }
      split_contracts: teia_split_contracts(where: {${
        type === 'address'
          ? `contract_address: {_eq: $addressOrSubjkt}`
          : `contract_profile: {name: {_eq: $addressOrSubjkt}}`
      }}) {
        administrator_address
        shareholders {
          shareholder_address
          shareholder_profile {
            name
          }
          holder_type
        }
        contract_address
        contract_profile {
          name
          metadata {
            data
          }
        }
      }
    }`,
    'GetCollabCreations',
    { addressOrSubjkt }
  )

  return data
}

export async function fetchObjktDetails(id) {
  const { data } = await fetchGraphQL(query_objkt, 'objkt', {
    id,
  })
  return data.tokens_by_pk
}

/**
 * Get User claims from their tzprofile
 */
const GetUserClaims = async (walletAddr) => {
  return await axios.post(process.env.REACT_APP_TZPROFILES_GRAPHQL_API, {
    query: `query MyQuery { tzprofiles_by_pk(account: "${walletAddr}") { valid_claims } }`,
    variables: null,
    operationName: 'MyQuery',
  })
}

/**
 * Get User Metadata
 */
export const GetUserMetadata = async (walletAddr) => {
  const tzktData = {}

  const tzpData = {}
  try {
    const claims = await GetUserClaims(walletAddr)
    if (claims.data.data.tzprofiles_by_pk !== null)
      for (const claim of claims.data.data.tzprofiles_by_pk.valid_claims) {
        const claimJSON = JSON.parse(claim[1])
        if (claimJSON.type.includes('TwitterVerification')) {
          if (!tzktData.data || !tzktData.data.twitter) {
            tzpData.twitter = claimJSON.evidence.handle
          }
        } else if (claimJSON.type.includes('BasicProfile')) {
          if (claimJSON.credentialSubject.alias !== '' && !tzktData.data?.alias)
            tzpData.alias = claimJSON.credentialSubject.alias
          tzpData.tzprofile = walletAddr
        } else if (claimJSON.type.includes('DiscordVerification')) {
          if (!tzktData.data) {
            tzpData.discord = claimJSON.evidence.handle
          }
        } else if (claimJSON.type.includes('GitHubVerification')) {
          if (!tzktData.data) {
            tzpData.github = claimJSON.evidence.handle
          }
        } else if (
          claimJSON.type.includes('DnsVerification') &&
          !tzktData.data
        ) {
          tzpData.dns = claimJSON.credentialSubject.sameAs.slice(4)
        }
      }
  } catch (e) {
    console.error(e, e.stack)
  }

  if (tzpData) {
    tzktData.data = tzpData
  }
  return tzktData
}
