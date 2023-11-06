import { Member } from './member';

export class MemberDTO {
  private constructor() {}

  static toEntity(member: Member): Member {
    const entity = new Member();
    entity.id = member.id;
    entity.email = member.email;
    entity.name = member.name;
    return entity;
  }

  static toPersist(member: Member): any {
    return {
      id: member.id,
      email: member.email,
      name: member.name,
    };
  }
}
