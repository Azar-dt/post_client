import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Wrapper } from "../../../components/Wrapper";
import {
  GetPostByIdDocument,
  PostInput,
  UpdatePostMutationVariables,
  useGetPostByIdQuery,
  useMeQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import NextLink from "next/link";
import { Form, Formik } from "formik";
import { InputField } from "../../../components/InputField";
import { mapError } from "../../../helper/mapError";

interface EditPostProps {}

const EditPost: React.FC<EditPostProps> = ({}) => {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: postData,
    loading: postLoading,
    error,
  } = useGetPostByIdQuery({
    variables: { getPostByIdId: Number(id) },
  });
  const { data: meData, loading: meLoading } = useMeQuery();
  const [updatePost, { data: updateData, loading: updateLoading }] =
    useUpdatePostMutation({
      refetchQueries: [GetPostByIdDocument],
    });
  const toast = useToast();
  const onSubmitHandler = async (values: PostInput, { setErrors }) => {
    const { title, text } = values;
    const response = await updatePost({
      variables: {
        postInput: {
          title,
          text,
        },
        updatePostId: id as string,
      },
    });
    if (response?.data?.updatePost.errors) {
      setErrors(mapError(response.data.updatePost.errors));
    } else if (response?.data?.updatePost.success) {
      toast({
        title: "Success",
        description: "Update post successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push(`/post/${id}`);
    }
    return updateLoading;
  };
  if (meLoading || postLoading)
    return (
      <Wrapper>
        <Flex justifyContent="center" alignItems="center" minH="100vh">
          <Spinner />
        </Flex>
      </Wrapper>
    );

  if (meData.me!.id !== postData?.getPostByID.userId.toString())
    return (
      <Wrapper>
        <Box w={800} mx={"auto"} mt={10}>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Unauthorized</AlertTitle>
          </Alert>
          <Box mt={4}>
            <NextLink href="/">
              <Button>Back to Homepage</Button>
            </NextLink>
          </Box>
        </Box>
      </Wrapper>
    );
  return (
    <Wrapper>
      <Box w={800} mx={"auto"} mt={10}>
        <Formik
          initialValues={{
            title: postData.getPostByID.title,
            text: postData.getPostByID.text,
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
                  Update post
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Wrapper>
  );
};
export default EditPost;
