import { User } from '../entities/user';
import { ErrorCode } from './error-code';

export interface GuestLoginInput {}

export interface GuestLoginOutput {
  success: boolean;
  errorCode?: ErrorCode;

  myInfo: User;
}
