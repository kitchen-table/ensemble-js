export class BaseStorage<T> {
  constructor(
    protected key: string,
    protected storage: Storage,
  ) {}

  protected restoreData(defaultValue: T): T {
    const saved = this.storage.getItem(this.key);
    if (saved) {
      return JSON.parse(saved);
    }
    return defaultValue;
  }

  protected setItem<T>(value: T) {
    this.storage.setItem(this.key, JSON.stringify(value));
  }
}
