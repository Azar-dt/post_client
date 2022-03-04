import { Box, Button, Flex, Link, Spinner } from "@chakra-ui/react";
import NextLink from "next/link";
import { Form, Formik } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useCheckAuth } from "../utils/useCheckAuth";
import { useCreatePostMutation } from "../generated/graphql";
import Router from "next/router";
interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
  const { data: authData, loading: authLoading } = useCheckAuth();
  const [createPost, { data: createPostData, loading: createPostLoading }] =
    useCreatePostMutation();

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
            posts() {},
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
                <Box>
                  <Button
                    type="submit"
                    colorScheme="teal"
                    isLoading={isSubmitting}
                    mt={"16px"}
                  >
                    Create post
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Wrapper>
    );
};
export default CreatePost;
