/// <reference types="vite/client" />

interface FileSystemDirectoryHandle {
  readonly kind: 'directory';
  readonly name: string;
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
  getFileHandle(name: string, options?: { create?: boolean }): Promise<FileSystemFileHandle>;
  getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<FileSystemDirectoryHandle>;
}

interface FileSystemFileHandle {
  readonly kind: 'file';
  readonly name: string;
  getFile(): Promise<File>;
}

type FileSystemHandle = FileSystemDirectoryHandle | FileSystemFileHandle;

interface Window {
  showDirectoryPicker?(options?: { mode?: 'read' | 'readwrite' }): Promise<FileSystemDirectoryHandle>;
}









