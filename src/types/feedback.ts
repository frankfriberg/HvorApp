export type SendFeedbackActionState = {
  input?: {
    name?: string;
    email?: string;
    content?: string;
  };
  message?: string;
  error?: string;
};
