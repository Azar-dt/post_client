import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Link,
  Text,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useChangePasswordMutation } from "../generated/graphql";
import { mapError } from "../helper/mapError";
import { useCheckAuth } from "../utils/useCheckAuth";

interface ChangePasswordProps {}

const ChangePassword: React.FC<ChangePasswordProps> = ({}) => {
  // const { data: authData, loading: authLoading } = useCheckAuth();
  const router = useRouter();

  const { token: tokenRouter, userId: userIdRouter } = router.query;
  // console.log(tokenRouter, userIdRouter);

  const [TokenError, setTokenError] = useState("");
  const [changePassword, { loading, data }] = useChangePasswordMutation();
  const onSubmitHandler = async (values, { setErrors }) => {
    // try {
    const response = await changePassword({
      variables: {
        changePasswordData: {
          token: tokenRouter?.toString(),
          userId: userIdRouter?.toString(),
          newPassword: values.newPassword,
        },
      },
    });
    if (response.data.changePassword.errors) {
      const Errors = mapError(response.data.changePassword.errors);
      console.log(Errors);
      if ("token" in Errors) {
        setTokenError(Errors.token);
      }
      setErrors(Errors);
    }
    // } catch (error) {
    //     console.log(error);
    // }
    // return loading;
  };
  if (!tokenRouter || !userIdRouter)
    return (
      <Wrapper>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="calc(100vh - 75px)"
        >
          <AlertIcon boxSize="60px" mr={0} mb="8px" />
          <AlertTitle mt={4} mb={1} fontSize="large">
            Invalid change password send request
          </AlertTitle>
        </Alert>
      </Wrapper>
    );
  else
    return (
      <Wrapper>
        <Box w={400} mx={"auto"} mt={10}>
          <Formik
            initialValues={{
              newPassword: "",
            }}
            onSubmit={onSubmitHandler}
          >
            {({ isSubmitting }) =>
              !loading && data?.changePassword.success ? (
                <Flex
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Text>Reset password successfully</Text>
                  <Box mt={"4"}>
                    <Button colorScheme="teal">
                      <NextLink href={"/login"}>Return to login page</NextLink>
                    </Button>
                  </Box>
                </Flex>
              ) : (
                <Form>
                  <InputField
                    name="newPassword"
                    placeholder="Password"
                    label="New password"
                    type="password"
                  />
                  <Box mt={"2"}>
                    <Flex justifyContent={"space-between"}>
                      <Text textColor={"red"} colorScheme={"red"}>
                        {TokenError}
                      </Text>
                      <Text textColor={"#176866"}>
                        <NextLink href={"/forgot-password"}>
                          Forgot password page
                        </NextLink>
                      </Text>
                    </Flex>
                  </Box>
                  <Box mt={"4"}>
                    <Button
                      type="submit"
                      colorScheme="teal"
                      isLoading={isSubmitting}
                    >
                      Reset password
                    </Button>
                  </Box>
                </Form>
              )
            }
          </Formik>
        </Box>
      </Wrapper>
    );
};

export default ChangePassword;
