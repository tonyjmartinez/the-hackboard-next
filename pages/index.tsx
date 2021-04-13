// pages/index.js
import {useQuery} from 'react-query'

const GetPosts = `
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
interface PostsType {
  posts: any[]
}

export default function Index() {
  const {status, data, error, isFetching} = useQuery<PostsType | undefined>(
    GetPosts,
  )

  return <p>{JSON.stringify(data)}</p>
}
