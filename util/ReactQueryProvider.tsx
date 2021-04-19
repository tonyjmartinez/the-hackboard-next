import {useRef} from 'react'
import {useUser} from '@auth0/nextjs-auth0'
import {ReactNode, useEffect, useState} from 'react'
import {QueryClient, QueryClientProvider} from 'react-query'
import {Hydrate} from 'react-query/hydration'
import {gql, GraphQLClient} from 'graphql-request'

const endpoint = 'https://the-hackboard.herokuapp.com/v1/graphql'
export const client = new GraphQLClient(endpoint)

export const graphqlRequest = (query: string) => {
  return async () => {
    try {
      return await client.request(query)
    } catch (err) {
      console.error(err)
    }
  }
}

const defaultQueryFn = async ({queryKey}: {queryKey: any}) => {
  let data = null
  try {
    data = await client.request(
      gql`
        ${queryKey[0]}
      `,
      queryKey[1],
    )
  } catch (err) {
    console.log(err)
  }

  return data
}

export type NavProps = {
  children: ReactNode
  pageProps: any
}
const ReactQueryProvider = ({children, pageProps}: NavProps) => {
  const {user, error, isLoading} = useUser()
  const [accessToken, setAccessToken] = useState<string>('')

  const queryClientRef = useRef<QueryClient>()
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient()
    // queryClientRef.current = new QueryClient({
    //   defaultOptions: {
    //     queries: {
    //       queryFn: defaultQueryFn,
    //     },
    //   },
    // })
  }

  useEffect(() => {
    if (user) {
      const getToken = async () => {
        const res = await fetch('api/auth/graphql')
        const jsonToken = await res.json()
        setAccessToken(jsonToken.accessToken)
      }

      getToken()
    }
  }, [user])

  useEffect(() => {
    if (accessToken) {
      client.setHeader('authorization', `Bearer ${accessToken}`)
    }
  }, [accessToken])

  // if (isLoading) return <div>Loading?</div>
  if (error) return <div>{error.message}</div>

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>{children}</Hydrate>
    </QueryClientProvider>
  )
}

export default ReactQueryProvider
