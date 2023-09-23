import { User } from '../entities/user';
import { ErrorCode } from './error-code';

export interface PointerMoveInput {
  element: string;
  x: number;
  y: number;
}

export interface PointerMoveOutput {
  success: boolean;
  errorCode?: ErrorCode;

  userId: User['id'];
  element: string;
  x: number;
  y: number;
}
