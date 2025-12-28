# SNPedia Integration Notes

## HTTP 403 Errors

SNPedia may return HTTP 403 (Forbidden) errors when:
- Too many requests are made too quickly
- Requests appear automated (missing browser-like headers)
- Rate limiting is triggered

## Current Handling

The system handles 403 errors gracefully:
- **No crashes**: 403s are treated as expected failures
- **Reduced logging**: First 403 is logged at DEBUG level, not WARNING
- **Progressive delays**: Longer waits between retries for 403s (5s, 10s, 15s)
- **Respectful rate limiting**: 
  - Concurrency limited to 3 requests at once
  - 0.5 second delay between requests
  - Only 2 retries for 403s (they typically won't succeed)

## Expected Behavior

403 errors are **normal and expected** when:
- Processing many RSIDs
- SNPedia is rate-limiting
- Some RSIDs don't exist in SNPedia

The system will:
1. Cache empty records for failed RSIDs
2. Continue processing other RSIDs
3. Never crash the pipeline

## Improving Success Rate

If you're getting many 403s:
1. Process fewer RSIDs at once
2. Increase delays between requests (in `config/settings.py`)
3. Reduce concurrency limit further
4. Consider using SNPedia's API if available (currently using HTML scraping)

## Alternative: Skip SNPedia

If 403s are problematic, you can skip SNPedia expansion entirely by:
- Not selecting candidate variants that require SNPedia
- Or modifying the pipeline to skip Layer 3

The system works perfectly fine without SNPedia data - it just won't have biological context for variants.









