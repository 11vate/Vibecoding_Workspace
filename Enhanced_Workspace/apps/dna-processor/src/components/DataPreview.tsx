import { DNAProcessedData } from '../types/dna';
import styles from './DataPreview.module.css';

interface DataPreviewProps {
  data: DNAProcessedData;
}

export default function DataPreview({ data }: DataPreviewProps) {
  const hasData = data.files.length > 0 && data.totalRecords > 0;
  const hasErrors = data.errors.length > 0;

  if (!hasData && !hasErrors) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Processing Results</h2>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Files Processed:</span>
          <span className={styles.summaryValue}>{data.files.length}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Records:</span>
          <span className={styles.summaryValue}>{data.totalRecords}</span>
        </div>
        {hasErrors && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Errors:</span>
            <span className={styles.summaryValueError}>{data.errors.length}</span>
          </div>
        )}
      </div>

      {hasErrors && (
        <div className={styles.errors}>
          <h3 className={styles.errorsTitle}>Errors</h3>
          <ul className={styles.errorList}>
            {data.errors.map((error, index) => (
              <li key={index} className={styles.errorItem}>
                <strong>{error.filename}:</strong> {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasData && (
        <div className={styles.files}>
          <h3 className={styles.filesTitle}>Processed Files</h3>
          <div className={styles.filesList}>
            {data.files.map((file) => (
              <div key={file.filename} className={styles.fileCard}>
                <div className={styles.fileHeader}>
                  <span className={styles.fileName}>{file.filename}</span>
                  <span className={styles.fileRecords}>{file.records.length} records</span>
                </div>
                {file.headers.length > 0 && (
                  <div className={styles.fileHeaders}>
                    <span className={styles.headersLabel}>Columns:</span>
                    <span className={styles.headersValue}>
                      {file.headers.slice(0, 5).join(', ')}
                      {file.headers.length > 5 && ` +${file.headers.length - 5} more`}
                    </span>
                  </div>
                )}
                {file.metadata?.errors && file.metadata.errors.length > 0 && (
                  <div className={styles.fileErrors}>
                    {file.metadata.errors.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.merged && data.merged.length > 0 && (
        <div className={styles.merged}>
          <h3 className={styles.mergedTitle}>Merged Data Preview</h3>
          <div className={styles.mergedInfo}>
            <p>Total merged records: {data.merged.length}</p>
            {data.files[0]?.headers && (
              <p>Columns: {data.files[0].headers.join(', ')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}









