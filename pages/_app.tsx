import {UserProvider} from '@auth0/nextjs-auth0'
import ReactQueryProvider from 'util/ReactQueryProvider'
import Nav from 'components/Nav'
import {ChakraProvider, Heading} from '@chakra-ui/react'
import theme from 'util/theme'
import {MDXProvider} from '@mdx-js/react'

const components = {
  h1: Heading,
}

const App = ({Component, pageProps}) => {
  return (
    <UserProvider>
      <ReactQueryProvider pageProps={pageProps}>
        <ChakraProvider theme={theme}>
          <MDXProvider components={components}>
            <Nav>
              <Component {...pageProps} />
            </Nav>
          </MDXProvider>
        </ChakraProvider>
      </ReactQueryProvider>
    </UserProvider>
  )
}

export default App
