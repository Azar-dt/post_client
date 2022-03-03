import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useCheckAuth = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery();
  useEffect(() => {
    if (!loading) {
      if (
        data.me &&
        (router.route === "/login" ||
          router.route === "/register" ||
          router.route === "/forgot-password")
      ) {
        router.replace("/");
      }
      if (!data.me && router.route === "/create-post") {
        router.replace("/login");
      }
    }
  }, [loading, data, router]);
  return {
    data,
    loading,
  };
};
