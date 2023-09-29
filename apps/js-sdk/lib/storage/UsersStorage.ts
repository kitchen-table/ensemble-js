import { Signal, signal } from '@preact/signals';
import { User } from '@packages/api';
import invariant from 'ts-invariant';

class UsersStorage {
  static usersSignal: Signal<Map<string, User>> = signal<Map<string, User>>(new Map());

  constructor() {}

  set(users: User[]) {
    UsersStorage.usersSignal.value = new Map(users.map((user) => [user.id, user]));
  }

  get(userId: string) {
    const user = UsersStorage.usersSignal.peek().get(userId);
    invariant(user, `user not found. userId: ${userId}`);
    return user;
  }

  push(user: User) {
    const updated = new Map(UsersStorage.usersSignal.peek());
    updated.set(user.id, user);
    UsersStorage.usersSignal.value = updated;
  }

  delete(userId: string) {
    const updated = new Map(UsersStorage.usersSignal.peek());
    updated.delete(userId);
    UsersStorage.usersSignal.value = updated;
  }
}

export default UsersStorage;
