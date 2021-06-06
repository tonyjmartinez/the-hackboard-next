import {extendTheme, ThemeConfig} from '@chakra-ui/react'

const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
}

export interface ColorsType {
  gray: 'gray.600' | 'gray.200'
}
export interface ColorModeType {
  dark: ColorsType
  light: ColorsType
}
// used in color-context.ts for custom light/dark colors
export const colors: ColorModeType = {
  dark: {
    gray: 'gray.600',
  },
  light: {
    gray: 'gray.200',
  },
}

const theme = extendTheme({
  config,
})

export default theme
