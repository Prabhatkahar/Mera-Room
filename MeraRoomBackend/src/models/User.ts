export interface User {
  id: string;
  username: string;
  password: string;
}

// In-memory user array (replace with DB later)
export const users: User[] = [];
