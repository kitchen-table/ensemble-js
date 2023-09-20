export class Logger {
  static log(message: string): void {
    // YYYY-MM-DD HH:MM:SS <message>
    const now = new Date();
    const timestamp = now.toISOString().replace("T", " ").replace("Z", "");
    console.log(`${timestamp} ${message}`);
  }
}
