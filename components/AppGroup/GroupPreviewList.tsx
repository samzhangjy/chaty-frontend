import { selectCurrentGroup, setCurrentGroup } from "@/features/group/groupSlice";
import { getUserAvatar } from "@/utils/avatar";
import {
  ScrollArea,
  ActionIcon,
  UnstyledButton,
  Group,
  Indicator,
  Center,
  Grid,
  Avatar,
  Box,
  Text,
} from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { truncate } from "@/utils/string";
import { DateTime } from "luxon";
import useStyles from "./group.styles";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import useJoinedGroups from "@/hooks/useJoinedGroups";
import { useWindowScroll } from "@mantine/hooks";

export type GroupPreviewListProps = {
  setSubNavbarOpened: (v: boolean) => void;
};

const GroupPreviewList = ({ setSubNavbarOpened }: GroupPreviewListProps) => {
  const { classes, cx } = useStyles();
  const dispatch = useAppDispatch();
  const currentGroup = useAppSelector(selectCurrentGroup);
  const { joinedGroups, mutate } = useJoinedGroups();
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <ScrollArea h="calc(100vh - 60px)">
      <div className={classes.groupsContainer}>
        <ActionIcon onClick={() => mutate()}>
          <IconRefresh size="1rem" />
        </ActionIcon>
        {joinedGroups?.map((group) => (
          <UnstyledButton
            key={group.group.id}
            className={cx(classes.groupButton, {
              [classes.groupButtonActive]: group.group.id === currentGroup?.group.id,
            })}
            onClick={() => {
              // For mobile use
              setSubNavbarOpened(false);
              if (group.group.id === currentGroup?.group.id) return;
              scrollTo({ y: 0 });
              dispatch(setCurrentGroup(group));
            }}
          >
            <Group>
              <Indicator
                label={group.group.unreadCount}
                inline
                size={16}
                radius="xl"
                disabled={group.group.unreadCount <= 0 || group.group.id === currentGroup?.group.id}
              >
                <Center className={classes.groupIcon}>
                  <Grid gutter={1} maw={30} mah={30}>
                    {group.group.members.slice(0, Math.min(group.group.members.length, 9)).map((member) => (
                      <Grid.Col
                        span={12 / Math.ceil(Math.sqrt(Math.min(group.group.members.length, 9)))}
                        key={member.id}
                      >
                        <Avatar src={getUserAvatar(member.user)} size="100%" radius={2} />
                      </Grid.Col>
                    ))}
                  </Grid>
                </Center>
              </Indicator>
              <Box sx={{ flex: 1 }}>
                <Text size="md" weight={500}>
                  {group.group.name}
                </Text>
                <Text size="sm" color="dimmed" weight={500}>
                  {group.group.lastMessage &&
                    truncate(`${group.group.lastMessage.sender?.username}: ${group.group.lastMessage.content}`, 24)}
                </Text>
              </Box>
              <Text size="xs" color="dimmed" className={classes.groupTime}>
                {group.group.lastMessage &&
                  (DateTime.fromISO(group.group.lastMessage.createdAt).diffNow("hours").hours > 24
                    ? DateTime.fromISO(group.group.lastMessage.createdAt).toLocaleString(DateTime.DATE_SHORT)
                    : DateTime.fromISO(group.group.lastMessage.createdAt).toLocaleString(DateTime.TIME_SIMPLE))}
              </Text>
            </Group>
          </UnstyledButton>
        ))}
      </div>
    </ScrollArea>
  );
};

export default GroupPreviewList;
