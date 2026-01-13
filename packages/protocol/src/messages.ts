import * as z from "zod/v4-mini";

// Individual message schemas
export const InitMessageSchema = z.object({
  type: z.literal("init"),
});

export const BootstrapMessageSchema = z.object({
  type: z.literal("bootstrap"),
});

export const PayloadMessageSchema = z.object({
  type: z.literal("message"),
  payload: z.string(),
});

// Union schema for all messages
export const MessageSchema = z.union([
  InitMessageSchema,
  BootstrapMessageSchema,
  PayloadMessageSchema,
]);

// Inferred TypeScript types
export type InitMessage = z.infer<typeof InitMessageSchema>;
export type BootstrapMessage = z.infer<typeof BootstrapMessageSchema>;
export type PayloadMessage = z.infer<typeof PayloadMessageSchema>;
export type Message = z.infer<typeof MessageSchema>;

// Validation helper
export function parseMessage(data: unknown): Message | null {
  const result = z.safeParse(MessageSchema, data);
  return result.success ? result.data : null;
}
