import { Box, Button, Center, Flex, Spinner } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import Router from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { MeDocument, useRegisterMutation } from "../generated/graphql";
import { mapError } from "../helper/mapError";
import { useCheckAuth } from "../utils/useCheckAuth";

interface registerProps {}

const register: React.FC<registerProps> = ({}) => {
  const [register, { error, loading }] = useRegisterMutation();
  const { data: authData, loading: authLoading } = useCheckAuth();

  const body =
    authLoading || (!authLoading && authData.me) ? (
      <Flex justifyContent={"center"} alignItems={"center"} height={"100vh"}>
        <Spinner></Spinner>
      </Flex>
    ) : (
      <Center h={"100%"} mt={8}>
        <Box w={400}>
          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
            }}
            onSubmit={async (values, { setErrors }) => {
              // let option : RegisterInput;
              const response = await register({
                variables: {
                  registerInput: values,
                },
                update(cache, { data }) {
                  if (data.register.success) {
                    cache.writeQuery({
                      query: MeDocument,
                      data: { me: data.register.user },
                    });
                  }
                },
              });
              if (response.data?.register.errors) {
                setErrors(mapError(response.data.register.errors));
              } else if (response.data.register.user) {
                Router.push("/");
              }
              return loading;
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="username"
                  placeholder="Username"
                  label="Username"
                  type="text"
                />
                <Box mt={2}>
                  <InputField
                    name="email"
                    placeholder="Email"
                    label="Email"
                    type="text"
                  />
                </Box>
                <Box mt={2}>
                  <InputField
                    name="password"
                    placeholder="Password"
                    label="Password"
                    type="password"
                  />
                </Box>
                <Box mt={2}>
                  <Button
                    type="submit"
                    colorScheme="teal"
                    isLoading={isSubmitting}
                  >
                    Register
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Center>
    );
  return <Wrapper>{body}</Wrapper>;
};

export default register;
