import { userTokenDto } from './user.dto';

export const getUserFromToken = (token: string) => {
  const payload = token.split('.')[1];
  const body: userTokenDto = JSON.parse(
    Buffer.from(payload, 'base64').toString(),
  );
  return body;
};
