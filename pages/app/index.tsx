import AppNavbar from "@/components/AppNavbar";
import { defaultLocale } from "@/config/locales";
import getGroupMessages from "@/features/group/getMessages";
import { selectCurrentGroup, setCurrentGroup } from "@/features/group/groupSlice";
import sendReadMessageAck from "@/features/group/sendReadMessageAck";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import useJoinedGroups from "@/hooks/useJoinedGroups";
import { ServerToClientEvents, socket } from "@/socket";
import Message from "@/types/message";
import { getUserAvatar } from "@/utils/avatar";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  ActionIcon,
  Affix,
  Avatar,
  Box,
  Card,
  Center,
  Grid,
  Group,
  Indicator,
  Loader,
  Popover,
  ScrollArea,
  Text,
  Textarea,
  Transition,
  UnstyledButton,
  createStyles,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery, useOs, useWindowScroll } from "@mantine/hooks";
import { IconMoodSmile, IconRefresh, IconSend } from "@tabler/icons-react";
import { DateTime } from "luxon";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { NextPageWithLayout } from "../_app";
import Head from "next/head";

const useStyles = createStyles((theme) => ({
  groupsContainer: {
    padding: theme.spacing.md,
    overflow: "hidden",
  },

  groupButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.radius.md,
    width: "100%",
    marginBottom: theme.spacing.xs,
    position: "relative",

    "&:hover": {
      background: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
    },
  },

  groupButtonActive: {
    background: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
  },

  groupIcon: {
    background: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
    height: rem(36),
    width: rem(36),
    borderRadius: theme.radius.sm,
  },

  groupTime: {
    position: "absolute",
    top: theme.spacing.xs,
    right: theme.spacing.xs,
  },

  chatInputContainer: {
    position: "sticky",
    bottom: 0,
    height: "10px",
    width: "100%",
  },

  sendMessageTextareaInput: {
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
  },

  sendMessageRightSection: {
    marginRight: theme.spacing.xl,
  },

  sendMessageActions: {
    marginLeft: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },

  messageBody: {
    paddingLeft: rem(54),
  },

  messageScroll: {
    display: "flex",
    flexDirection: "column-reverse",
    padding: `${theme.spacing.xl} ${theme.spacing.xl} 0 ${theme.spacing.xl}`,
    marginBottom: 140,
  },

  messageScrollWrapper: {
    height: `calc(100vh - 60px)`,
    overflow: "auto",
    display: "flex",
    flexDirection: "column-reverse",
  },
}));

const AppIndexPage: NextPageWithLayout = () => {
  const { classes } = useStyles();
  const currentGroup = useAppSelector(selectCurrentGroup);
  const { t, i18n } = useTranslation("app");
  const theme = useMantineTheme();
  const isOnMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const form = useForm({
    initialValues: {
      message: "",
    },
  });
  const os = useOs();
  const [history, setHistory] = useState<Message[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [recvMessageCnt, setRecvMessageCnt] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const getMoreMessages = async (isEmpty = false) => {
    if (!currentGroup || (!isEmpty && !nextPage) || (isLoadingMessages && !isEmpty)) {
      setHistory([...history]);
      return;
    }
    if (!isEmpty) setIsLoadingMessages(true);
    const response = await getGroupMessages(currentGroup?.group?.id!, isEmpty ? 1 : nextPage!, recvMessageCnt);
    if (!response.hasFetchError) {
      setHistory(isEmpty ? response.data.data : [...history, ...response.data.data]);
      setNextPage(response.data.nextPage);
      if (!!response.data.nextPage !== hasMoreMessages) {
        setHasMoreMessages(!!response.data.nextPage);
      }
      if (isEmpty && currentGroup.group.lastMessage) {
        await sendReadMessageAck(currentGroup.group.id, currentGroup.group.lastMessage.id);
        dispatch(setCurrentGroup({ ...currentGroup, group: { ...currentGroup.group, unreadCount: 0 } }));
      }
      setTimeout(() => scrollRef.current?.scrollBy({ top: 1 }), 5);
    }
    if (isEmpty) {
      setRecvMessageCnt(0);
    }
    setIsLoadingMessages(false);
  };

  useEffect(() => {
    setTimeout(() => getMoreMessages(true), 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGroup?.group.id]);

  useEffect(() => {
    const onRecvGroupMessage: ServerToClientEvents["recvGroupMessage"] = async (body) => {
      if (body.group.id !== currentGroup?.group.id) return;
      setRecvMessageCnt((cnt) => cnt + 1);
      setHistory((messages) => [body, ...messages]);
      await sendReadMessageAck(currentGroup?.group.id!, body.id);
    };
    socket.on("recvGroupMessage", onRecvGroupMessage);

    return () => {
      socket.off("recvGroupMessage", onRecvGroupMessage);
    };
  }, [currentGroup]);

  const handleSendMessage = async ({ message }: typeof form.values) => {
    if (!message) return;
    socket.emit("sendGroupMessage", {
      msg: message,
      groupId: currentGroup?.group.id!,
      type: "text",
    });
    form.setFieldValue("message", "");
  };

  const DisplayMessage = ({ message }: { message: Message }) => (
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

  if (!currentGroup)
    return (
      <Center h={300}>
        <Text color="dimmed">{t("main.empty")}</Text>
      </Center>
    );

  return (
    <>
      <Head>
        <title>Chaty</title>
      </Head>
      <div id="scrollableDiv" className={classes.messageScrollWrapper} ref={scrollRef}>
        <InfiniteScroll
          scrollableTarget="scrollableDiv"
          dataLength={history.length - recvMessageCnt}
          hasMore={hasMoreMessages}
          next={getMoreMessages}
          loader={<Loader size="sm" />}
          className={classes.messageScroll}
          inverse={true}
          key={currentGroup?.group.id}
        >
          {history.map((message) => (
            <DisplayMessage message={message} key={message.id} />
          ))}
        </InfiniteScroll>
      </div>
      <Affix
        w={isOnMobile ? "100%" : "calc(100% - 350px)"}
        position={{ left: isOnMobile ? 0 : 350, bottom: theme.spacing.xl }}
        zIndex={10}
      >
        <Center>
          <Card w={`calc(100% - ${theme.spacing.xl} * 2)`} shadow="sm" p={0} withBorder radius="md">
            <form onSubmit={form.onSubmit(handleSendMessage)}>
              <Textarea
                variant="unstyled"
                maxRows={4}
                placeholder={t("main.send-message").toString()}
                {...form.getInputProps("message")}
                classNames={{ input: classes.sendMessageTextareaInput }}
                onKeyDown={(e) => {
                  const ctrlOrCommandKey = os === "macos" ? e.metaKey : e.ctrlKey;
                  if (ctrlOrCommandKey && e.key === "Enter") {
                    form.setFieldValue("message", form.values.message + "\n");
                    return;
                  }
                  if (e.key === "Enter") {
                    e.preventDefault();
                    form.onSubmit(handleSendMessage)();
                    return;
                  }
                }}
                rightSection={
                  <Transition transition="slide-up" duration={300} mounted={!!form.values.message}>
                    {(styles) => (
                      <ActionIcon
                        disabled={!form.values.message}
                        type="submit"
                        variant="filled"
                        color="indigo"
                        className={classes.sendMessageRightSection}
                        style={styles}
                      >
                        <IconSend size={16} />
                      </ActionIcon>
                    )}
                  </Transition>
                }
                rightSectionWidth={`calc(20px + ${theme.spacing.lg})`}
              />
            </form>

            <Group className={classes.sendMessageActions}>
              <Popover
                zIndex={1000}
                withinPortal
                opened={showEmojiPicker}
                closeOnClickOutside
                onClose={() => setShowEmojiPicker(false)}
              >
                <Popover.Target>
                  <ActionIcon onClick={() => setShowEmojiPicker(true)}>
                    <IconMoodSmile size="1rem" />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown p={0} style={{ border: "none", borderRadius: 10 }}>
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji: { native: string }) => {
                      form.setFieldValue("message", form.values.message + emoji.native);
                      setShowEmojiPicker(false);
                    }}
                    locale={i18n.language}
                    theme={theme.colorScheme}
                  />
                </Popover.Dropdown>
              </Popover>
            </Group>
          </Card>
        </Center>
      </Affix>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? defaultLocale, ["common", "app"])),
  },
});

const Navbar = ({ children }: { children: ReactNode }) => {
  const { joinedGroups, mutate } = useJoinedGroups();
  const { classes, cx } = useStyles();
  const dispatch = useAppDispatch();
  const currentGroup = useAppSelector(selectCurrentGroup);
  const [subNavbarOpened, setSubNavbarOpened] = useState(false);
  const [scroll, scrollTo] = useWindowScroll();

  const truncate = (str: string, maxLength: number) => {
    if (str.length >= maxLength) return `${str.slice(0, maxLength)}...`;
    return str;
  };

  useEffect(() => {
    mutate();
  }, [currentGroup]);

  useEffect(() => {
    const onRecvGroupMessage: ServerToClientEvents["recvGroupMessage"] = async (body) => {
      mutate();
    };
    socket.on("recvGroupMessage", onRecvGroupMessage);

    return () => {
      socket.off("recvGroupMessage", onRecvGroupMessage);
    };
  }, [currentGroup]);

  return (
    <AppNavbar
      subNavbarOpened={subNavbarOpened}
      setSubNavbarOpened={setSubNavbarOpened}
      title={currentGroup?.group?.name}
      subNavbarContent={
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
                    disabled={!group.group.unreadCount || group.group.id === currentGroup?.group.id}
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
      }
    >
      {children}
    </AppNavbar>
  );
};

const AppLayout = (page: ReactNode) => {
  return <Navbar>{page}</Navbar>;
};

AppIndexPage.getLayout = AppLayout;

export default AppIndexPage;
