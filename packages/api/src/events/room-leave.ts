import { ErrorCode } from './error-code';

export interface RoomLeaveInput {
  roomId: string;
}

export interface RoomLeaveOutput {
  success: boolean;
  errorCode?: ErrorCode;
}
