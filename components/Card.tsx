import React from 'react'
import {Box, AspectRatio, Badge, BoxProps} from '@chakra-ui/react'
import Link from 'next/link'
import moment from 'moment'
import Image from 'next/image'
// Sample card from Airbnb

export interface CardProps extends BoxProps {
  title: string
  subtitle: string
  createdAt?: any
  imageUrl?: string
  linkUrl?: string
}

const Card = ({
  title,
  subtitle,
  createdAt,
  imageUrl = 'https://bit.ly/2Z4KKcF',
  linkUrl,
}: CardProps) => {
  return (
    <Link href={linkUrl}>
      <Box
        w="90%"
        m="auto"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        cursor="pointer"
      >
        <AspectRatio ratio={16 / 9}>
          <Image
            src={imageUrl}
            alt={'post image'}
            layout="fill"
            objectFit="cover"
          />
        </AspectRatio>

        <Box p="6">
          <Box d="flex" alignItems="baseline">
            <Badge borderRadius="full" px="2" colorScheme="teal">
              New
            </Badge>
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              {moment(createdAt).fromNow()}
            </Box>
          </Box>

          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            {title}
          </Box>

          <Box>{subtitle}</Box>
        </Box>
      </Box>
    </Link>
  )
}

export default Card
