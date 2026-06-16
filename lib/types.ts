export interface User {
   id: string;
   name: string;
   email: string;
   emailVerified: boolean;
   twoFactorEnabled?: boolean | null;
   createdAt: Date;
   updatedAt: Date;
   image?: string | null | undefined;
}