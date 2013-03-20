/* BWT test, for BWT module.
 * Ported from bwtest.java from https://sites.google.com/site/yuta256/sais
 * See lib/BWT.js for more details on provenance.
 */
var assert = require('assert');
var fs = require('fs');
var BWT = require('../').BWT;

var testFile = function(filename, verbose) {
    var T = fs.readFileSync('test/'+filename+'.ref');
    var n = T.length, i;
    if (verbose) { console.log('File', filename+'.ref', n, 'bytes....'); }

    /** Allocate 5n bytes of memory */
    T = new Uint8Array(T);
    var U = new Uint8Array(n);
    var V = new Uint8Array(n);
    var A = new Int32Array(n);

    /** Construct the BWT */
    var start = Date.now();
    var pidx = BWT.bwtransform(T, U, A, n);
    var finish = Date.now();
    if (verbose) { console.log((finish - start)/1000, 'seconds'); }

    if (verbose) { console.log('unbwtcheck...'); }
    BWT.unbwt(U, V, A, n, pidx);
    for (i=0; i<n; i++) {
        assert.ok(T[i] === V[i],
                  'mismatch at', i,': ',T[i],'!=',V[i]);
    }
    if (verbose) { console.log('Done.'); }

    T = null; U = null; V = null; A = null;
};

describe('BWT transform', function() {
    ['sample0', 'sample1', 'sample2', 'sample3', 'sample4', 'sample5'].forEach(function(f) {
        it('should correctly round-trip '+f, function() {
            testFile(f, false);
        });
    });
});