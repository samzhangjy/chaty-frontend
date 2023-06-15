import { createStyles, rem } from "@mantine/core";

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
    background: `${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]} !important`,
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

export default useStyles;
