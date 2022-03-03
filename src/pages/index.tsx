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
import NextLink from "next/link";
import PostDeleteEditButton from "../components/PostDeleteEditButton";
import { Wrapper } from "../components/Wrapper";
import {
  Post,
  PostsDocument,
  useMeQuery,
  usePostsQuery,
} from "../generated/graphql";
import { addApolloState, initializeApollo } from "../libs/apolloClient";

const limit = 3;

const Index = () => {
  const { data: meData, loading: meLoading } = useMeQuery();
  const { data, loading, fetchMore, networkStatus, refetch } = usePostsQuery({
    variables: {
      limit,
    },
    notifyOnNetworkStatusChange: true, // component render boi query nay se rerender khi networkstatus change
  });
  const isLoadingMorePosts = networkStatus === NetworkStatus.fetchMore;

  const loadMorePosts = () => {
    // fetchMore({
    //   variables: { cursor: data?.posts?.cursor },
    //   updateQuery(existing: any, incoming: any) {
    //     console.log("existing", existing.paginatedPosts);
    //     console.log("incoming", incoming.fetchMoreResult.paginatedPosts);
    //     let paginatedPosts: any[] = [];
    //     if (existing && existing.paginatedPosts) {
    //       paginatedPosts = paginatedPosts.concat(existing.paginatedPosts);
    //     }
    //     if (incoming) {
    //       paginatedPosts = paginatedPosts.concat(
    //         incoming.fetchMoreResult.paginatedPosts
    //       );
    //     }
    //     console.log(paginatedPosts);

    //     return { ...incoming.fetchMoreResult, paginatedPosts };
    //   },
    // });
    refetch({ limit: 3, cursor: data?.posts?.cursor });
  };
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
            // console.log(post);
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
                <Box flex={1}>
                  <NextLink href={`/post/${post.id}`}>
                    <Link>
                      <Heading>{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>Post by {post.user.username} </Text>
                  <Flex alignItems={"center"}>
                    <Text mt="4">{post.textSnippet}...</Text>
                    <Box ml={"auto"}>
                      {meData?.me?.id === post.userId.toString() && (
                        <PostDeleteEditButton />
                      )}
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
            Next
          </Button>
        </Flex>
      )}
    </Wrapper>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: PostsDocument,
    variables: {
      limit,
    },
  });

  return addApolloState(apolloClient, {
    props: {},
  });
}

export default Index;
