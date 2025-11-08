/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
export interface User {
  createdAt: Date;
  id: string;
  password: string;
  role: Role;
  updatedAt: Date;
}

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
