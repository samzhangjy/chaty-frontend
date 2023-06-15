import GroupDrawer from "@/components/AppGroup/GroupDrawer";
import GroupPreviewList from "@/components/AppGroup/GroupPreviewList";
import AppNavbar from "@/components/AppNavbar";
import DisplayMessage from "@/components/Message/DisplayMessage";
import MessageTextarea from "@/components/Message/MessageTextarea";
import { defaultLocale } from "@/config/locales";
import getGroupMessages from "@/features/group/getMessages";
import { selectCurrentGroup, setCurrentGroup } from "@/features/group/groupSlice";
import sendReadMessageAck from "@/features/group/sendReadMessageAck";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import useJoinedGroups from "@/hooks/useJoinedGroups";
import { ServerToClientEvents, socket } from "@/socket";
import Message from "@/types/message";
import { ActionIcon, Center, Loader, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots } from "@tabler/icons-react";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { ReactNode, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { NextPageWithLayout } from "../_app";
import { createStyles } from "@mantine/core";
import { useRouter } from "next/router";
import getGroup from "@/features/group/getGroup";

const useStyles = createStyles((theme) => ({
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
  const { t } = useTranslation("app");
  const [history, setHistory] = useState<Message[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [recvMessageCnt, setRecvMessageCnt] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (router.query.groupId) {
      getGroup(parseInt(router.query.groupId as string)).then((group) => {
        dispatch(setCurrentGroup(group.data?.group ?? null));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

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

  const handleSendMessage = async (message: string) => {
    if (!message) return;
    socket.emit("sendGroupMessage", {
      msg: message,
      groupId: currentGroup?.group.id!,
      type: "text",
    });
  };

  if (!currentGroup)
    return (
      <Center h={300}>
        <Text color="dimmed">{t("main.group.empty")}</Text>
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
      <MessageTextarea onSendMessage={handleSendMessage} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? defaultLocale, ["common", "app"])),
  },
});

const Navbar = ({ children }: { children: ReactNode }) => {
  const { mutate } = useJoinedGroups();
  const currentGroup = useAppSelector(selectCurrentGroup);
  const [subNavbarOpened, setSubNavbarOpened] = useState(false);
  const [isDrawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  useEffect(() => {
    mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGroup]);

  useEffect(() => {
    const onRecvGroupMessage: ServerToClientEvents["recvGroupMessage"] = async (body) => {
      mutate();
    };
    socket.on("recvGroupMessage", onRecvGroupMessage);

    return () => {
      socket.off("recvGroupMessage", onRecvGroupMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGroup]);

  return (
    <AppNavbar
      subNavbarOpened={subNavbarOpened}
      setSubNavbarOpened={setSubNavbarOpened}
      title={currentGroup?.group?.name}
      subNavbarContent={<GroupPreviewList setSubNavbarOpened={setSubNavbarOpened} />}
      headerActions={
        <>
          {currentGroup?.group && (
            <ActionIcon onClick={openDrawer}>
              <IconDots size="1rem" />
            </ActionIcon>
          )}
        </>
      }
    >
      {children}
      <GroupDrawer opened={isDrawerOpened} onClose={closeDrawer} />
    </AppNavbar>
  );
};

const AppLayout = (page: ReactNode) => {
  return <Navbar>{page}</Navbar>;
};

AppIndexPage.getLayout = AppLayout;

export default AppIndexPage;
