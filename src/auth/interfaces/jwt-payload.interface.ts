export interface JwtPayload {
  sub: string;

  email: string;

  type: 'ACCESS' | 'REFRESH' | 'TEMP';
}
