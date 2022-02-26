import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import {
  MeDocument,
  useLogoutMutation,
  useMeQuery,
} from "../generated/graphql";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const { data, loading } = useMeQuery();
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  // console.log(data, loading, error);
  let boxLog: any;
  const logoutHandler = async () => {
    return await logout({
      update(cache, { data }) {
        if (data.logout)
          cache.writeQuery({
            query: MeDocument,
            data: { me: null },
          });
      },
    });
  };
  if (loading) {
    boxLog = null;
  } else if (!data?.me) {
    boxLog = (
      <Box>
        <NextLink href={"/login"} passHref>
          <Link ml={4}>Login</Link>
        </NextLink>
        <NextLink href={"/register"} passHref>
          <Link ml={4}>Register</Link>
        </NextLink>
      </Box>
    );
  } else {
    boxLog = (
      <Box>
        <Button onClick={logoutHandler} isLoading={logoutLoading}>
          Logout
        </Button>
      </Box>
    );
  }
  return (
    <Box bg={"rgba(72, 190, 162, 1)"} p={4} w="100vw">
      <Flex
        justifyContent={"space-between"}
        align={"center"}
        m={"auto"}
        maxW="800px"
      >
        <NextLink href={"/"}>
          <Heading>Nextjs</Heading>
        </NextLink>
        {boxLog}
      </Flex>
    </Box>
  );
};
