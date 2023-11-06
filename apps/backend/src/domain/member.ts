import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Member {
  /** 사용자 ID */
  @Field(() => Int, { description: '사용자 ID' })
  id!: number;

  /** 사용자 이름 */
  @Field({ description: '사용자 이름' })
  name!: string;

  /** 사용자 이메일 */
  @Field({ description: '사용자 이메일' })
  email!: string;
}
