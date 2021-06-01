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
import {mdxFiles} from './posts/[slug]'
import R from 'ramda'

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
  const promises = files.map(async file => {
    const fileRes = await readFile(path.join('mdx/', file))
    const result = await bundleMDX(fileRes.toString().trim(), mdxFiles)
    const {frontmatter} = result
    const {publishedAt, modifiedAt} = frontmatter
    frontmatter.publishedAt = JSON.parse(JSON.stringify(publishedAt))
    frontmatter.modifiedAt = JSON.parse(JSON.stringify(modifiedAt))

    return {file, ...frontmatter}
  })

  const result = await Promise.all([...promises])
  const publishedDesc = (a, b) => b.publishedAt - a.publishedAt
  const sorted = R.sort(publishedDesc, result)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      localPosts: sorted,
    },
  }
}

export interface IndexProps {
  localPosts: any[]
}
const Index = ({localPosts}) => {
  // const {status, data, error, isFetching} = useQuery<PostsType | undefined>(
  //   'posts',
  //   graphqlRequest(getPosts),
  // )

  // const posts = data?.posts

  const [sm, md, lg] = useMediaQuery([
    '(min-width: 0em)',
    '(min-width: 30em)',
    '(min-width: 80em)',
  ])

  const parentRef = useRef()

  const rowVirtualizer = useVirtual({
    size: localPosts.length,
    parentRef,
    estimateSize: useCallback(() => 350, []),
  })

  // if (isFetching || !data || !(data?.posts.length > 0)) {
  //   return <Skeleton />
  // }

  const Row = ({index}: any) => {
    if (!localPosts || !localPosts[index]) return null
    const {title, description, publishedAt, slug} = localPosts[index]

    return (
      <Box key={slug}>
        <Center h="100%">
          <Box w={['90%', '50%', '25%']} margin="0px auto">
            <Card
              title={title}
              subtitle={description}
              createdAt={publishedAt}
              // imageUrl={image ? image : undefined}
              // linkUrl={`/posts/${id}`}
              linkUrl={`/posts/${slug}`}
            />
          </Box>
        </Center>
      </Box>
    )
  }

  return (
    <Box
      ref={parentRef}
      h={`${rowVirtualizer.totalSize}px`}
      width="100%"
      position="relative"
      mt={10}
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
