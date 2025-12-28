# DNA Processor

A web application for processing DNA data from CSV files and folders.

## Features

- **File Input**: Accept single DNA files (CSV, TXT, ZIP)
- **Folder Input**: Accept folders containing DNA data (multiple files or mixed file types)
- **ZIP Support**: Extract and process DNA files from ZIP archives
- **Text File Processing**: Process genome data from TXT files (tab-delimited, comma-delimited, or space-delimited)
- **CSV Parsing**: Robust CSV parsing with header detection and validation
- **DNA Processing**: Process and merge DNA data from multiple sources
- **Extensible Architecture**: Support for future file/folder types

## Project Structure

```
src/
├── components/          # React components
├── services/            # Business logic & file processing
│   ├── fileInput/       # File/folder input handling
│   ├── csvParser/       # CSV parsing utilities
│   └── dnaProcessor/    # DNA data processing
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── styles/              # Global styles
└── main.tsx             # Entry point
```

## Technology Stack

- **React** + **TypeScript** - UI framework
- **Vite** - Build tooling
- **papaparse** - CSV parsing library
- **File System Access API** - Directory handling (modern browsers)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Browser Compatibility

- File input: All modern browsers
- Directory input: Chrome/Edge (File System Access API)
- Fallback: File input for older browsers

## Usage

The application supports:

1. **Single File Input**: Upload individual DNA files (CSV, TXT, or ZIP)
2. **Multiple File Input**: Upload multiple DNA files at once
3. **Directory Input**: Select a folder containing DNA data files (Chrome/Edge)
4. **ZIP Files**: ZIP archives are automatically extracted and all DNA files within are processed

Files are automatically:
- Detected and filtered (CSV, TXT files)
- ZIP files are extracted and their contents processed
- Parsed with header detection (for CSV) or delimiter detection (for TXT)
- Validated for DNA data structure
- Processed and merged (if multiple files)

## File/Folder Processing

### Supported File Types

#### CSV Files
- Header row (column names)
- DNA data records
- Standard CSV format (comma, semicolon, or tab delimited)

#### TXT Files (Genome Data)
- Tab-delimited, comma-delimited, or space-delimited formats
- Automatic delimiter detection
- Header detection (if present) or auto-generated column names

#### ZIP Files
- Extracted automatically
- All supported file types (CSV, TXT) within ZIP are processed
- Nested ZIP files are not supported (only one level deep)

### Folders

When selecting a folder:
- All supported DNA files (CSV, TXT) in the folder are processed
- ZIP files are extracted and their contents processed
- Recursive subfolder scanning is supported
- Other file types are ignored (extensible for future file types)

## Architecture

### File Input Service

Handles file and directory selection:
- `FileInputHandler` - Main file/directory input handler
- `DirectoryProcessor` - Recursive folder scanning
- `FileTypeDetector` - File type detection and filtering

### CSV Parser Service

Parses and validates CSV files:
- `CSVParser` - Generic CSV parsing utilities
- `DNAFileValidator` - DNA-specific validation
- `DNAFileProcessor` - Process CSV files into DNA data format

### DNA Processor Service

Processes and merges DNA data:
- `DNADataProcessor` - Main processing orchestration
- `DNADataMerger` - Merge data from multiple files/folders

## Future Enhancements

- Support for additional file formats (JSON, XML, etc.)
- Custom DNA data schema validation
- Data transformation and filtering
- Export capabilities
- Visualization of DNA data

## License

ISC

