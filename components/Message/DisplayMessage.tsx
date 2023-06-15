import Message from "@/types/message";
import { getUserAvatar } from "@/utils/avatar";
import { Box, Group, Avatar, Text } from "@mantine/core";
import { DateTime } from "luxon";
import useStyles from "./message.styles";

const DisplayMessage = ({ message }: { message: Message }) => {
  const { classes } = useStyles();

  return (
    <div>
      {message.type === "text" ? (
        <Box mb="lg">
          <Group>
            <Avatar src={getUserAvatar(message.sender)} alt={message.sender.username} radius="xl" />
            <div>
              <Text size="sm" weight={500}>
                {message.sender.username}
              </Text>
              <Text size="xs" color="dimmed">
                {DateTime.fromISO(message.createdAt).toLocaleString(DateTime.DATETIME_SHORT)}
              </Text>
            </div>
          </Group>
          <Text className={classes.messageBody} size="md">
            {message.content}
          </Text>
        </Box>
      ) : null}
    </div>
  );
};

export default DisplayMessage;
