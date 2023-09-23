import { User } from '../entities/user';
import { ErrorCode } from './error-code';

export interface RoomUserListInput {
  roomId: string;
}

export interface RoomUserListOutput {
  success: boolean;
  errorCode?: ErrorCode;

  users: User[];
}
