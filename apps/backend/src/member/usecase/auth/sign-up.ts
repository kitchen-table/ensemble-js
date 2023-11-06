import { Field, InputType } from 'type-graphql';

@InputType()
export class SignUpInput {
  @Field(() => String)
  email!: string;
}

export class SignUp {
  private constructor() {}

  static async execute(input: SignUpInput): Promise<void> {}
}
