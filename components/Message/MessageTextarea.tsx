import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { ActionIcon, Affix, Card, Center, Group, Popover, Textarea, Transition } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery, useOs } from "@mantine/hooks";
import { IconMoodSmile, IconSend } from "@tabler/icons-react";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import useStyles from "./message.styles";

export type MessageTextareaProps = {
  onSendMessage: (message: string) => void;
};

const MessageTextarea = ({ onSendMessage }: MessageTextareaProps) => {
  const { classes, theme } = useStyles();
  const isOnMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const os = useOs();
  const form = useForm({
    initialValues: {
      message: "",
    },
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { t, i18n } = useTranslation("app");

  const handleSendMessage = ({ message }: typeof form.values) => {
    onSendMessage(message);
    form.setFieldValue("message", "");
  };

  return (
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
  );
};

export default MessageTextarea;
