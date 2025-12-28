import { useState } from 'react';
import FileInput from './components/FileInput';
import DataPreview from './components/DataPreview';
import { FileInputHandler } from './services/fileInput';
import { DNADataProcessor } from './services/dnaProcessor';
import type { FileInputResult } from './types/fileInput';
import type { DNAProcessedData } from './types/dna';
import styles from './App.module.css';

function App() {
  const [processedData, setProcessedData] = useState<DNAProcessedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (inputResult: FileInputResult) => {
    setIsProcessing(true);
    setError(null);
    setProcessedData(null);

    try {
      if (inputResult.error) {
        setError(inputResult.error);
        setIsProcessing(false);
        return;
      }

      const result = await DNADataProcessor.process(inputResult);
      setProcessedData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>DNA Processor</h1>
        <p className={styles.subtitle}>
          Upload CSV, TXT, or ZIP DNA files, or select a folder containing DNA data
        </p>
      </header>

      <main className={styles.main}>
        <FileInput
          onFilesSelected={handleFilesSelected}
          accept={['.csv', '.txt', '.zip']}
          multiple={true}
        />

        {isProcessing && (
          <div className={styles.processing}>
            <p>Processing files...</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {processedData && !isProcessing && (
          <DataPreview data={processedData} />
        )}
      </main>

      <footer className={styles.footer}>
        <p>
          {FileInputHandler.isDirectoryInputSupported()
            ? 'Directory selection is supported in this browser'
            : 'Directory selection requires Chrome or Edge browser'}
        </p>
      </footer>
    </div>
  );
}

export default App;
