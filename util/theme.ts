import {extendTheme, ThemeConfig} from '@chakra-ui/react'

const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
}

export interface ColorsType {
  gray?: 'gray.600' | 'gray.200'
  teal?: 'teal.400'
}

const colorValues: ColorsType = {
  teal: 'teal.400',
}

const {teal} = colorValues
export interface ColorModeType {
  dark: ColorsType
  light: ColorsType
}
// used in color-context.ts for custom light/dark colors

export const colors: ColorModeType = {
  dark: {
    gray: 'gray.600',
    teal,
  },
  light: {
    gray: 'gray.200',
    teal,
  },
}

const theme = extendTheme({
  config,
})

export default theme
