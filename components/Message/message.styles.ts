import { createStyles, rem } from "@mantine/core";

const useStyles = createStyles((theme) => ({
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
