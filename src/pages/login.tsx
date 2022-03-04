import {
  Box,
  Button,
  Flex,
  Link,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import Router from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { MeDocument, useLoginMutation } from "../generated/graphql";
import { mapError } from "../helper/mapError";
import { useCheckAuth } from "../utils/useCheckAuth";

interface loginProps {}

const login: React.FC<loginProps> = ({}) => {
  const toast = useToast();
  const [login, { error, loading }] = useLoginMutation();
  const { data: authData, loading: authLoading } = useCheckAuth();

  const onSubmitHandler = async (values, { setErrors }) => {
    // let option : RegisterInput;
    const response = await login({
      variables: {
        loginInput: values,
      },
      update(cache, { data }) {
        // console.log(data);
        if (data.login.success) {
          cache.writeQuery({
            query: MeDocument,
            data: { me: data.login.user },
          });
        }
      },
    });
    if (response.data?.login.errors) {
      setErrors(mapError(response.data.login.errors));
    } else if (response.data.login.user) {
      toast({
        title: "Welcome",
        description: `${response.data.login.user.username}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      Router.push("/");
    }
    return loading;
  };

  const body =
    authLoading || (!authLoading && authData.me) ? (
      <Flex justifyContent={"center"} alignItems={"center"} height={"100vh"}>
        <Spinner></Spinner>
      </Flex>
    ) : (
      <Box w={400} mx={"auto"} mt={10}>
        <Formik
          initialValues={{
            usernameOrEmail: "",
            password: "",
          }}
          onSubmit={onSubmitHandler}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="usernameOrEmail"
                placeholder="Username or email"
                label="Username or email"
                type="text"
              />

              <Box mt={2}>
                <InputField
                  name="password"
                  placeholder="Password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Flex mt={"2"} justifyContent={"flex-end"}>
                <NextLink href={"/forgot-password"}>
                  <Link colorScheme={"blue"}>Forgot password ?</Link>
                </NextLink>
              </Flex>
              <Box>
                <Button
                  type="submit"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                >
                  Login
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    );

  return <Wrapper>{body}</Wrapper>;
};

export default login;
