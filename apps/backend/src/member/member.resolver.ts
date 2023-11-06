import { Query, Resolver } from 'type-graphql';
import { Member } from './member';

@Resolver(() => Member)
export class MemberResolver {
  @Query(() => [Member])
  members(): Member[] {
    return [];
  }
}
