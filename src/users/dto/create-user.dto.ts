export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly image?: string;
  readonly token?: string;
  readonly tokenExp?: number;
}
