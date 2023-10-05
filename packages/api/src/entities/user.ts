import { DateTimeISO } from '../types/datetime';
import { HexCode } from '../types/hex-code';
import { Name } from '../types/name';
import { UUIDv4 } from '../types/uuid';

export interface User {
  /** 유저의 고유 식별 번호 */
  id: UUIDv4;

  /** 유저가 키친 테이블에 첫 접속을 시작한 시각 (YYYY-MM-DD hh:mm:ss) */
  createdAt: DateTimeISO;

  /** 랜덤하게 만들어진 유저의 이름 */
  name: Name;

  /** 유저의 퍼스널 컬러 */
  color: HexCode;

  /**
   * 브라우저를 안보고 있는지 여부
   * @default false
   */
  isBackground: boolean;

  /**
   * 유저가 현재 접속중인 URL
   */
  path: string | null;
}
