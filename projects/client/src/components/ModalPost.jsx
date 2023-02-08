import {
  Avatar,
  Box,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";

const ModalPost = ({
  image_url,
  comment,
  onOpen,
  isOpen,
  onClose,
  username,
  caption,
  createdAt,
}) => {
  //   const [onOpen, isOpen, onClose] = useDisclosure();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
      <ModalOverlay />
      <ModalContent bgColor={"transparent"}>
        <ModalCloseButton />
        <ModalBody p="0" display={"flex"} alignItems="center" fontSize={"14px"}>
          <Box
            display={"flex"}
            bgColor="white"
            h="700px"
            mx="auto"
            borderRadius={"4px"}
          >
            <Box>
              <Image
                // borderRadius="4px"
                // height="inherit"
                h={"700px"}
                width="auto"
                objectFit="cover"
                src={image_url}
                borderRadius="4px 0 0 4px"
              />
            </Box>
            <Box maxW={"500px"} minW="405px">
              <Box
                h="60px"
                p="14px"
                display={"flex"}
                alignItems="center"
                borderBottom={"1px solid #efefef"}
              >
                <Avatar name={username} size="sm" />
                <Text ml="14px" fontWeight={"bold"}>
                  {username}
                </Text>
              </Box>
              <Box p="14px" overflowY={"scroll"} overflow="hidden">
                <Box display={"flex"} mb="14px">
                  <Avatar
                    name={username}
                    size="sm"
                    display={"flex"}
                    alignItems="center"
                  />
                  <Text mr="2" ml="14px">
                    <Text display="inline" fontWeight={"bold"}>
                      {username}
                    </Text>
                    {" " + `${caption}`}
                    <Text fontSize={"12px"}>
                      {moment(createdAt).startOf("hour").fromNow()}
                    </Text>
                  </Text>
                  <Box>
                    <Box></Box>
                  </Box>
                </Box>
                {comment.map((val) => (
                  <Box display={"flex"} mb="14px">
                    <Avatar
                      name={val.User.username}
                      size="sm"
                      display={"flex"}
                      alignItems="center"
                    />
                    <Text mr="2" ml="14px" w="378.3px">
                      <Text display="inline" fontWeight={"bold"}>
                        {val.User.username}
                      </Text>
                      {" " + `${val.comment}`}
                      <Text fontSize={"12px"}>
                        {moment(val.createdAt).startOf("hour").fromNow()}
                      </Text>
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalPost;
