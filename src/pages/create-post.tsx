import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import Router from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useCreatePostMutation } from "../generated/graphql";
import { useCheckAuth } from "../utils/useCheckAuth";
interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
  const { data: authData, loading: authLoading } = useCheckAuth();
  const [createPost, { loading: createPostLoading }] = useCreatePostMutation();

  const onSubmitHandler = async (values) => {
    const response = await createPost({
      variables: {
        postInput: {
          title: values.title,
          text: values.text,
        },
      },
      update(cache, { data }) {
        cache.modify({
          fields: {
            posts(existing) {
              if (data?.createPost.success && data.createPost.post) {
                // Post:new_id
                const newPostRef = cache.identify(data.createPost.post);

                const newPostsAfterCreation = {
                  ...existing,
                  totalPosts: existing.totalPosts + 1,
                  paginatedPosts: [
                    { __ref: newPostRef },
                    ...existing.paginatedPosts, // [{__ref: 'Post:1'}, {__ref: 'Post:2'}]
                  ],
                };

                return newPostsAfterCreation;
              }
            },
          },
        });
      },
    });
    if (response.data.createPost.success) Router.push("/");
    return createPostLoading;
  };

  if (authLoading || (!authLoading && !authData.me)) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"} height={"100vh"}>
        <Spinner></Spinner>
      </Flex>
    );
  } else
    return (
      <Wrapper>
        <Box w={800} mx={"auto"} mt={10}>
          <Formik
            initialValues={{
              title: "",
              text: "",
            }}
            onSubmit={onSubmitHandler}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="title"
                  placeholder="Title"
                  label="Title"
                  type="text"
                />

                <Box mt={2}>
                  <InputField
                    name="text"
                    placeholder="Text"
                    label="text"
                    type="text"
                    textarea
                  />
                </Box>
                <Flex mt={"16px"} justifyContent={"space-between"}>
                  <Button
                    type="submit"
                    colorScheme="teal"
                    isLoading={isSubmitting}
                  >
                    Create post
                  </Button>
                  <NextLink href="/">
                    <Button>Back to Homepage</Button>
                  </NextLink>
                </Flex>
              </Form>
            )}
          </Formik>
        </Box>
      </Wrapper>
    );
};
export default CreatePost;
