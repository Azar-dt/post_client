import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface WrapperProps {
  children: ReactNode;
}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <Box w={"100vw"} minH={"100vh"}>
      <Navbar></Navbar>
      {children}
    </Box>
  );
};
