import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../api";
import Post from "../components/Post";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const toast = useToast();

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/posts", {
        params: {
          _limit: 5,
          _page: page,
          _sortDir: "DESC",
        },
      });
      console.log(response);

      setTotalCount(response.data.dataCount);

      if (page === 1) {
        setPosts(response.data.data);
      } else {
        setPosts([...posts, ...response.data.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBtnHandler = async (id) => {
    try {
      await axiosInstance.delete(`/posts/${id}`);

      fetchPosts();
      toast({ position: "top", title: "Post deleted", status: "info" });
    } catch (error) {
      console.log(error);
    }
  };

  const renderPosts = () => {
    return posts.map((val) => {
      return (
        <Post
          key={val.id.toString()}
          id={val.UserId}
          username={val.User.username}
          caption={val.caption}
          image_url={val.image_url}
          userId={val.UserId}
          onDelete={() => deleteBtnHandler(val.id)}
          postId={val.id}
          createdAt={val.createdAt.toString()}
          comment={val.Comments}
        />
      );
    });
  };

  const seeMoreBtnHandler = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  return (
    <Box bgColor={"white"}>
      <Container maxW={"container.sm"} py="4" pb={"10"}>
        <Stack mt="0">
          {renderPosts()}

          {!posts.length ? (
            <Alert status="warning">
              <AlertIcon />
              <AlertTitle>No posts found</AlertTitle>
            </Alert>
          ) : null}
        </Stack>
        {posts.length <= totalCount ? null : (
          <Button
            colorScheme={"teal"}
            width={"100%"}
            mt={"6"}
            onClick={seeMoreBtnHandler}
            id="font"
          >
            See More
          </Button>
        )}
      </Container>
    </Box>
  );
};
export default HomePage;
