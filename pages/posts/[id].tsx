import {QueryClient, useQuery} from 'react-query'
import {useRouter} from 'next/router'
import {dehydrate} from 'react-query/hydration'
import {graphqlRequest} from 'util/ReactQueryProvider'
import React from 'react'
import {AspectRatio, Box, Center, Heading, VStack} from '@chakra-ui/react'
import PostContent from 'components/PostContent'
import Image from 'next/image'

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
      created_at
      subtitle
      title
      image
    }
  }
`

export async function getStaticProps({params}) {
  const {id} = params
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(
    'post-content',
    graphqlRequest(getPost, {id: parseInt(id)}),
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export async function getStaticPaths() {
  const postIds = await graphqlRequest(getPostIds)()
  const {posts} = postIds
  const paths = posts.map(({id}) => ({
    params: {id: `${id}`},
  }))
  console.log('paths', paths)

  return {
    paths,
    fallback: false,
  }
}

const Post = () => {
  const router = useRouter()
  const {id} = router.query
  // TODO: create post type
  const {status, data, error, isFetching} = useQuery<any | undefined>(
    'post-data',
    graphqlRequest(getPost, {id: parseInt(id as string)}),
  )
  console.log('posts?', data)
  if (isFetching) return <p>Loading...</p>

  return (
    <Box maxW="675px" m="auto">
      {data?.posts?.map(
        ({title, subtitle, post_items, image}: any, idx: number) => {
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
                  <Heading size="md">{subtitle}</Heading>
                </Box>
                {post_items.length > 0 &&
                  post_items.map((item: any, idx: number) => (
                    <PostContent key={item} itemId={item} />
                  ))}
              </VStack>
            </Box>
          )
        },
      )}
    </Box>
  )
}

export default Post
