// In your component's TypeScript file

export interface ChatMessage {
  UserName: string;
  Message: string;
  isImage?: boolean;
  isDocument?: boolean;
  FileData?: string;
}
