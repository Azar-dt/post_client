import {
  Box,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Navbar } from "../components/Navbar";
import { Wrapper } from "../components/Wrapper";
import { GetAllPostsDocument, useGetAllPostsQuery } from "../generated/graphql";
import { addApolloState, initializeApollo } from "../libs/apolloClient";

const Index = () => {
  const { data, loading } = useGetAllPostsQuery();
  // console.log(data);
  return (
    <Wrapper>
      {loading ? (
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
        >
          {data?.getAllPosts.map((post, idx) => {
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
                <Box>
                  <NextLink href={`/${post.id}`}>
                    <Link>
                      <Heading>{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>Post by {post.user.username} </Text>
                  <Flex alignItems={"center"}>
                    <Text mt="4">{post.textSnippet}...</Text>
                    <Box>Edit button</Box>
                  </Flex>
                </Box>
              </Flex>
            );
          })}
        </Stack>
      )}
    </Wrapper>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: GetAllPostsDocument,
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
}

export default Index;
