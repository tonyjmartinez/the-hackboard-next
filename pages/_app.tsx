import {UserProvider} from '@auth0/nextjs-auth0'
import ReactQueryProvider from 'util/ReactQueryProvider'
import Nav from 'components/Nav'
import {ChakraProvider, Heading} from '@chakra-ui/react'
import Head from 'next/head'
import theme from 'util/theme'
import {ColorProvider} from 'util/color-context'

const App = ({Component, pageProps}) => {
  return (
    <>
      <Head>
        <title>The Hackboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="The Hackboard - An MDX Blog" />
      </Head>
      <UserProvider>
        <ReactQueryProvider pageProps={pageProps}>
          <ChakraProvider theme={theme}>
            <ColorProvider>
              <Nav>
                <Component {...pageProps} />
              </Nav>
            </ColorProvider>
          </ChakraProvider>
        </ReactQueryProvider>
      </UserProvider>
    </>
  )
}

export default App
