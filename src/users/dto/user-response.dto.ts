export class UserResponseDto {
  id: string;
  email: string;
  username: string;
  name?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}
