import { useRef, useState } from 'react';
import { FileInputHandler } from '../services/fileInput';
import type { FileInputResult } from '../types/fileInput';
import styles from './FileInput.module.css';

interface FileInputProps {
  onFilesSelected: (result: FileInputResult) => void;
  accept?: string[];
  multiple?: boolean;
}

export default function FileInput({ onFilesSelected, accept = ['.csv', '.txt', '.zip'], multiple = true }: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    try {
      const result = multiple
        ? await FileInputHandler.handleMultipleFileInput(files, { accept })
        : await FileInputHandler.handleFileInput(files[0], { accept });
      onFilesSelected(result);
    } catch (error) {
      onFilesSelected({
        type: 'file',
        name: 'Error',
        files: [],
        error: error instanceof Error ? error.message : 'Failed to process files',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleDirectorySelect = async () => {
    if (!FileInputHandler.isDirectoryInputSupported()) {
      alert('Directory selection is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    setIsProcessing(true);
    try {
      const dirHandle = await FileInputHandler.requestDirectoryAccess();
      if (dirHandle) {
        const result = await FileInputHandler.handleDirectoryInput(dirHandle, {
          accept,
          recursive: true,
        });
        onFilesSelected(result);
      }
    } catch (error) {
      onFilesSelected({
        type: 'directory',
        name: 'Error',
        files: [],
        error: error instanceof Error ? error.message : 'Failed to process directory',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={styles.dropZoneContent}>
          <p className={styles.dropZoneText}>
            {isDragOver ? 'Drop files here' : 'Drag and drop files here, or'}
          </p>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className={styles.button}
            >
              {multiple ? 'Select Files' : 'Select File'}
            </button>
            {FileInputHandler.isDirectoryInputSupported() && (
              <button
                type="button"
                onClick={handleDirectorySelect}
                disabled={isProcessing}
                className={styles.button}
              >
                Select Folder
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept.map(a => a.startsWith('.') ? a : `.${a}`).join(',')}
            multiple={multiple}
            onChange={handleFileInputChange}
            className={styles.hiddenInput}
          />
          {isProcessing && <p className={styles.processingText}>Processing...</p>}
        </div>
      </div>
    </div>
  );
}

