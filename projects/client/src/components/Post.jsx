import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";
import Comment from "../components/Comment";
import * as Yup from "yup";
import { axiosInstance } from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const Post = ({
  username,
  caption,
  image_url,
  userId,
  onDelete,
  postId,
  profile_picture,
  createdAt,
  comment,
  id,
}) => {
  const [comments, setComments] = useState([]);
  const [UserId, setUserId] = useState([]);

  const authSelector = useSelector((state) => state.auth);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const confirmDeleteBtnHandler = () => {
    onClose();
    onDelete();
  };

  const formik = useFormik({
    initialValues: {
      comment: "",
    },
    validationSchema: Yup.object({
      comment: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      try {
        let newComment = {
          text: values.comment,
          userId: authSelector.id,
          postId: postId,
        };

        await axiosInstance.post("/comments", newComment);
        // fecthComments()
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <Box
        borderBottom="1px solid #cbd5e0"
        backgroundColor="white"
        pb="20px"
        mb="12px"
      >
        <HStack justifyContent={"space-between"} padding={"4"}>
          <HStack gap={"2"}>
            <Avatar size="md" name={username} src={profile_picture} />
            <Text fontSize="sm" fontWeight="bold">
              <Link to={`/profile/${username}/${id}`}>
                <Button
                  bgColor={"white"}
                  _hover={false}
                  _active={false}
                  p="0"
                  onClick={() => setUserId(id)}
                  value={id}
                >
                  {username}
                </Button>
              </Link>
            </Text>
          </HStack>

          {authSelector.id === userId ? (
            <Menu>
              <MenuButton>
                <Icon as={BsThreeDots} boxSize="20px" />
              </MenuButton>
              <MenuList>
                <MenuItem>Edit</MenuItem>
                <MenuItem onClick={onOpen}>Delete</MenuItem>
              </MenuList>
            </Menu>
          ) : null}
        </HStack>

        <Image
          // borderRadius="4px"
          height="auto"
          width="100%"
          objectFit="cover"
          src={
            image_url ||
            "https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=415&q=80"
          }
        />
        <Box fontSize="sm" padding={"16px 0"}>
          <Box display={"flex"}>
            <Link to={`/profile/${id}/${username}`}>
              <Text fontWeight="bold" display={"inline"} mr="2">
                {username}
              </Text>
            </Link>
            <Text display={"inline"}>{caption}</Text>
          </Box>
          <Text fontSize={"12px"}>
            {moment(createdAt).format("MMMM DD, YYYY")}
          </Text>
          {/* {comment.map((val) => (
            <Box display={"flex"}>
              <Text fontSize={"sm"} fontWeight="bold" mr="2">
                {val.User.username}
              </Text>
              <Text fontSize={"sm"}>{val.comment}</Text>
            </Box>
          ))} */}
          <Text cursor={"pointer"}>
            {comment.length > 0
              ? `Lihat semua ${comment.length} komentar`
              : null}
          </Text>
        </Box>
        <Box>
          <form onSubmit={formik.handleSubmit}>
            <HStack>
              <Textarea
                // width={"full"}
                p="0"
                maxH="80px"
                placeholder="Tambahkan komentar..."
                onChange={({ target }) =>
                  formik.setFieldValue(target.name, target.value)
                }
                value={formik.values.comment}
                name="comment"
                border="0"
                borderRadius="0"
                rows={3}
                fontSize="14px"
              />

              <Button
                colorScheme={"none"}
                textColor="#C37B89"
                size="sm"
                type="submit"
                none
                p="4"
                display={formik.values.comment ? "block" : "none"}
              >
                Send
              </Button>
            </HStack>
          </form>
        </Box>
      </Box>

      <AlertDialog isCentered isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={confirmDeleteBtnHandler}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Post;
