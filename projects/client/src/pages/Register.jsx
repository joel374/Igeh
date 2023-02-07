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
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { axiosInstance } from "../api";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ username, email, password }) => {
      try {
        const response = await axiosInstance.post("/auth/register", {
          username,
          email,
          password,
        });
        toast({
          title: "Registration successful",
          position: "top",
          description: response.data.mesagge,
          status: "success",
        });
      } catch (error) {
        toast({
          position: "top",
          title: "Registration failed",
          description: error.response.data.message,
          status: "error",
        });
        console.log(error);
      }
    },
    validationSchema: Yup.object({
      username: Yup.string().required().min(3),
      email: Yup.string().required().email(),
      password: Yup.string()
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain  Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
    }),
    validateOnChange: false,
  });

  const formChangeHandler = ({ target }) => {
    const { name, value } = target;
    formik.setFieldValue(name, value);
  };
  return (
    <Box backgroundColor={"#fafafa"} h="91vh">
      <Container maxW={"container.md"} py="4" pb={"10"}>
        <Text fontSize={"4xl"} fontWeight={"light"} textAlign="center">
          Register
        </Text>
        <Box padding="6" width={"600px"} mx={"auto"}>
          <form onSubmit={formik.handleSubmit}>
            <Stack>
              <FormControl isInvalid={formik.errors.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  value={formik.values.username}
                  name="username"
                  onChange={formChangeHandler}
                />
                <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  value={formik.values.email}
                  name="email"
                  onChange={formChangeHandler}
                  type={"email"}
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.password}>
                <FormLabel>Password </FormLabel>
                <InputGroup>
                  <Input
                    value={formik.values.password}
                    name="password"
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
                <Button colorScheme={"teal"} type={"submit"}>
                  Register
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
