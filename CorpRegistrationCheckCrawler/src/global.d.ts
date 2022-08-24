export {};

declare global {
  interface Window {
    api: {
      manageInput(id: string, pw: string, inputFilePath: string[]): void;
      convertFileName(inputFilePath: string[]): void;
      readCompanyList(): void;
    };
  }
}
