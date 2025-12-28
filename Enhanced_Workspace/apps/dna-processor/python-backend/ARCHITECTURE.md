# Architecture Documentation

## Layer Separation

The system follows strict layer separation where each layer:
- Accepts structured input
- Produces structured output
- Never directly touches the GUI
- Maintains clear invariants

## Layer Overview

### Layer 0: Input Normalization
- **Input:** Raw DNA files (23andMe .txt, CSV, etc.)
- **Output:** Canonical DataFrame with [rsid, chrom, pos, genotype]
- **Invariants:** RSIDs start with "rs", positions are integers, duplicates collapsed

### Layer 1: ClinVar Annotation
- **Input:** RSIDs from Layer 0
- **Output:** RSID → {clinical_significance, phenotype_list, rcv_accession}
- **Invariants:** Missing data returns empty strings, O(1) lookup, atomic cache writes

### Layer 2: Candidate Selection
- **Input:** Annotated variants from Layer 1
- **Output:** Sorted list of candidate RSIDs
- **Invariants:** Deterministic selection, never silently drops variants

### Layer 3: SNPedia Expansion
- **Input:** Candidate RSIDs
- **Output:** RSID → {extract, categories, url, source}
- **Invariants:** Never crashes pipeline, respects concurrency limits, checkpoint resumable

### Layer 4: Population Context
- **Input:** RSIDs
- **Output:** RSID → allele frequency (0.0-1.0)
- **Invariants:** Streaming VCF parsing, never blocks GUI, missing AF allowed

### Layer 5: Annotation Synthesis
- **Input:** All annotation data from previous layers
- **Output:** Unified DataFrame with all annotations
- **Invariants:** Stable column names, serializes to CSV/JSON cleanly

### Layer 6: AI Interpretation (Optional)
- **Input:** Annotated DataFrame
- **Output:** RSID → summary text
- **Invariants:** Clearly marked as interpretive, graceful degradation

### Layer 7: GUI
- **Input:** User file selection, pipeline outputs
- **Output:** Visual display, user interactions
- **Invariants:** Never blocks on background work, Qt signals only

### Layer 8: Persistence
- **Input:** Any data to persist
- **Output:** Saved files/checkpoints
- **Invariants:** Atomic writes, deterministic outputs, no silent overwrites

## Data Flow

```
User File
  ↓
Layer 0: Normalize → [rsid, chrom, pos, genotype]
  ↓
Layer 1: ClinVar → {clinical_significance, phenotypes, rcv}
  ↓
Layer 2: Select Candidates → [candidate_rsids]
  ↓
Layer 3: SNPedia → {extract, categories} (async)
  ↓
Layer 4: Population → {frequency} (parallel)
  ↓
Layer 5: Synthesize → Unified DataFrame
  ↓
Layer 6: AI Summarize → {summaries} (optional)
  ↓
Layer 7: GUI Display → User sees results
```

## Design Principles

1. **Epistemic Discipline:** Each layer answers one clear question
2. **Determinism:** Same input → same output always
3. **Inspectability:** Every transformation is reversible or inspectable
4. **Non-Diagnostic:** System provides information, not medical advice
5. **Local-First:** All data processing happens locally
6. **Transparency:** Source data and transformations are traceable









