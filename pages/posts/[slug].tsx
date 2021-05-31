import {useMemo} from 'react'
import {QueryClient, useQuery} from 'react-query'
import {useRouter} from 'next/router'
import {dehydrate} from 'react-query/hydration'
import {graphqlRequest} from 'util/ReactQueryProvider'
import React from 'react'
import {
  Button,
  AspectRatio,
  Box,
  Text,
  Center,
  Heading,
  VStack,
} from '@chakra-ui/react'

import PostContent from 'components/PostContent'
import Image from 'next/image'
// import {serialize} from 'next-mdx-remote/serialize'
// import {MDXRemote} from 'next-mdx-remote'
import {bundleMDX} from 'mdx-bundler'
import {getMDXComponent} from 'mdx-bundler/client'
import produce from 'immer'
import fs from 'fs'
import path from 'path'
import R from 'ramda'

const {readdir, readFile} = fs.promises

const Paragraph = ({children}) => {
  console.log('para')
  return (
    <Text color="tomato" size="xl">
      {children}
    </Text>
  )
}

export const mdxFiles = {
  files: {
    './demo.tsx': `
    import * as React from 'react'
    
    function Demo() {
      return <div>Neat demo!</div>
    }
    
    export default Demo
        `,
  },
  globals: {button: 'button', p: 'p'},
}

export const serialize = ({
  slug,
  title,
  description,
  code,
  publishedAt,
  modifiedAt,
}) => {
  return {
    slug,
    title,
    code,
    description,
    publishedAt: JSON.parse(JSON.stringify(publishedAt)),
    modifiedAt: JSON.parse(JSON.stringify(modifiedAt)),
  }
}

export async function getStaticProps({params}) {
  const {slug} = params

  const files = await readdir('mdx/')
  const promises = files.map(async file => {
    const fileRes = await readFile(path.join('mdx/', file))
    const result = await bundleMDX(fileRes.toString().trim(), mdxFiles)

    const {frontmatter, code} = result
    // const {slug} = frontmatter
    // const {publishedAt, modifiedAt} = frontmatter
    // frontmatter.publishedAt = JSON.parse(JSON.stringify(publishedAt))
    // frontmatter.modifiedAt = JSON.parse(JSON.stringify(modifiedAt))
    // return {params: {slug}}
    // return {file, code, slug: frontmatter.slug}
    return {file, code, ...frontmatter}

    // return {file, ...frontmatter}
  })

  const result = await Promise.all([...promises])
  // const mdxFile = R.find(data => data.slug.test()))(result) //=> undefined
  const currentSlug = R.find(data => data.file === `${slug}.mdx`)(result)

  // const {id} = params
  // const queryClient = new QueryClient()

  // await queryClient.prefetchQuery(
  //   'post-data',
  //   graphqlRequest(getPost, {id: parseInt(id as string)}),
  // )

  // const data = await graphqlRequest(getPostMdx, {id: parseInt(id as string)})()
  // let mdxContent = null
  // let mdxData = data.posts[0].mdx_content
  // if (mdxData) {
  //   mdxContent = await bundleMDX(mdxData, {})
  // }

  return {
    props: {...serialize(currentSlug)},
  }
  // return {
  //   props: {
  //     dehydratedState: dehydrate(queryClient),
  //     mdxContent: mdxContent?.code ?? mdxContent,
  //   },
  // }
}

export async function getStaticPaths() {
  const files = await readdir('mdx/')
  const promises = files.map(async file => {
    const fileRes = await readFile(path.join('mdx/', file))
    const result = await bundleMDX(fileRes.toString().trim(), mdxFiles)
    const {frontmatter} = result
    const {slug} = frontmatter
    // const {publishedAt, modifiedAt} = frontmatter
    // frontmatter.publishedAt = JSON.parse(JSON.stringify(publishedAt))
    // frontmatter.modifiedAt = JSON.parse(JSON.stringify(modifiedAt))
    return {params: {slug}}

    // return {file, ...frontmatter}
  })

  const result = await Promise.all([...promises])
  return {
    paths: result,
    fallback: false,
  }
}

// export async function getStaticPaths() {
//   const postIds = await graphqlRequest(getPostIds)()
//   const {posts} = postIds
//   const paths = posts.map(({id}) => ({
//     params: {id: `${id}`},
//   }))

//   return {
//     paths,
//     fallback: false,
//   }
// }

// export interface PostProps {
//   mdxContent: any
// }
//

export interface PostProps {
  code: string
  slug: string
  title: string
  description: string
}

const Post = ({code, title, description, slug}: PostProps) => {
  // const router = useRouter()
  // const {id} = router.query
  // // TODO: create post type
  // const {status, data, error, isFetching} = useQuery<any | undefined>(
  //   'post-data',
  //   // serializeWrapper(getPost, {id: parseInt(id as string)}, graphqlRequest),
  //   graphqlRequest(getPost, {id: parseInt(id as string)}),
  // )

  // const Component = useMemo(() => getMDXComponent(code), [code])

  const Component = useMemo(
    () => getMDXComponent(code, {button: Button}),
    [code, Button, Paragraph],
  )

  // TODO: Write code to save first mdx val - since it's right
  // maybe a useEffect or something

  // const mdx = 'Some **mdx** text, with a component <Test />'
  // const source = await serialize(mdx)

  // if (isFetching) return <p>Loading...</p>

  const data = {posts: []}

  // return <div>hello there</div>

  return (
    <Box maxW="675px" m="auto">
      {/* {data?.posts?.map( */}
      {/* ({title, subtitle, post_items, image}: any, idx: number) => {
          return ( */}
      <Box key={slug} m="auto" mt={20} textAlign="left">
        <VStack spacing={7} align="start">
          <Box w="100%" textAlign="center">
            {/* {image && (
              <Center w="100%">
                <AspectRatio ratio={16 / 9} w={['80%', '80%', '60%']}>
                  <Image src={image} layout="fill" objectFit="cover" />
                </AspectRatio>
              </Center>
            )} */}
            <Heading size="2xl" mb={6}>
              {title}
            </Heading>
            <Heading size="md">{description}</Heading>
          </Box>
          <Component components={{p: Paragraph}} />
          {/* {post_items.length > 0 &&
                  post_items.map((item: any, idx: number) => (
                    <PostContent key={item} itemId={item} />
                  ))} */}
        </VStack>
      </Box>
      {/* )
        },
      )} */}
    </Box>
  )
}

export default Post
