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
import {
  GetPostByIdDocument,
  GetPostByIdQuery,
  PaginatedPostsIdDocument,
  PaginatedPostsIdQuery,
  useGetPostByIdQuery,
  useMeQuery,
  usePaginatedPostsIdQuery,
} from "../../generated/graphql";
import NextLink from "next/link";
import PostDeleteEditButton from "../../components/PostDeleteEditButton";
import { addApolloState, initializeApollo } from "../../libs/apolloClient";
import { GetStaticPaths, GetStaticProps } from "next";

interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, error } = useGetPostByIdQuery({
    variables: { getPostByIdId: Number(id) },
  });

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
          <NextLink href="/">
            <Button>Back to Homepage</Button>
          </NextLink>
          <PostDeleteEditButton
            postId={data?.getPostByID.id}
            postUserId={data?.getPostByID.userId.toString()}
          />
        </Flex>
      </Box>
    </Wrapper>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query<PaginatedPostsIdQuery>({
    query: PaginatedPostsIdDocument,
    variables: { limit: 3 },
  });

  return {
    paths: data.posts!.paginatedPosts.map((post) => ({
      params: { id: `${post.id}` },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<
  { [key: string]: any },
  { id: string }
> = async ({ params }) => {
  const apolloClient = initializeApollo();
  await apolloClient.query<GetPostByIdQuery>({
    query: GetPostByIdDocument,
    variables: {
      getPostByIdId: Number(params.id),
    },
  });
  return addApolloState(apolloClient, {
    props: {},
  });
};

export default Post;
