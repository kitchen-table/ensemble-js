import { User } from '../entities/user';
import { ErrorCode } from './error-code';

export interface PointerClickInput {
  element: string;
  x: number;
  y: number;
}

export interface PointerClickOutput {
  success: boolean;
  errorCode?: ErrorCode;

  userId: User['id'];
  element: string;
  x: number;
  y: number;
}
