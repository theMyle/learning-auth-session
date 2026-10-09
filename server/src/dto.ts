export type LoginDto = {
  username: string;
  password: string;
};

export type ProfileDto = {
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
};
