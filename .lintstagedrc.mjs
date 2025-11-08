export default {
  '*.{ts,json}': (filenames) => {
    const filtered = filenames.filter(
      (file) => !(file.includes('/test/') || file.endsWith('.spec.ts')),
    );

    return filtered.length
      ? [`biome check --write --no-errors-on-unmatched ${filtered.join(' ')}`]
      : [];
  },
};
