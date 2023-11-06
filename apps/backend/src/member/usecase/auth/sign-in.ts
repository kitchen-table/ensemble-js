import { Field, InputType } from 'type-graphql';

@InputType()
export class SignInInput {
  @Field(() => String)
  email!: string;
}

export class SignIn {
  private constructor() {}

  static async execute(input: SignInInput): Promise<void> {}
}
