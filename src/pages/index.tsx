import { NetworkStatus } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import NextLink from "next/link";
import PostDeleteEditButton from "../components/PostDeleteEditButton";
import VoteSection from "../components/VoteSection";
import { Wrapper } from "../components/Wrapper";
import { PostsDocument, usePostsQuery } from "../generated/graphql";
import { addApolloState, initializeApollo } from "../libs/apolloClient";
import { useEffect } from "react";

export const limit = 3;

const Index = () => {
  const { data, loading, fetchMore, networkStatus, refetch } = usePostsQuery({
    variables: {
      limit,
    },
    notifyOnNetworkStatusChange: false, // component render boi query nay se rerender khi networkstatus change
  });
  useEffect(() => {
    refetch();
  }, []);
  const isLoadingMorePosts = networkStatus === NetworkStatus.fetchMore;
  const loadMorePosts = () =>
    fetchMore({ variables: { cursor: data?.posts?.cursor } });
  return (
    <Wrapper>
      {loading && !isLoadingMorePosts ? (
        <Flex justifyContent={"center"} alignItems={"center"} height={"100vh"}>
          <Spinner></Spinner>
        </Flex>
      ) : (
        <Stack
          spacing={8}
          width="100vw"
          mx={"auto"}
          justifyContent="center"
          alignItems={"center"}
          mt={"24px"}
        >
          {data?.posts?.paginatedPosts.map((post, idx) => {
            return (
              <Flex
                key={idx}
                p={5}
                shadow={"md"}
                borderWidth="1px"
                width={"800px"}
                // mx="auto"
                mt="4px"
              >
                <VoteSection post={post} />
                <Box flex={1}>
                  <NextLink href={`/post/${post.id}`}>
                    <Link>
                      <Heading>{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>Post by {post.user.username} </Text>
                  <Flex alignItems={"center"}>
                    <Text mt="4">{post.textSnippet.substring(0, 20)}...</Text>
                    <Box ml={"auto"}>
                      <PostDeleteEditButton
                        postId={post.id}
                        postUserId={post.userId.toString()}
                      />
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            );
          })}
        </Stack>
      )}
      {data?.posts?.hasmore && (
        <Flex mt={"20px"} justifyContent={"center"}>
          <Button isLoading={isLoadingMorePosts} onClick={loadMorePosts}>
            Load more
          </Button>
        </Flex>
      )}
    </Wrapper>
  );
};

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const apolloClient = initializeApollo({ headers: context.req.headers });

//   await apolloClient.query({
//     query: PostsDocument,
//     variables: {
//       limit,
//     },
//   });

//   return addApolloState(apolloClient, {
//     props: {},
//   });
// };

export default Index;
