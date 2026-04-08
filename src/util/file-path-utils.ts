import path from 'path';
import { fileURLToPath } from 'url';

class FilePathUtils {
  __filename: string;
  __dirname: string;

  constructor(importMetaUrl: string) {
    this.__filename = fileURLToPath(importMetaUrl);
    this.__dirname = path.dirname(this.__filename);
  }

  getResolvedPath(relativePath: string): string {
    return path.join(this.__dirname, relativePath);
  }
}

function createFilePathUtils(importMetaUrl: string): FilePathUtils {
  if (new.target) throw new TypeError("Cannot call a class as a function");
  return new FilePathUtils(importMetaUrl);
}

export default createFilePathUtils;