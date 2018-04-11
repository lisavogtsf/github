class File {
  static empty() {
    return new File({path: null, mode: null, symlink: null});
  }

  constructor({path, mode, symlink}) {
    this.path = path;
    this.mode = mode;
    this.symlink = symlink;
  }

  getPath() {
    return this.path;
  }

  getMode() {
    return this.mode;
  }

  isSymlink() {
    return this.getMode() === '120000';
  }

  isRegularFile() {
    return this.getMode() === '100644' || this.getMode() === '100755';
  }

  getSymlink() {
    return this.symlink;
  }

  clone(opts = {}) {
    return new File({
      path: opts.path !== undefined ? opts.path : this.path,
      mode: opts.mode !== undefined ? opts.mode : this.mode,
      symlink: opts.symlink !== undefined ? opts.symlink : this.symlink,
    });
  }
}

class Patch {
  constructor({status, hunks}) {
  }

  getStatus() {
    return this.status;
  }

  getHunks() {
    return this.hunks;
  }

  clone(opts = {}) {
    return new Patch({
      status: opts.status !== undefined ? opts.status : this.status,
      hunks: opts.hunks !== undefined ? opts.hunks : this.hunks,
    });
  }
}

export default class FilePatch {
  static File = File;
  static Patch = Patch;

  constructor(oldFile, newFile, patch) {
    this.oldFile = oldFile;
    this.newFile = newFile;
    this.patch = patch;

    this.changedLineCount = this.getHunks().reduce((acc, hunk) => {
  clone(opts = {}) {
    const oldFile = opts.oldFile !== undefined ? opts.oldFile : this.getOldFile();
    const newFile = opts.newFile !== undefined ? opts.newFile : this.getNewFile();
    const patch = opts.patch !== undefined ? opts.patch : this.patch;
    return new FilePatch(oldFile, newFile, patch);
  }

  getOldFile() {
    return this.oldFile;
  }

  getNewFile() {
    return this.newFile;
  }

  getPatch() {
    return this.patch;
  }

    return this.getOldFile().getPath();
    return this.getNewFile().getPath();
  }

  getOldMode() {
    return this.getOldFile().getMode();
  }

  getNewMode() {
    return this.getNewFile().getMode();
  }

  getOldSymlink() {
    return this.getOldFile().getSymlink();
  }

  getNewSymlink() {
    return this.getNewFile().getSymlink();
  }

  didChangeExecutableMode() {
    const oldMode = this.getOldMode();
    const newMode = this.getNewMode();
    return oldMode === '100755' && newMode !== '100755' ||
      oldMode !== '100755' && newMode === '100755';
  }

  didChangeSymlinkMode() {
    const oldMode = this.getOldMode();
    const newMode = this.getNewMode();
    return oldMode === '120000' && newMode !== '120000' ||
      oldMode !== '120000' && newMode === '120000';
  }

  hasSymlink() {
    return this.getOldFile().getSymlink() || this.getNewFile().getSymlink();
  }

  hasTypechange() {
    const oldFile = this.getOldFile();
    const newFile = this.getNewFile();
    return (oldFile.isSymlink() && newFile.isRegularFile()) ||
           (newFile.isSymlink() && oldFile.isRegularFile());
    return this.getPatch().getStatus();
    return this.getPatch().getHunks();
    const wholeFileSelected = this.changedLineCount === [...selectedLines].filter(line => line.isChanged()).length;
    if (wholeFileSelected) {
      if (this.hasTypechange() && this.getStatus() === 'deleted') {
        // handle special case when symlink is created where a file was deleted. In order to stage the file deletion,
        // we must ensure that the created file patch has no new file
        return this.clone({
          newFile: File.empty(),
        });
      } else {
        return this;
      }
    } else {
      const hunks = this.getStagePatchHunks(selectedLines);
      if (this.getStatus() === 'deleted') {
        // Set status to modified
        return this.clone({
          newFile: this.getOldFile(),
          patch: this.getPatch().clone({hunks, status: 'modified'}),
        });
      } else {
        return this.clone({
          patch: this.getPatch().clone({hunks}),
        });
      }
  }
  getStagePatchHunks(selectedLines) {
      // eslint-disable-next-line max-len
    return hunks;
    case 'modified':
      invertedStatus = 'modified';
      break;
    case 'added':
      invertedStatus = 'deleted';
      break;
    case 'deleted':
      invertedStatus = 'added';
      break;
    default:
        // throw new Error(`Unknown Status: ${this.getStatus()}`);
    return this.clone({
      oldFile: this.getNewFile(),
      newFile: this.getOldFile(),
      patch: this.getPatch().clone({
        status: invertedStatus,
        hunks: invertedHunks,
      }),
    });
      if (this.hasTypechange() && this.getStatus() === 'added') {
        // handle special case when a file was created after a symlink was deleted.
        // In order to unstage the file creation, we must ensure that the unstage patch has no new file,
        // so when the patch is applied to the index, there file will be removed from the index
        return this.clone({
          oldFile: File.empty(),
        }).getUnstagePatch();
      } else {
        return this.getUnstagePatch();
      }
    const hunks = this.getUnstagePatchHunks(selectedLines);
    if (this.getStatus() === 'added') {
      return this.clone({
        oldFile: this.getNewFile(),
        patch: this.getPatch().clone({hunks, status: 'modified'}),
      }).getUnstagePatch();
    } else {
      return this.clone({
        patch: this.getPatch().clone({hunks}),
      }).getUnstagePatch();
    }
  }

  getUnstagePatchHunks(selectedLines) {
    return hunks;
    if (this.hasTypechange()) {
      const left = this.clone({
        newFile: File.empty(),
        patch: this.getOldSymlink() ? new Patch({status: 'deleted', hunks: []}) : this.getPatch(),
      });
      const right = this.clone({
        oldFile: File.empty(),
        patch: this.getNewSymlink() ? new Patch({status: 'added', hunks: []}) : this.getPatch(),
      });

      return left.toString() + right.toString();
    } else if (this.getStatus() === 'added' && this.getNewFile().isSymlink()) {
      const symlinkPath = this.getNewSymlink();
      return this.getHeaderString() + `@@ -0,0 +1 @@\n+${symlinkPath}\n\\ No newline at end of file\n`;
    } else if (this.getStatus() === 'deleted' && this.getOldFile().isSymlink()) {
      const symlinkPath = this.getOldSymlink();
      return this.getHeaderString() + `@@ -1 +0,0 @@\n-${symlinkPath}\n\\ No newline at end of file\n`;
    } else {
      return this.getHeaderString() + this.getHunks().map(h => h.toString()).join('');
    }
    const fromPath = this.getOldPath() || this.getNewPath();
    const toPath = this.getNewPath() || this.getOldPath();
    let header = `diff --git a/${toGitPathSep(fromPath)} b/${toGitPathSep(toPath)}`;
    header += '\n';
    if (this.getStatus() === 'added') {
      header += `new file mode ${this.getNewMode()}`;
      header += '\n';
    } else if (this.getStatus() === 'deleted') {
      header += `deleted file mode ${this.getOldMode()}`;
      header += '\n';
    }
    header += this.getOldPath() ? `--- a/${toGitPathSep(this.getOldPath())}` : '--- /dev/null';