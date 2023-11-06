import { db } from '../knex';
import { Member } from './member';
import { MemberDTO } from './member.dto';

export class MemberRepository {
  private constructor() {}

  static async findOne(id: number): Promise<Member | undefined> {
    const member = await db('members').select('*').where({ id }).first();
    if (!member) return undefined;
    return MemberDTO.toEntity(member);
  }

  static async findAll(): Promise<Member[]> {
    return (await db('members').select('*')).map((member) => MemberDTO.toEntity(member));
  }
}
