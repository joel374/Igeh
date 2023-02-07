import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../api";
import * as Yup from "yup";
import Post from "../components/Post";
import { AddIcon } from "@chakra-ui/icons";
import comment from "../components/Comment";

const NewPost = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const inputFileRef = useRef(null);

  const authSelector = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      caption: "",
      post_image: null,
    },
    onSubmit: async (values) => {
      try {
        let newPost = new FormData();

        newPost.append("caption", values.caption);
        newPost.append("post_image", values.post_image);

        await axiosInstance.post("/posts", newPost);

        formik.setFieldValue("caption", "");
        formik.setFieldValue("post_image", null);

        toast({
          position: "top",
          title: "Post success",
          status: "success",
        });

        fetchPosts();
      } catch (error) {
        console.log(error);
      }
    },
  });

  const inputChangeHandler = ({ target }) => {
    const { name, value } = target;

    formik.setFieldValue(name, value);
  };

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/posts", {
        params: {
          _limit: 2,
          _page: page,
          _sortDir: "DESC",
        },
      });

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
          username={val.user.username}
          body={val.body}
          image_url={val.image_url}
          userId={val.userId}
          onDelete={() => {
            deleteBtnHandler(val.id);
          }}
          postId={val.id}
        ></Post>
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
    <Box backgroundColor={"#fafafa"}>
      <Container maxW={"container.md"} py="4" pb={"10"}>
        <Heading fontWeight={"light"}>New Post</Heading>

        <Stack mt={"4"} isOpen={isOpen} onClose={onClose}>
          <Textarea
            placeholder="Insert your caption here"
            value={formik.values.caption}
            onChange={inputChangeHandler}
            name="caption"
          />
          <HStack>
            <Input
              ref={inputFileRef}
              display={"none"}
              onChange={(event) => {
                formik.setFieldValue("post_image", event.target.files[0]);
              }}
              name="post_image"
              type="file"
              accept="image/*"
            />
            <Button
              onClick={() => {
                inputFileRef.current.click();
              }}
              width="100%"
            >
              {formik?.values?.post_image?.name || "Upload Image"}
            </Button>
            <Button
              onClick={formik.handleSubmit}
              isDisabled={formik.isSubmitting}
              colorScheme={"twitter"}
            >
              Post
            </Button>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
};
export default NewPost;
