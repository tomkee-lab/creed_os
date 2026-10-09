import type { Session, User } from '$lib/server/auth';

declare module 'd3-scale';

declare global {
  namespace App {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
