import {useUser} from '@auth0/nextjs-auth0'
import {ReactNode, useEffect, useState} from 'react'
import {QueryClient, QueryClientProvider} from 'react-query'
import {gql, GraphQLClient} from 'graphql-request'

const endpoint = 'https://the-hackboard.herokuapp.com/v1/graphql'
export const client = new GraphQLClient(endpoint)

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
})

export type NavProps = {
  children: ReactNode
}
const Nav = ({children}: NavProps) => {
  const {user, error, isLoading} = useUser()
  const [accessToken, setAccessToken] = useState<string>('')

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

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default Nav
