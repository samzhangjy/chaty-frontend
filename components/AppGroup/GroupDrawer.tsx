import { selectCurrentGroup } from "@/features/group/groupSlice";
import { useAppSelector } from "@/hooks/store";
import { getUserAvatar } from "@/utils/avatar";
import { truncate } from "@/utils/string";
import { Avatar, Drawer, Text, SimpleGrid, Stack, Title } from "@mantine/core";
import { useTranslation } from "next-i18next";

export type GroupDrawerProps = {
  opened: boolean;
  onClose: () => void;
};

const GroupDrawer = ({ opened, onClose }: GroupDrawerProps) => {
  const { t } = useTranslation("app");
  const currentGroup = useAppSelector(selectCurrentGroup);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      title={t("main.group.details")}
      overlayProps={{ opacity: 0.4, blur: 3 }}
    >
      <Title order={4} mb="lg">
        {t("main.group.members")} ({currentGroup?.group.members.length})
      </Title>
      <SimpleGrid cols={5} spacing="md">
        {currentGroup?.group.members.map((member) => (
          <Stack key={member.id} align="center" spacing={5}>
            <Avatar src={getUserAvatar(member.user)} />
            <Text color="dimmed" size="xs">
              {truncate(member.user.username, 10)}
            </Text>
          </Stack>
        ))}
      </SimpleGrid>
    </Drawer>
  );
};

export default GroupDrawer;
