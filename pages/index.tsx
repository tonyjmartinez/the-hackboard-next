import {QueryClient, useQuery} from 'react-query'
import {dehydrate} from 'react-query/hydration'
import {graphqlRequest} from 'util/ReactQueryProvider'
import {Box, useMediaQuery, Center} from '@chakra-ui/react'
import Skeleton from 'components/Skeleton'
import Card from 'components/Card'
import React, {useRef, useCallback} from 'react'
import {useVirtual} from 'react-virtual'
import fs from 'fs'
import path from 'path'
import {bundleMDX} from 'mdx-bundler'

const {readdir, readFile} = fs.promises

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
  // const files = await readdir(path.join(__dirname, '/posts/'))
  const files = await readdir('mdx/')
  console.log('files', files)
  const promises = files.map(async file => {
    const fileRes = await readFile(path.join('mdx/', file))
    const result = await bundleMDX(fileRes.toString().trim())
    console.log('result', result.frontmatter)

    return [{file, content: fileRes.toString().trim()}]
  })

  const result = await Promise.all([...promises])
  console.log('result', result)

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

  const posts = data?.posts

  const [sm, md, lg] = useMediaQuery([
    '(min-width: 0em)',
    '(min-width: 30em)',
    '(min-width: 80em)',
  ])

  const parentRef = useRef()

  console.log('length?', posts.length)
  const rowVirtualizer = useVirtual({
    size: posts.length,
    parentRef,
    estimateSize: useCallback(() => 350, []),
  })

  if (isFetching || !data || !(data?.posts.length > 0)) {
    return <Skeleton />
  }

  const Row = ({index, style}: any) => {
    if (!posts || !posts[index]) return null
    const {title, subtitle, id, image, created_at} = posts[index]
    console.log(posts[index])

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

  console.log('items', rowVirtualizer.virtualItems)
  return (
    <Box
      ref={parentRef}
      h={`${rowVirtualizer.totalSize}px`}
      width="100%"
      position="relative"
    >
      {rowVirtualizer.virtualItems.map(virtualRow => (
        <Box
          key={virtualRow.index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${virtualRow.size}px`,
            transform: `translateY(${virtualRow.start}px)`,
          }}
        >
          <Row index={virtualRow.index} />
        </Box>
      ))}
      {/* <AutoSizer>
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
      </AutoSizer> */}
    </Box>
  )
}

export default Index
