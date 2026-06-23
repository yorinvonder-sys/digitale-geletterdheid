// Type declarations for Vite's ?raw import suffix.
// Allows importing any file as a raw string, e.g.:
//   import text from '../../some/file.md?raw'
declare module '*?raw' {
    const content: string;
    export default content;
}
