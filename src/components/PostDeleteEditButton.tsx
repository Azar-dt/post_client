import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";

interface PostDeleteEditButtonProps {
  postId?: string;
  postUserId?: string;
}

const PostDeleteEditButton: React.FC<PostDeleteEditButtonProps> = ({
  postId,
  postUserId,
}) => {
  return (
    <Box>
      <NextLink href={`/post/edit/${postId}`}>
        <IconButton icon={<EditIcon />} aria-label="edit" mr={4} />
      </NextLink>
      <IconButton icon={<DeleteIcon />} aria-label="delete" colorScheme="red" />
    </Box>
  );
};
export default PostDeleteEditButton;
