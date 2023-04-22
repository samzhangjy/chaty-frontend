export class FetchError extends Error {
  public status!: number;

  constructor(status: number) {
    super("Fetch failed.");
    this.status = status;
  }
}
