import { User } from '../entities/user';
import { ErrorCode } from './error-code';

export interface RoomJoinInput {
  roomId: string;
}

export interface RoomJoinOutput {
  success: boolean;
  errorCode?: ErrorCode;

  myInfo: User;
}
