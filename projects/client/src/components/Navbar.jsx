import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../redux/features/authSlice";
import NewPost from "./NewPost";

const Navbar = () => {
  const authSelector = useSelector((state) => state.auth);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();

  const logoutBtnHandler = () => {
    localStorage.removeItem("auth_token");
    dispatch(logout());
  };
  return (
    <>
      <Box
        backgroundColor={"#C37B89"}
        className="heroColor"
        position="sticky"
        opacity={"0.9"}
        // filter="blur(1px)"
        right={"0"}
        top={"0"}
        left="0"
        zIndex={"999"}
        borderBottom="1px solid"
        borderBottomColor={"#cfb2ba"}
      >
        <Container maxW={"container.lg"}>
          <Grid templateColumns={"repeat(3, 1fr)"} gap="2" p="1" color="white">
            <GridItem>
              <Text fontSize={"3xl"} fontWeight={"semibold"}>
                Igeh
              </Text>
            </GridItem>
            <GridItem padding="1px"></GridItem>
            <GridItem display="flex" justifyContent={"end"} padding="7px">
              {authSelector.id ? (
                <>
                  <Button
                    onClick={onOpen}
                    bgColor="transparent"
                    border={"3px solid"}
                    size="md"
                    _hover="none"
                    _active={false}
                  >
                    <AddIcon />
                  </Button>
                  <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalCloseButton />
                      <ModalBody p={10}>
                        <NewPost />
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                </>
              ) : null}
              <Button
                mr={"2"}
                ml="2"
                bgColor="transparent"
                border={"3px solid "}
                _hover="none"
                _active={false}
              >
                <Link to={"/"}>Home</Link>
              </Button>

              {authSelector.id ? null : (
                <Button
                  bgColor="transparent"
                  border={"3px solid white"}
                  _hover="none"
                  _active={false}
                >
                  <Link to={"/login"}>Login</Link>
                </Button>
              )}
              {!authSelector.id ? (
                <Button
                  colorScheme={"#008080"}
                  border={"3px solid white"}
                  ml="2"
                  // size={"lg"}
                >
                  <Link to={"/register"}>Register</Link>
                </Button>
              ) : (
                <Button
                  colorScheme={"#008080"}
                  border={"3px solid white"}
                  onClick={logoutBtnHandler}
                  // size={"lg"}
                >
                  Logout
                </Button>
              )}
              {authSelector.id ? (
                <Box ml={"2"} my="auto">
                  <Link to={"/my-profile/"}>
                    <Avatar
                      size={"sm"}
                      name={authSelector.username}
                      border="3px solid white"
                    />
                  </Link>
                </Box>
              ) : null}
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Navbar;
