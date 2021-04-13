import {
  Flex,
  Heading,
  IconButton,
  Spacer,
  Box,
  Button,
  useColorMode,
  Center,
  useTheme,
  useColorModeValue,
  Tooltip,
  BoxProps,
} from '@chakra-ui/react'
import React from 'react'
import {FiSun, FiMoon, FiPlusCircle} from 'react-icons/fi'
import Link from 'next/link'
import {useUser} from '@auth0/nextjs-auth0'

const Nav = ({...rest}: BoxProps) => {
  const {colorMode, toggleColorMode} = useColorMode()
  const {user, error, isLoading} = useUser()

  const isLight = colorMode === 'light'

  const theme = useTheme()

  const buttonIconColor = useColorModeValue('cyan', 'teal')
  const iconColor = useColorModeValue('white', theme.colors.blue[800])

  return (
    <>
      <Flex w="100%" pos="fixed" {...rest}>
        <Box bg="gray.600" opacity="0.8">
          <Heading size="md" p={3} color="white">
            <Link href="/">The Hackboard</Link>
          </Heading>
        </Box>
      </Flex>
      <Flex w="100%" pos="fixed" bottom="0" {...rest}>
        <Spacer />
        <Box px={2} bg="gray.600" opacity="0.8" mr={6}>
          {user ? (
            <>
              <Link href="/new">
                <Tooltip label="New Post">
                  <IconButton
                    colorScheme={buttonIconColor}
                    aria-label="new post"
                    variant="solid"
                    icon={<FiPlusCircle size={30} color={iconColor} />}
                  />
                </Tooltip>
              </Link>

              <Link href="api/auth/logout">
                <Button m={3} colorScheme="teal">
                  Logout
                </Button>
              </Link>
            </>
          ) : (
            <Link href="api/auth/login">
              <Button m={3} colorScheme="teal">
                Login
              </Button>
            </Link>
          )}

          <IconButton
            onClick={toggleColorMode}
            colorScheme={buttonIconColor}
            aria-label="Dark Mode toggle"
            mr={3}
            icon={
              isLight ? (
                <FiMoon size={30} color={iconColor} />
              ) : (
                <FiSun size={30} color={iconColor} />
              )
            }
          />
        </Box>
      </Flex>
    </>
  )
}

export default Nav
