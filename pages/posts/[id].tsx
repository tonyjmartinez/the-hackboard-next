import {QueryClient, useQuery} from 'react-query'
import {useRouter} from 'next/router'
import {dehydrate} from 'react-query/hydration'
import {graphqlRequest} from 'util/ReactQueryProvider'

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
    'post-content',
    graphqlRequest(getPost, {id: parseInt(id as string)}),
  )
  console.log('data?', data)
  if (isFetching) return <p>Loading...</p>

  return <p>{JSON.stringify(data)}</p>
}

export default Post
