/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return hashedPassword;
}

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return await bcrypt.compare(plainPassword, hashedPassword);
}
