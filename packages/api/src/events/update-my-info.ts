import { User } from '../entities/user';
import { ErrorCode } from './error-code';

export interface UpdateMyInfoInput {
  name?: User['name'];
  color?: User['color'];
  isBackground?: User['isBackground'];
}

export interface UpdateMyInfoOutput {
  success: boolean;
  errorCode?: ErrorCode;

  myInfo: User;
}
