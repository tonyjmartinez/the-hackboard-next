import {createContext, useState, useContext} from 'react'
import {colors} from './theme'
import {useColorMode} from '@chakra-ui/react'
import {ColorsType} from './theme'

const {light, dark} = colors
const ColorContext = createContext({} as ColorsType)

const ColorProvider = ({children}) => {
  const {colorMode} = useColorMode()
  const colors = colorMode === 'dark' ? dark : light

  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  return (
    <ColorContext.Provider value={colors}>{children}</ColorContext.Provider>
  )
}

const useColors = () => {
  const context = useContext(ColorContext)
  if (context === undefined) {
    throw new Error('useColors values must be used within a ColorProvider')
  }
  return context
}

export {ColorProvider, useColors}
