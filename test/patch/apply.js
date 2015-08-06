import {applyPatch} from '../../lib/patch/apply';
import {createPatch} from '../../lib/patch/create';

describe('patch/apply', function() {
  describe('#applyPatch', function() {
    it('should apply patches that change the last line', function() {
      applyPatch(
          'line2\n'
          + 'line3\n'
          + 'line5\n',

          'Index: test\n'
          + '===================================================================\n'
          + '--- test\theader1\n'
          + '+++ test\theader2\n'
          + '@@ -1,3 +1,4 @@\n'
          + ' line2\n'
          + ' line3\n'
          + '+line4\n'
          + ' line5\n')
        .should.equal(
          'line2\n'
          + 'line3\n'
          + 'line4\n'
          + 'line5\n');

      applyPatch(
          'line2\nline3\nline4\n',

          'Index: test\n'
          + '===================================================================\n'
          + '--- test\theader1\n'
          + '+++ test\theader2\n'
          + '@@ -1,3 +1,4 @@\n'
          + ' line2\n'
          + ' line3\n'
          + ' line4\n'
          + '+line5\n')
        .should.equal('line2\nline3\nline4\nline5\n');

      applyPatch(
          'line1\nline2\nline3\nline4\n',

          'Index: test\n'
          + '===================================================================\n'
          + '--- test\theader1\n'
          + '+++ test\theader2\n'
          + '@@ -1,4 +1,4 @@\n'
          + ' line1\n'
          + ' line2\n'
          + ' line3\n'
          + '+line44\n'
          + '-line4\n')
        .should.equal('line1\nline2\nline3\nline44\n');

      applyPatch(
          'line1\nline2\nline3\nline4\n',

          'Index: test\n'
          + '===================================================================\n'
          + '--- test\theader1\n'
          + '+++ test\theader2\n'
          + '@@ -1,4 +1,5 @@\n'
          + ' line1\n'
          + ' line2\n'
          + ' line3\n'
          + '+line44\n'
          + '+line5\n'
          + '-line4\n')
        .should.equal('line1\nline2\nline3\nline44\nline5\n');
    });

    it('should merge EOFNL', function() {
      applyPatch(
          'line1\nline2\nline3\nline4\n',

          'Index: test\n'
          + '===================================================================\n'
          + '--- test\theader1\n'
          + '+++ test\theader2\n'
          + '@@ -1,4 +1,4 @@\n'
          + ' line1\n'
          + ' line2\n'
          + ' line3\n'
          + '+line4\n'
          + '\\ No newline at end of file\n'
          + '-line4\n')
        .should.equal('line1\nline2\nline3\nline4');

      applyPatch(
          'line1\nline2\nline3\nline4',

          'Index: test\n'
          + '===================================================================\n'
          + '--- test\theader1\n'
          + '+++ test\theader2\n'
          + '@@ -1,4 +1,4 @@\n'
          + ' line1\n'
          + ' line2\n'
          + ' line3\n'
          + '+line4\n'
          + '-line4\n'
          + '\\ No newline at end of file\n')
        .should.equal('line1\nline2\nline3\nline4\n');

      applyPatch(
          'line11\nline2\nline3\nline4',

            'Index: test\n'
            + '===================================================================\n'
            + '--- test\theader1\n'
            + '+++ test\theader2\n'
            + '@@ -1,4 +1,4 @@\n'
            + '+line1\n'
            + '-line11\n'
            + ' line2\n'
            + ' line3\n'
            + ' line4\n'
            + '\\ No newline at end of file\n')
        .should.equal('line1\nline2\nline3\nline4');

      applyPatch(
          'line11\nline2\nline3\nline4\nline4\nline4\nline4',

          'Index: test\n'
          + '===================================================================\n'
          + '--- test\theader1\n'
          + '+++ test\theader2\n'
          + '@@ -1,5 +1,5 @@\n'
          + '+line1\n'
          + '-line11\n'
          + ' line2\n'
          + ' line3\n'
          + ' line4\n'
          + ' line4\n')
        .should.equal('line1\nline2\nline3\nline4\nline4\nline4\nline4');
    });

    it('should apply patches', function() {
      // Create patch
      const oldFile =
        'value\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'remove value\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'remove value\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'value\n'
        + 'context\n'
        + 'context';
      const newFile =
        'new value\n'
        + 'new value 2\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'add value\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'context\n'
        + 'new value\n'
        + 'new value 2\n'
        + 'context\n'
        + 'context';
      let diffFile =
        'Index: testFileName\n'
        + '===================================================================\n'
        + '--- testFileName\tOld Header\n'
        + '+++ testFileName\tNew Header\n'
        + '@@ -1,5 +1,6 @@\n'
        + '+new value\n'
        + '+new value 2\n'
        + '-value\n'
        + ' context\n'
        + ' context\n'
        + ' context\n'
        + ' context\n'
        + '@@ -7,9 +8,8 @@\n'
        + ' context\n'
        + ' context\n'
        + ' context\n'
        + ' context\n'
        + '-remove value\n'
        + ' context\n'
        + ' context\n'
        + ' context\n'
        + ' context\n'
        + '@@ -17,20 +17,21 @@\n'
        + ' context\n'
        + ' context\n'
        + ' context\n'
        + ' context\n'
        + '-remove value\n'
        + ' context\n'
        + ' context\n'
        + ' context\n'
        + ' context\n'
        + ' context\n'
        + ' context\n'
        + ' context\n'
        + ' context\n'
        + '+add value\n'
        + ' context\n'
        + ' context\n'
        + ' context\n'
        + ' context\n'
        + '+new value\n'
        + '+new value 2\n'
        + '-value\n'
        + ' context\n'
        + ' context\n'
        + '\\ No newline at end of file\n';

      applyPatch(oldFile, diffFile).should.equal(newFile);

      diffFile =
        'Index: testFileName\n'
        + '===================================================================\n'
        + '--- testFileName\tOld Header\n'
        + '+++ testFileName\tNew Header\n';
      applyPatch(oldFile, diffFile).should.equal(oldFile);
    });

    it('should apply patches that lack an index header', function() {
      applyPatch(
          'line2\n'
          + 'line3\n'
          + 'line5\n',

          '--- test\theader1\n'
          + '+++ test\theader2\n'
          + '@@ -1,3 +1,4 @@\n'
          + ' line2\n'
          + ' line3\n'
          + '+line4\n'
          + ' line5\n')
        .should.equal(
          'line2\n'
          + 'line3\n'
          + 'line4\n'
          + 'line5\n');
    });

    it('should fail on mismatch', function() {
      applyPatch(
          'line2\n'
          + 'line2\n'
          + 'line5\n',

          '--- test\theader1\n'
          + '+++ test\theader2\n'
          + '@@ -1,3 +1,4 @@\n'
          + ' line2\n'
          + ' line3\n'
          + '+line4\n'
          + ' line5\n')
        .should.equal(false);
    });

    it('should work with unicode newline characters', function() {
      const oldtext = 'AAAAAAAAAAAAAAAA\n\n';
      const newtext = 'AAAAAAAAAAAAAAAA\nBBBBBB' + String.fromCharCode(0x2028) + '\nCCCCCCCCCCCCCCCCCC\n\n';

      const diffed = createPatch('test', oldtext, newtext);
      applyPatch(oldtext, diffed).should.equal(newtext);
    });
  });
});
