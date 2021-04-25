import {useQuery} from 'react-query'
import {graphqlRequest} from 'util/ReactQueryProvider'
import {ItemTypes} from '../util/enums'
import {Text, AspectRatio} from '@chakra-ui/react'
import Skeleton from './Skeleton'
import Interweave from 'interweave'
import Image from 'next/image'

export const getItem = `
  query MyQuery($id: Int) {
    items(where: {id: {_eq: $id}}) {
      id
      type
      value
    }
  }
`

export type PostContentProps = {
  itemId: number
}

export interface PostContentType {
  items: any[]
}
const PostContent = ({itemId}: PostContentProps) => {
  const {data, isFetching} = useQuery<PostContentType | undefined>(
    'post-content',
    graphqlRequest(getItem, {id: itemId}),
  )

  if (isFetching || !data) {
    return <Skeleton />
  }
  const {type, value} = data?.items[0]
  console.log('items?', data)

  // return <div>{result.data?.items[0].value}</div>;
  switch (type) {
    case ItemTypes.Text:
      return <Text whiteSpace="pre-line">{value}</Text>
    case ItemTypes.Image:
      return (
        <AspectRatio ratio={16 / 9} w={['80%', '80%', '60%']}>
          <Image src={value} layout="fill" objectFit="cover" />
        </AspectRatio>
      )
    case ItemTypes.Markdown:
      return <Interweave content={value} />

    default:
      return <Text>Oops</Text>
  }
}

export default PostContent
