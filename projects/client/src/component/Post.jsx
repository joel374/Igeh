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
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { BsThreeDots } from "react-icons/bs"
import { useSelector } from "react-redux"
import Comment from "../component/Comment"
import * as Yup from "yup"
import { axiosInstance } from "../api"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "../App.css"
import moment from "moment"

const Post = ({
  username,
  caption,
  image_url,
  userId,
  onDelete,
  postId,
  profile_picture,
  createdAt,
  id,
}) => {
  const [comments, setComments] = useState([])
  const [UserId, setUserId] = useState([])

  const authSelector = useSelector((state) => state.auth)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const confirmDeleteBtnHandler = () => {
    onClose()
    onDelete()
  }

  const fecthComments = async () => {
    try {
      const response = await axiosInstance.get("/comments", {
        params: {
          postId,
          _expand: "user",
        },
      })

      setComments(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const renderComments = () => {
    return comments.map((val) => {
      return <Comment username={val.user.username} text={val.text} />
    })
  }

  useEffect(() => {
    // fecthComments()
  })

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
        }

        await axiosInstance.post("/comments", newComment)
        // fecthComments()
      } catch (error) {
        console.log(error)
      }
    },
  })

  return (
    <>
      <Box
        borderColor={"gray.300"}
        borderWidth="1px"
        borderRadius={"8px"}
        backgroundColor="white"
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
          className="mobilePost"
          // borderRadius="4px"
          height="auto"
          width="100%"
          objectFit="cover"
          mt=""
          src={
            image_url ||
            "https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=415&q=80"
          }
        />
        <Box
          fontSize="sm"
          padding={"4"}
          borderBottom="1px"
          borderBottomColor={"gray.300"}
        >
          <Box display={"flex"}>
            <Link to={`/profile/${id}/${username}`}>
              <Text fontWeight="bold" display={"inline"}>
                {username || "Username"}
              </Text>
            </Link>
            <Text display={"inline"}>
              {caption ||
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architectovoluptas animi quis dolore officia quia quisquam sint quas ab dicta ut mollitia laboriosam sit officiis non, voluptatem nisi facere rem."}
            </Text>
          </Box>
          <Text fontSize={"12px"}>
            {moment(createdAt).format("DD MMMM YYYY")}
          </Text>
        </Box>
        {/* <Text display={"block"}>Komentar</Text> */}
        <Box>
          <Stack>{/* {renderComments()} */}</Stack>

          <form onSubmit={formik.handleSubmit}>
            <HStack>
              <Textarea
                width={"full"}
                maxH="20px"
                placeholder="Tambahkan komentar..."
                onChange={({ target }) =>
                  formik.setFieldValue(target.name, target.value)
                }
                value={formik.values.comment}
                name="comment"
                resize={"none"}
                border="0"
                borderRadius="0"
                outline={"blue"}
                size="xs"
              />

              <Button
                colorScheme={"none"}
                textColor="#C37B89"
                size="sm"
                type="submit"
                p="4"
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
  )
}

export default Post
