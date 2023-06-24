import { Session } from 'next-auth/core/types';

declare module 'next' {
  interface NextApiRequest {
    session?: Session;
  }
}
