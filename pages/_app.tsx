import {UserProvider} from '@auth0/nextjs-auth0'
import ReactQueryProvider from 'util/ReactQueryProvider'
import Nav from 'components/Nav'
import {ChakraProvider, Heading} from '@chakra-ui/react'
import theme from 'util/theme'
import {ColorProvider} from 'util/color-context'

const App = ({Component, pageProps}) => {
  return (
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
  )
}

export default App
