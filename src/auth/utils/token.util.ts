import * as bcrypt from 'bcrypt';
import { HASH_SALT_ROUNDS } from '../constants/auth.constants';

export class TokenUtil {
  static async hash(token: string): Promise<string> {
    return bcrypt.hash(token, HASH_SALT_ROUNDS);
  }

  static async compare(token: string, hash: string): Promise<boolean> {
    return bcrypt.compare(token, hash);
  }
}
