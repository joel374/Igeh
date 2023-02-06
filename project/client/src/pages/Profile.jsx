import {
  Avatar,
  Box,
  Container,
  Grid,
  HStack,
  Image,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams, Navigate } from "react-router-dom"
import { axiosInstance } from "../api"

const ProfilePage = () => {
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState({})
  const authSelector = useSelector((state) => state.auth)
  const params = useParams()

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get(`/auth/${params?.id}`)
      setUser(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get(`/posts/profile/${params.id}`)
      setPosts(response.data.data.Posts)
    } catch (error) {
      console.log(error)
    }
  }

  const renderPosts = () => {
    return posts.map((val) => {
      return (
        <Image
          src={val.image_url}
          h="244px"
          objectFit="cover"
          key={val.id.toString()}
        />
      )
    })
  }

  useEffect(() => {
    fetchUserProfile()
    fetchPosts()
  }, [])
  // useEffect(() => {
  // }, [user?.id])

  if (params.username === authSelector.username) {
    return <Navigate replace to="/my-profile" />
  }

  return (
    <Box backgroundColor={"#fafafa"}>
      <Container maxW={"container.md"} py="4" pb={"10"} mt="4">
        <Box
          borderColor={"gray.300"}
          borderWidth="1px"
          p={"6"}
          borderRadius={"8px"}
        >
          <Box>
            <Stack>
              <HStack gap={"10"}>
                <Wrap>
                  <WrapItem>
                    <Avatar
                      size="2xl"
                      name={user?.username}
                      // src="https://images.unsplash.com/photo-1508185140592-283327020902?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
                    />
                  </WrapItem>
                </Wrap>
                <Stack>
                  <Text fontSize={"3xl"} fontWeight="bold">
                    {user?.username}
                  </Text>
                  <Text fontSize={"2xl"}>{user?.email}</Text>
                  <Text fontSize={"2xl"} fontWeight="light">
                    {user?.role}
                  </Text>
                </Stack>
              </HStack>
            </Stack>
          </Box>
        </Box>
        <Grid templateColumns={"repeat(3, 1fr)"} gap="2px">
          {renderPosts()}
        </Grid>

        {/* <Stack mt={"5"} spacing="5">
          {renderPosts()}
        </Stack> */}
      </Container>
    </Box>
  )
}
export default ProfilePage
