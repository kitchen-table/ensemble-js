export enum EventType {
  /** 비회원 로그인 (유저 정보 생성) */
  GUEST_LOGIN = 'GUEST_LOGIN',

  /** 방 입장 */
  ROOM_JOIN = 'ROOM_JOIN',

  /** 방 퇴장 */
  ROOM_LEAVE = 'ROOM_LEAVE',

  /** 방에 접속 중인 모든 유저 정보 반환 */
  ROOM_USER_LIST = 'ROOM_USER_LIST',

  /** 마우스 또는 터치 포인터가 움직였을때 공유 */
  POINTER_MOVE = 'POINTER_MOVE',

  /** 마우스 또는 터치 포인터가 클릭했을때 공유 */
  POINTER_CLICK = 'POINTER_CLICK',

  /** 채팅했을때 공유 */
  CHAT_MESSAGE = 'CHAT_MESSAGE',

  /** 유저 개인 정보 부분 업데이트 요청 */
  UPDATE_MY_INFO = 'UPDATE_MY_INFO',
}
