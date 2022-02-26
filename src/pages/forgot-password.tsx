import { Wrapper } from "../components/Wrapper";
import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { InputField } from "../components/InputField";
import {
  ForgotPasswordInput,
  useForgotPasswordMutation,
} from "../generated/graphql";
import { useCheckAuth } from "../utils/useCheckAuth";

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  const { data: authData, loading: authLoading } = useCheckAuth();

  const [forgotPassword, { loading, data }] = useForgotPasswordMutation();

  const onSubmitHandler = async (values: ForgotPasswordInput) => {
    await forgotPassword({
      variables: {
        forgotPasswordInput: values,
      },
    });
    return loading;
  };
  if (authLoading || (!authLoading && authData.me)) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"} height={"100vh"}>
        <Spinner></Spinner>
      </Flex>
    );
  } else
    return (
      <Wrapper>
        <Box w={400} mx={"auto"} mt={10}>
          <Formik
            initialValues={{
              email: "",
            }}
            onSubmit={onSubmitHandler}
          >
            {({ isSubmitting }) =>
              !loading && data ? (
                <Box mx={"auto"}>
                  <h3>Please check your mail</h3>
                </Box>
              ) : (
                <Form>
                  <Flex
                    flexDirection={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <InputField
                      name="email"
                      placeholder="Email"
                      label="Email"
                      type="email"
                    />
                    <Box mt={4} width={"100%"}>
                      <Button
                        width={"100%"}
                        type="submit"
                        colorScheme="teal"
                        isLoading={isSubmitting}
                      >
                        Send
                      </Button>
                    </Box>
                  </Flex>
                </Form>
              )
            }
          </Formik>
        </Box>
      </Wrapper>
    );
};
export default ForgotPassword;
