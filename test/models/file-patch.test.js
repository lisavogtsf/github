import {cloneRepository, buildRepository} from '../helpers';
      const filePatch = new FilePatch('a.txt', 'a.txt', 'modified', [
      assert.deepEqual(filePatch.getStagePatchForLines(new Set(linesFromHunk2)), new FilePatch(
      assert.deepEqual(filePatch.getStagePatchForLines(new Set(selectedLines)), new FilePatch(
        const filePatch = new FilePatch('a.txt', null, 'deleted', [
        assert.deepEqual(filePatch.getStagePatchForLines(new Set(linesFromHunk)), new FilePatch(
          'a.txt', 'a.txt', 'deleted', [
        const filePatch = new FilePatch('a.txt', null, 'deleted', [
        assert.deepEqual(filePatch.getStagePatchForLines(new Set(linesFromHunk)), new FilePatch(
      const filePatch = new FilePatch('a.txt', 'a.txt', 'modified', [
      assert.deepEqual(filePatch.getUnstagePatchForLines(lines), new FilePatch(
        const filePatch = new FilePatch(null, 'a.txt', 'added', [
        assert.deepEqual(filePatch.getUnstagePatchForLines(new Set(linesFromHunk)), new FilePatch(
          'a.txt', 'a.txt', 'deleted', [
        const filePatch = new FilePatch(null, 'a.txt', 'added', [
        assert.deepEqual(filePatch.getUnstagePatchForLines(new Set(linesFromHunk)), new FilePatch(
    const filePatch = new FilePatch(null, 'a.txt', 'added', [
    assert.deepEqual(filePatch.getUnstagePatchForLines(new Set(linesFromHunk)), new FilePatch(
      'a.txt', 'a.txt', 'deleted', [
  });
  if (process.platform === 'win32') {
    describe('getHeaderString()', function() {
      it('formats paths with git line endings', function() {
        const oldPath = path.join('foo', 'bar', 'old.js');
        const newPath = path.join('baz', 'qux', 'new.js');
        const patch = new FilePatch(oldPath, newPath, 'modified', []);
        assert.equal(patch.getHeaderString(), dedent`
          --- a/foo/bar/old.js
          +++ b/baz/qux/new.js
  }