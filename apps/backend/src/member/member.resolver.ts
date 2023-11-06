import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Member } from './member';
import { MemberRepository } from './member.repository';
import { SignUpInput } from './usecase/auth/sign-up';
import { SignInInput } from './usecase/auth/sign-in';

@Resolver(() => Member)
export class MemberResolver {
  @Query(() => Member, { nullable: true })
  async member(@Arg('id', () => Int) id: number): Promise<Member | undefined> {
    return MemberRepository.findOne(id);
  }

  @Query(() => [Member])
  async members(): Promise<Member[]> {
    return MemberRepository.findAll();
  }

  @Mutation(() => Member)
  async signUp(@Arg('input') input: SignUpInput): Promise<Member> {
    return undefined as any;
  }

  @Mutation(() => Member)
  async signIn(@Arg('input') input: SignInInput): Promise<Member> {
    return undefined as any;
  }
}
