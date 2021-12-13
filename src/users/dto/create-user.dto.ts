export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  joinedAt: Date = new Date();
}
