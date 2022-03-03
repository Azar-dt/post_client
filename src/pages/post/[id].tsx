import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Wrapper } from "../../components/Wrapper";
import { useGetPostByIdQuery, useMeQuery } from "../../generated/graphql";
import NextLink from "next/link";
import PostDeleteEditButton from "../../components/PostDeleteEditButton";
import { initializeApollo } from "../../libs/apolloClient";

interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, error } = useGetPostByIdQuery({
    variables: { getPostByIdId: Number(id) },
  });
  const { data: meData, loading: meLoading } = useMeQuery();
  if (loading)
    return (
      <Wrapper>
        <Flex justifyContent="center" alignItems="center" minH="100vh">
          <Spinner />
        </Flex>
      </Wrapper>
    );

  if (error || !data?.getPostByID)
    return (
      <Wrapper>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{error ? error.message : "Post not found"}</AlertTitle>
        </Alert>
        <Box mt={4}>
          <NextLink href="/">
            <Button>Back to Homepage</Button>
          </NextLink>
        </Box>
      </Wrapper>
    );
  return (
    <Wrapper>
      <Box w={800} mx={"auto"} mt={10}>
        <Heading mb={4}>{data?.getPostByID.title}</Heading>
        <Box mb={4}>{data?.getPostByID.text}</Box>
        <Flex justifyContent="space-between" alignItems="center">
          {meData?.me?.id === data?.getPostByID.userId.toString() && (
            <PostDeleteEditButton
              postId={data?.getPostByID.id}
              postUserId={data?.getPostByID.userId.toString()}
            />
          )}
          <NextLink href="/">
            <Button>Back to Homepage</Button>
          </NextLink>
        </Flex>
      </Box>
    </Wrapper>
  );
};

export default Post;
