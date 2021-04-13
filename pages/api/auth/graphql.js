// pages/api/products.js
import {getAccessToken, withApiAuthRequired} from '@auth0/nextjs-auth0'

export default withApiAuthRequired(async function products(req, res) {
  // If your Access Token is expired and you have a Refresh Token
  // `getAccessToken` will fetch you a new one using the `refresh_token` grant
  const {accessToken} = await getAccessToken(req, res)

  // const response = await fetch('https://api.example.com/products', {
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //   },
  // })
  // const products = await response.json()
  res.status(200).json({accessToken})
})
