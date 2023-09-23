import { User } from '../entities/user';
import { ErrorCode } from './error-code';

export interface ChatMessageInput {
  message: string;
}

export interface ChatMessageOutput {
  success: boolean;
  errorCode?: ErrorCode;

  userId: User['id'];
  message: string;
}
