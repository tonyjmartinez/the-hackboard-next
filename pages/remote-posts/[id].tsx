import {useMemo} from 'react'
import {QueryClient, useQuery} from 'react-query'
import {useRouter} from 'next/router'
import {dehydrate} from 'react-query/hydration'
import {graphqlRequest} from 'util/ReactQueryProvider'
import React from 'react'
import {AspectRatio, Box, Center, Heading, VStack} from '@chakra-ui/react'
import PostContent from 'components/PostContent'
import Image from 'next/image'
// import {serialize} from 'next-mdx-remote/serialize'
// import {MDXRemote} from 'next-mdx-remote'
import {bundleMDX} from 'mdx-bundler'
import {getMDXComponent} from 'mdx-bundler/client'
import produce from 'immer'

const getPostIds = `
  query MyQuery {
    posts {
      id
    }
  }
`
const getPost = `
  query MyQuery($id: Int) {
    posts(where: {id: {_eq: $id}}) {
      id
      post_items
      published_at
      description
      title
      image
    }
  }
`

const getPostMdx = `
  query MyQuery($id: Int) {
    posts(where: {id: {_eq: $id}}) {
      mdx_content
    }
  }

`

export async function getStaticProps({params}) {
  const {id} = params
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(
    'post-data',
    graphqlRequest(getPost, {id: parseInt(id as string)}),
  )

  const data = await graphqlRequest(getPostMdx, {id: parseInt(id as string)})()
  let mdxContent = null
  let mdxData = data.posts[0].mdx_content
  if (mdxData) {
    mdxContent = await bundleMDX(mdxData, {})
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      mdxContent: mdxContent?.code ?? mdxContent,
    },
  }
}

export async function getStaticPaths() {
  const postIds = await graphqlRequest(getPostIds)()
  const {posts} = postIds
  const paths = posts.map(({id}) => ({
    params: {id: `${id}`},
  }))

  return {
    paths,
    fallback: false,
  }
}

export interface PostProps {
  mdxContent: any
}

const Post = ({mdxContent}: PostProps) => {
  const router = useRouter()
  const {id} = router.query
  // TODO: create post type
  const {status, data, error, isFetching} = useQuery<any | undefined>(
    'post-data',
    // serializeWrapper(getPost, {id: parseInt(id as string)}, graphqlRequest),
    graphqlRequest(getPost, {id: parseInt(id as string)}),
  )

  // const Component = useMemo(() => getMDXComponent(mdxContent), [mdxContent])
  const Component = getMDXComponent(mdxContent)

  // TODO: Write code to save first mdx val - since it's right
  // maybe a useEffect or something

  // const mdx = 'Some **mdx** text, with a component <Test />'
  // const source = await serialize(mdx)

  if (isFetching) return <p>Loading...</p>

  return (
    <Box maxW="675px" m="auto">
      {data?.posts?.map(
        ({title, description, post_items, image}: any, idx: number) => {
          return (
            <Box key={idx} m="auto" mt={20} textAlign="left">
              <VStack spacing={7} align="start">
                <Box w="100%" textAlign="center">
                  {image && (
                    <Center w="100%">
                      <AspectRatio ratio={16 / 9} w={['80%', '80%', '60%']}>
                        <Image src={image} layout="fill" objectFit="cover" />
                      </AspectRatio>
                    </Center>
                  )}
                  <Heading size="2xl" mb={6}>
                    {title}
                  </Heading>
                  <Heading size="md">{description}</Heading>
                </Box>
                <Component />
                {/* {post_items.length > 0 &&
                  post_items.map((item: any, idx: number) => (
                    <PostContent key={item} itemId={item} />
                  ))} */}
              </VStack>
            </Box>
          )
        },
      )}
    </Box>
  )
}

export default Post
