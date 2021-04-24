import {QueryClient, useQuery} from 'react-query'
import {dehydrate} from 'react-query/hydration'
import {graphqlRequest} from 'util/ReactQueryProvider'
import {Box, useMediaQuery, Center} from '@chakra-ui/react'
import Skeleton from 'components/Skeleton'
import {FixedSizeList as List} from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import Card from 'components/Card'

const getPosts = `
  query MyQuery @cached {
    posts(order_by: {created_at: desc}) {
      id
      post_items
      title
      subtitle
      created_at
      image
      is_public
    }
  }
`

export interface ItemType {
  title: string
  subtitle: string
  id?: number
  created_at?: any
  image?: string
}

interface PostsType {
  posts: any[]
}

export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery('posts', graphqlRequest(getPosts))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

const Index = () => {
  const {status, data, error, isFetching} = useQuery<PostsType | undefined>(
    'posts',
    graphqlRequest(getPosts),
  )

  const [sm, md, lg] = useMediaQuery([
    '(min-width: 0em)',
    '(min-width: 30em)',
    '(min-width: 80em)',
  ])

  let cardHeight = 200
  if (lg) {
    cardHeight = 500
  } else if (md) {
    cardHeight = 400
  } else if (sm) {
    cardHeight = 350
  }

  if (isFetching || !data || !(data?.posts.length > 0)) {
    return <Skeleton />
  }

  const posts = data?.posts

  const Row = ({index, style}: any) => {
    if (!posts || !posts[index]) return null
    const {title, subtitle, id, image, created_at} = posts[index]

    return (
      <Box sx={{...style}} key={id}>
        <Center h="100%">
          <Box w={['90%', '70%', '40%']} margin="0px auto">
            <Card
              title={title}
              subtitle={subtitle}
              key={id}
              createdAt={created_at}
              imageUrl={image ? image : undefined}
              linkUrl={`/posts/${id}`}
            />
          </Box>
        </Center>
      </Box>
    )
  }

  return (
    <Box h="100vh">
      <AutoSizer>
        {({height, width}) => (
          <List
            height={height}
            itemCount={posts.length}
            itemSize={cardHeight}
            width={width}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </Box>
  )
}

export default Index
