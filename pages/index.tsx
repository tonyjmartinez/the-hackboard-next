import {QueryClient, useQuery} from 'react-query'
import {dehydrate} from 'react-query/hydration'
import {graphqlRequest} from 'util/ReactQueryProvider'
import {Box, useMediaQuery, Center} from '@chakra-ui/react'
import Skeleton from 'components/Skeleton'
import Card from 'components/Card'
import PostCard from 'components/PostCard'
import React, {useRef, useCallback} from 'react'
import {useVirtual} from 'react-virtual'
import fs from 'fs'
import path from 'path'
import {bundleMDX} from 'mdx-bundler'
import {mdxFiles} from './posts/[slug]'
import R from 'ramda'
import {useColors} from 'util/color-context'

const {readdir, readFile} = fs.promises

const getPosts = `
  query MyQuery @cached {
    posts(order_by: {created_at: desc}) {
      id
      post_items
      title
      subtitle
      published_at
      image
      is_public
    }
  }
`

export interface ItemType {
  title: string
  subtitle: string
  id?: number
  published_at?: any
  image?: string
}

interface PostsType {
  posts: any[]
}

export async function getStaticProps() {
  // const queryClient = new QueryClient()

  // await queryClient.prefetchQuery('posts', graphqlRequest(getPosts))
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
      // dehydratedState: dehydrate(queryClient),
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
    '(min-width: 30em)',
    '(min-width: 48em)',
    '(min-width: 62em)',
  ])

  const parentRef = useRef()

  let rowSize = 400
  if (lg) {
    rowSize = 475
  } else if (md) {
    rowSize = 475
  } else if (sm) {
    rowSize = 450
  }
  console.log('sm', sm, 'md', md, 'lg', lg)

  const rowVirtualizer = useVirtual({
    size: localPosts.length,
    parentRef,
    estimateSize: useCallback(() => rowSize, [rowSize]),
  })

  const Row = ({index}: any) => {
    if (!localPosts || !localPosts[index]) return null
    const {title, description, publishedAt, slug, image} = localPosts[index]

    return (
      <Center h="100%" key={slug}>
        <PostCard
          image={image ?? null}
          title={title}
          description={description}
          publishedAt={publishedAt}
          slug={slug}
        />
      </Center>
    )
  }

  return (
    <Center w="100%">
      <Box maxW="1100px" w="100%" mx={3}>
        <Box
          ref={parentRef}
          h={`${rowVirtualizer.totalSize}px`}
          width="100%"
          position="relative"
          mt={20}
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
        </Box>
      </Box>
    </Center>
  )
}

export default Index
