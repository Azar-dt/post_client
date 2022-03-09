import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  PostWithUserInforFragment,
  useVoteMutation,
  VoteType,
} from "../generated/graphql";

enum VoteTypeValues {
  Upvote = 1,
  Downvote = -1,
}

interface VoteSectionProps {
  post: PostWithUserInforFragment;
}

const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
  const [vote, { loading }] = useVoteMutation();
  const router = useRouter();
  const [loadingState, setLoadingState] = useState<
    "upvote-loading" | "downvote-loading" | "not-loading"
  >("not-loading");

  const upvote = async (postId: string) => {
    setLoadingState("upvote-loading");
    await vote({
      variables: {
        inputVoteValue: VoteType.UpVote,
        postId: parseInt(postId),
      },
    });
    setLoadingState("not-loading");
  };

  const downvote = async (postId: string) => {
    setLoadingState("downvote-loading");
    await vote({
      variables: {
        inputVoteValue: VoteType.DownVote,
        postId: parseInt(postId),
      },
    });
    setLoadingState("not-loading");
  };

  return (
    <Flex direction="column" alignItems="center" mr={4}>
      <IconButton
        icon={<ChevronUpIcon />}
        aria-label="upvote"
        onClick={
          post.currentUserVoteType === VoteTypeValues.Upvote
            ? undefined
            : upvote.bind(this, post.id)
        }
        isLoading={loading && loadingState === "upvote-loading"}
        colorScheme={
          post.currentUserVoteType === VoteTypeValues.Upvote
            ? "green"
            : undefined
        }
      />
      {post.points}
      <IconButton
        icon={<ChevronDownIcon />}
        aria-label="downvote"
        onClick={
          post.currentUserVoteType === VoteTypeValues.Downvote
            ? undefined
            : downvote.bind(this, post.id)
        }
        isLoading={loading && loadingState === "downvote-loading"}
        colorScheme={
          post.currentUserVoteType === VoteTypeValues.Downvote
            ? "red"
            : undefined
        }
      />
    </Flex>
  );
};

export default VoteSection;
