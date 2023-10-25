type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

type UserResponse = Omit<User, "password">;

export type { User, UserResponse };
