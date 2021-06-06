import {
  Flex,
  Heading,
  IconButton,
  Icon,
  Spacer,
  Box,
  Button,
  useColorMode,
  Center,
  useTheme,
  useColorModeValue,
  Tooltip,
  BoxProps,
  Portal,
} from '@chakra-ui/react'
import React, {ReactNode} from 'react'
import {FiSun, FiMoon, FiPlusCircle} from 'react-icons/fi'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useUser} from '@auth0/nextjs-auth0'
import {useColors} from 'util/color-context'

export interface NavProps extends BoxProps {
  children: ReactNode
}

const Nav = ({children, ...rest}: NavProps) => {
  const router = useRouter()
  const {colorMode, toggleColorMode} = useColorMode()
  const {user, error, isLoading} = useUser()
  const colors = useColors()
  const {gray} = colors

  const isLight = colorMode === 'light'

  return (
    <>
      <Portal>
        <Flex w="100%" pos="fixed" top={0} {...rest}>
          <Box bg={gray} opacity="0.8">
            <Heading size="md" p={3}>
              <Link href="/">The Hackboard</Link>
            </Heading>
          </Box>
        </Flex>
      </Portal>
      <Portal>
        <Flex w="100%" pos="fixed" bottom="0" {...rest}>
          <Spacer />
          <Box px={2} bg={gray} opacity="0.8" mr={6}>
            {user ? (
              <>
                <Tooltip label="New Post">
                  <span>
                    <IconButton
                      colorScheme="teal"
                      onClick={e => router.push('/new-post')}
                      aria-label="new post"
                      variant="solid"
                      icon={<FiPlusCircle size={30} />}
                    />
                  </span>
                </Tooltip>

                <Link
                  href={{
                    pathname: '/api/auth/logout',
                  }}
                >
                  <Button m={3} colorScheme="teal">
                    Logout
                  </Button>
                </Link>
              </>
            ) : (
              <Link
                href={{
                  pathname: '/api/auth/login',
                }}
              >
                <Button m={3} colorScheme="teal">
                  Login
                </Button>
              </Link>
            )}

            <IconButton
              onClick={toggleColorMode}
              colorScheme="teal"
              aria-label="Dark Mode toggle"
              mr={3}
              icon={isLight ? <FiMoon size={30} /> : <FiSun size={30} />}
            />
          </Box>
        </Flex>
      </Portal>
      {children}
    </>
  )
}

export default Nav
