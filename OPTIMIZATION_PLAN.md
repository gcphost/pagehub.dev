# ClassGenerator Optimization Plan

## Current Performance Issues

### 1. **Repeated Regex Matching** (HIGH IMPACT)
- `resolveStyleGuide` and `resolvePalette` use regex on EVERY class
- Called multiple times per component (mobile, desktop, root, hover, focus)
- Regex is expensive: `/^([a-z]+-)?(?:(style|palette):)(.+)$/`

### 2. **Multiple Array Iterations** (HIGH IMPACT)
```javascript
.filter() // 6 times in ClassGene
.map()    // 5 times in ClassGene
```
- Each creates a new array
- Could be combined into single pass

### 3. **Palette Lookup** (MEDIUM IMPACT)
```javascript
palette.find((p) => p.name === paletteName)
```
- Linear search O(n) on every palette reference
- Called many times per component

### 4. **No Caching** (HIGH IMPACT)
- Same props generate same classes every render
- No memoization of results
- Style guide resolution happens repeatedly

### 5. **String Operations** (LOW IMPACT)
- Multiple `.includes()`, `.startsWith()`, `.replace()` calls
- Could be optimized with single-pass parsing

## Recommended Optimizations

### Priority 1: Add Memoization Cache
```javascript
const classCache = new Map();

export const ClassGenerator = (props, view, enabled, ...) => {
  const cacheKey = JSON.stringify({ props, view, enabled, exclude, only });
  if (classCache.has(cacheKey)) {
    return classCache.get(cacheKey);
  }
  
  const result = // ... generate classes
  classCache.set(cacheKey, result);
  return result;
};
```

**Impact**: 80-90% reduction in computation for repeated renders

### Priority 2: Convert Palette to Map
```javascript
// At component mount
const paletteMap = new Map(palette.map(p => [p.name, p.color]));

// In resolution
const paletteColor = paletteMap.get(paletteName);
```

**Impact**: O(1) lookup instead of O(n)

### Priority 3: Combine Filter/Map Chains
```javascript
// Instead of 6 filters + 5 maps
const results = Object.keys(props).reduce((acc, key) => {
  if (!classFilter.includes(key)) return acc;
  const value = props[key];
  if (!value || exclude.includes(key)) return acc;
  // ... all logic in one pass
  acc.push(processedValue);
  return acc;
}, []);
```

**Impact**: 50% reduction in array allocations

### Priority 4: Pre-compile Regex
```javascript
const STYLE_PALETTE_REGEX = /^([a-z]+-)?(?:(style|palette):)(.+)$/;
const PALETTE_REGEX = /^([a-z]+-)?palette:(.+)$/;
```

**Impact**: Small but measurable improvement

### Priority 5: Lazy Style Guide Resolution
```javascript
// Only resolve if actually used
if (value.includes(':')) {
  // resolve
}
```

**Impact**: Skip unnecessary work

## Implementation Strategy

1. **Phase 1**: Add caching (biggest win, easiest to implement)
2. **Phase 2**: Convert palette to Map
3. **Phase 3**: Optimize filter/map chains
4. **Phase 4**: Fine-tune regex and string operations

## Expected Results

- **50-70% faster** class generation
- **Reduced memory allocations** (fewer intermediate arrays)
- **Better scalability** as page complexity grows

## Risks

- Cache invalidation: Need to clear cache when palette/styleGuide changes
- Memory: Cache could grow large (add LRU eviction)
- Complexity: More code to maintain

## Next Steps

1. Add performance profiling to measure current performance
2. Implement Phase 1 (caching) first
3. Benchmark before/after
4. Iterate on other optimizations if needed
