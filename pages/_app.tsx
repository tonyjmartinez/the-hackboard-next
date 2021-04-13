import {UserProvider, useUser} from '@auth0/nextjs-auth0'
import {getSession} from '@auth0/nextjs-auth0'
import {useEffect, useState} from 'react'
import ReactQueryProvider from 'util/ReactQueryProvider'
import Nav from 'components/Nav'
import {ChakraProvider} from '@chakra-ui/react'
import theme from 'util/theme'

const App = ({Component, pageProps}) => {
  return (
    <UserProvider>
      <ReactQueryProvider>
        <ChakraProvider theme={theme}>
          <Nav>
            <Component {...pageProps} />
          </Nav>
        </ChakraProvider>
      </ReactQueryProvider>
    </UserProvider>
  )
}

export default App
