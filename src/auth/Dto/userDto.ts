import { Length } from 'class-validator';

export class UserDto {
  @Length(2)
  name: string;
  password: string;
}
