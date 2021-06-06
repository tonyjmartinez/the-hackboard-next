import {
  LinkBox,
  Box,
  AspectRatio,
  Heading,
  LinkOverlay,
  Text,
  Center,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import Image from 'next/image'
import moment from 'moment'
import {useColors} from 'util/color-context'

export interface PostCardProps {
  image: string
  title: string
  description: string
  publishedAt: Date
  slug: string
}

const PostCard = ({
  image,
  title,
  description,
  publishedAt,
  slug,
}: PostCardProps) => {
  const href = `/posts/${slug}`

  const colors = useColors()
  const {gray} = colors
  return (
    <Center w="100%">
      <LinkBox
        as="article"
        maxW="xl"
        p={5}
        borderWidth="1px"
        rounded="lg"
        w="100%"
        bg={gray}
        border="none"
      >
        {image && (
          <Center>
            <AspectRatio ratio={16 / 9} w="80%">
              <Image
                src={image}
                alt={'post image'}
                layout="fill"
                objectFit="cover"
              />
            </AspectRatio>
          </Center>
        )}

        <Box as="time" dateTime="2021-01-15 15:30:00 +0000 UTC">
          {moment(publishedAt).fromNow()}
        </Box>
        <Heading size="md" my="2">
          <NextLink href={href} passHref>
            <LinkOverlay>{title}</LinkOverlay>
          </NextLink>
        </Heading>
        <Text mb="3">{description}</Text>
        <NextLink href={href} passHref>
          <Box as="a" color="teal.400" fontWeight="bold">
            Read more
          </Box>
        </NextLink>
      </LinkBox>
    </Center>
  )
}

export default PostCard
