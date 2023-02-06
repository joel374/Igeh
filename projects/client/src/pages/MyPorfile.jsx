import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Image,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { axiosInstance } from "../api"
import { login } from "../redux/features/authSlice"

const MyProfile = () => {
  const [posts, setPosts] = useState([])
  const [editMode, setEditMode] = useState(false)

  const authSelector = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const toast = useToast()

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/posts/me")

      setPosts(response.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  const deleteBtnHandler = async (id) => {
    try {
      await axiosInstance.delete(`/posts/${id}`)

      fetchPosts()
      toast({ position: "top", title: "Post deleted", status: "info" })
    } catch (error) {
      console.log(error)
    }
  }

  const renderPosts = () => {
    return posts
      .map((val) => {
        return <Image src={val.image_url} h="244px" objectFit="cover" />
      })
      .reverse()
  }

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      profile_picture: "",
    },
    onSubmit: async ({ username, email, profile_picture }) => {
      try {
        const userData = new FormData()

        if (username && username !== authSelector.username) {
          userData.append("username", username)
        }

        if (email && email !== authSelector.email) {
          userData.append("email", email)
        }

        if (profile_picture) {
          userData.append("profile_picture", profile_picture)
        }

        const userResponse = await axiosInstance.patch("/auth/me", userData)

        dispatch(login(userResponse.data.data))
        setEditMode(false)
        toast({ title: "Profile edited", status: "success" })
      } catch (error) {
        console.log(error)
        toast({
          title: "Failed edit",
          status: "error",
          description: error.response.data.message,
        })
      }
    },
  })

  const formChangeHandler = ({ target }) => {
    const { name, value } = target

    formik.setFieldValue(name, value)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <Box backgroundColor={"#fafafa"}>
      <Container maxW={"container.md"} py="4" pb={"10"}>
        <Box
          borderColor={"gray.300"}
          borderWidth="1px"
          p={"6"}
          borderRadius={"8px"}
        >
          <Box>
            <Stack>
              <HStack gap={"10"}>
                <Avatar
                  size="2xl"
                  name={authSelector.username}
                  src={authSelector.profile_picture_url}
                />

                {editMode ? (
                  <Stack>
                    <FormControl>
                      <FormLabel>Username</FormLabel>
                      <Input
                        onChange={formChangeHandler}
                        name="username"
                        defaultValue={authSelector.username}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input
                        onChange={formChangeHandler}
                        name="email"
                        defaultValue={authSelector.email}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Profile Picture</FormLabel>
                      <Input
                        accept="image/*"
                        type={"file"}
                        onChange={(event) =>
                          formik.setFieldValue(
                            "profile_picture",
                            event.target.files[0]
                          )
                        }
                        name="profile_picture"
                      />
                    </FormControl>
                  </Stack>
                ) : (
                  <Stack>
                    <Text fontSize={"3xl"} fontWeight="bold">
                      {authSelector.username}
                    </Text>
                    <Text fontSize={"2xl"}>{authSelector.email}</Text>
                    <Text fontSize={"2xl"} fontWeight="light">
                      {authSelector.role}
                    </Text>
                  </Stack>
                )}
              </HStack>
            </Stack>

            {editMode ? (
              <Button width={"100%"} mt={"8"} onClick={formik.handleSubmit}>
                Save
              </Button>
            ) : (
              <Button
                width={"100%"}
                mt={"8"}
                colorScheme="teal"
                onClick={() => setEditMode(true)}
              >
                Edit profile
              </Button>
            )}
          </Box>
        </Box>
        <Grid templateColumns={"repeat(3, 1fr)"} gap="2px">
          {renderPosts()}
        </Grid>
      </Container>
    </Box>
  )
}

export default MyProfile
