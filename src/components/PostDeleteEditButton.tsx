import { Reference } from "@apollo/client";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import {
  PaginatedPosts,
  useDeletePostMutation,
  useMeQuery,
} from "../generated/graphql";

interface PostDeleteEditButtonProps {
  postId?: string;
  postUserId?: string;
}

const PostDeleteEditButton: React.FC<PostDeleteEditButtonProps> = ({
  postId,
  postUserId,
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: meData } = useMeQuery();
  const [deletePost, _] = useDeletePostMutation();
  const deletePostHandler = async (postId: string) => {
    const response = await deletePost({
      variables: { deletePostId: postId },
      update(cache, { data }) {
        cache.modify({
          fields: {
            posts(
              existing: Pick<
                PaginatedPosts,
                "__typename" | "totalPosts" | "cursor" | "hasmore"
              > & { paginatedPosts: Reference[] }
            ) {
              // console.log(existing);
              const newPaginatedPosts = {
                ...existing,
                totalPosts: existing.totalPosts - 1,
                paginatedPosts: existing.paginatedPosts.filter(
                  (post) => post.__ref !== `Post:${postId}`
                ),
              };
            },
          },
        });
      },
    });
    if (response.data.deletePost.success) {
      onClose();
      toast({
        title: "",
        description: "Delete post successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  if (meData?.me?.id !== postUserId) return <Box />;
  return (
    <>
      <Box>
        <NextLink href={`/post/edit/${postId}`}>
          <IconButton icon={<EditIcon />} aria-label="edit" mr={4} />
        </NextLink>
        <IconButton
          icon={<DeleteIcon />}
          aria-label="delete"
          colorScheme="red"
          onClick={onOpen}
        />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Confirm delete this post</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme={"red"}
              onClick={deletePostHandler.bind(this, postId)}
            >
              DELETE
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default PostDeleteEditButton;
