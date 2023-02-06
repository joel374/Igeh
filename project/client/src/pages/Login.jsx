import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useState } from "react"
import { useDispatch } from "react-redux"
import * as Yup from "yup"
import { axiosInstance } from "../api"
import { login } from "../redux/features/authSlice"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const togglePassword = () => {
    setShowPassword(!showPassword)
  }
  const toast = useToast()

  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      usernameOrEmail: "",
      password: "",
    },
    onSubmit: async ({ usernameOrEmail, password }) => {
      try {
        const response = await axiosInstance.post("/auth/login", {
          usernameOrEmail,
          password,
        })

        console.log(response)

        localStorage.setItem("auth_token", response.data.token)
        dispatch(
          login({
            username: response.data.data.username,
            email: response.data.data.email,
            id: response.data.data.id,
          })
        )
        toast({
          title: "Login successful",
          position: "top",
          description: response.data.message,
          status: "success",
        })
      } catch (error) {
        console.log(error)
        toast({
          status: "error",
          title: "Login failed",
          description: error.response.data.message,
        })
      }
    },
    validationSchema: Yup.object({
      usernameOrEmail: Yup.string().required().min(3),
      password: Yup.string().required(),
    }),
    validateOnChange: false,
  })

  const formChangeHandler = ({ target }) => {
    const { name, value } = target
    formik.setFieldValue(name, value)
  }

  return (
    <Box backgroundColor={"#fafafa"} h="91vh">
      <Container maxW={"container.md"} py="4" pb={"10"}>
        <Text fontSize={"4xl"} fontWeight={"light"} textAlign="center">
          Login
        </Text>
        <Box padding="6" width={"600px"} mx={"auto"}>
          <form onSubmit={formik.handleSubmit}>
            <Stack>
              <FormControl isInvalid={formik.errors.usernameOrEmail}>
                <FormLabel>Username or Email</FormLabel>
                <Input
                  value={formik.values.usernameOrEmail}
                  name="usernameOrEmail"
                  placeholder="Input your username or email"
                  onChange={formChangeHandler}
                />
                <FormErrorMessage>
                  {formik.errors.usernameOrEmail}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formik.errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    value={formik.values.password}
                    name="password"
                    placeholder="Input your password"
                    onChange={formChangeHandler}
                    type={showPassword ? "text" : "password"}
                  />
                  <InputRightElement width="56px" mr="4px">
                    <Button onClick={togglePassword} height="28px" size="sm">
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>
              <Box py={"3"}>
                <Button
                  bgColor={"#C37B89"}
                  _hover={false}
                  _active={false}
                  color="white"
                  type={"submit"}
                >
                  Login
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  )
}
export default LoginPage
