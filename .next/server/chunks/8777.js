"use strict";
exports.id = 8777;
exports.ids = [8777];
exports.modules = {

/***/ 60444:
/***/ ((__unused_webpack_module, exports) => {


// Copyright (C) 2016 Dmitry Chestnykh
// MIT License. See LICENSE file for details.
var __extends = (void 0) && (void 0).__extends || function() {
    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || ({
            __proto__: []
        }) instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for(var p in b)if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return extendStatics(d, b);
    };
    return function(d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/**
 * Package base64 implements Base64 encoding and decoding.
 */ // Invalid character used in decoding to indicate
// that the character to decode is out of range of
// alphabet and cannot be decoded.
var INVALID_BYTE = 256;
/**
 * Implements standard Base64 encoding.
 *
 * Operates in constant time.
 */ var Coder = /** @class */ function() {
    // TODO(dchest): methods to encode chunk-by-chunk.
    function Coder(_paddingCharacter) {
        if (_paddingCharacter === void 0) {
            _paddingCharacter = "=";
        }
        this._paddingCharacter = _paddingCharacter;
    }
    Coder.prototype.encodedLength = function(length) {
        if (!this._paddingCharacter) {
            return (length * 8 + 5) / 6 | 0;
        }
        return (length + 2) / 3 * 4 | 0;
    };
    Coder.prototype.encode = function(data) {
        var out = "";
        var i = 0;
        for(; i < data.length - 2; i += 3){
            var c = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
            out += this._encodeByte(c >>> 3 * 6 & 63);
            out += this._encodeByte(c >>> 2 * 6 & 63);
            out += this._encodeByte(c >>> 1 * 6 & 63);
            out += this._encodeByte(c >>> 0 * 6 & 63);
        }
        var left = data.length - i;
        if (left > 0) {
            var c = data[i] << 16 | (left === 2 ? data[i + 1] << 8 : 0);
            out += this._encodeByte(c >>> 3 * 6 & 63);
            out += this._encodeByte(c >>> 2 * 6 & 63);
            if (left === 2) {
                out += this._encodeByte(c >>> 1 * 6 & 63);
            } else {
                out += this._paddingCharacter || "";
            }
            out += this._paddingCharacter || "";
        }
        return out;
    };
    Coder.prototype.maxDecodedLength = function(length) {
        if (!this._paddingCharacter) {
            return (length * 6 + 7) / 8 | 0;
        }
        return length / 4 * 3 | 0;
    };
    Coder.prototype.decodedLength = function(s) {
        return this.maxDecodedLength(s.length - this._getPaddingLength(s));
    };
    Coder.prototype.decode = function(s) {
        if (s.length === 0) {
            return new Uint8Array(0);
        }
        var paddingLength = this._getPaddingLength(s);
        var length = s.length - paddingLength;
        var out = new Uint8Array(this.maxDecodedLength(length));
        var op = 0;
        var i = 0;
        var haveBad = 0;
        var v0 = 0, v1 = 0, v2 = 0, v3 = 0;
        for(; i < length - 4; i += 4){
            v0 = this._decodeChar(s.charCodeAt(i + 0));
            v1 = this._decodeChar(s.charCodeAt(i + 1));
            v2 = this._decodeChar(s.charCodeAt(i + 2));
            v3 = this._decodeChar(s.charCodeAt(i + 3));
            out[op++] = v0 << 2 | v1 >>> 4;
            out[op++] = v1 << 4 | v2 >>> 2;
            out[op++] = v2 << 6 | v3;
            haveBad |= v0 & INVALID_BYTE;
            haveBad |= v1 & INVALID_BYTE;
            haveBad |= v2 & INVALID_BYTE;
            haveBad |= v3 & INVALID_BYTE;
        }
        if (i < length - 1) {
            v0 = this._decodeChar(s.charCodeAt(i));
            v1 = this._decodeChar(s.charCodeAt(i + 1));
            out[op++] = v0 << 2 | v1 >>> 4;
            haveBad |= v0 & INVALID_BYTE;
            haveBad |= v1 & INVALID_BYTE;
        }
        if (i < length - 2) {
            v2 = this._decodeChar(s.charCodeAt(i + 2));
            out[op++] = v1 << 4 | v2 >>> 2;
            haveBad |= v2 & INVALID_BYTE;
        }
        if (i < length - 3) {
            v3 = this._decodeChar(s.charCodeAt(i + 3));
            out[op++] = v2 << 6 | v3;
            haveBad |= v3 & INVALID_BYTE;
        }
        if (haveBad !== 0) {
            throw new Error("Base64Coder: incorrect characters for decoding");
        }
        return out;
    };
    // Standard encoding have the following encoded/decoded ranges,
    // which we need to convert between.
    //
    // ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789  +   /
    // Index:   0 - 25                    26 - 51              52 - 61   62  63
    // ASCII:  65 - 90                    97 - 122             48 - 57   43  47
    //
    // Encode 6 bits in b into a new character.
    Coder.prototype._encodeByte = function(b) {
        // Encoding uses constant time operations as follows:
        //
        // 1. Define comparison of A with B using (A - B) >>> 8:
        //          if A > B, then result is positive integer
        //          if A <= B, then result is 0
        //
        // 2. Define selection of C or 0 using bitwise AND: X & C:
        //          if X == 0, then result is 0
        //          if X != 0, then result is C
        //
        // 3. Start with the smallest comparison (b >= 0), which is always
        //    true, so set the result to the starting ASCII value (65).
        //
        // 4. Continue comparing b to higher ASCII values, and selecting
        //    zero if comparison isn't true, otherwise selecting a value
        //    to add to result, which:
        //
        //          a) undoes the previous addition
        //          b) provides new value to add
        //
        var result = b;
        // b >= 0
        result += 65;
        // b > 25
        result += 25 - b >>> 8 & 0 - 65 - 26 + 97;
        // b > 51
        result += 51 - b >>> 8 & 26 - 97 - 52 + 48;
        // b > 61
        result += 61 - b >>> 8 & 52 - 48 - 62 + 43;
        // b > 62
        result += 62 - b >>> 8 & 62 - 43 - 63 + 47;
        return String.fromCharCode(result);
    };
    // Decode a character code into a byte.
    // Must return 256 if character is out of alphabet range.
    Coder.prototype._decodeChar = function(c) {
        // Decoding works similar to encoding: using the same comparison
        // function, but now it works on ranges: result is always incremented
        // by value, but this value becomes zero if the range is not
        // satisfied.
        //
        // Decoding starts with invalid value, 256, which is then
        // subtracted when the range is satisfied. If none of the ranges
        // apply, the function returns 256, which is then checked by
        // the caller to throw error.
        var result = INVALID_BYTE; // start with invalid character
        // c == 43 (c > 42 and c < 44)
        result += (42 - c & c - 44) >>> 8 & -INVALID_BYTE + c - 43 + 62;
        // c == 47 (c > 46 and c < 48)
        result += (46 - c & c - 48) >>> 8 & -INVALID_BYTE + c - 47 + 63;
        // c > 47 and c < 58
        result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
        // c > 64 and c < 91
        result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
        // c > 96 and c < 123
        result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
        return result;
    };
    Coder.prototype._getPaddingLength = function(s) {
        var paddingLength = 0;
        if (this._paddingCharacter) {
            for(var i = s.length - 1; i >= 0; i--){
                if (s[i] !== this._paddingCharacter) {
                    break;
                }
                paddingLength++;
            }
            if (s.length < 4 || paddingLength > 2) {
                throw new Error("Base64Coder: incorrect padding");
            }
        }
        return paddingLength;
    };
    return Coder;
}();
exports.Coder = Coder;
var stdCoder = new Coder();
function encode(data) {
    return stdCoder.encode(data);
}
exports.encode = encode;
function decode(s) {
    return stdCoder.decode(s);
}
exports.decode = decode;
/**
 * Implements URL-safe Base64 encoding.
 * (Same as Base64, but '+' is replaced with '-', and '/' with '_').
 *
 * Operates in constant time.
 */ var URLSafeCoder = /** @class */ function(_super) {
    __extends(URLSafeCoder, _super);
    function URLSafeCoder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // URL-safe encoding have the following encoded/decoded ranges:
    //
    // ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789  -   _
    // Index:   0 - 25                    26 - 51              52 - 61   62  63
    // ASCII:  65 - 90                    97 - 122             48 - 57   45  95
    //
    URLSafeCoder.prototype._encodeByte = function(b) {
        var result = b;
        // b >= 0
        result += 65;
        // b > 25
        result += 25 - b >>> 8 & 0 - 65 - 26 + 97;
        // b > 51
        result += 51 - b >>> 8 & 26 - 97 - 52 + 48;
        // b > 61
        result += 61 - b >>> 8 & 52 - 48 - 62 + 45;
        // b > 62
        result += 62 - b >>> 8 & 62 - 45 - 63 + 95;
        return String.fromCharCode(result);
    };
    URLSafeCoder.prototype._decodeChar = function(c) {
        var result = INVALID_BYTE;
        // c == 45 (c > 44 and c < 46)
        result += (44 - c & c - 46) >>> 8 & -INVALID_BYTE + c - 45 + 62;
        // c == 95 (c > 94 and c < 96)
        result += (94 - c & c - 96) >>> 8 & -INVALID_BYTE + c - 95 + 63;
        // c > 47 and c < 58
        result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
        // c > 64 and c < 91
        result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
        // c > 96 and c < 123
        result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
        return result;
    };
    return URLSafeCoder;
}(Coder);
exports.URLSafeCoder = URLSafeCoder;
var urlSafeCoder = new URLSafeCoder();
function encodeURLSafe(data) {
    return urlSafeCoder.encode(data);
}
exports.encodeURLSafe = encodeURLSafe;
function decodeURLSafe(s) {
    return urlSafeCoder.decode(s);
}
exports.decodeURLSafe = decodeURLSafe;
exports.encodedLength = function(length) {
    return stdCoder.encodedLength(length);
};
exports.maxDecodedLength = function(length) {
    return stdCoder.maxDecodedLength(length);
};
exports.decodedLength = function(s) {
    return stdCoder.decodedLength(s);
}; //# sourceMappingURL=base64.js.map


/***/ }),

/***/ 32562:
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;
(function(root, factory) {
    // Hack to make all exports of this module sha256 function object properties.
    var exports = {};
    factory(exports);
    var sha256 = exports["default"];
    for(var k in exports){
        sha256[k] = exports[k];
    }
    if ( true && typeof module.exports === "object") {
        module.exports = sha256;
    } else if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
            return sha256;
        }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
})(void 0, function(exports) {
    "use strict";
    exports.__esModule = true;
    // SHA-256 (+ HMAC and PBKDF2) for JavaScript.
    //
    // Written in 2014-2016 by Dmitry Chestnykh.
    // Public domain, no warranty.
    //
    // Functions (accept and return Uint8Arrays):
    //
    //   sha256(message) -> hash
    //   sha256.hmac(key, message) -> mac
    //   sha256.pbkdf2(password, salt, rounds, dkLen) -> dk
    //
    //  Classes:
    //
    //   new sha256.Hash()
    //   new sha256.HMAC(key)
    //
    exports.digestLength = 32;
    exports.blockSize = 64;
    // SHA-256 constants
    var K = new Uint32Array([
        0x428a2f98,
        0x71374491,
        0xb5c0fbcf,
        0xe9b5dba5,
        0x3956c25b,
        0x59f111f1,
        0x923f82a4,
        0xab1c5ed5,
        0xd807aa98,
        0x12835b01,
        0x243185be,
        0x550c7dc3,
        0x72be5d74,
        0x80deb1fe,
        0x9bdc06a7,
        0xc19bf174,
        0xe49b69c1,
        0xefbe4786,
        0x0fc19dc6,
        0x240ca1cc,
        0x2de92c6f,
        0x4a7484aa,
        0x5cb0a9dc,
        0x76f988da,
        0x983e5152,
        0xa831c66d,
        0xb00327c8,
        0xbf597fc7,
        0xc6e00bf3,
        0xd5a79147,
        0x06ca6351,
        0x14292967,
        0x27b70a85,
        0x2e1b2138,
        0x4d2c6dfc,
        0x53380d13,
        0x650a7354,
        0x766a0abb,
        0x81c2c92e,
        0x92722c85,
        0xa2bfe8a1,
        0xa81a664b,
        0xc24b8b70,
        0xc76c51a3,
        0xd192e819,
        0xd6990624,
        0xf40e3585,
        0x106aa070,
        0x19a4c116,
        0x1e376c08,
        0x2748774c,
        0x34b0bcb5,
        0x391c0cb3,
        0x4ed8aa4a,
        0x5b9cca4f,
        0x682e6ff3,
        0x748f82ee,
        0x78a5636f,
        0x84c87814,
        0x8cc70208,
        0x90befffa,
        0xa4506ceb,
        0xbef9a3f7,
        0xc67178f2
    ]);
    function hashBlocks(w, v, p, pos, len) {
        var a, b, c, d, e, f, g, h, u, i, j, t1, t2;
        while(len >= 64){
            a = v[0];
            b = v[1];
            c = v[2];
            d = v[3];
            e = v[4];
            f = v[5];
            g = v[6];
            h = v[7];
            for(i = 0; i < 16; i++){
                j = pos + i * 4;
                w[i] = (p[j] & 0xff) << 24 | (p[j + 1] & 0xff) << 16 | (p[j + 2] & 0xff) << 8 | p[j + 3] & 0xff;
            }
            for(i = 16; i < 64; i++){
                u = w[i - 2];
                t1 = (u >>> 17 | u << 32 - 17) ^ (u >>> 19 | u << 32 - 19) ^ u >>> 10;
                u = w[i - 15];
                t2 = (u >>> 7 | u << 32 - 7) ^ (u >>> 18 | u << 32 - 18) ^ u >>> 3;
                w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
            }
            for(i = 0; i < 64; i++){
                t1 = (((e >>> 6 | e << 32 - 6) ^ (e >>> 11 | e << 32 - 11) ^ (e >>> 25 | e << 32 - 25)) + (e & f ^ ~e & g) | 0) + (h + (K[i] + w[i] | 0) | 0) | 0;
                t2 = ((a >>> 2 | a << 32 - 2) ^ (a >>> 13 | a << 32 - 13) ^ (a >>> 22 | a << 32 - 22)) + (a & b ^ a & c ^ b & c) | 0;
                h = g;
                g = f;
                f = e;
                e = d + t1 | 0;
                d = c;
                c = b;
                b = a;
                a = t1 + t2 | 0;
            }
            v[0] += a;
            v[1] += b;
            v[2] += c;
            v[3] += d;
            v[4] += e;
            v[5] += f;
            v[6] += g;
            v[7] += h;
            pos += 64;
            len -= 64;
        }
        return pos;
    }
    // Hash implements SHA256 hash algorithm.
    var Hash = /** @class */ function() {
        function Hash() {
            this.digestLength = exports.digestLength;
            this.blockSize = exports.blockSize;
            // Note: Int32Array is used instead of Uint32Array for performance reasons.
            this.state = new Int32Array(8); // hash state
            this.temp = new Int32Array(64); // temporary state
            this.buffer = new Uint8Array(128); // buffer for data to hash
            this.bufferLength = 0; // number of bytes in buffer
            this.bytesHashed = 0; // number of total bytes hashed
            this.finished = false; // indicates whether the hash was finalized
            this.reset();
        }
        // Resets hash state making it possible
        // to re-use this instance to hash other data.
        Hash.prototype.reset = function() {
            this.state[0] = 0x6a09e667;
            this.state[1] = 0xbb67ae85;
            this.state[2] = 0x3c6ef372;
            this.state[3] = 0xa54ff53a;
            this.state[4] = 0x510e527f;
            this.state[5] = 0x9b05688c;
            this.state[6] = 0x1f83d9ab;
            this.state[7] = 0x5be0cd19;
            this.bufferLength = 0;
            this.bytesHashed = 0;
            this.finished = false;
            return this;
        };
        // Cleans internal buffers and re-initializes hash state.
        Hash.prototype.clean = function() {
            for(var i = 0; i < this.buffer.length; i++){
                this.buffer[i] = 0;
            }
            for(var i = 0; i < this.temp.length; i++){
                this.temp[i] = 0;
            }
            this.reset();
        };
        // Updates hash state with the given data.
        //
        // Optionally, length of the data can be specified to hash
        // fewer bytes than data.length.
        //
        // Throws error when trying to update already finalized hash:
        // instance must be reset to use it again.
        Hash.prototype.update = function(data, dataLength) {
            if (dataLength === void 0) {
                dataLength = data.length;
            }
            if (this.finished) {
                throw new Error("SHA256: can't update because hash was finished.");
            }
            var dataPos = 0;
            this.bytesHashed += dataLength;
            if (this.bufferLength > 0) {
                while(this.bufferLength < 64 && dataLength > 0){
                    this.buffer[this.bufferLength++] = data[dataPos++];
                    dataLength--;
                }
                if (this.bufferLength === 64) {
                    hashBlocks(this.temp, this.state, this.buffer, 0, 64);
                    this.bufferLength = 0;
                }
            }
            if (dataLength >= 64) {
                dataPos = hashBlocks(this.temp, this.state, data, dataPos, dataLength);
                dataLength %= 64;
            }
            while(dataLength > 0){
                this.buffer[this.bufferLength++] = data[dataPos++];
                dataLength--;
            }
            return this;
        };
        // Finalizes hash state and puts hash into out.
        //
        // If hash was already finalized, puts the same value.
        Hash.prototype.finish = function(out) {
            if (!this.finished) {
                var bytesHashed = this.bytesHashed;
                var left = this.bufferLength;
                var bitLenHi = bytesHashed / 0x20000000 | 0;
                var bitLenLo = bytesHashed << 3;
                var padLength = bytesHashed % 64 < 56 ? 64 : 128;
                this.buffer[left] = 0x80;
                for(var i = left + 1; i < padLength - 8; i++){
                    this.buffer[i] = 0;
                }
                this.buffer[padLength - 8] = bitLenHi >>> 24 & 0xff;
                this.buffer[padLength - 7] = bitLenHi >>> 16 & 0xff;
                this.buffer[padLength - 6] = bitLenHi >>> 8 & 0xff;
                this.buffer[padLength - 5] = bitLenHi >>> 0 & 0xff;
                this.buffer[padLength - 4] = bitLenLo >>> 24 & 0xff;
                this.buffer[padLength - 3] = bitLenLo >>> 16 & 0xff;
                this.buffer[padLength - 2] = bitLenLo >>> 8 & 0xff;
                this.buffer[padLength - 1] = bitLenLo >>> 0 & 0xff;
                hashBlocks(this.temp, this.state, this.buffer, 0, padLength);
                this.finished = true;
            }
            for(var i = 0; i < 8; i++){
                out[i * 4 + 0] = this.state[i] >>> 24 & 0xff;
                out[i * 4 + 1] = this.state[i] >>> 16 & 0xff;
                out[i * 4 + 2] = this.state[i] >>> 8 & 0xff;
                out[i * 4 + 3] = this.state[i] >>> 0 & 0xff;
            }
            return this;
        };
        // Returns the final hash digest.
        Hash.prototype.digest = function() {
            var out = new Uint8Array(this.digestLength);
            this.finish(out);
            return out;
        };
        // Internal function for use in HMAC for optimization.
        Hash.prototype._saveState = function(out) {
            for(var i = 0; i < this.state.length; i++){
                out[i] = this.state[i];
            }
        };
        // Internal function for use in HMAC for optimization.
        Hash.prototype._restoreState = function(from, bytesHashed) {
            for(var i = 0; i < this.state.length; i++){
                this.state[i] = from[i];
            }
            this.bytesHashed = bytesHashed;
            this.finished = false;
            this.bufferLength = 0;
        };
        return Hash;
    }();
    exports.Hash = Hash;
    // HMAC implements HMAC-SHA256 message authentication algorithm.
    var HMAC = /** @class */ function() {
        function HMAC(key) {
            this.inner = new Hash();
            this.outer = new Hash();
            this.blockSize = this.inner.blockSize;
            this.digestLength = this.inner.digestLength;
            var pad = new Uint8Array(this.blockSize);
            if (key.length > this.blockSize) {
                new Hash().update(key).finish(pad).clean();
            } else {
                for(var i = 0; i < key.length; i++){
                    pad[i] = key[i];
                }
            }
            for(var i = 0; i < pad.length; i++){
                pad[i] ^= 0x36;
            }
            this.inner.update(pad);
            for(var i = 0; i < pad.length; i++){
                pad[i] ^= 0x36 ^ 0x5c;
            }
            this.outer.update(pad);
            this.istate = new Uint32Array(8);
            this.ostate = new Uint32Array(8);
            this.inner._saveState(this.istate);
            this.outer._saveState(this.ostate);
            for(var i = 0; i < pad.length; i++){
                pad[i] = 0;
            }
        }
        // Returns HMAC state to the state initialized with key
        // to make it possible to run HMAC over the other data with the same
        // key without creating a new instance.
        HMAC.prototype.reset = function() {
            this.inner._restoreState(this.istate, this.inner.blockSize);
            this.outer._restoreState(this.ostate, this.outer.blockSize);
            return this;
        };
        // Cleans HMAC state.
        HMAC.prototype.clean = function() {
            for(var i = 0; i < this.istate.length; i++){
                this.ostate[i] = this.istate[i] = 0;
            }
            this.inner.clean();
            this.outer.clean();
        };
        // Updates state with provided data.
        HMAC.prototype.update = function(data) {
            this.inner.update(data);
            return this;
        };
        // Finalizes HMAC and puts the result in out.
        HMAC.prototype.finish = function(out) {
            if (this.outer.finished) {
                this.outer.finish(out);
            } else {
                this.inner.finish(out);
                this.outer.update(out, this.digestLength).finish(out);
            }
            return this;
        };
        // Returns message authentication code.
        HMAC.prototype.digest = function() {
            var out = new Uint8Array(this.digestLength);
            this.finish(out);
            return out;
        };
        return HMAC;
    }();
    exports.HMAC = HMAC;
    // Returns SHA256 hash of data.
    function hash(data) {
        var h = new Hash().update(data);
        var digest = h.digest();
        h.clean();
        return digest;
    }
    exports.hash = hash;
    // Function hash is both available as module.hash and as default export.
    exports["default"] = hash;
    // Returns HMAC-SHA256 of data under the key.
    function hmac(key, data) {
        var h = new HMAC(key).update(data);
        var digest = h.digest();
        h.clean();
        return digest;
    }
    exports.hmac = hmac;
    // Fills hkdf buffer like this:
    // T(1) = HMAC-Hash(PRK, T(0) | info | 0x01)
    function fillBuffer(buffer, hmac, info, counter) {
        // Counter is a byte value: check if it overflowed.
        var num = counter[0];
        if (num === 0) {
            throw new Error("hkdf: cannot expand more");
        }
        // Prepare HMAC instance for new data with old key.
        hmac.reset();
        // Hash in previous output if it was generated
        // (i.e. counter is greater than 1).
        if (num > 1) {
            hmac.update(buffer);
        }
        // Hash in info if it exists.
        if (info) {
            hmac.update(info);
        }
        // Hash in the counter.
        hmac.update(counter);
        // Output result to buffer and clean HMAC instance.
        hmac.finish(buffer);
        // Increment counter inside typed array, this works properly.
        counter[0]++;
    }
    var hkdfSalt = new Uint8Array(exports.digestLength); // Filled with zeroes.
    function hkdf(key, salt, info, length) {
        if (salt === void 0) {
            salt = hkdfSalt;
        }
        if (length === void 0) {
            length = 32;
        }
        var counter = new Uint8Array([
            1
        ]);
        // HKDF-Extract uses salt as HMAC key, and key as data.
        var okm = hmac(salt, key);
        // Initialize HMAC for expanding with extracted key.
        // Ensure no collisions with `hmac` function.
        var hmac_ = new HMAC(okm);
        // Allocate buffer.
        var buffer = new Uint8Array(hmac_.digestLength);
        var bufpos = buffer.length;
        var out = new Uint8Array(length);
        for(var i = 0; i < length; i++){
            if (bufpos === buffer.length) {
                fillBuffer(buffer, hmac_, info, counter);
                bufpos = 0;
            }
            out[i] = buffer[bufpos++];
        }
        hmac_.clean();
        buffer.fill(0);
        counter.fill(0);
        return out;
    }
    exports.hkdf = hkdf;
    // Derives a key from password and salt using PBKDF2-HMAC-SHA256
    // with the given number of iterations.
    //
    // The number of bytes returned is equal to dkLen.
    //
    // (For better security, avoid dkLen greater than hash length - 32 bytes).
    function pbkdf2(password, salt, iterations, dkLen) {
        var prf = new HMAC(password);
        var len = prf.digestLength;
        var ctr = new Uint8Array(4);
        var t = new Uint8Array(len);
        var u = new Uint8Array(len);
        var dk = new Uint8Array(dkLen);
        for(var i = 0; i * len < dkLen; i++){
            var c = i + 1;
            ctr[0] = c >>> 24 & 0xff;
            ctr[1] = c >>> 16 & 0xff;
            ctr[2] = c >>> 8 & 0xff;
            ctr[3] = c >>> 0 & 0xff;
            prf.reset();
            prf.update(salt);
            prf.update(ctr);
            prf.finish(u);
            for(var j = 0; j < len; j++){
                t[j] = u[j];
            }
            for(var j = 2; j <= iterations; j++){
                prf.reset();
                prf.update(u).finish(u);
                for(var k = 0; k < len; k++){
                    t[k] ^= u[k];
                }
            }
            for(var j = 0; j < len && i * len + j < dkLen; j++){
                dk[i * len + j] = t[j];
            }
        }
        for(var i = 0; i < len; i++){
            t[i] = u[i] = 0;
        }
        for(var i = 0; i < 4; i++){
            ctr[i] = 0;
        }
        prf.clean();
        return dk;
    }
    exports.pbkdf2 = pbkdf2;
});


/***/ }),

/***/ 77365:
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
function _interopDefault(ex) {
    return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}
var Stream = _interopDefault(__webpack_require__(12781));
var http = _interopDefault(__webpack_require__(13685));
var Url = _interopDefault(__webpack_require__(57310));
var whatwgUrl = _interopDefault(__webpack_require__(61870));
var https = _interopDefault(__webpack_require__(95687));
var zlib = _interopDefault(__webpack_require__(59796));
// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js
// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;
const BUFFER = Symbol("buffer");
const TYPE = Symbol("type");
class Blob {
    constructor(){
        this[TYPE] = "";
        const blobParts = arguments[0];
        const options = arguments[1];
        const buffers = [];
        let size = 0;
        if (blobParts) {
            const a = blobParts;
            const length = Number(a.length);
            for(let i = 0; i < length; i++){
                const element = a[i];
                let buffer;
                if (element instanceof Buffer) {
                    buffer = element;
                } else if (ArrayBuffer.isView(element)) {
                    buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
                } else if (element instanceof ArrayBuffer) {
                    buffer = Buffer.from(element);
                } else if (element instanceof Blob) {
                    buffer = element[BUFFER];
                } else {
                    buffer = Buffer.from(typeof element === "string" ? element : String(element));
                }
                size += buffer.length;
                buffers.push(buffer);
            }
        }
        this[BUFFER] = Buffer.concat(buffers);
        let type = options && options.type !== undefined && String(options.type).toLowerCase();
        if (type && !/[^\u0020-\u007E]/.test(type)) {
            this[TYPE] = type;
        }
    }
    get size() {
        return this[BUFFER].length;
    }
    get type() {
        return this[TYPE];
    }
    text() {
        return Promise.resolve(this[BUFFER].toString());
    }
    arrayBuffer() {
        const buf = this[BUFFER];
        const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        return Promise.resolve(ab);
    }
    stream() {
        const readable = new Readable();
        readable._read = function() {};
        readable.push(this[BUFFER]);
        readable.push(null);
        return readable;
    }
    toString() {
        return "[object Blob]";
    }
    slice() {
        const size = this.size;
        const start = arguments[0];
        const end = arguments[1];
        let relativeStart, relativeEnd;
        if (start === undefined) {
            relativeStart = 0;
        } else if (start < 0) {
            relativeStart = Math.max(size + start, 0);
        } else {
            relativeStart = Math.min(start, size);
        }
        if (end === undefined) {
            relativeEnd = size;
        } else if (end < 0) {
            relativeEnd = Math.max(size + end, 0);
        } else {
            relativeEnd = Math.min(end, size);
        }
        const span = Math.max(relativeEnd - relativeStart, 0);
        const buffer = this[BUFFER];
        const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
        const blob = new Blob([], {
            type: arguments[2]
        });
        blob[BUFFER] = slicedBuffer;
        return blob;
    }
}
Object.defineProperties(Blob.prototype, {
    size: {
        enumerable: true
    },
    type: {
        enumerable: true
    },
    slice: {
        enumerable: true
    }
});
Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
    value: "Blob",
    writable: false,
    enumerable: false,
    configurable: true
});
/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */ /**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */ function FetchError(message, type, systemError) {
    Error.call(this, message);
    this.message = message;
    this.type = type;
    // when err.type is `system`, err.code contains system error code
    if (systemError) {
        this.code = this.errno = systemError.code;
    }
    // hide custom error implementation details from end-users
    Error.captureStackTrace(this, this.constructor);
}
FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = "FetchError";
let convert;
try {
    convert = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'encoding'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
} catch (e) {}
const INTERNALS = Symbol("Body internals");
// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;
/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */ function Body(body) {
    var _this = this;
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}, _ref$size = _ref.size;
    let size = _ref$size === undefined ? 0 : _ref$size;
    var _ref$timeout = _ref.timeout;
    let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;
    if (body == null) {
        // body is undefined or null
        body = null;
    } else if (isURLSearchParams(body)) {
        // body is a URLSearchParams
        body = Buffer.from(body.toString());
    } else if (isBlob(body)) ;
    else if (Buffer.isBuffer(body)) ;
    else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        // body is ArrayBuffer
        body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
        // body is ArrayBufferView
        body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof Stream) ;
    else {
        // none of the above
        // coerce to string then buffer
        body = Buffer.from(String(body));
    }
    this[INTERNALS] = {
        body,
        disturbed: false,
        error: null
    };
    this.size = size;
    this.timeout = timeout;
    if (body instanceof Stream) {
        body.on("error", function(err) {
            const error = err.name === "AbortError" ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, "system", err);
            _this[INTERNALS].error = error;
        });
    }
}
Body.prototype = {
    get body () {
        return this[INTERNALS].body;
    },
    get bodyUsed () {
        return this[INTERNALS].disturbed;
    },
    /**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */ arrayBuffer () {
        return consumeBody.call(this).then(function(buf) {
            return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        });
    },
    /**
  * Return raw response as Blob
  *
  * @return Promise
  */ blob () {
        let ct = this.headers && this.headers.get("content-type") || "";
        return consumeBody.call(this).then(function(buf) {
            return Object.assign(// Prevent copying
            new Blob([], {
                type: ct.toLowerCase()
            }), {
                [BUFFER]: buf
            });
        });
    },
    /**
  * Decode response as json
  *
  * @return  Promise
  */ json () {
        var _this2 = this;
        return consumeBody.call(this).then(function(buffer) {
            try {
                return JSON.parse(buffer.toString());
            } catch (err) {
                return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, "invalid-json"));
            }
        });
    },
    /**
  * Decode response as text
  *
  * @return  Promise
  */ text () {
        return consumeBody.call(this).then(function(buffer) {
            return buffer.toString();
        });
    },
    /**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */ buffer () {
        return consumeBody.call(this);
    },
    /**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */ textConverted () {
        var _this3 = this;
        return consumeBody.call(this).then(function(buffer) {
            return convertBody(buffer, _this3.headers);
        });
    }
};
// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
    body: {
        enumerable: true
    },
    bodyUsed: {
        enumerable: true
    },
    arrayBuffer: {
        enumerable: true
    },
    blob: {
        enumerable: true
    },
    json: {
        enumerable: true
    },
    text: {
        enumerable: true
    }
});
Body.mixIn = function(proto) {
    for (const name of Object.getOwnPropertyNames(Body.prototype)){
        // istanbul ignore else: future proof
        if (!(name in proto)) {
            const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
            Object.defineProperty(proto, name, desc);
        }
    }
};
/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */ function consumeBody() {
    var _this4 = this;
    if (this[INTERNALS].disturbed) {
        return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
    }
    this[INTERNALS].disturbed = true;
    if (this[INTERNALS].error) {
        return Body.Promise.reject(this[INTERNALS].error);
    }
    let body = this.body;
    // body is null
    if (body === null) {
        return Body.Promise.resolve(Buffer.alloc(0));
    }
    // body is blob
    if (isBlob(body)) {
        body = body.stream();
    }
    // body is buffer
    if (Buffer.isBuffer(body)) {
        return Body.Promise.resolve(body);
    }
    // istanbul ignore if: should never happen
    if (!(body instanceof Stream)) {
        return Body.Promise.resolve(Buffer.alloc(0));
    }
    // body is stream
    // get ready to actually consume the body
    let accum = [];
    let accumBytes = 0;
    let abort = false;
    return new Body.Promise(function(resolve, reject) {
        let resTimeout;
        // allow timeout on slow response body
        if (_this4.timeout) {
            resTimeout = setTimeout(function() {
                abort = true;
                reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, "body-timeout"));
            }, _this4.timeout);
        }
        // handle stream errors
        body.on("error", function(err) {
            if (err.name === "AbortError") {
                // if the request was aborted, reject with this Error
                abort = true;
                reject(err);
            } else {
                // other errors, such as incorrect content-encoding
                reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, "system", err));
            }
        });
        body.on("data", function(chunk) {
            if (abort || chunk === null) {
                return;
            }
            if (_this4.size && accumBytes + chunk.length > _this4.size) {
                abort = true;
                reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, "max-size"));
                return;
            }
            accumBytes += chunk.length;
            accum.push(chunk);
        });
        body.on("end", function() {
            if (abort) {
                return;
            }
            clearTimeout(resTimeout);
            try {
                resolve(Buffer.concat(accum, accumBytes));
            } catch (err) {
                // handle streams that have accumulated too much data (issue #414)
                reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, "system", err));
            }
        });
    });
}
/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */ function convertBody(buffer, headers) {
    if (typeof convert !== "function") {
        throw new Error("The package `encoding` must be installed to use the textConverted() function");
    }
    const ct = headers.get("content-type");
    let charset = "utf-8";
    let res, str;
    // header
    if (ct) {
        res = /charset=([^;]*)/i.exec(ct);
    }
    // no charset in content type, peek at response body for at most 1024 bytes
    str = buffer.slice(0, 1024).toString();
    // html5
    if (!res && str) {
        res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
    }
    // html4
    if (!res && str) {
        res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
        if (!res) {
            res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
            if (res) {
                res.pop(); // drop last quote
            }
        }
        if (res) {
            res = /charset=(.*)/i.exec(res.pop());
        }
    }
    // xml
    if (!res && str) {
        res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
    }
    // found charset
    if (res) {
        charset = res.pop();
        // prevent decode issues when sites use incorrect encoding
        // ref: https://hsivonen.fi/encoding-menu/
        if (charset === "gb2312" || charset === "gbk") {
            charset = "gb18030";
        }
    }
    // turn raw buffers into a single utf-8 buffer
    return convert(buffer, "UTF-8", charset).toString();
}
/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */ function isURLSearchParams(obj) {
    // Duck-typing as a necessary condition.
    if (typeof obj !== "object" || typeof obj.append !== "function" || typeof obj.delete !== "function" || typeof obj.get !== "function" || typeof obj.getAll !== "function" || typeof obj.has !== "function" || typeof obj.set !== "function") {
        return false;
    }
    // Brand-checking and more duck-typing as optional condition.
    return obj.constructor.name === "URLSearchParams" || Object.prototype.toString.call(obj) === "[object URLSearchParams]" || typeof obj.sort === "function";
}
/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */ function isBlob(obj) {
    return typeof obj === "object" && typeof obj.arrayBuffer === "function" && typeof obj.type === "string" && typeof obj.stream === "function" && typeof obj.constructor === "function" && typeof obj.constructor.name === "string" && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}
/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */ function clone(instance) {
    let p1, p2;
    let body = instance.body;
    // don't allow cloning a used body
    if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
    }
    // check that body is a stream and not form-data object
    // note: we can't clone the form-data object without having it as a dependency
    if (body instanceof Stream && typeof body.getBoundary !== "function") {
        // tee instance body
        p1 = new PassThrough();
        p2 = new PassThrough();
        body.pipe(p1);
        body.pipe(p2);
        // set instance body to teed body and return the other teed body
        instance[INTERNALS].body = p1;
        body = p2;
    }
    return body;
}
/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */ function extractContentType(body) {
    if (body === null) {
        // body is null
        return null;
    } else if (typeof body === "string") {
        // body is string
        return "text/plain;charset=UTF-8";
    } else if (isURLSearchParams(body)) {
        // body is a URLSearchParams
        return "application/x-www-form-urlencoded;charset=UTF-8";
    } else if (isBlob(body)) {
        // body is blob
        return body.type || null;
    } else if (Buffer.isBuffer(body)) {
        // body is buffer
        return null;
    } else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        // body is ArrayBuffer
        return null;
    } else if (ArrayBuffer.isView(body)) {
        // body is ArrayBufferView
        return null;
    } else if (typeof body.getBoundary === "function") {
        // detect form data input from form-data module
        return `multipart/form-data;boundary=${body.getBoundary()}`;
    } else if (body instanceof Stream) {
        // body is stream
        // can't really do much about this
        return null;
    } else {
        // Body constructor defaults other things to string
        return "text/plain;charset=UTF-8";
    }
}
/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */ function getTotalBytes(instance) {
    const body = instance.body;
    if (body === null) {
        // body is null
        return 0;
    } else if (isBlob(body)) {
        return body.size;
    } else if (Buffer.isBuffer(body)) {
        // body is buffer
        return body.length;
    } else if (body && typeof body.getLengthSync === "function") {
        // detect form data input from form-data module
        if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
        body.hasKnownLength && body.hasKnownLength()) {
            // 2.x
            return body.getLengthSync();
        }
        return null;
    } else {
        // body is stream
        return null;
    }
}
/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */ function writeToStream(dest, instance) {
    const body = instance.body;
    if (body === null) {
        // body is null
        dest.end();
    } else if (isBlob(body)) {
        body.stream().pipe(dest);
    } else if (Buffer.isBuffer(body)) {
        // body is buffer
        dest.write(body);
        dest.end();
    } else {
        // body is stream
        body.pipe(dest);
    }
}
// expose Promise
Body.Promise = global.Promise;
/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */ const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
function validateName(name) {
    name = `${name}`;
    if (invalidTokenRegex.test(name) || name === "") {
        throw new TypeError(`${name} is not a legal HTTP header name`);
    }
}
function validateValue(value) {
    value = `${value}`;
    if (invalidHeaderCharRegex.test(value)) {
        throw new TypeError(`${value} is not a legal HTTP header value`);
    }
}
/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */ function find(map, name) {
    name = name.toLowerCase();
    for(const key in map){
        if (key.toLowerCase() === name) {
            return key;
        }
    }
    return undefined;
}
const MAP = Symbol("map");
class Headers {
    /**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */ constructor(){
        let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
        this[MAP] = Object.create(null);
        if (init instanceof Headers) {
            const rawHeaders = init.raw();
            const headerNames = Object.keys(rawHeaders);
            for (const headerName of headerNames){
                for (const value of rawHeaders[headerName]){
                    this.append(headerName, value);
                }
            }
            return;
        }
        // We don't worry about converting prop to ByteString here as append()
        // will handle it.
        if (init == null) ;
        else if (typeof init === "object") {
            const method = init[Symbol.iterator];
            if (method != null) {
                if (typeof method !== "function") {
                    throw new TypeError("Header pairs must be iterable");
                }
                // sequence<sequence<ByteString>>
                // Note: per spec we have to first exhaust the lists then process them
                const pairs = [];
                for (const pair of init){
                    if (typeof pair !== "object" || typeof pair[Symbol.iterator] !== "function") {
                        throw new TypeError("Each header pair must be iterable");
                    }
                    pairs.push(Array.from(pair));
                }
                for (const pair of pairs){
                    if (pair.length !== 2) {
                        throw new TypeError("Each header pair must be a name/value tuple");
                    }
                    this.append(pair[0], pair[1]);
                }
            } else {
                // record<ByteString, ByteString>
                for (const key of Object.keys(init)){
                    const value = init[key];
                    this.append(key, value);
                }
            }
        } else {
            throw new TypeError("Provided initializer must be an object");
        }
    }
    /**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */ get(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key === undefined) {
            return null;
        }
        return this[MAP][key].join(", ");
    }
    /**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */ forEach(callback) {
        let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        let pairs = getHeaders(this);
        let i = 0;
        while(i < pairs.length){
            var _pairs$i = pairs[i];
            const name = _pairs$i[0], value = _pairs$i[1];
            callback.call(thisArg, value, name, this);
            pairs = getHeaders(this);
            i++;
        }
    }
    /**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */ set(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        this[MAP][key !== undefined ? key : name] = [
            value
        ];
    }
    /**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */ append(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        if (key !== undefined) {
            this[MAP][key].push(value);
        } else {
            this[MAP][name] = [
                value
            ];
        }
    }
    /**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */ has(name) {
        name = `${name}`;
        validateName(name);
        return find(this[MAP], name) !== undefined;
    }
    /**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */ delete(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key !== undefined) {
            delete this[MAP][key];
        }
    }
    /**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */ raw() {
        return this[MAP];
    }
    /**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */ keys() {
        return createHeadersIterator(this, "key");
    }
    /**
  * Get an iterator on values.
  *
  * @return  Iterator
  */ values() {
        return createHeadersIterator(this, "value");
    }
    /**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */ [Symbol.iterator]() {
        return createHeadersIterator(this, "key+value");
    }
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];
Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
    value: "Headers",
    writable: false,
    enumerable: false,
    configurable: true
});
Object.defineProperties(Headers.prototype, {
    get: {
        enumerable: true
    },
    forEach: {
        enumerable: true
    },
    set: {
        enumerable: true
    },
    append: {
        enumerable: true
    },
    has: {
        enumerable: true
    },
    delete: {
        enumerable: true
    },
    keys: {
        enumerable: true
    },
    values: {
        enumerable: true
    },
    entries: {
        enumerable: true
    }
});
function getHeaders(headers) {
    let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "key+value";
    const keys = Object.keys(headers[MAP]).sort();
    return keys.map(kind === "key" ? function(k) {
        return k.toLowerCase();
    } : kind === "value" ? function(k) {
        return headers[MAP][k].join(", ");
    } : function(k) {
        return [
            k.toLowerCase(),
            headers[MAP][k].join(", ")
        ];
    });
}
const INTERNAL = Symbol("internal");
function createHeadersIterator(target, kind) {
    const iterator = Object.create(HeadersIteratorPrototype);
    iterator[INTERNAL] = {
        target,
        kind,
        index: 0
    };
    return iterator;
}
const HeadersIteratorPrototype = Object.setPrototypeOf({
    next () {
        // istanbul ignore if
        if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
            throw new TypeError("Value of `this` is not a HeadersIterator");
        }
        var _INTERNAL = this[INTERNAL];
        const target = _INTERNAL.target, kind = _INTERNAL.kind, index = _INTERNAL.index;
        const values = getHeaders(target, kind);
        const len = values.length;
        if (index >= len) {
            return {
                value: undefined,
                done: true
            };
        }
        this[INTERNAL].index = index + 1;
        return {
            value: values[index],
            done: false
        };
    }
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
    value: "HeadersIterator",
    writable: false,
    enumerable: false,
    configurable: true
});
/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */ function exportNodeCompatibleHeaders(headers) {
    const obj = Object.assign({
        __proto__: null
    }, headers[MAP]);
    // http.request() only supports string as Host header. This hack makes
    // specifying custom Host header possible.
    const hostHeaderKey = find(headers[MAP], "Host");
    if (hostHeaderKey !== undefined) {
        obj[hostHeaderKey] = obj[hostHeaderKey][0];
    }
    return obj;
}
/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */ function createHeadersLenient(obj) {
    const headers = new Headers();
    for (const name of Object.keys(obj)){
        if (invalidTokenRegex.test(name)) {
            continue;
        }
        if (Array.isArray(obj[name])) {
            for (const val of obj[name]){
                if (invalidHeaderCharRegex.test(val)) {
                    continue;
                }
                if (headers[MAP][name] === undefined) {
                    headers[MAP][name] = [
                        val
                    ];
                } else {
                    headers[MAP][name].push(val);
                }
            }
        } else if (!invalidHeaderCharRegex.test(obj[name])) {
            headers[MAP][name] = [
                obj[name]
            ];
        }
    }
    return headers;
}
const INTERNALS$1 = Symbol("Response internals");
// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;
/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */ class Response {
    constructor(){
        let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        Body.call(this, body, opts);
        const status = opts.status || 200;
        const headers = new Headers(opts.headers);
        if (body != null && !headers.has("Content-Type")) {
            const contentType = extractContentType(body);
            if (contentType) {
                headers.append("Content-Type", contentType);
            }
        }
        this[INTERNALS$1] = {
            url: opts.url,
            status,
            statusText: opts.statusText || STATUS_CODES[status],
            headers,
            counter: opts.counter
        };
    }
    get url() {
        return this[INTERNALS$1].url || "";
    }
    get status() {
        return this[INTERNALS$1].status;
    }
    /**
  * Convenience property representing if the request ended normally
  */ get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
    }
    get redirected() {
        return this[INTERNALS$1].counter > 0;
    }
    get statusText() {
        return this[INTERNALS$1].statusText;
    }
    get headers() {
        return this[INTERNALS$1].headers;
    }
    /**
  * Clone this response
  *
  * @return  Response
  */ clone() {
        return new Response(clone(this), {
            url: this.url,
            status: this.status,
            statusText: this.statusText,
            headers: this.headers,
            ok: this.ok,
            redirected: this.redirected
        });
    }
}
Body.mixIn(Response.prototype);
Object.defineProperties(Response.prototype, {
    url: {
        enumerable: true
    },
    status: {
        enumerable: true
    },
    ok: {
        enumerable: true
    },
    redirected: {
        enumerable: true
    },
    statusText: {
        enumerable: true
    },
    headers: {
        enumerable: true
    },
    clone: {
        enumerable: true
    }
});
Object.defineProperty(Response.prototype, Symbol.toStringTag, {
    value: "Response",
    writable: false,
    enumerable: false,
    configurable: true
});
const INTERNALS$2 = Symbol("Request internals");
const URL = Url.URL || whatwgUrl.URL;
// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;
/**
 * Wrapper around `new URL` to handle arbitrary URLs
 *
 * @param  {string} urlStr
 * @return {void}
 */ function parseURL(urlStr) {
    /*
 	Check whether the URL is absolute or not
 		Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
 	Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
 */ if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.exec(urlStr)) {
        urlStr = new URL(urlStr).toString();
    }
    // Fallback to old implementation for arbitrary URLs
    return parse_url(urlStr);
}
const streamDestructionSupported = "destroy" in Stream.Readable.prototype;
/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */ function isRequest(input) {
    return typeof input === "object" && typeof input[INTERNALS$2] === "object";
}
function isAbortSignal(signal) {
    const proto = signal && typeof signal === "object" && Object.getPrototypeOf(signal);
    return !!(proto && proto.constructor.name === "AbortSignal");
}
/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */ class Request {
    constructor(input){
        let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        let parsedURL;
        // normalize input
        if (!isRequest(input)) {
            if (input && input.href) {
                // in order to support Node.js' Url objects; though WHATWG's URL objects
                // will fall into this branch also (since their `toString()` will return
                // `href` property anyway)
                parsedURL = parseURL(input.href);
            } else {
                // coerce input to a string before attempting to parse
                parsedURL = parseURL(`${input}`);
            }
            input = {};
        } else {
            parsedURL = parseURL(input.url);
        }
        let method = init.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
            throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;
        Body.call(this, inputBody, {
            timeout: init.timeout || input.timeout || 0,
            size: init.size || input.size || 0
        });
        const headers = new Headers(init.headers || input.headers || {});
        if (inputBody != null && !headers.has("Content-Type")) {
            const contentType = extractContentType(inputBody);
            if (contentType) {
                headers.append("Content-Type", contentType);
            }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init) signal = init.signal;
        if (signal != null && !isAbortSignal(signal)) {
            throw new TypeError("Expected signal to be an instanceof AbortSignal");
        }
        this[INTERNALS$2] = {
            method,
            redirect: init.redirect || input.redirect || "follow",
            headers,
            parsedURL,
            signal
        };
        // node-fetch-only options
        this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
        this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
        this.counter = init.counter || input.counter || 0;
        this.agent = init.agent || input.agent;
    }
    get method() {
        return this[INTERNALS$2].method;
    }
    get url() {
        return format_url(this[INTERNALS$2].parsedURL);
    }
    get headers() {
        return this[INTERNALS$2].headers;
    }
    get redirect() {
        return this[INTERNALS$2].redirect;
    }
    get signal() {
        return this[INTERNALS$2].signal;
    }
    /**
  * Clone this request
  *
  * @return  Request
  */ clone() {
        return new Request(this);
    }
}
Body.mixIn(Request.prototype);
Object.defineProperty(Request.prototype, Symbol.toStringTag, {
    value: "Request",
    writable: false,
    enumerable: false,
    configurable: true
});
Object.defineProperties(Request.prototype, {
    method: {
        enumerable: true
    },
    url: {
        enumerable: true
    },
    headers: {
        enumerable: true
    },
    redirect: {
        enumerable: true
    },
    clone: {
        enumerable: true
    },
    signal: {
        enumerable: true
    }
});
/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */ function getNodeRequestOptions(request) {
    const parsedURL = request[INTERNALS$2].parsedURL;
    const headers = new Headers(request[INTERNALS$2].headers);
    // fetch step 1.3
    if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
    }
    // Basic fetch
    if (!parsedURL.protocol || !parsedURL.hostname) {
        throw new TypeError("Only absolute URLs are supported");
    }
    if (!/^https?:$/.test(parsedURL.protocol)) {
        throw new TypeError("Only HTTP(S) protocols are supported");
    }
    if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
        throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
    }
    // HTTP-network-or-cache fetch steps 2.4-2.7
    let contentLengthValue = null;
    if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
        contentLengthValue = "0";
    }
    if (request.body != null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number") {
            contentLengthValue = String(totalBytes);
        }
    }
    if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
    }
    // HTTP-network-or-cache fetch step 2.11
    if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
    }
    // HTTP-network-or-cache fetch step 2.15
    if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate");
    }
    let agent = request.agent;
    if (typeof agent === "function") {
        agent = agent(parsedURL);
    }
    // HTTP-network fetch step 4.2
    // chunked encoding is handled by Node.js
    return Object.assign({}, parsedURL, {
        method: request.method,
        headers: exportNodeCompatibleHeaders(headers),
        agent
    });
}
/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */ /**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */ function AbortError(message) {
    Error.call(this, message);
    this.type = "aborted";
    this.message = message;
    // hide custom error implementation details from end-users
    Error.captureStackTrace(this, this.constructor);
}
AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = "AbortError";
const URL$1 = Url.URL || whatwgUrl.URL;
// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const isDomainOrSubdomain = function isDomainOrSubdomain(destination, original) {
    const orig = new URL$1(original).hostname;
    const dest = new URL$1(destination).hostname;
    return orig === dest || orig[orig.length - dest.length - 1] === "." && orig.endsWith(dest);
};
/**
 * isSameProtocol reports whether the two provided URLs use the same protocol.
 *
 * Both domains must already be in canonical form.
 * @param {string|URL} original
 * @param {string|URL} destination
 */ const isSameProtocol = function isSameProtocol(destination, original) {
    const orig = new URL$1(original).protocol;
    const dest = new URL$1(destination).protocol;
    return orig === dest;
};
/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */ function fetch(url, opts) {
    // allow custom promise
    if (!fetch.Promise) {
        throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
    }
    Body.Promise = fetch.Promise;
    // wrap http.request into fetch
    return new fetch.Promise(function(resolve, reject) {
        // build request object
        const request = new Request(url, opts);
        const options = getNodeRequestOptions(request);
        const send = (options.protocol === "https:" ? https : http).request;
        const signal = request.signal;
        let response = null;
        const abort = function abort() {
            let error = new AbortError("The user aborted a request.");
            reject(error);
            if (request.body && request.body instanceof Stream.Readable) {
                destroyStream(request.body, error);
            }
            if (!response || !response.body) return;
            response.body.emit("error", error);
        };
        if (signal && signal.aborted) {
            abort();
            return;
        }
        const abortAndFinalize = function abortAndFinalize() {
            abort();
            finalize();
        };
        // send request
        const req = send(options);
        let reqTimeout;
        if (signal) {
            signal.addEventListener("abort", abortAndFinalize);
        }
        function finalize() {
            req.abort();
            if (signal) signal.removeEventListener("abort", abortAndFinalize);
            clearTimeout(reqTimeout);
        }
        if (request.timeout) {
            req.once("socket", function(socket) {
                reqTimeout = setTimeout(function() {
                    reject(new FetchError(`network timeout at: ${request.url}`, "request-timeout"));
                    finalize();
                }, request.timeout);
            });
        }
        req.on("error", function(err) {
            reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
            if (response && response.body) {
                destroyStream(response.body, err);
            }
            finalize();
        });
        fixResponseChunkedTransferBadEnding(req, function(err) {
            if (signal && signal.aborted) {
                return;
            }
            if (response && response.body) {
                destroyStream(response.body, err);
            }
        });
        /* c8 ignore next 18 */ if (parseInt(process.version.substring(1)) < 14) {
            // Before Node.js 14, pipeline() does not fully support async iterators and does not always
            // properly handle when the socket close/end events are out of order.
            req.on("socket", function(s) {
                s.addListener("close", function(hadError) {
                    // if a data listener is still present we didn't end cleanly
                    const hasDataListener = s.listenerCount("data") > 0;
                    // if end happened before close but the socket didn't emit an error, do it now
                    if (response && hasDataListener && !hadError && !(signal && signal.aborted)) {
                        const err = new Error("Premature close");
                        err.code = "ERR_STREAM_PREMATURE_CLOSE";
                        response.body.emit("error", err);
                    }
                });
            });
        }
        req.on("response", function(res) {
            clearTimeout(reqTimeout);
            const headers = createHeadersLenient(res.headers);
            // HTTP fetch step 5
            if (fetch.isRedirect(res.statusCode)) {
                // HTTP fetch step 5.2
                const location = headers.get("Location");
                // HTTP fetch step 5.3
                let locationURL = null;
                try {
                    locationURL = location === null ? null : new URL$1(location, request.url).toString();
                } catch (err) {
                    // error here can only be invalid URL in Location: header
                    // do not throw when options.redirect == manual
                    // let the user extract the errorneous redirect URL
                    if (request.redirect !== "manual") {
                        reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, "invalid-redirect"));
                        finalize();
                        return;
                    }
                }
                // HTTP fetch step 5.5
                switch(request.redirect){
                    case "error":
                        reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
                        finalize();
                        return;
                    case "manual":
                        // node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
                        if (locationURL !== null) {
                            // handle corrupted header
                            try {
                                headers.set("Location", locationURL);
                            } catch (err) {
                                // istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
                                reject(err);
                            }
                        }
                        break;
                    case "follow":
                        // HTTP-redirect fetch step 2
                        if (locationURL === null) {
                            break;
                        }
                        // HTTP-redirect fetch step 5
                        if (request.counter >= request.follow) {
                            reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
                            finalize();
                            return;
                        }
                        // HTTP-redirect fetch step 6 (counter increment)
                        // Create a new Request object.
                        const requestOpts = {
                            headers: new Headers(request.headers),
                            follow: request.follow,
                            counter: request.counter + 1,
                            agent: request.agent,
                            compress: request.compress,
                            method: request.method,
                            body: request.body,
                            signal: request.signal,
                            timeout: request.timeout,
                            size: request.size
                        };
                        if (!isDomainOrSubdomain(request.url, locationURL) || !isSameProtocol(request.url, locationURL)) {
                            for (const name of [
                                "authorization",
                                "www-authenticate",
                                "cookie",
                                "cookie2"
                            ]){
                                requestOpts.headers.delete(name);
                            }
                        }
                        // HTTP-redirect fetch step 9
                        if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
                            reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
                            finalize();
                            return;
                        }
                        // HTTP-redirect fetch step 11
                        if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === "POST") {
                            requestOpts.method = "GET";
                            requestOpts.body = undefined;
                            requestOpts.headers.delete("content-length");
                        }
                        // HTTP-redirect fetch step 15
                        resolve(fetch(new Request(locationURL, requestOpts)));
                        finalize();
                        return;
                }
            }
            // prepare response
            res.once("end", function() {
                if (signal) signal.removeEventListener("abort", abortAndFinalize);
            });
            let body = res.pipe(new PassThrough$1());
            const response_options = {
                url: request.url,
                status: res.statusCode,
                statusText: res.statusMessage,
                headers: headers,
                size: request.size,
                timeout: request.timeout,
                counter: request.counter
            };
            // HTTP-network fetch step 12.1.1.3
            const codings = headers.get("Content-Encoding");
            // HTTP-network fetch step 12.1.1.4: handle content codings
            // in following scenarios we ignore compression support
            // 1. compression support is disabled
            // 2. HEAD request
            // 3. no Content-Encoding header
            // 4. no content response (204)
            // 5. content not modified response (304)
            if (!request.compress || request.method === "HEAD" || codings === null || res.statusCode === 204 || res.statusCode === 304) {
                response = new Response(body, response_options);
                resolve(response);
                return;
            }
            // For Node v6+
            // Be less strict when decoding compressed responses, since sometimes
            // servers send slightly invalid responses that are still accepted
            // by common browsers.
            // Always using Z_SYNC_FLUSH is what cURL does.
            const zlibOptions = {
                flush: zlib.Z_SYNC_FLUSH,
                finishFlush: zlib.Z_SYNC_FLUSH
            };
            // for gzip
            if (codings == "gzip" || codings == "x-gzip") {
                body = body.pipe(zlib.createGunzip(zlibOptions));
                response = new Response(body, response_options);
                resolve(response);
                return;
            }
            // for deflate
            if (codings == "deflate" || codings == "x-deflate") {
                // handle the infamous raw deflate response from old servers
                // a hack for old IIS and Apache servers
                const raw = res.pipe(new PassThrough$1());
                raw.once("data", function(chunk) {
                    // see http://stackoverflow.com/questions/37519828
                    if ((chunk[0] & 0x0F) === 0x08) {
                        body = body.pipe(zlib.createInflate());
                    } else {
                        body = body.pipe(zlib.createInflateRaw());
                    }
                    response = new Response(body, response_options);
                    resolve(response);
                });
                raw.on("end", function() {
                    // some old IIS servers return zero-length OK deflate responses, so 'data' is never emitted.
                    if (!response) {
                        response = new Response(body, response_options);
                        resolve(response);
                    }
                });
                return;
            }
            // for br
            if (codings == "br" && typeof zlib.createBrotliDecompress === "function") {
                body = body.pipe(zlib.createBrotliDecompress());
                response = new Response(body, response_options);
                resolve(response);
                return;
            }
            // otherwise, use response as-is
            response = new Response(body, response_options);
            resolve(response);
        });
        writeToStream(req, request);
    });
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
    let socket;
    request.on("socket", function(s) {
        socket = s;
    });
    request.on("response", function(response) {
        const headers = response.headers;
        if (headers["transfer-encoding"] === "chunked" && !headers["content-length"]) {
            response.once("close", function(hadError) {
                // tests for socket presence, as in some situations the
                // the 'socket' event is not triggered for the request
                // (happens in deno), avoids `TypeError`
                // if a data listener is still present we didn't end cleanly
                const hasDataListener = socket && socket.listenerCount("data") > 0;
                if (hasDataListener && !hadError) {
                    const err = new Error("Premature close");
                    err.code = "ERR_STREAM_PREMATURE_CLOSE";
                    errorCallback(err);
                }
            });
        }
    });
}
function destroyStream(stream, err) {
    if (stream.destroy) {
        stream.destroy(err);
    } else {
        // node < 8
        stream.emit("error", err);
        stream.end();
    }
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */ fetch.isRedirect = function(code) {
    return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};
// expose Promise
fetch.Promise = global.Promise;
module.exports = exports = fetch;
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = exports;
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.FetchError = FetchError;
exports.AbortError = AbortError;


/***/ }),

/***/ 81222:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var punycode = __webpack_require__(85477);
var mappingTable = __webpack_require__(52676);
var PROCESSING_OPTIONS = {
    TRANSITIONAL: 0,
    NONTRANSITIONAL: 1
};
function normalize(str) {
    return str.split("\x00").map(function(s) {
        return s.normalize("NFC");
    }).join("\x00");
}
function findStatus(val) {
    var start = 0;
    var end = mappingTable.length - 1;
    while(start <= end){
        var mid = Math.floor((start + end) / 2);
        var target = mappingTable[mid];
        if (target[0][0] <= val && target[0][1] >= val) {
            return target;
        } else if (target[0][0] > val) {
            end = mid - 1;
        } else {
            start = mid + 1;
        }
    }
    return null;
}
var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
function countSymbols(string) {
    return string// replace every surrogate pair with a BMP symbol
    .replace(regexAstralSymbols, "_")// then get the length
    .length;
}
function mapChars(domain_name, useSTD3, processing_option) {
    var hasError = false;
    var processed = "";
    var len = countSymbols(domain_name);
    for(var i = 0; i < len; ++i){
        var codePoint = domain_name.codePointAt(i);
        var status = findStatus(codePoint);
        switch(status[1]){
            case "disallowed":
                hasError = true;
                processed += String.fromCodePoint(codePoint);
                break;
            case "ignored":
                break;
            case "mapped":
                processed += String.fromCodePoint.apply(String, status[2]);
                break;
            case "deviation":
                if (processing_option === PROCESSING_OPTIONS.TRANSITIONAL) {
                    processed += String.fromCodePoint.apply(String, status[2]);
                } else {
                    processed += String.fromCodePoint(codePoint);
                }
                break;
            case "valid":
                processed += String.fromCodePoint(codePoint);
                break;
            case "disallowed_STD3_mapped":
                if (useSTD3) {
                    hasError = true;
                    processed += String.fromCodePoint(codePoint);
                } else {
                    processed += String.fromCodePoint.apply(String, status[2]);
                }
                break;
            case "disallowed_STD3_valid":
                if (useSTD3) {
                    hasError = true;
                }
                processed += String.fromCodePoint(codePoint);
                break;
        }
    }
    return {
        string: processed,
        error: hasError
    };
}
var combiningMarksRegex = /[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D01-\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u192B\u1930-\u193B\u19B0-\u19C0\u19C8\u19C9\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2D]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC7F-\uDC82\uDCB0-\uDCBA\uDD00-\uDD02\uDD27-\uDD34\uDD73\uDD80-\uDD82\uDDB3-\uDDC0\uDE2C-\uDE37\uDEDF-\uDEEA\uDF01-\uDF03\uDF3C\uDF3E-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDCB0-\uDCC3\uDDAF-\uDDB5\uDDB8-\uDDC0\uDE30-\uDE40\uDEAB-\uDEB7]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF51-\uDF7E\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD83A[\uDCD0-\uDCD6]|\uDB40[\uDD00-\uDDEF]/;
function validateLabel(label, processing_option) {
    if (label.substr(0, 4) === "xn--") {
        label = punycode.toUnicode(label);
        processing_option = PROCESSING_OPTIONS.NONTRANSITIONAL;
    }
    var error = false;
    if (normalize(label) !== label || label[3] === "-" && label[4] === "-" || label[0] === "-" || label[label.length - 1] === "-" || label.indexOf(".") !== -1 || label.search(combiningMarksRegex) === 0) {
        error = true;
    }
    var len = countSymbols(label);
    for(var i = 0; i < len; ++i){
        var status = findStatus(label.codePointAt(i));
        if (processing === PROCESSING_OPTIONS.TRANSITIONAL && status[1] !== "valid" || processing === PROCESSING_OPTIONS.NONTRANSITIONAL && status[1] !== "valid" && status[1] !== "deviation") {
            error = true;
            break;
        }
    }
    return {
        label: label,
        error: error
    };
}
function processing(domain_name, useSTD3, processing_option) {
    var result = mapChars(domain_name, useSTD3, processing_option);
    result.string = normalize(result.string);
    var labels = result.string.split(".");
    for(var i = 0; i < labels.length; ++i){
        try {
            var validation = validateLabel(labels[i]);
            labels[i] = validation.label;
            result.error = result.error || validation.error;
        } catch (e) {
            result.error = true;
        }
    }
    return {
        string: labels.join("."),
        error: result.error
    };
}
module.exports.toASCII = function(domain_name, useSTD3, processing_option, verifyDnsLength) {
    var result = processing(domain_name, useSTD3, processing_option);
    var labels = result.string.split(".");
    labels = labels.map(function(l) {
        try {
            return punycode.toASCII(l);
        } catch (e) {
            result.error = true;
            return l;
        }
    });
    if (verifyDnsLength) {
        var total = labels.slice(0, labels.length - 1).join(".").length;
        if (total.length > 253 || total.length === 0) {
            result.error = true;
        }
        for(var i = 0; i < labels.length; ++i){
            if (labels.length > 63 || labels.length === 0) {
                result.error = true;
                break;
            }
        }
    }
    if (result.error) return null;
    return labels.join(".");
};
module.exports.toUnicode = function(domain_name, useSTD3) {
    var result = processing(domain_name, useSTD3, PROCESSING_OPTIONS.NONTRANSITIONAL);
    return {
        domain: result.string,
        error: result.error
    };
};
module.exports.PROCESSING_OPTIONS = PROCESSING_OPTIONS;


/***/ }),

/***/ 94637:
/***/ ((module) => {


var conversions = {};
module.exports = conversions;
function sign(x) {
    return x < 0 ? -1 : 1;
}
function evenRound(x) {
    // Round x to the nearest integer, choosing the even integer if it lies halfway between two.
    if (x % 1 === 0.5 && (x & 1) === 0) {
        return Math.floor(x);
    } else {
        return Math.round(x);
    }
}
function createNumberConversion(bitLength, typeOpts) {
    if (!typeOpts.unsigned) {
        --bitLength;
    }
    const lowerBound = typeOpts.unsigned ? 0 : -Math.pow(2, bitLength);
    const upperBound = Math.pow(2, bitLength) - 1;
    const moduloVal = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength) : Math.pow(2, bitLength);
    const moduloBound = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength - 1) : Math.pow(2, bitLength - 1);
    return function(V, opts) {
        if (!opts) opts = {};
        let x = +V;
        if (opts.enforceRange) {
            if (!Number.isFinite(x)) {
                throw new TypeError("Argument is not a finite number");
            }
            x = sign(x) * Math.floor(Math.abs(x));
            if (x < lowerBound || x > upperBound) {
                throw new TypeError("Argument is not in byte range");
            }
            return x;
        }
        if (!isNaN(x) && opts.clamp) {
            x = evenRound(x);
            if (x < lowerBound) x = lowerBound;
            if (x > upperBound) x = upperBound;
            return x;
        }
        if (!Number.isFinite(x) || x === 0) {
            return 0;
        }
        x = sign(x) * Math.floor(Math.abs(x));
        x = x % moduloVal;
        if (!typeOpts.unsigned && x >= moduloBound) {
            return x - moduloVal;
        } else if (typeOpts.unsigned) {
            if (x < 0) {
                x += moduloVal;
            } else if (x === -0) {
                return 0;
            }
        }
        return x;
    };
}
conversions["void"] = function() {
    return undefined;
};
conversions["boolean"] = function(val) {
    return !!val;
};
conversions["byte"] = createNumberConversion(8, {
    unsigned: false
});
conversions["octet"] = createNumberConversion(8, {
    unsigned: true
});
conversions["short"] = createNumberConversion(16, {
    unsigned: false
});
conversions["unsigned short"] = createNumberConversion(16, {
    unsigned: true
});
conversions["long"] = createNumberConversion(32, {
    unsigned: false
});
conversions["unsigned long"] = createNumberConversion(32, {
    unsigned: true
});
conversions["long long"] = createNumberConversion(32, {
    unsigned: false,
    moduloBitLength: 64
});
conversions["unsigned long long"] = createNumberConversion(32, {
    unsigned: true,
    moduloBitLength: 64
});
conversions["double"] = function(V) {
    const x = +V;
    if (!Number.isFinite(x)) {
        throw new TypeError("Argument is not a finite floating-point value");
    }
    return x;
};
conversions["unrestricted double"] = function(V) {
    const x = +V;
    if (isNaN(x)) {
        throw new TypeError("Argument is NaN");
    }
    return x;
};
// not quite valid, but good enough for JS
conversions["float"] = conversions["double"];
conversions["unrestricted float"] = conversions["unrestricted double"];
conversions["DOMString"] = function(V, opts) {
    if (!opts) opts = {};
    if (opts.treatNullAsEmptyString && V === null) {
        return "";
    }
    return String(V);
};
conversions["ByteString"] = function(V, opts) {
    const x = String(V);
    let c = undefined;
    for(let i = 0; (c = x.codePointAt(i)) !== undefined; ++i){
        if (c > 255) {
            throw new TypeError("Argument is not a valid bytestring");
        }
    }
    return x;
};
conversions["USVString"] = function(V) {
    const S = String(V);
    const n = S.length;
    const U = [];
    for(let i = 0; i < n; ++i){
        const c = S.charCodeAt(i);
        if (c < 0xD800 || c > 0xDFFF) {
            U.push(String.fromCodePoint(c));
        } else if (0xDC00 <= c && c <= 0xDFFF) {
            U.push(String.fromCodePoint(0xFFFD));
        } else {
            if (i === n - 1) {
                U.push(String.fromCodePoint(0xFFFD));
            } else {
                const d = S.charCodeAt(i + 1);
                if (0xDC00 <= d && d <= 0xDFFF) {
                    const a = c & 0x3FF;
                    const b = d & 0x3FF;
                    U.push(String.fromCodePoint((2 << 15) + (2 << 9) * a + b));
                    ++i;
                } else {
                    U.push(String.fromCodePoint(0xFFFD));
                }
            }
        }
    }
    return U.join("");
};
conversions["Date"] = function(V, opts) {
    if (!(V instanceof Date)) {
        throw new TypeError("Argument is not a Date object");
    }
    if (isNaN(V)) {
        return undefined;
    }
    return V;
};
conversions["RegExp"] = function(V, opts) {
    if (!(V instanceof RegExp)) {
        V = new RegExp(V);
    }
    return V;
};


/***/ }),

/***/ 89112:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


const usm = __webpack_require__(91063);
exports.implementation = class URLImpl {
    constructor(constructorArgs){
        const url = constructorArgs[0];
        const base = constructorArgs[1];
        let parsedBase = null;
        if (base !== undefined) {
            parsedBase = usm.basicURLParse(base);
            if (parsedBase === "failure") {
                throw new TypeError("Invalid base URL");
            }
        }
        const parsedURL = usm.basicURLParse(url, {
            baseURL: parsedBase
        });
        if (parsedURL === "failure") {
            throw new TypeError("Invalid URL");
        }
        this._url = parsedURL;
    // TODO: query stuff
    }
    get href() {
        return usm.serializeURL(this._url);
    }
    set href(v) {
        const parsedURL = usm.basicURLParse(v);
        if (parsedURL === "failure") {
            throw new TypeError("Invalid URL");
        }
        this._url = parsedURL;
    }
    get origin() {
        return usm.serializeURLOrigin(this._url);
    }
    get protocol() {
        return this._url.scheme + ":";
    }
    set protocol(v) {
        usm.basicURLParse(v + ":", {
            url: this._url,
            stateOverride: "scheme start"
        });
    }
    get username() {
        return this._url.username;
    }
    set username(v) {
        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
            return;
        }
        usm.setTheUsername(this._url, v);
    }
    get password() {
        return this._url.password;
    }
    set password(v) {
        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
            return;
        }
        usm.setThePassword(this._url, v);
    }
    get host() {
        const url = this._url;
        if (url.host === null) {
            return "";
        }
        if (url.port === null) {
            return usm.serializeHost(url.host);
        }
        return usm.serializeHost(url.host) + ":" + usm.serializeInteger(url.port);
    }
    set host(v) {
        if (this._url.cannotBeABaseURL) {
            return;
        }
        usm.basicURLParse(v, {
            url: this._url,
            stateOverride: "host"
        });
    }
    get hostname() {
        if (this._url.host === null) {
            return "";
        }
        return usm.serializeHost(this._url.host);
    }
    set hostname(v) {
        if (this._url.cannotBeABaseURL) {
            return;
        }
        usm.basicURLParse(v, {
            url: this._url,
            stateOverride: "hostname"
        });
    }
    get port() {
        if (this._url.port === null) {
            return "";
        }
        return usm.serializeInteger(this._url.port);
    }
    set port(v) {
        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
            return;
        }
        if (v === "") {
            this._url.port = null;
        } else {
            usm.basicURLParse(v, {
                url: this._url,
                stateOverride: "port"
            });
        }
    }
    get pathname() {
        if (this._url.cannotBeABaseURL) {
            return this._url.path[0];
        }
        if (this._url.path.length === 0) {
            return "";
        }
        return "/" + this._url.path.join("/");
    }
    set pathname(v) {
        if (this._url.cannotBeABaseURL) {
            return;
        }
        this._url.path = [];
        usm.basicURLParse(v, {
            url: this._url,
            stateOverride: "path start"
        });
    }
    get search() {
        if (this._url.query === null || this._url.query === "") {
            return "";
        }
        return "?" + this._url.query;
    }
    set search(v) {
        // TODO: query stuff
        const url = this._url;
        if (v === "") {
            url.query = null;
            return;
        }
        const input = v[0] === "?" ? v.substring(1) : v;
        url.query = "";
        usm.basicURLParse(input, {
            url,
            stateOverride: "query"
        });
    }
    get hash() {
        if (this._url.fragment === null || this._url.fragment === "") {
            return "";
        }
        return "#" + this._url.fragment;
    }
    set hash(v) {
        if (v === "") {
            this._url.fragment = null;
            return;
        }
        const input = v[0] === "#" ? v.substring(1) : v;
        this._url.fragment = "";
        usm.basicURLParse(input, {
            url: this._url,
            stateOverride: "fragment"
        });
    }
    toJSON() {
        return this.href;
    }
};


/***/ }),

/***/ 17080:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const conversions = __webpack_require__(94637);
const utils = __webpack_require__(19545);
const Impl = __webpack_require__(89112);
const impl = utils.implSymbol;
function URL(url) {
    if (!this || this[impl] || !(this instanceof URL)) {
        throw new TypeError("Failed to construct 'URL': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
    }
    if (arguments.length < 1) {
        throw new TypeError("Failed to construct 'URL': 1 argument required, but only " + arguments.length + " present.");
    }
    const args = [];
    for(let i = 0; i < arguments.length && i < 2; ++i){
        args[i] = arguments[i];
    }
    args[0] = conversions["USVString"](args[0]);
    if (args[1] !== undefined) {
        args[1] = conversions["USVString"](args[1]);
    }
    module.exports.setup(this, args);
}
URL.prototype.toJSON = function toJSON() {
    if (!this || !module.exports.is(this)) {
        throw new TypeError("Illegal invocation");
    }
    const args = [];
    for(let i = 0; i < arguments.length && i < 0; ++i){
        args[i] = arguments[i];
    }
    return this[impl].toJSON.apply(this[impl], args);
};
Object.defineProperty(URL.prototype, "href", {
    get () {
        return this[impl].href;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].href = V;
    },
    enumerable: true,
    configurable: true
});
URL.prototype.toString = function() {
    if (!this || !module.exports.is(this)) {
        throw new TypeError("Illegal invocation");
    }
    return this.href;
};
Object.defineProperty(URL.prototype, "origin", {
    get () {
        return this[impl].origin;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "protocol", {
    get () {
        return this[impl].protocol;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].protocol = V;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "username", {
    get () {
        return this[impl].username;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].username = V;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "password", {
    get () {
        return this[impl].password;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].password = V;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "host", {
    get () {
        return this[impl].host;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].host = V;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "hostname", {
    get () {
        return this[impl].hostname;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].hostname = V;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "port", {
    get () {
        return this[impl].port;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].port = V;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "pathname", {
    get () {
        return this[impl].pathname;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].pathname = V;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "search", {
    get () {
        return this[impl].search;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].search = V;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "hash", {
    get () {
        return this[impl].hash;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].hash = V;
    },
    enumerable: true,
    configurable: true
});
module.exports = {
    is (obj) {
        return !!obj && obj[impl] instanceof Impl.implementation;
    },
    create (constructorArgs, privateData) {
        let obj = Object.create(URL.prototype);
        this.setup(obj, constructorArgs, privateData);
        return obj;
    },
    setup (obj, constructorArgs, privateData) {
        if (!privateData) privateData = {};
        privateData.wrapper = obj;
        obj[impl] = new Impl.implementation(constructorArgs, privateData);
        obj[impl][utils.wrapperSymbol] = obj;
    },
    interface: URL,
    expose: {
        Window: {
            URL: URL
        },
        Worker: {
            URL: URL
        }
    }
};


/***/ }),

/***/ 61870:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.URL = __webpack_require__(17080)["interface"];
exports.serializeURL = __webpack_require__(91063).serializeURL;
exports.serializeURLOrigin = __webpack_require__(91063).serializeURLOrigin;
exports.basicURLParse = __webpack_require__(91063).basicURLParse;
exports.setTheUsername = __webpack_require__(91063).setTheUsername;
exports.setThePassword = __webpack_require__(91063).setThePassword;
exports.serializeHost = __webpack_require__(91063).serializeHost;
exports.serializeInteger = __webpack_require__(91063).serializeInteger;
exports.parseURL = __webpack_require__(91063).parseURL;


/***/ }),

/***/ 91063:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const punycode = __webpack_require__(85477);
const tr46 = __webpack_require__(81222);
const specialSchemes = {
    ftp: 21,
    file: null,
    gopher: 70,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
};
const failure = Symbol("failure");
function countSymbols(str) {
    return punycode.ucs2.decode(str).length;
}
function at(input, idx) {
    const c = input[idx];
    return isNaN(c) ? undefined : String.fromCodePoint(c);
}
function isASCIIDigit(c) {
    return c >= 0x30 && c <= 0x39;
}
function isASCIIAlpha(c) {
    return c >= 0x41 && c <= 0x5A || c >= 0x61 && c <= 0x7A;
}
function isASCIIAlphanumeric(c) {
    return isASCIIAlpha(c) || isASCIIDigit(c);
}
function isASCIIHex(c) {
    return isASCIIDigit(c) || c >= 0x41 && c <= 0x46 || c >= 0x61 && c <= 0x66;
}
function isSingleDot(buffer) {
    return buffer === "." || buffer.toLowerCase() === "%2e";
}
function isDoubleDot(buffer) {
    buffer = buffer.toLowerCase();
    return buffer === ".." || buffer === "%2e." || buffer === ".%2e" || buffer === "%2e%2e";
}
function isWindowsDriveLetterCodePoints(cp1, cp2) {
    return isASCIIAlpha(cp1) && (cp2 === 58 || cp2 === 124);
}
function isWindowsDriveLetterString(string) {
    return string.length === 2 && isASCIIAlpha(string.codePointAt(0)) && (string[1] === ":" || string[1] === "|");
}
function isNormalizedWindowsDriveLetterString(string) {
    return string.length === 2 && isASCIIAlpha(string.codePointAt(0)) && string[1] === ":";
}
function containsForbiddenHostCodePoint(string) {
    return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|%|\/|:|\?|@|\[|\\|\]/) !== -1;
}
function containsForbiddenHostCodePointExcludingPercent(string) {
    return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|\/|:|\?|@|\[|\\|\]/) !== -1;
}
function isSpecialScheme(scheme) {
    return specialSchemes[scheme] !== undefined;
}
function isSpecial(url) {
    return isSpecialScheme(url.scheme);
}
function defaultPort(scheme) {
    return specialSchemes[scheme];
}
function percentEncode(c) {
    let hex = c.toString(16).toUpperCase();
    if (hex.length === 1) {
        hex = "0" + hex;
    }
    return "%" + hex;
}
function utf8PercentEncode(c) {
    const buf = new Buffer(c);
    let str = "";
    for(let i = 0; i < buf.length; ++i){
        str += percentEncode(buf[i]);
    }
    return str;
}
function utf8PercentDecode(str) {
    const input = new Buffer(str);
    const output = [];
    for(let i = 0; i < input.length; ++i){
        if (input[i] !== 37) {
            output.push(input[i]);
        } else if (input[i] === 37 && isASCIIHex(input[i + 1]) && isASCIIHex(input[i + 2])) {
            output.push(parseInt(input.slice(i + 1, i + 3).toString(), 16));
            i += 2;
        } else {
            output.push(input[i]);
        }
    }
    return new Buffer(output).toString();
}
function isC0ControlPercentEncode(c) {
    return c <= 0x1F || c > 0x7E;
}
const extraPathPercentEncodeSet = new Set([
    32,
    34,
    35,
    60,
    62,
    63,
    96,
    123,
    125
]);
function isPathPercentEncode(c) {
    return isC0ControlPercentEncode(c) || extraPathPercentEncodeSet.has(c);
}
const extraUserinfoPercentEncodeSet = new Set([
    47,
    58,
    59,
    61,
    64,
    91,
    92,
    93,
    94,
    124
]);
function isUserinfoPercentEncode(c) {
    return isPathPercentEncode(c) || extraUserinfoPercentEncodeSet.has(c);
}
function percentEncodeChar(c, encodeSetPredicate) {
    const cStr = String.fromCodePoint(c);
    if (encodeSetPredicate(c)) {
        return utf8PercentEncode(cStr);
    }
    return cStr;
}
function parseIPv4Number(input) {
    let R = 10;
    if (input.length >= 2 && input.charAt(0) === "0" && input.charAt(1).toLowerCase() === "x") {
        input = input.substring(2);
        R = 16;
    } else if (input.length >= 2 && input.charAt(0) === "0") {
        input = input.substring(1);
        R = 8;
    }
    if (input === "") {
        return 0;
    }
    const regex = R === 10 ? /[^0-9]/ : R === 16 ? /[^0-9A-Fa-f]/ : /[^0-7]/;
    if (regex.test(input)) {
        return failure;
    }
    return parseInt(input, R);
}
function parseIPv4(input) {
    const parts = input.split(".");
    if (parts[parts.length - 1] === "") {
        if (parts.length > 1) {
            parts.pop();
        }
    }
    if (parts.length > 4) {
        return input;
    }
    const numbers = [];
    for (const part of parts){
        if (part === "") {
            return input;
        }
        const n = parseIPv4Number(part);
        if (n === failure) {
            return input;
        }
        numbers.push(n);
    }
    for(let i = 0; i < numbers.length - 1; ++i){
        if (numbers[i] > 255) {
            return failure;
        }
    }
    if (numbers[numbers.length - 1] >= Math.pow(256, 5 - numbers.length)) {
        return failure;
    }
    let ipv4 = numbers.pop();
    let counter = 0;
    for (const n of numbers){
        ipv4 += n * Math.pow(256, 3 - counter);
        ++counter;
    }
    return ipv4;
}
function serializeIPv4(address) {
    let output = "";
    let n = address;
    for(let i = 1; i <= 4; ++i){
        output = String(n % 256) + output;
        if (i !== 4) {
            output = "." + output;
        }
        n = Math.floor(n / 256);
    }
    return output;
}
function parseIPv6(input) {
    const address = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ];
    let pieceIndex = 0;
    let compress = null;
    let pointer = 0;
    input = punycode.ucs2.decode(input);
    if (input[pointer] === 58) {
        if (input[pointer + 1] !== 58) {
            return failure;
        }
        pointer += 2;
        ++pieceIndex;
        compress = pieceIndex;
    }
    while(pointer < input.length){
        if (pieceIndex === 8) {
            return failure;
        }
        if (input[pointer] === 58) {
            if (compress !== null) {
                return failure;
            }
            ++pointer;
            ++pieceIndex;
            compress = pieceIndex;
            continue;
        }
        let value = 0;
        let length = 0;
        while(length < 4 && isASCIIHex(input[pointer])){
            value = value * 0x10 + parseInt(at(input, pointer), 16);
            ++pointer;
            ++length;
        }
        if (input[pointer] === 46) {
            if (length === 0) {
                return failure;
            }
            pointer -= length;
            if (pieceIndex > 6) {
                return failure;
            }
            let numbersSeen = 0;
            while(input[pointer] !== undefined){
                let ipv4Piece = null;
                if (numbersSeen > 0) {
                    if (input[pointer] === 46 && numbersSeen < 4) {
                        ++pointer;
                    } else {
                        return failure;
                    }
                }
                if (!isASCIIDigit(input[pointer])) {
                    return failure;
                }
                while(isASCIIDigit(input[pointer])){
                    const number = parseInt(at(input, pointer));
                    if (ipv4Piece === null) {
                        ipv4Piece = number;
                    } else if (ipv4Piece === 0) {
                        return failure;
                    } else {
                        ipv4Piece = ipv4Piece * 10 + number;
                    }
                    if (ipv4Piece > 255) {
                        return failure;
                    }
                    ++pointer;
                }
                address[pieceIndex] = address[pieceIndex] * 0x100 + ipv4Piece;
                ++numbersSeen;
                if (numbersSeen === 2 || numbersSeen === 4) {
                    ++pieceIndex;
                }
            }
            if (numbersSeen !== 4) {
                return failure;
            }
            break;
        } else if (input[pointer] === 58) {
            ++pointer;
            if (input[pointer] === undefined) {
                return failure;
            }
        } else if (input[pointer] !== undefined) {
            return failure;
        }
        address[pieceIndex] = value;
        ++pieceIndex;
    }
    if (compress !== null) {
        let swaps = pieceIndex - compress;
        pieceIndex = 7;
        while(pieceIndex !== 0 && swaps > 0){
            const temp = address[compress + swaps - 1];
            address[compress + swaps - 1] = address[pieceIndex];
            address[pieceIndex] = temp;
            --pieceIndex;
            --swaps;
        }
    } else if (compress === null && pieceIndex !== 8) {
        return failure;
    }
    return address;
}
function serializeIPv6(address) {
    let output = "";
    const seqResult = findLongestZeroSequence(address);
    const compress = seqResult.idx;
    let ignore0 = false;
    for(let pieceIndex = 0; pieceIndex <= 7; ++pieceIndex){
        if (ignore0 && address[pieceIndex] === 0) {
            continue;
        } else if (ignore0) {
            ignore0 = false;
        }
        if (compress === pieceIndex) {
            const separator = pieceIndex === 0 ? "::" : ":";
            output += separator;
            ignore0 = true;
            continue;
        }
        output += address[pieceIndex].toString(16);
        if (pieceIndex !== 7) {
            output += ":";
        }
    }
    return output;
}
function parseHost(input, isSpecialArg) {
    if (input[0] === "[") {
        if (input[input.length - 1] !== "]") {
            return failure;
        }
        return parseIPv6(input.substring(1, input.length - 1));
    }
    if (!isSpecialArg) {
        return parseOpaqueHost(input);
    }
    const domain = utf8PercentDecode(input);
    const asciiDomain = tr46.toASCII(domain, false, tr46.PROCESSING_OPTIONS.NONTRANSITIONAL, false);
    if (asciiDomain === null) {
        return failure;
    }
    if (containsForbiddenHostCodePoint(asciiDomain)) {
        return failure;
    }
    const ipv4Host = parseIPv4(asciiDomain);
    if (typeof ipv4Host === "number" || ipv4Host === failure) {
        return ipv4Host;
    }
    return asciiDomain;
}
function parseOpaqueHost(input) {
    if (containsForbiddenHostCodePointExcludingPercent(input)) {
        return failure;
    }
    let output = "";
    const decoded = punycode.ucs2.decode(input);
    for(let i = 0; i < decoded.length; ++i){
        output += percentEncodeChar(decoded[i], isC0ControlPercentEncode);
    }
    return output;
}
function findLongestZeroSequence(arr) {
    let maxIdx = null;
    let maxLen = 1; // only find elements > 1
    let currStart = null;
    let currLen = 0;
    for(let i = 0; i < arr.length; ++i){
        if (arr[i] !== 0) {
            if (currLen > maxLen) {
                maxIdx = currStart;
                maxLen = currLen;
            }
            currStart = null;
            currLen = 0;
        } else {
            if (currStart === null) {
                currStart = i;
            }
            ++currLen;
        }
    }
    // if trailing zeros
    if (currLen > maxLen) {
        maxIdx = currStart;
        maxLen = currLen;
    }
    return {
        idx: maxIdx,
        len: maxLen
    };
}
function serializeHost(host) {
    if (typeof host === "number") {
        return serializeIPv4(host);
    }
    // IPv6 serializer
    if (host instanceof Array) {
        return "[" + serializeIPv6(host) + "]";
    }
    return host;
}
function trimControlChars(url) {
    return url.replace(/^[\u0000-\u001F\u0020]+|[\u0000-\u001F\u0020]+$/g, "");
}
function trimTabAndNewline(url) {
    return url.replace(/\u0009|\u000A|\u000D/g, "");
}
function shortenPath(url) {
    const path = url.path;
    if (path.length === 0) {
        return;
    }
    if (url.scheme === "file" && path.length === 1 && isNormalizedWindowsDriveLetter(path[0])) {
        return;
    }
    path.pop();
}
function includesCredentials(url) {
    return url.username !== "" || url.password !== "";
}
function cannotHaveAUsernamePasswordPort(url) {
    return url.host === null || url.host === "" || url.cannotBeABaseURL || url.scheme === "file";
}
function isNormalizedWindowsDriveLetter(string) {
    return /^[A-Za-z]:$/.test(string);
}
function URLStateMachine(input, base, encodingOverride, url, stateOverride) {
    this.pointer = 0;
    this.input = input;
    this.base = base || null;
    this.encodingOverride = encodingOverride || "utf-8";
    this.stateOverride = stateOverride;
    this.url = url;
    this.failure = false;
    this.parseError = false;
    if (!this.url) {
        this.url = {
            scheme: "",
            username: "",
            password: "",
            host: null,
            port: null,
            path: [],
            query: null,
            fragment: null,
            cannotBeABaseURL: false
        };
        const res = trimControlChars(this.input);
        if (res !== this.input) {
            this.parseError = true;
        }
        this.input = res;
    }
    const res = trimTabAndNewline(this.input);
    if (res !== this.input) {
        this.parseError = true;
    }
    this.input = res;
    this.state = stateOverride || "scheme start";
    this.buffer = "";
    this.atFlag = false;
    this.arrFlag = false;
    this.passwordTokenSeenFlag = false;
    this.input = punycode.ucs2.decode(this.input);
    for(; this.pointer <= this.input.length; ++this.pointer){
        const c = this.input[this.pointer];
        const cStr = isNaN(c) ? undefined : String.fromCodePoint(c);
        // exec state machine
        const ret = this["parse " + this.state](c, cStr);
        if (!ret) {
            break; // terminate algorithm
        } else if (ret === failure) {
            this.failure = true;
            break;
        }
    }
}
URLStateMachine.prototype["parse scheme start"] = function parseSchemeStart(c, cStr) {
    if (isASCIIAlpha(c)) {
        this.buffer += cStr.toLowerCase();
        this.state = "scheme";
    } else if (!this.stateOverride) {
        this.state = "no scheme";
        --this.pointer;
    } else {
        this.parseError = true;
        return failure;
    }
    return true;
};
URLStateMachine.prototype["parse scheme"] = function parseScheme(c, cStr) {
    if (isASCIIAlphanumeric(c) || c === 43 || c === 45 || c === 46) {
        this.buffer += cStr.toLowerCase();
    } else if (c === 58) {
        if (this.stateOverride) {
            if (isSpecial(this.url) && !isSpecialScheme(this.buffer)) {
                return false;
            }
            if (!isSpecial(this.url) && isSpecialScheme(this.buffer)) {
                return false;
            }
            if ((includesCredentials(this.url) || this.url.port !== null) && this.buffer === "file") {
                return false;
            }
            if (this.url.scheme === "file" && (this.url.host === "" || this.url.host === null)) {
                return false;
            }
        }
        this.url.scheme = this.buffer;
        this.buffer = "";
        if (this.stateOverride) {
            return false;
        }
        if (this.url.scheme === "file") {
            if (this.input[this.pointer + 1] !== 47 || this.input[this.pointer + 2] !== 47) {
                this.parseError = true;
            }
            this.state = "file";
        } else if (isSpecial(this.url) && this.base !== null && this.base.scheme === this.url.scheme) {
            this.state = "special relative or authority";
        } else if (isSpecial(this.url)) {
            this.state = "special authority slashes";
        } else if (this.input[this.pointer + 1] === 47) {
            this.state = "path or authority";
            ++this.pointer;
        } else {
            this.url.cannotBeABaseURL = true;
            this.url.path.push("");
            this.state = "cannot-be-a-base-URL path";
        }
    } else if (!this.stateOverride) {
        this.buffer = "";
        this.state = "no scheme";
        this.pointer = -1;
    } else {
        this.parseError = true;
        return failure;
    }
    return true;
};
URLStateMachine.prototype["parse no scheme"] = function parseNoScheme(c) {
    if (this.base === null || this.base.cannotBeABaseURL && c !== 35) {
        return failure;
    } else if (this.base.cannotBeABaseURL && c === 35) {
        this.url.scheme = this.base.scheme;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
        this.url.fragment = "";
        this.url.cannotBeABaseURL = true;
        this.state = "fragment";
    } else if (this.base.scheme === "file") {
        this.state = "file";
        --this.pointer;
    } else {
        this.state = "relative";
        --this.pointer;
    }
    return true;
};
URLStateMachine.prototype["parse special relative or authority"] = function parseSpecialRelativeOrAuthority(c) {
    if (c === 47 && this.input[this.pointer + 1] === 47) {
        this.state = "special authority ignore slashes";
        ++this.pointer;
    } else {
        this.parseError = true;
        this.state = "relative";
        --this.pointer;
    }
    return true;
};
URLStateMachine.prototype["parse path or authority"] = function parsePathOrAuthority(c) {
    if (c === 47) {
        this.state = "authority";
    } else {
        this.state = "path";
        --this.pointer;
    }
    return true;
};
URLStateMachine.prototype["parse relative"] = function parseRelative(c) {
    this.url.scheme = this.base.scheme;
    if (isNaN(c)) {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
    } else if (c === 47) {
        this.state = "relative slash";
    } else if (c === 63) {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice();
        this.url.query = "";
        this.state = "query";
    } else if (c === 35) {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
        this.url.fragment = "";
        this.state = "fragment";
    } else if (isSpecial(this.url) && c === 92) {
        this.parseError = true;
        this.state = "relative slash";
    } else {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice(0, this.base.path.length - 1);
        this.state = "path";
        --this.pointer;
    }
    return true;
};
URLStateMachine.prototype["parse relative slash"] = function parseRelativeSlash(c) {
    if (isSpecial(this.url) && (c === 47 || c === 92)) {
        if (c === 92) {
            this.parseError = true;
        }
        this.state = "special authority ignore slashes";
    } else if (c === 47) {
        this.state = "authority";
    } else {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.state = "path";
        --this.pointer;
    }
    return true;
};
URLStateMachine.prototype["parse special authority slashes"] = function parseSpecialAuthoritySlashes(c) {
    if (c === 47 && this.input[this.pointer + 1] === 47) {
        this.state = "special authority ignore slashes";
        ++this.pointer;
    } else {
        this.parseError = true;
        this.state = "special authority ignore slashes";
        --this.pointer;
    }
    return true;
};
URLStateMachine.prototype["parse special authority ignore slashes"] = function parseSpecialAuthorityIgnoreSlashes(c) {
    if (c !== 47 && c !== 92) {
        this.state = "authority";
        --this.pointer;
    } else {
        this.parseError = true;
    }
    return true;
};
URLStateMachine.prototype["parse authority"] = function parseAuthority(c, cStr) {
    if (c === 64) {
        this.parseError = true;
        if (this.atFlag) {
            this.buffer = "%40" + this.buffer;
        }
        this.atFlag = true;
        // careful, this is based on buffer and has its own pointer (this.pointer != pointer) and inner chars
        const len = countSymbols(this.buffer);
        for(let pointer = 0; pointer < len; ++pointer){
            const codePoint = this.buffer.codePointAt(pointer);
            if (codePoint === 58 && !this.passwordTokenSeenFlag) {
                this.passwordTokenSeenFlag = true;
                continue;
            }
            const encodedCodePoints = percentEncodeChar(codePoint, isUserinfoPercentEncode);
            if (this.passwordTokenSeenFlag) {
                this.url.password += encodedCodePoints;
            } else {
                this.url.username += encodedCodePoints;
            }
        }
        this.buffer = "";
    } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92) {
        if (this.atFlag && this.buffer === "") {
            this.parseError = true;
            return failure;
        }
        this.pointer -= countSymbols(this.buffer) + 1;
        this.buffer = "";
        this.state = "host";
    } else {
        this.buffer += cStr;
    }
    return true;
};
URLStateMachine.prototype["parse hostname"] = URLStateMachine.prototype["parse host"] = function parseHostName(c, cStr) {
    if (this.stateOverride && this.url.scheme === "file") {
        --this.pointer;
        this.state = "file host";
    } else if (c === 58 && !this.arrFlag) {
        if (this.buffer === "") {
            this.parseError = true;
            return failure;
        }
        const host = parseHost(this.buffer, isSpecial(this.url));
        if (host === failure) {
            return failure;
        }
        this.url.host = host;
        this.buffer = "";
        this.state = "port";
        if (this.stateOverride === "hostname") {
            return false;
        }
    } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92) {
        --this.pointer;
        if (isSpecial(this.url) && this.buffer === "") {
            this.parseError = true;
            return failure;
        } else if (this.stateOverride && this.buffer === "" && (includesCredentials(this.url) || this.url.port !== null)) {
            this.parseError = true;
            return false;
        }
        const host = parseHost(this.buffer, isSpecial(this.url));
        if (host === failure) {
            return failure;
        }
        this.url.host = host;
        this.buffer = "";
        this.state = "path start";
        if (this.stateOverride) {
            return false;
        }
    } else {
        if (c === 91) {
            this.arrFlag = true;
        } else if (c === 93) {
            this.arrFlag = false;
        }
        this.buffer += cStr;
    }
    return true;
};
URLStateMachine.prototype["parse port"] = function parsePort(c, cStr) {
    if (isASCIIDigit(c)) {
        this.buffer += cStr;
    } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92 || this.stateOverride) {
        if (this.buffer !== "") {
            const port = parseInt(this.buffer);
            if (port > Math.pow(2, 16) - 1) {
                this.parseError = true;
                return failure;
            }
            this.url.port = port === defaultPort(this.url.scheme) ? null : port;
            this.buffer = "";
        }
        if (this.stateOverride) {
            return false;
        }
        this.state = "path start";
        --this.pointer;
    } else {
        this.parseError = true;
        return failure;
    }
    return true;
};
const fileOtherwiseCodePoints = new Set([
    47,
    92,
    63,
    35
]);
URLStateMachine.prototype["parse file"] = function parseFile(c) {
    this.url.scheme = "file";
    if (c === 47 || c === 92) {
        if (c === 92) {
            this.parseError = true;
        }
        this.state = "file slash";
    } else if (this.base !== null && this.base.scheme === "file") {
        if (isNaN(c)) {
            this.url.host = this.base.host;
            this.url.path = this.base.path.slice();
            this.url.query = this.base.query;
        } else if (c === 63) {
            this.url.host = this.base.host;
            this.url.path = this.base.path.slice();
            this.url.query = "";
            this.state = "query";
        } else if (c === 35) {
            this.url.host = this.base.host;
            this.url.path = this.base.path.slice();
            this.url.query = this.base.query;
            this.url.fragment = "";
            this.state = "fragment";
        } else {
            if (this.input.length - this.pointer - 1 === 0 || // remaining consists of 0 code points
            !isWindowsDriveLetterCodePoints(c, this.input[this.pointer + 1]) || this.input.length - this.pointer - 1 >= 2 && // remaining has at least 2 code points
            !fileOtherwiseCodePoints.has(this.input[this.pointer + 2])) {
                this.url.host = this.base.host;
                this.url.path = this.base.path.slice();
                shortenPath(this.url);
            } else {
                this.parseError = true;
            }
            this.state = "path";
            --this.pointer;
        }
    } else {
        this.state = "path";
        --this.pointer;
    }
    return true;
};
URLStateMachine.prototype["parse file slash"] = function parseFileSlash(c) {
    if (c === 47 || c === 92) {
        if (c === 92) {
            this.parseError = true;
        }
        this.state = "file host";
    } else {
        if (this.base !== null && this.base.scheme === "file") {
            if (isNormalizedWindowsDriveLetterString(this.base.path[0])) {
                this.url.path.push(this.base.path[0]);
            } else {
                this.url.host = this.base.host;
            }
        }
        this.state = "path";
        --this.pointer;
    }
    return true;
};
URLStateMachine.prototype["parse file host"] = function parseFileHost(c, cStr) {
    if (isNaN(c) || c === 47 || c === 92 || c === 63 || c === 35) {
        --this.pointer;
        if (!this.stateOverride && isWindowsDriveLetterString(this.buffer)) {
            this.parseError = true;
            this.state = "path";
        } else if (this.buffer === "") {
            this.url.host = "";
            if (this.stateOverride) {
                return false;
            }
            this.state = "path start";
        } else {
            let host = parseHost(this.buffer, isSpecial(this.url));
            if (host === failure) {
                return failure;
            }
            if (host === "localhost") {
                host = "";
            }
            this.url.host = host;
            if (this.stateOverride) {
                return false;
            }
            this.buffer = "";
            this.state = "path start";
        }
    } else {
        this.buffer += cStr;
    }
    return true;
};
URLStateMachine.prototype["parse path start"] = function parsePathStart(c) {
    if (isSpecial(this.url)) {
        if (c === 92) {
            this.parseError = true;
        }
        this.state = "path";
        if (c !== 47 && c !== 92) {
            --this.pointer;
        }
    } else if (!this.stateOverride && c === 63) {
        this.url.query = "";
        this.state = "query";
    } else if (!this.stateOverride && c === 35) {
        this.url.fragment = "";
        this.state = "fragment";
    } else if (c !== undefined) {
        this.state = "path";
        if (c !== 47) {
            --this.pointer;
        }
    }
    return true;
};
URLStateMachine.prototype["parse path"] = function parsePath(c) {
    if (isNaN(c) || c === 47 || isSpecial(this.url) && c === 92 || !this.stateOverride && (c === 63 || c === 35)) {
        if (isSpecial(this.url) && c === 92) {
            this.parseError = true;
        }
        if (isDoubleDot(this.buffer)) {
            shortenPath(this.url);
            if (c !== 47 && !(isSpecial(this.url) && c === 92)) {
                this.url.path.push("");
            }
        } else if (isSingleDot(this.buffer) && c !== 47 && !(isSpecial(this.url) && c === 92)) {
            this.url.path.push("");
        } else if (!isSingleDot(this.buffer)) {
            if (this.url.scheme === "file" && this.url.path.length === 0 && isWindowsDriveLetterString(this.buffer)) {
                if (this.url.host !== "" && this.url.host !== null) {
                    this.parseError = true;
                    this.url.host = "";
                }
                this.buffer = this.buffer[0] + ":";
            }
            this.url.path.push(this.buffer);
        }
        this.buffer = "";
        if (this.url.scheme === "file" && (c === undefined || c === 63 || c === 35)) {
            while(this.url.path.length > 1 && this.url.path[0] === ""){
                this.parseError = true;
                this.url.path.shift();
            }
        }
        if (c === 63) {
            this.url.query = "";
            this.state = "query";
        }
        if (c === 35) {
            this.url.fragment = "";
            this.state = "fragment";
        }
    } else {
        // TODO: If c is not a URL code point and not "%", parse error.
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
            this.parseError = true;
        }
        this.buffer += percentEncodeChar(c, isPathPercentEncode);
    }
    return true;
};
URLStateMachine.prototype["parse cannot-be-a-base-URL path"] = function parseCannotBeABaseURLPath(c) {
    if (c === 63) {
        this.url.query = "";
        this.state = "query";
    } else if (c === 35) {
        this.url.fragment = "";
        this.state = "fragment";
    } else {
        // TODO: Add: not a URL code point
        if (!isNaN(c) && c !== 37) {
            this.parseError = true;
        }
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
            this.parseError = true;
        }
        if (!isNaN(c)) {
            this.url.path[0] = this.url.path[0] + percentEncodeChar(c, isC0ControlPercentEncode);
        }
    }
    return true;
};
URLStateMachine.prototype["parse query"] = function parseQuery(c, cStr) {
    if (isNaN(c) || !this.stateOverride && c === 35) {
        if (!isSpecial(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") {
            this.encodingOverride = "utf-8";
        }
        const buffer = new Buffer(this.buffer); // TODO: Use encoding override instead
        for(let i = 0; i < buffer.length; ++i){
            if (buffer[i] < 0x21 || buffer[i] > 0x7E || buffer[i] === 0x22 || buffer[i] === 0x23 || buffer[i] === 0x3C || buffer[i] === 0x3E) {
                this.url.query += percentEncode(buffer[i]);
            } else {
                this.url.query += String.fromCodePoint(buffer[i]);
            }
        }
        this.buffer = "";
        if (c === 35) {
            this.url.fragment = "";
            this.state = "fragment";
        }
    } else {
        // TODO: If c is not a URL code point and not "%", parse error.
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
            this.parseError = true;
        }
        this.buffer += cStr;
    }
    return true;
};
URLStateMachine.prototype["parse fragment"] = function parseFragment(c) {
    if (isNaN(c)) {} else if (c === 0x0) {
        this.parseError = true;
    } else {
        // TODO: If c is not a URL code point and not "%", parse error.
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
            this.parseError = true;
        }
        this.url.fragment += percentEncodeChar(c, isC0ControlPercentEncode);
    }
    return true;
};
function serializeURL(url, excludeFragment) {
    let output = url.scheme + ":";
    if (url.host !== null) {
        output += "//";
        if (url.username !== "" || url.password !== "") {
            output += url.username;
            if (url.password !== "") {
                output += ":" + url.password;
            }
            output += "@";
        }
        output += serializeHost(url.host);
        if (url.port !== null) {
            output += ":" + url.port;
        }
    } else if (url.host === null && url.scheme === "file") {
        output += "//";
    }
    if (url.cannotBeABaseURL) {
        output += url.path[0];
    } else {
        for (const string of url.path){
            output += "/" + string;
        }
    }
    if (url.query !== null) {
        output += "?" + url.query;
    }
    if (!excludeFragment && url.fragment !== null) {
        output += "#" + url.fragment;
    }
    return output;
}
function serializeOrigin(tuple) {
    let result = tuple.scheme + "://";
    result += serializeHost(tuple.host);
    if (tuple.port !== null) {
        result += ":" + tuple.port;
    }
    return result;
}
module.exports.serializeURL = serializeURL;
module.exports.serializeURLOrigin = function(url) {
    // https://url.spec.whatwg.org/#concept-url-origin
    switch(url.scheme){
        case "blob":
            try {
                return module.exports.serializeURLOrigin(module.exports.parseURL(url.path[0]));
            } catch (e) {
                // serializing an opaque origin returns "null"
                return "null";
            }
        case "ftp":
        case "gopher":
        case "http":
        case "https":
        case "ws":
        case "wss":
            return serializeOrigin({
                scheme: url.scheme,
                host: url.host,
                port: url.port
            });
        case "file":
            // spec says "exercise to the reader", chrome says "file://"
            return "file://";
        default:
            // serializing an opaque origin returns "null"
            return "null";
    }
};
module.exports.basicURLParse = function(input, options) {
    if (options === undefined) {
        options = {};
    }
    const usm = new URLStateMachine(input, options.baseURL, options.encodingOverride, options.url, options.stateOverride);
    if (usm.failure) {
        return "failure";
    }
    return usm.url;
};
module.exports.setTheUsername = function(url, username) {
    url.username = "";
    const decoded = punycode.ucs2.decode(username);
    for(let i = 0; i < decoded.length; ++i){
        url.username += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
    }
};
module.exports.setThePassword = function(url, password) {
    url.password = "";
    const decoded = punycode.ucs2.decode(password);
    for(let i = 0; i < decoded.length; ++i){
        url.password += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
    }
};
module.exports.serializeHost = serializeHost;
module.exports.cannotHaveAUsernamePasswordPort = cannotHaveAUsernamePasswordPort;
module.exports.serializeInteger = function(integer) {
    return String(integer);
};
module.exports.parseURL = function(input, options) {
    if (options === undefined) {
        options = {};
    }
    // We don't handle blobs, so this just delegates:
    return module.exports.basicURLParse(input, {
        baseURL: options.baseURL,
        encodingOverride: options.encodingOverride
    });
};


/***/ }),

/***/ 19545:
/***/ ((module) => {


module.exports.mixin = function mixin(target, source) {
    const keys = Object.getOwnPropertyNames(source);
    for(let i = 0; i < keys.length; ++i){
        Object.defineProperty(target, keys[i], Object.getOwnPropertyDescriptor(source, keys[i]));
    }
};
module.exports.wrapperSymbol = Symbol("wrapper");
module.exports.implSymbol = Symbol("impl");
module.exports.wrapperForImpl = function(impl) {
    return impl[module.exports.wrapperSymbol];
};
module.exports.implForWrapper = function(wrapper) {
    return wrapper[module.exports.implSymbol];
};


/***/ }),

/***/ 35175:
/***/ ((__unused_webpack_module, exports) => {


var has = Object.prototype.hasOwnProperty, undef;
/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */ function decode(input) {
    try {
        return decodeURIComponent(input.replace(/\+/g, " "));
    } catch (e) {
        return null;
    }
}
/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */ function encode(input) {
    try {
        return encodeURIComponent(input);
    } catch (e) {
        return null;
    }
}
/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */ function querystring(query) {
    var parser = /([^=?#&]+)=?([^&]*)/g, result = {}, part;
    while(part = parser.exec(query)){
        var key = decode(part[1]), value = decode(part[2]);
        //
        // Prevent overriding of existing properties. This ensures that build-in
        // methods like `toString` or __proto__ are not overriden by malicious
        // querystrings.
        //
        // In the case if failed decoding, we want to omit the key/value pairs
        // from the result.
        //
        if (key === null || value === null || key in result) continue;
        result[key] = value;
    }
    return result;
}
/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */ function querystringify(obj, prefix) {
    prefix = prefix || "";
    var pairs = [], value, key;
    //
    // Optionally prefix with a '?' if needed
    //
    if ("string" !== typeof prefix) prefix = "?";
    for(key in obj){
        if (has.call(obj, key)) {
            value = obj[key];
            //
            // Edge cases where we actually want to encode the value to an empty
            // string instead of the stringified value.
            //
            if (!value && (value === null || value === undef || isNaN(value))) {
                value = "";
            }
            key = encode(key);
            value = encode(value);
            //
            // If we failed to encode the strings, we should bail out as we don't
            // want to add invalid strings to the query.
            //
            if (key === null || value === null) continue;
            pairs.push(key + "=" + value);
        }
    }
    return pairs.length ? prefix + pairs.join("&") : "";
}
//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;


/***/ }),

/***/ 76885:
/***/ ((module) => {


/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */ module.exports = function required(port, protocol) {
    protocol = protocol.split(":")[0];
    port = +port;
    if (!port) return false;
    switch(protocol){
        case "http":
        case "ws":
            return port !== 80;
        case "https":
        case "wss":
            return port !== 443;
        case "ftp":
            return port !== 21;
        case "gopher":
            return port !== 70;
        case "file":
            return false;
    }
    return port !== 0;
};


/***/ }),

/***/ 21805:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var http = __webpack_require__(13685);
var https = __webpack_require__(95687);
var realFetch = __webpack_require__(77365);
const httpAgent = new http.Agent({
    keepAlive: true
});
const httpsAgent = new https.Agent({
    keepAlive: true
});
const agent = function(_parsedURL) {
    if (_parsedURL.protocol == "http:") {
        return httpAgent;
    } else {
        return httpsAgent;
    }
};
module.exports = function(url, options) {
    if (/^\/\//.test(url)) {
        url = "https:" + url;
    }
    return realFetch.call(this, url, {
        agent,
        ...options
    });
};
if (!global.fetch) {
    global.fetch = module.exports;
    global.Response = realFetch.Response;
    global.Headers = realFetch.Headers;
    global.Request = realFetch.Request;
}


/***/ }),

/***/ 24256:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var required = __webpack_require__(76885), qs = __webpack_require__(35175), controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/, CRHTLF = /[\n\r\t]/g, slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//, port = /:\d+$/, protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i, windowsDriveLetter = /^[a-zA-Z]:/;
/**
 * Remove control characters and whitespace from the beginning of a string.
 *
 * @param {Object|String} str String to trim.
 * @returns {String} A new string representing `str` stripped of control
 *     characters and whitespace from its beginning.
 * @public
 */ function trimLeft(str) {
    return (str ? str : "").toString().replace(controlOrWhitespace, "");
}
/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */ var rules = [
    [
        "#",
        "hash"
    ],
    [
        "?",
        "query"
    ],
    function sanitize(address, url) {
        return isSpecial(url.protocol) ? address.replace(/\\/g, "/") : address;
    },
    [
        "/",
        "pathname"
    ],
    [
        "@",
        "auth",
        1
    ],
    [
        NaN,
        "host",
        undefined,
        1,
        1
    ],
    [
        /:(\d*)$/,
        "port",
        undefined,
        1
    ],
    [
        NaN,
        "hostname",
        undefined,
        1,
        1
    ] // Set left over.
];
/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */ var ignore = {
    hash: 1,
    query: 1
};
/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */ function lolcation(loc) {
    var globalVar;
    if (false) {}
    else if (typeof global !== "undefined") globalVar = global;
    else if (typeof self !== "undefined") globalVar = self;
    else globalVar = {};
    var location = globalVar.location || {};
    loc = loc || location;
    var finaldestination = {}, type = typeof loc, key;
    if ("blob:" === loc.protocol) {
        finaldestination = new Url(unescape(loc.pathname), {});
    } else if ("string" === type) {
        finaldestination = new Url(loc, {});
        for(key in ignore)delete finaldestination[key];
    } else if ("object" === type) {
        for(key in loc){
            if (key in ignore) continue;
            finaldestination[key] = loc[key];
        }
        if (finaldestination.slashes === undefined) {
            finaldestination.slashes = slashes.test(loc.href);
        }
    }
    return finaldestination;
}
/**
 * Check whether a protocol scheme is special.
 *
 * @param {String} The protocol scheme of the URL
 * @return {Boolean} `true` if the protocol scheme is special, else `false`
 * @private
 */ function isSpecial(scheme) {
    return scheme === "file:" || scheme === "ftp:" || scheme === "http:" || scheme === "https:" || scheme === "ws:" || scheme === "wss:";
}
/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */ /**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @param {Object} location
 * @return {ProtocolExtract} Extracted information.
 * @private
 */ function extractProtocol(address, location) {
    address = trimLeft(address);
    address = address.replace(CRHTLF, "");
    location = location || {};
    var match = protocolre.exec(address);
    var protocol = match[1] ? match[1].toLowerCase() : "";
    var forwardSlashes = !!match[2];
    var otherSlashes = !!match[3];
    var slashesCount = 0;
    var rest;
    if (forwardSlashes) {
        if (otherSlashes) {
            rest = match[2] + match[3] + match[4];
            slashesCount = match[2].length + match[3].length;
        } else {
            rest = match[2] + match[4];
            slashesCount = match[2].length;
        }
    } else {
        if (otherSlashes) {
            rest = match[3] + match[4];
            slashesCount = match[3].length;
        } else {
            rest = match[4];
        }
    }
    if (protocol === "file:") {
        if (slashesCount >= 2) {
            rest = rest.slice(2);
        }
    } else if (isSpecial(protocol)) {
        rest = match[4];
    } else if (protocol) {
        if (forwardSlashes) {
            rest = rest.slice(2);
        }
    } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
        rest = match[4];
    }
    return {
        protocol: protocol,
        slashes: forwardSlashes || isSpecial(protocol),
        slashesCount: slashesCount,
        rest: rest
    };
}
/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */ function resolve(relative, base) {
    if (relative === "") return base;
    var path = (base || "/").split("/").slice(0, -1).concat(relative.split("/")), i = path.length, last = path[i - 1], unshift = false, up = 0;
    while(i--){
        if (path[i] === ".") {
            path.splice(i, 1);
        } else if (path[i] === "..") {
            path.splice(i, 1);
            up++;
        } else if (up) {
            if (i === 0) unshift = true;
            path.splice(i, 1);
            up--;
        }
    }
    if (unshift) path.unshift("");
    if (last === "." || last === "..") path.push("");
    return path.join("/");
}
/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */ function Url(address, location, parser) {
    address = trimLeft(address);
    address = address.replace(CRHTLF, "");
    if (!(this instanceof Url)) {
        return new Url(address, location, parser);
    }
    var relative, extracted, parse, instruction, index, key, instructions = rules.slice(), type = typeof location, url = this, i = 0;
    //
    // The following if statements allows this module two have compatibility with
    // 2 different API:
    //
    // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
    //    where the boolean indicates that the query string should also be parsed.
    //
    // 2. The `URL` interface of the browser which accepts a URL, object as
    //    arguments. The supplied object will be used as default values / fall-back
    //    for relative paths.
    //
    if ("object" !== type && "string" !== type) {
        parser = location;
        location = null;
    }
    if (parser && "function" !== typeof parser) parser = qs.parse;
    location = lolcation(location);
    //
    // Extract protocol information before running the instructions.
    //
    extracted = extractProtocol(address || "", location);
    relative = !extracted.protocol && !extracted.slashes;
    url.slashes = extracted.slashes || relative && location.slashes;
    url.protocol = extracted.protocol || location.protocol || "";
    address = extracted.rest;
    //
    // When the authority component is absent the URL starts with a path
    // component.
    //
    if (extracted.protocol === "file:" && (extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) || !extracted.slashes && (extracted.protocol || extracted.slashesCount < 2 || !isSpecial(url.protocol))) {
        instructions[3] = [
            /(.*)/,
            "pathname"
        ];
    }
    for(; i < instructions.length; i++){
        instruction = instructions[i];
        if (typeof instruction === "function") {
            address = instruction(address, url);
            continue;
        }
        parse = instruction[0];
        key = instruction[1];
        if (parse !== parse) {
            url[key] = address;
        } else if ("string" === typeof parse) {
            index = parse === "@" ? address.lastIndexOf(parse) : address.indexOf(parse);
            if (~index) {
                if ("number" === typeof instruction[2]) {
                    url[key] = address.slice(0, index);
                    address = address.slice(index + instruction[2]);
                } else {
                    url[key] = address.slice(index);
                    address = address.slice(0, index);
                }
            }
        } else if (index = parse.exec(address)) {
            url[key] = index[1];
            address = address.slice(0, index.index);
        }
        url[key] = url[key] || (relative && instruction[3] ? location[key] || "" : "");
        //
        // Hostname, host and protocol should be lowercased so they can be used to
        // create a proper `origin`.
        //
        if (instruction[4]) url[key] = url[key].toLowerCase();
    }
    //
    // Also parse the supplied query string in to an object. If we're supplied
    // with a custom parser as function use that instead of the default build-in
    // parser.
    //
    if (parser) url.query = parser(url.query);
    //
    // If the URL is relative, resolve the pathname against the base URL.
    //
    if (relative && location.slashes && url.pathname.charAt(0) !== "/" && (url.pathname !== "" || location.pathname !== "")) {
        url.pathname = resolve(url.pathname, location.pathname);
    }
    //
    // Default to a / for pathname if none exists. This normalizes the URL
    // to always have a /
    //
    if (url.pathname.charAt(0) !== "/" && isSpecial(url.protocol)) {
        url.pathname = "/" + url.pathname;
    }
    //
    // We should not add port numbers if they are already the default port number
    // for a given protocol. As the host also contains the port number we're going
    // override it with the hostname which contains no port number.
    //
    if (!required(url.port, url.protocol)) {
        url.host = url.hostname;
        url.port = "";
    }
    //
    // Parse down the `auth` for the username and password.
    //
    url.username = url.password = "";
    if (url.auth) {
        index = url.auth.indexOf(":");
        if (~index) {
            url.username = url.auth.slice(0, index);
            url.username = encodeURIComponent(decodeURIComponent(url.username));
            url.password = url.auth.slice(index + 1);
            url.password = encodeURIComponent(decodeURIComponent(url.password));
        } else {
            url.username = encodeURIComponent(decodeURIComponent(url.auth));
        }
        url.auth = url.password ? url.username + ":" + url.password : url.username;
    }
    url.origin = url.protocol !== "file:" && isSpecial(url.protocol) && url.host ? url.protocol + "//" + url.host : "null";
    //
    // The href is just the compiled result.
    //
    url.href = url.toString();
}
/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */ function set(part, value, fn) {
    var url = this;
    switch(part){
        case "query":
            if ("string" === typeof value && value.length) {
                value = (fn || qs.parse)(value);
            }
            url[part] = value;
            break;
        case "port":
            url[part] = value;
            if (!required(value, url.protocol)) {
                url.host = url.hostname;
                url[part] = "";
            } else if (value) {
                url.host = url.hostname + ":" + value;
            }
            break;
        case "hostname":
            url[part] = value;
            if (url.port) value += ":" + url.port;
            url.host = value;
            break;
        case "host":
            url[part] = value;
            if (port.test(value)) {
                value = value.split(":");
                url.port = value.pop();
                url.hostname = value.join(":");
            } else {
                url.hostname = value;
                url.port = "";
            }
            break;
        case "protocol":
            url.protocol = value.toLowerCase();
            url.slashes = !fn;
            break;
        case "pathname":
        case "hash":
            if (value) {
                var char = part === "pathname" ? "/" : "#";
                url[part] = value.charAt(0) !== char ? char + value : value;
            } else {
                url[part] = value;
            }
            break;
        case "username":
        case "password":
            url[part] = encodeURIComponent(value);
            break;
        case "auth":
            var index = value.indexOf(":");
            if (~index) {
                url.username = value.slice(0, index);
                url.username = encodeURIComponent(decodeURIComponent(url.username));
                url.password = value.slice(index + 1);
                url.password = encodeURIComponent(decodeURIComponent(url.password));
            } else {
                url.username = encodeURIComponent(decodeURIComponent(value));
            }
    }
    for(var i = 0; i < rules.length; i++){
        var ins = rules[i];
        if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
    }
    url.auth = url.password ? url.username + ":" + url.password : url.username;
    url.origin = url.protocol !== "file:" && isSpecial(url.protocol) && url.host ? url.protocol + "//" + url.host : "null";
    url.href = url.toString();
    return url;
}
/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */ function toString(stringify) {
    if (!stringify || "function" !== typeof stringify) stringify = qs.stringify;
    var query, url = this, host = url.host, protocol = url.protocol;
    if (protocol && protocol.charAt(protocol.length - 1) !== ":") protocol += ":";
    var result = protocol + (url.protocol && url.slashes || isSpecial(url.protocol) ? "//" : "");
    if (url.username) {
        result += url.username;
        if (url.password) result += ":" + url.password;
        result += "@";
    } else if (url.password) {
        result += ":" + url.password;
        result += "@";
    } else if (url.protocol !== "file:" && isSpecial(url.protocol) && !host && url.pathname !== "/") {
        //
        // Add back the empty userinfo, otherwise the original invalid URL
        // might be transformed into a valid one with `url.pathname` as host.
        //
        result += "@";
    }
    //
    // Trailing colon is removed from `url.host` when it is parsed. If it still
    // ends with a colon, then add back the trailing colon that was removed. This
    // prevents an invalid URL from being transformed into a valid one.
    //
    if (host[host.length - 1] === ":" || port.test(url.hostname) && !url.port) {
        host += ":";
    }
    result += host + url.pathname;
    query = "object" === typeof url.query ? stringify(url.query) : url.query;
    if (query) result += "?" !== query.charAt(0) ? "?" + query : query;
    if (url.hash) result += url.hash;
    return result;
}
Url.prototype = {
    set: set,
    toString: toString
};
//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = qs;
module.exports = Url;


/***/ }),

/***/ 58777:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __createBinding = (void 0) && (void 0).__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = (void 0) && (void 0).__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !exports1.hasOwnProperty(p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.Webhook = exports.WebhookVerificationError = exports.Svix = void 0;
const index_1 = __webpack_require__(18943);
__exportStar(__webpack_require__(11794), exports);
__exportStar(__webpack_require__(10432), exports);
const timing_safe_equal_1 = __webpack_require__(94972);
const base64 = __webpack_require__(60444);
const sha256 = __webpack_require__(32562);
const WEBHOOK_TOLERANCE_IN_SECONDS = 5 * 60;
const VERSION = "1.11.0";
class UserAgentMiddleware {
    pre(context) {
        context.setHeaderParam("User-Agent", `svix-libs/${VERSION}/javascript`);
        return Promise.resolve(context);
    }
    post(context) {
        return Promise.resolve(context);
    }
}
const REGIONS = [
    {
        region: "us",
        url: "https://api.us.svix.com"
    },
    {
        region: "eu",
        url: "https://api.eu.svix.com"
    },
    {
        region: "in",
        url: "https://api.in.svix.com"
    }
];
class Svix {
    constructor(token, options = {}){
        var _a, _b, _c;
        const regionalUrl = (_a = REGIONS.find((x)=>x.region === token.split(".")[1])) === null || _a === void 0 ? void 0 : _a.url;
        const baseUrl = (_c = (_b = options.serverUrl) !== null && _b !== void 0 ? _b : regionalUrl) !== null && _c !== void 0 ? _c : "https://api.svix.com";
        const baseServer = new index_1.ServerConfiguration(baseUrl, {});
        const bearerConfiguration = {
            tokenProvider: {
                getToken: ()=>token
            }
        };
        const config = index_1.createConfiguration({
            baseServer,
            promiseMiddleware: [
                new UserAgentMiddleware()
            ],
            authMethods: {
                HTTPBearer: bearerConfiguration
            }
        });
        this._configuration = config;
        this.authentication = new Authentication(config);
        this.application = new Application(config);
        this.endpoint = new Endpoint(config);
        this.eventType = new EventType(config);
        this.integration = new Integration(config);
        this.message = new Message(config);
        this.messageAttempt = new MessageAttempt(config);
        this.backgroundTask = new BackgroundTask(config);
    }
}
exports.Svix = Svix;
class Authentication {
    constructor(config){
        this.api = new index_1.AuthenticationApi(config);
    }
    appPortalAccess(appId, appPortalAccessIn, options) {
        return this.api.v1AuthenticationAppPortalAccess(Object.assign({
            appId,
            appPortalAccessIn
        }, options));
    }
    dashboardAccess(appId, options) {
        return this.api.v1AuthenticationDashboardAccess(Object.assign({
            appId
        }, options));
    }
    logout(options) {
        return this.api.v1AuthenticationLogout(Object.assign({}, options));
    }
}
class Application {
    constructor(config){
        this.api = new index_1.ApplicationApi(config);
    }
    list(options) {
        return this.api.v1ApplicationList(Object.assign({}, options));
    }
    create(applicationIn, options) {
        return this.api.v1ApplicationCreate(Object.assign({
            applicationIn
        }, options));
    }
    getOrCreate(applicationIn, options) {
        return this.api.v1ApplicationCreate(Object.assign(Object.assign({
            applicationIn
        }, options), {
            getIfExists: true
        }));
    }
    get(appId) {
        return this.api.v1ApplicationGet({
            appId
        });
    }
    update(appId, applicationIn) {
        return this.api.v1ApplicationUpdate({
            appId,
            applicationIn
        });
    }
    patch(appId, applicationPatch) {
        return this.api.v1ApplicationPatch({
            appId,
            applicationPatch
        });
    }
    delete(appId) {
        return this.api.v1ApplicationDelete({
            appId
        });
    }
}
class Endpoint {
    constructor(config){
        this.api = new index_1.EndpointApi(config);
    }
    list(appId, options) {
        return this.api.v1EndpointList(Object.assign({
            appId
        }, options));
    }
    create(appId, endpointIn, options) {
        return this.api.v1EndpointCreate(Object.assign({
            appId,
            endpointIn
        }, options));
    }
    get(appId, endpointId) {
        return this.api.v1EndpointGet({
            endpointId,
            appId
        });
    }
    update(appId, endpointId, endpointUpdate) {
        return this.api.v1EndpointUpdate({
            appId,
            endpointId,
            endpointUpdate
        });
    }
    patch(appId, endpointId, endpointPatch) {
        return this.api.v1EndpointPatch({
            appId,
            endpointId,
            endpointPatch
        });
    }
    delete(appId, endpointId) {
        return this.api.v1EndpointDelete({
            endpointId,
            appId
        });
    }
    getSecret(appId, endpointId) {
        return this.api.v1EndpointGetSecret({
            endpointId,
            appId
        });
    }
    rotateSecret(appId, endpointId, endpointSecretRotateIn, options) {
        return this.api.v1EndpointRotateSecret(Object.assign({
            endpointId,
            appId,
            endpointSecretRotateIn
        }, options));
    }
    recover(appId, endpointId, recoverIn, options) {
        return this.api.v1EndpointRecover(Object.assign({
            appId,
            endpointId,
            recoverIn
        }, options)).then(()=>Promise.resolve());
    }
    replayMissing(appId, endpointId, replayIn, options) {
        return this.api.v1EndpointReplay(Object.assign({
            appId,
            endpointId,
            replayIn
        }, options)).then(()=>Promise.resolve());
    }
    getHeaders(appId, endpointId) {
        return this.api.v1EndpointGetHeaders({
            appId,
            endpointId
        });
    }
    updateHeaders(appId, endpointId, endpointHeadersIn) {
        return this.api.v1EndpointUpdateHeaders({
            appId,
            endpointId,
            endpointHeadersIn
        });
    }
    patchHeaders(appId, endpointId, endpointHeadersPatchIn) {
        return this.api.v1EndpointPatchHeaders({
            appId,
            endpointId,
            endpointHeadersPatchIn
        });
    }
    getStats(appId, endpointId, options) {
        return this.api.v1EndpointGetStats(Object.assign({
            appId,
            endpointId
        }, options));
    }
    transformationGet(appId, endpointId) {
        return this.api.v1EndpointTransformationGet({
            endpointId,
            appId
        });
    }
    transformationPartialUpdate(appId, endpointId, endpointTransformationIn) {
        return this.api.v1EndpointTransformationPartialUpdate({
            appId,
            endpointId,
            endpointTransformationIn
        });
    }
    sendExample(appId, endpointId, eventExampleIn, options) {
        return this.api.v1EndpointSendExample(Object.assign({
            appId,
            endpointId,
            eventExampleIn
        }, options));
    }
}
class EventType {
    constructor(config){
        this.api = new index_1.EventTypeApi(config);
    }
    list(options) {
        return this.api.v1EventTypeList(Object.assign({}, options));
    }
    get(eventTypeName) {
        return this.api.v1EventTypeGet({
            eventTypeName
        });
    }
    create(eventTypeIn, options) {
        return this.api.v1EventTypeCreate(Object.assign({
            eventTypeIn
        }, options));
    }
    update(eventTypeName, eventTypeUpdate) {
        return this.api.v1EventTypeUpdate({
            eventTypeName,
            eventTypeUpdate
        });
    }
    patch(eventTypeName, eventTypePatch) {
        return this.api.v1EventTypePatch({
            eventTypeName,
            eventTypePatch
        });
    }
    delete(eventTypeName) {
        return this.api.v1EventTypeDelete({
            eventTypeName
        });
    }
    importOpenApi(eventTypeImportOpenApiIn, options) {
        return this.api.v1EventTypeImportOpenapi(Object.assign({
            eventTypeImportOpenApiIn
        }, options));
    }
}
class Integration {
    constructor(config){
        this.api = new index_1.IntegrationApi(config);
    }
    list(appId, options) {
        return this.api.v1IntegrationList(Object.assign({
            appId
        }, options));
    }
    create(appId, integrationIn, options) {
        return this.api.v1IntegrationCreate(Object.assign({
            appId,
            integrationIn
        }, options));
    }
    get(appId, integId) {
        return this.api.v1IntegrationGet({
            integId,
            appId
        });
    }
    update(appId, integId, integrationUpdate) {
        return this.api.v1IntegrationUpdate({
            appId,
            integId,
            integrationUpdate
        });
    }
    delete(appId, integId) {
        return this.api.v1IntegrationDelete({
            integId,
            appId
        });
    }
    getKey(appId, integId) {
        return this.api.v1IntegrationGetKey({
            integId,
            appId
        });
    }
    rotateKey(appId, integId, options) {
        return this.api.v1IntegrationRotateKey(Object.assign({
            integId,
            appId
        }, options));
    }
}
class Message {
    constructor(config){
        this.api = new index_1.MessageApi(config);
    }
    list(appId, options) {
        return this.api.v1MessageList(Object.assign({
            appId
        }, options));
    }
    create(appId, messageIn, options) {
        return this.api.v1MessageCreate(Object.assign({
            appId,
            messageIn
        }, options));
    }
    get(appId, msgId) {
        return this.api.v1MessageGet({
            msgId,
            appId
        });
    }
    expungeContent(appId, msgId) {
        return this.api.v1MessageExpungeContent({
            appId,
            msgId
        });
    }
}
class MessageAttempt {
    constructor(config){
        this.api = new index_1.MessageAttemptApi(config);
    }
    list(appId, msgId, options) {
        return this.listByMsg(appId, msgId, options);
    }
    listByMsg(appId, msgId, options) {
        return this.api.v1MessageAttemptListByMsg(Object.assign({
            appId,
            msgId
        }, options));
    }
    listByEndpoint(appId, endpointId, options) {
        return this.api.v1MessageAttemptListByEndpoint(Object.assign({
            appId,
            endpointId
        }, options));
    }
    get(appId, msgId, attemptId) {
        return this.api.v1MessageAttemptGet({
            attemptId,
            msgId,
            appId
        });
    }
    resend(appId, msgId, endpointId, options) {
        return this.api.v1MessageAttemptResend(Object.assign({
            endpointId,
            msgId,
            appId
        }, options));
    }
    listAttemptedMessages(appId, endpointId, options) {
        return this.api.v1MessageAttemptListAttemptedMessages(Object.assign({
            appId,
            endpointId
        }, options));
    }
    listAttemptedDestinations(appId, msgId, options) {
        return this.api.v1MessageAttemptListAttemptedDestinations(Object.assign({
            appId,
            msgId
        }, options));
    }
    listAttemptsForEndpoint(appId, msgId, endpointId, options) {
        return this.api.v1MessageAttemptListByEndpointDeprecated(Object.assign({
            appId,
            msgId,
            endpointId
        }, options));
    }
    expungeContent(appId, msgId, attemptId) {
        return this.api.v1MessageAttemptExpungeContent({
            appId,
            msgId,
            attemptId
        });
    }
}
class BackgroundTask {
    constructor(config){
        this.api = new index_1.BackgroundTasksApi(config);
    }
    listByEndpoint(options) {
        return this.api.listBackgroundTasks(Object.assign({}, options));
    }
    get(taskId) {
        return this.api.getBackgroundTask({
            taskId
        });
    }
}
class ExtendableError extends Error {
    constructor(message){
        super(message);
        Object.setPrototypeOf(this, ExtendableError.prototype);
        this.name = "ExtendableError";
        this.stack = new Error(message).stack;
    }
}
class WebhookVerificationError extends ExtendableError {
    constructor(message){
        super(message);
        Object.setPrototypeOf(this, WebhookVerificationError.prototype);
        this.name = "WebhookVerificationError";
    }
}
exports.WebhookVerificationError = WebhookVerificationError;
class Webhook {
    constructor(secret, options){
        if (!secret) {
            throw new Error("Secret can't be empty.");
        }
        if ((options === null || options === void 0 ? void 0 : options.format) === "raw") {
            if (secret instanceof Uint8Array) {
                this.key = secret;
            } else {
                this.key = Uint8Array.from(secret, (c)=>c.charCodeAt(0));
            }
        } else {
            if (typeof secret !== "string") {
                throw new Error("Expected secret to be of type string");
            }
            if (secret.startsWith(Webhook.prefix)) {
                secret = secret.substring(Webhook.prefix.length);
            }
            this.key = base64.decode(secret);
        }
    }
    verify(payload, headers_) {
        const headers = {};
        for (const key of Object.keys(headers_)){
            headers[key.toLowerCase()] = headers_[key];
        }
        let msgId = headers["svix-id"];
        let msgSignature = headers["svix-signature"];
        let msgTimestamp = headers["svix-timestamp"];
        if (!msgSignature || !msgId || !msgTimestamp) {
            msgId = headers["webhook-id"];
            msgSignature = headers["webhook-signature"];
            msgTimestamp = headers["webhook-timestamp"];
            if (!msgSignature || !msgId || !msgTimestamp) {
                throw new WebhookVerificationError("Missing required headers");
            }
        }
        const timestamp = this.verifyTimestamp(msgTimestamp);
        const computedSignature = this.sign(msgId, timestamp, payload);
        const expectedSignature = computedSignature.split(",")[1];
        const passedSignatures = msgSignature.split(" ");
        const encoder = new globalThis.TextEncoder();
        for (const versionedSignature of passedSignatures){
            const [version, signature] = versionedSignature.split(",");
            if (version !== "v1") {
                continue;
            }
            if (timing_safe_equal_1.timingSafeEqual(encoder.encode(signature), encoder.encode(expectedSignature))) {
                return JSON.parse(payload.toString());
            }
        }
        throw new WebhookVerificationError("No matching signature found");
    }
    sign(msgId, timestamp, payload) {
        if (typeof payload === "string") {} else if (payload.constructor.name === "Buffer") {
            payload = payload.toString();
        } else {
            throw new Error("Expected payload to be of type string or Buffer. Please refer to https://docs.svix.com/receiving/verifying-payloads/how for more information.");
        }
        const encoder = new TextEncoder();
        const timestampNumber = Math.floor(timestamp.getTime() / 1000);
        const toSign = encoder.encode(`${msgId}.${timestampNumber}.${payload}`);
        const expectedSignature = base64.encode(sha256.hmac(this.key, toSign));
        return `v1,${expectedSignature}`;
    }
    verifyTimestamp(timestampHeader) {
        const now = Math.floor(Date.now() / 1000);
        const timestamp = parseInt(timestampHeader, 10);
        if (isNaN(timestamp)) {
            throw new WebhookVerificationError("Invalid Signature Headers");
        }
        if (now - timestamp > WEBHOOK_TOLERANCE_IN_SECONDS) {
            throw new WebhookVerificationError("Message timestamp too old");
        }
        if (timestamp > now + WEBHOOK_TOLERANCE_IN_SECONDS) {
            throw new WebhookVerificationError("Message timestamp too new");
        }
        return new Date(timestamp * 1000);
    }
}
exports.Webhook = Webhook;
Webhook.prefix = "whsec_"; //# sourceMappingURL=index.js.map


/***/ }),

/***/ 83117:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ApplicationApiResponseProcessor = exports.ApplicationApiRequestFactory = void 0;
const baseapi_1 = __webpack_require__(47105);
const http_1 = __webpack_require__(35665);
const ObjectSerializer_1 = __webpack_require__(70309);
const exception_1 = __webpack_require__(10432);
const util_1 = __webpack_require__(53617);
class ApplicationApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    getAppUsageStatsApiV1AppStatsUsageGet(since, until, limit, iterator, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (since === null || since === undefined) {
                throw new baseapi_1.RequiredError("Required parameter since was null or undefined when calling getAppUsageStatsApiV1AppStatsUsageGet.");
            }
            if (until === null || until === undefined) {
                throw new baseapi_1.RequiredError("Required parameter until was null or undefined when calling getAppUsageStatsApiV1AppStatsUsageGet.");
            }
            const localVarPath = "/api/v1/app/stats/usage/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (since !== undefined) {
                requestContext.setQueryParam("since", ObjectSerializer_1.ObjectSerializer.serialize(since, "Date", "date-time"));
            }
            if (until !== undefined) {
                requestContext.setQueryParam("until", ObjectSerializer_1.ObjectSerializer.serialize(until, "Date", "date-time"));
            }
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "int"));
            }
            if (iterator !== undefined) {
                requestContext.setQueryParam("iterator", ObjectSerializer_1.ObjectSerializer.serialize(iterator, "string", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1ApplicationCreate(applicationIn, getIfExists, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (applicationIn === null || applicationIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter applicationIn was null or undefined when calling v1ApplicationCreate.");
            }
            const localVarPath = "/api/v1/app/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (getIfExists !== undefined) {
                requestContext.setQueryParam("get_if_exists", ObjectSerializer_1.ObjectSerializer.serialize(getIfExists, "boolean", ""));
            }
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(applicationIn, "ApplicationIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1ApplicationDelete(appId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1ApplicationDelete.");
            }
            const localVarPath = "/api/v1/app/{app_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.DELETE);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1ApplicationGet(appId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1ApplicationGet.");
            }
            const localVarPath = "/api/v1/app/{app_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1ApplicationGetStats(since, until, appId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (since === null || since === undefined) {
                throw new baseapi_1.RequiredError("Required parameter since was null or undefined when calling v1ApplicationGetStats.");
            }
            if (until === null || until === undefined) {
                throw new baseapi_1.RequiredError("Required parameter until was null or undefined when calling v1ApplicationGetStats.");
            }
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1ApplicationGetStats.");
            }
            const localVarPath = "/api/v1/app/{app_id}/stats/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (since !== undefined) {
                requestContext.setQueryParam("since", ObjectSerializer_1.ObjectSerializer.serialize(since, "Date", "date-time"));
            }
            if (until !== undefined) {
                requestContext.setQueryParam("until", ObjectSerializer_1.ObjectSerializer.serialize(until, "Date", "date-time"));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1ApplicationList(limit, iterator, order, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            const localVarPath = "/api/v1/app/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "uint64"));
            }
            if (iterator !== undefined) {
                requestContext.setQueryParam("iterator", ObjectSerializer_1.ObjectSerializer.serialize(iterator, "string", ""));
            }
            if (order !== undefined) {
                requestContext.setQueryParam("order", ObjectSerializer_1.ObjectSerializer.serialize(order, "Ordering", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1ApplicationPatch(appId, applicationPatch, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1ApplicationPatch.");
            }
            if (applicationPatch === null || applicationPatch === undefined) {
                throw new baseapi_1.RequiredError("Required parameter applicationPatch was null or undefined when calling v1ApplicationPatch.");
            }
            const localVarPath = "/api/v1/app/{app_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.PATCH);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(applicationPatch, "ApplicationPatch", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1ApplicationUpdate(appId, applicationIn, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1ApplicationUpdate.");
            }
            if (applicationIn === null || applicationIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter applicationIn was null or undefined when calling v1ApplicationUpdate.");
            }
            const localVarPath = "/api/v1/app/{app_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.PUT);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(applicationIn, "ApplicationIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
}
exports.ApplicationApiRequestFactory = ApplicationApiRequestFactory;
class ApplicationApiResponseProcessor {
    getAppUsageStatsApiV1AppStatsUsageGet(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseApplicationStats", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseApplicationStats", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1ApplicationCreate(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ApplicationOut", "");
                return body;
            }
            if (util_1.isCodeInRange("201", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ApplicationOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ApplicationOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1ApplicationDelete(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("204", response.httpStatusCode)) {
                return;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "void", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1ApplicationGet(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ApplicationOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ApplicationOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1ApplicationGetStats(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ApplicationStats", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ApplicationStats", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1ApplicationList(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseApplicationOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseApplicationOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1ApplicationPatch(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ApplicationOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ApplicationOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1ApplicationUpdate(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ApplicationOut", "");
                return body;
            }
            if (util_1.isCodeInRange("201", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ApplicationOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ApplicationOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
}
exports.ApplicationApiResponseProcessor = ApplicationApiResponseProcessor; //# sourceMappingURL=ApplicationApi.js.map


/***/ }),

/***/ 97987:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.AuthenticationApiResponseProcessor = exports.AuthenticationApiRequestFactory = void 0;
const baseapi_1 = __webpack_require__(47105);
const http_1 = __webpack_require__(35665);
const ObjectSerializer_1 = __webpack_require__(70309);
const exception_1 = __webpack_require__(10432);
const util_1 = __webpack_require__(53617);
class AuthenticationApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    v1AuthenticationAppPortalAccess(appId, appPortalAccessIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1AuthenticationAppPortalAccess.");
            }
            if (appPortalAccessIn === null || appPortalAccessIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appPortalAccessIn was null or undefined when calling v1AuthenticationAppPortalAccess.");
            }
            const localVarPath = "/api/v1/auth/app-portal-access/{app_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(appPortalAccessIn, "AppPortalAccessIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1AuthenticationDashboardAccess(appId, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1AuthenticationDashboardAccess.");
            }
            const localVarPath = "/api/v1/auth/dashboard-access/{app_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1AuthenticationExchangeOneTimeToken(oneTimeTokenIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (oneTimeTokenIn === null || oneTimeTokenIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter oneTimeTokenIn was null or undefined when calling v1AuthenticationExchangeOneTimeToken.");
            }
            const localVarPath = "/api/v1/auth/one-time-token/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(oneTimeTokenIn, "OneTimeTokenIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1AuthenticationExpireAll(appId, applicationTokenExpireIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1AuthenticationExpireAll.");
            }
            if (applicationTokenExpireIn === null || applicationTokenExpireIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter applicationTokenExpireIn was null or undefined when calling v1AuthenticationExpireAll.");
            }
            const localVarPath = "/api/v1/auth/app/{app_id}/expire-all/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(applicationTokenExpireIn, "ApplicationTokenExpireIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1AuthenticationLogout(idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            const localVarPath = "/api/v1/auth/logout/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
}
exports.AuthenticationApiRequestFactory = AuthenticationApiRequestFactory;
class AuthenticationApiResponseProcessor {
    v1AuthenticationAppPortalAccess(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "AppPortalAccessOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "AppPortalAccessOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1AuthenticationDashboardAccess(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "DashboardAccessOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "DashboardAccessOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1AuthenticationExchangeOneTimeToken(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "OneTimeTokenOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "OneTimeTokenOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1AuthenticationExpireAll(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("204", response.httpStatusCode)) {
                return;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "void", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1AuthenticationLogout(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("204", response.httpStatusCode)) {
                return;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "void", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
}
exports.AuthenticationApiResponseProcessor = AuthenticationApiResponseProcessor; //# sourceMappingURL=AuthenticationApi.js.map


/***/ }),

/***/ 54025:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.BackgroundTasksApiResponseProcessor = exports.BackgroundTasksApiRequestFactory = void 0;
const baseapi_1 = __webpack_require__(47105);
const http_1 = __webpack_require__(35665);
const ObjectSerializer_1 = __webpack_require__(70309);
const exception_1 = __webpack_require__(10432);
const util_1 = __webpack_require__(53617);
class BackgroundTasksApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    getBackgroundTask(taskId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (taskId === null || taskId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter taskId was null or undefined when calling getBackgroundTask.");
            }
            const localVarPath = "/api/v1/background-task/{task_id}/".replace("{" + "task_id" + "}", encodeURIComponent(String(taskId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    listBackgroundTasks(status, task, limit, iterator, order, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            const localVarPath = "/api/v1/background-task/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (status !== undefined) {
                requestContext.setQueryParam("status", ObjectSerializer_1.ObjectSerializer.serialize(status, "BackgroundTaskStatus", ""));
            }
            if (task !== undefined) {
                requestContext.setQueryParam("task", ObjectSerializer_1.ObjectSerializer.serialize(task, "BackgroundTaskType", ""));
            }
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "uint64"));
            }
            if (iterator !== undefined) {
                requestContext.setQueryParam("iterator", ObjectSerializer_1.ObjectSerializer.serialize(iterator, "string", ""));
            }
            if (order !== undefined) {
                requestContext.setQueryParam("order", ObjectSerializer_1.ObjectSerializer.serialize(order, "Ordering", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
}
exports.BackgroundTasksApiRequestFactory = BackgroundTasksApiRequestFactory;
class BackgroundTasksApiResponseProcessor {
    getBackgroundTask(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "BackgroundTaskOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "BackgroundTaskOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    listBackgroundTasks(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseBackgroundTaskOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseBackgroundTaskOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
}
exports.BackgroundTasksApiResponseProcessor = BackgroundTasksApiResponseProcessor; //# sourceMappingURL=BackgroundTasksApi.js.map


/***/ }),

/***/ 25199:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.BroadcastApiResponseProcessor = exports.BroadcastApiRequestFactory = void 0;
const baseapi_1 = __webpack_require__(47105);
const http_1 = __webpack_require__(35665);
const ObjectSerializer_1 = __webpack_require__(70309);
const exception_1 = __webpack_require__(10432);
const util_1 = __webpack_require__(53617);
class BroadcastApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    createBroadcastMessage(messageBroadcastIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (messageBroadcastIn === null || messageBroadcastIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter messageBroadcastIn was null or undefined when calling createBroadcastMessage.");
            }
            const localVarPath = "/api/v1/msg/broadcast/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(messageBroadcastIn, "MessageBroadcastIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
}
exports.BroadcastApiRequestFactory = BroadcastApiRequestFactory;
class BroadcastApiResponseProcessor {
    createBroadcastMessage(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("202", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "MessageBroadcastOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "MessageBroadcastOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
}
exports.BroadcastApiResponseProcessor = BroadcastApiResponseProcessor; //# sourceMappingURL=BroadcastApi.js.map


/***/ }),

/***/ 29170:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointApiResponseProcessor = exports.EndpointApiRequestFactory = void 0;
const baseapi_1 = __webpack_require__(47105);
const http_1 = __webpack_require__(35665);
const ObjectSerializer_1 = __webpack_require__(70309);
const exception_1 = __webpack_require__(10432);
const util_1 = __webpack_require__(53617);
class EndpointApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    v1EndpointCreate(appId, endpointIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointCreate.");
            }
            if (endpointIn === null || endpointIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointIn was null or undefined when calling v1EndpointCreate.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(endpointIn, "EndpointIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointDelete(appId, endpointId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointDelete.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1EndpointDelete.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.DELETE);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointGet(appId, endpointId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointGet.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1EndpointGet.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointGetHeaders(appId, endpointId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointGetHeaders.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1EndpointGetHeaders.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/headers/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointGetSecret(appId, endpointId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointGetSecret.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1EndpointGetSecret.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/secret/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointGetStats(appId, endpointId, since, until, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointGetStats.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1EndpointGetStats.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/stats/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (since !== undefined) {
                requestContext.setQueryParam("since", ObjectSerializer_1.ObjectSerializer.serialize(since, "Date", "date-time"));
            }
            if (until !== undefined) {
                requestContext.setQueryParam("until", ObjectSerializer_1.ObjectSerializer.serialize(until, "Date", "date-time"));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointList(appId, limit, iterator, order, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointList.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "uint64"));
            }
            if (iterator !== undefined) {
                requestContext.setQueryParam("iterator", ObjectSerializer_1.ObjectSerializer.serialize(iterator, "string", ""));
            }
            if (order !== undefined) {
                requestContext.setQueryParam("order", ObjectSerializer_1.ObjectSerializer.serialize(order, "Ordering", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointPatch(appId, endpointId, endpointPatch, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointPatch.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1EndpointPatch.");
            }
            if (endpointPatch === null || endpointPatch === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointPatch was null or undefined when calling v1EndpointPatch.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.PATCH);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(endpointPatch, "EndpointPatch", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointPatchHeaders(appId, endpointId, endpointHeadersPatchIn, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointPatchHeaders.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1EndpointPatchHeaders.");
            }
            if (endpointHeadersPatchIn === null || endpointHeadersPatchIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointHeadersPatchIn was null or undefined when calling v1EndpointPatchHeaders.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/headers/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.PATCH);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(endpointHeadersPatchIn, "EndpointHeadersPatchIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointRecover(appId, endpointId, recoverIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointRecover.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1EndpointRecover.");
            }
            if (recoverIn === null || recoverIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter recoverIn was null or undefined when calling v1EndpointRecover.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/recover/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(recoverIn, "RecoverIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointReplay(appId, endpointId, replayIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointReplay.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1EndpointReplay.");
            }
            if (replayIn === null || replayIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter replayIn was null or undefined when calling v1EndpointReplay.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/replay-missing/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(replayIn, "ReplayIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointRotateSecret(appId, endpointId, endpointSecretRotateIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointRotateSecret.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1EndpointRotateSecret.");
            }
            if (endpointSecretRotateIn === null || endpointSecretRotateIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointSecretRotateIn was null or undefined when calling v1EndpointRotateSecret.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/secret/rotate/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(endpointSecretRotateIn, "EndpointSecretRotateIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointSendExample(appId, endpointId, eventExampleIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointSendExample.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1EndpointSendExample.");
            }
            if (eventExampleIn === null || eventExampleIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter eventExampleIn was null or undefined when calling v1EndpointSendExample.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/send-example/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(eventExampleIn, "EventExampleIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointTransformationGet(appId, endpointId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointTransformationGet.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1EndpointTransformationGet.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/transformation/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointTransformationPartialUpdate(appId, endpointId, endpointTransformationIn, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointTransformationPartialUpdate.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1EndpointTransformationPartialUpdate.");
            }
            if (endpointTransformationIn === null || endpointTransformationIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointTransformationIn was null or undefined when calling v1EndpointTransformationPartialUpdate.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/transformation/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.PATCH);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(endpointTransformationIn, "EndpointTransformationIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointTransformationSimulate(appId, endpointId, endpointTransformationSimulateIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointTransformationSimulate.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1EndpointTransformationSimulate.");
            }
            if (endpointTransformationSimulateIn === null || endpointTransformationSimulateIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointTransformationSimulateIn was null or undefined when calling v1EndpointTransformationSimulate.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/transformation/simulate/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(endpointTransformationSimulateIn, "EndpointTransformationSimulateIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointUpdate(appId, endpointId, endpointUpdate, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointUpdate.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1EndpointUpdate.");
            }
            if (endpointUpdate === null || endpointUpdate === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointUpdate was null or undefined when calling v1EndpointUpdate.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.PUT);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(endpointUpdate, "EndpointUpdate", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EndpointUpdateHeaders(appId, endpointId, endpointHeadersIn, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1EndpointUpdateHeaders.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1EndpointUpdateHeaders.");
            }
            if (endpointHeadersIn === null || endpointHeadersIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointHeadersIn was null or undefined when calling v1EndpointUpdateHeaders.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/headers/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.PUT);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(endpointHeadersIn, "EndpointHeadersIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
}
exports.EndpointApiRequestFactory = EndpointApiRequestFactory;
class EndpointApiResponseProcessor {
    v1EndpointCreate(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("201", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointDelete(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("204", response.httpStatusCode)) {
                return;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "void", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointGet(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointGetHeaders(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointHeadersOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointHeadersOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointGetSecret(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointSecretOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointSecretOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointGetStats(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointStats", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointStats", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointList(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseEndpointOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseEndpointOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointPatch(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointPatchHeaders(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("204", response.httpStatusCode)) {
                return;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "void", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointRecover(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("202", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "RecoverOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "RecoverOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointReplay(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("202", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ReplayOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ReplayOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointRotateSecret(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("204", response.httpStatusCode)) {
                return;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "void", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointSendExample(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("202", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "MessageOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "MessageOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointTransformationGet(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointTransformationOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointTransformationOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointTransformationPartialUpdate(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("204", response.httpStatusCode)) {
                return;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "void", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointTransformationSimulate(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointTransformationSimulateOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointTransformationSimulateOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointUpdate(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointOut", "");
                return body;
            }
            if (util_1.isCodeInRange("201", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EndpointOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EndpointUpdateHeaders(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("204", response.httpStatusCode)) {
                return;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "void", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
}
exports.EndpointApiResponseProcessor = EndpointApiResponseProcessor; //# sourceMappingURL=EndpointApi.js.map


/***/ }),

/***/ 36398:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EnvironmentApiResponseProcessor = exports.EnvironmentApiRequestFactory = void 0;
const baseapi_1 = __webpack_require__(47105);
const http_1 = __webpack_require__(35665);
const ObjectSerializer_1 = __webpack_require__(70309);
const exception_1 = __webpack_require__(10432);
const util_1 = __webpack_require__(53617);
class EnvironmentApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    v1EnvironmentExport(body, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (body === null || body === undefined) {
                throw new baseapi_1.RequiredError("Required parameter body was null or undefined when calling v1EnvironmentExport.");
            }
            const localVarPath = "/api/v1/environment/export/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(body, "any", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EnvironmentImport(environmentIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (environmentIn === null || environmentIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter environmentIn was null or undefined when calling v1EnvironmentImport.");
            }
            const localVarPath = "/api/v1/environment/import/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(environmentIn, "EnvironmentIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
}
exports.EnvironmentApiRequestFactory = EnvironmentApiRequestFactory;
class EnvironmentApiResponseProcessor {
    v1EnvironmentExport(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EnvironmentOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EnvironmentOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EnvironmentImport(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("204", response.httpStatusCode)) {
                return;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "void", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
}
exports.EnvironmentApiResponseProcessor = EnvironmentApiResponseProcessor; //# sourceMappingURL=EnvironmentApi.js.map


/***/ }),

/***/ 81394:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EnvironmentSettingsApiResponseProcessor = exports.EnvironmentSettingsApiRequestFactory = void 0;
const baseapi_1 = __webpack_require__(47105);
const http_1 = __webpack_require__(35665);
const ObjectSerializer_1 = __webpack_require__(70309);
const exception_1 = __webpack_require__(10432);
const util_1 = __webpack_require__(53617);
class EnvironmentSettingsApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    v1EnvironmentGetSettings(_options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            const localVarPath = "/api/v1/environment/settings/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
}
exports.EnvironmentSettingsApiRequestFactory = EnvironmentSettingsApiRequestFactory;
class EnvironmentSettingsApiResponseProcessor {
    v1EnvironmentGetSettings(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EnvironmentSettingsOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EnvironmentSettingsOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
}
exports.EnvironmentSettingsApiResponseProcessor = EnvironmentSettingsApiResponseProcessor; //# sourceMappingURL=EnvironmentSettingsApi.js.map


/***/ }),

/***/ 86560:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EventTypeApiResponseProcessor = exports.EventTypeApiRequestFactory = void 0;
const baseapi_1 = __webpack_require__(47105);
const http_1 = __webpack_require__(35665);
const ObjectSerializer_1 = __webpack_require__(70309);
const exception_1 = __webpack_require__(10432);
const util_1 = __webpack_require__(53617);
class EventTypeApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    v1EventTypeCreate(eventTypeIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (eventTypeIn === null || eventTypeIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter eventTypeIn was null or undefined when calling v1EventTypeCreate.");
            }
            const localVarPath = "/api/v1/event-type/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(eventTypeIn, "EventTypeIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EventTypeDelete(eventTypeName, expunge, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (eventTypeName === null || eventTypeName === undefined) {
                throw new baseapi_1.RequiredError("Required parameter eventTypeName was null or undefined when calling v1EventTypeDelete.");
            }
            const localVarPath = "/api/v1/event-type/{event_type_name}/".replace("{" + "event_type_name" + "}", encodeURIComponent(String(eventTypeName)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.DELETE);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (expunge !== undefined) {
                requestContext.setQueryParam("expunge", ObjectSerializer_1.ObjectSerializer.serialize(expunge, "boolean", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EventTypeGenerateExample(eventTypeSchemaIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (eventTypeSchemaIn === null || eventTypeSchemaIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter eventTypeSchemaIn was null or undefined when calling v1EventTypeGenerateExample.");
            }
            const localVarPath = "/api/v1/event-type/schema/generate-example/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(eventTypeSchemaIn, "EventTypeSchemaIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EventTypeGet(eventTypeName, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (eventTypeName === null || eventTypeName === undefined) {
                throw new baseapi_1.RequiredError("Required parameter eventTypeName was null or undefined when calling v1EventTypeGet.");
            }
            const localVarPath = "/api/v1/event-type/{event_type_name}/".replace("{" + "event_type_name" + "}", encodeURIComponent(String(eventTypeName)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EventTypeImportOpenapi(eventTypeImportOpenApiIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (eventTypeImportOpenApiIn === null || eventTypeImportOpenApiIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter eventTypeImportOpenApiIn was null or undefined when calling v1EventTypeImportOpenapi.");
            }
            const localVarPath = "/api/v1/event-type/import/openapi/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(eventTypeImportOpenApiIn, "EventTypeImportOpenApiIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EventTypeList(limit, iterator, order, includeArchived, withContent, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            const localVarPath = "/api/v1/event-type/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "uint64"));
            }
            if (iterator !== undefined) {
                requestContext.setQueryParam("iterator", ObjectSerializer_1.ObjectSerializer.serialize(iterator, "string", ""));
            }
            if (order !== undefined) {
                requestContext.setQueryParam("order", ObjectSerializer_1.ObjectSerializer.serialize(order, "Ordering", ""));
            }
            if (includeArchived !== undefined) {
                requestContext.setQueryParam("include_archived", ObjectSerializer_1.ObjectSerializer.serialize(includeArchived, "boolean", ""));
            }
            if (withContent !== undefined) {
                requestContext.setQueryParam("with_content", ObjectSerializer_1.ObjectSerializer.serialize(withContent, "boolean", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EventTypePatch(eventTypeName, eventTypePatch, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (eventTypeName === null || eventTypeName === undefined) {
                throw new baseapi_1.RequiredError("Required parameter eventTypeName was null or undefined when calling v1EventTypePatch.");
            }
            if (eventTypePatch === null || eventTypePatch === undefined) {
                throw new baseapi_1.RequiredError("Required parameter eventTypePatch was null or undefined when calling v1EventTypePatch.");
            }
            const localVarPath = "/api/v1/event-type/{event_type_name}/".replace("{" + "event_type_name" + "}", encodeURIComponent(String(eventTypeName)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.PATCH);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(eventTypePatch, "EventTypePatch", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1EventTypeUpdate(eventTypeName, eventTypeUpdate, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (eventTypeName === null || eventTypeName === undefined) {
                throw new baseapi_1.RequiredError("Required parameter eventTypeName was null or undefined when calling v1EventTypeUpdate.");
            }
            if (eventTypeUpdate === null || eventTypeUpdate === undefined) {
                throw new baseapi_1.RequiredError("Required parameter eventTypeUpdate was null or undefined when calling v1EventTypeUpdate.");
            }
            const localVarPath = "/api/v1/event-type/{event_type_name}/".replace("{" + "event_type_name" + "}", encodeURIComponent(String(eventTypeName)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.PUT);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(eventTypeUpdate, "EventTypeUpdate", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
}
exports.EventTypeApiRequestFactory = EventTypeApiRequestFactory;
class EventTypeApiResponseProcessor {
    v1EventTypeCreate(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("201", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EventTypeOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EventTypeOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EventTypeDelete(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("204", response.httpStatusCode)) {
                return;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "void", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EventTypeGenerateExample(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EventTypeExampleOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EventTypeExampleOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EventTypeGet(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EventTypeOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EventTypeOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EventTypeImportOpenapi(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EventTypeImportOpenApiOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EventTypeImportOpenApiOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EventTypeList(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseEventTypeOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseEventTypeOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EventTypePatch(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EventTypeOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EventTypeOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1EventTypeUpdate(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EventTypeOut", "");
                return body;
            }
            if (util_1.isCodeInRange("201", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EventTypeOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "EventTypeOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
}
exports.EventTypeApiResponseProcessor = EventTypeApiResponseProcessor; //# sourceMappingURL=EventTypeApi.js.map


/***/ }),

/***/ 21031:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.HealthApiResponseProcessor = exports.HealthApiRequestFactory = void 0;
const baseapi_1 = __webpack_require__(47105);
const http_1 = __webpack_require__(35665);
const ObjectSerializer_1 = __webpack_require__(70309);
const exception_1 = __webpack_require__(10432);
const util_1 = __webpack_require__(53617);
class HealthApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    v1HealthGet(_options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            const localVarPath = "/api/v1/health/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            return requestContext;
        });
    }
}
exports.HealthApiRequestFactory = HealthApiRequestFactory;
class HealthApiResponseProcessor {
    v1HealthGet(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("204", response.httpStatusCode)) {
                return;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "void", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
}
exports.HealthApiResponseProcessor = HealthApiResponseProcessor; //# sourceMappingURL=HealthApi.js.map


/***/ }),

/***/ 54497:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.IntegrationApiResponseProcessor = exports.IntegrationApiRequestFactory = void 0;
const baseapi_1 = __webpack_require__(47105);
const http_1 = __webpack_require__(35665);
const ObjectSerializer_1 = __webpack_require__(70309);
const exception_1 = __webpack_require__(10432);
const util_1 = __webpack_require__(53617);
class IntegrationApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    v1IntegrationCreate(appId, integrationIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1IntegrationCreate.");
            }
            if (integrationIn === null || integrationIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter integrationIn was null or undefined when calling v1IntegrationCreate.");
            }
            const localVarPath = "/api/v1/app/{app_id}/integration/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(integrationIn, "IntegrationIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1IntegrationDelete(appId, integId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1IntegrationDelete.");
            }
            if (integId === null || integId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter integId was null or undefined when calling v1IntegrationDelete.");
            }
            const localVarPath = "/api/v1/app/{app_id}/integration/{integ_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "integ_id" + "}", encodeURIComponent(String(integId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.DELETE);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1IntegrationGet(appId, integId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1IntegrationGet.");
            }
            if (integId === null || integId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter integId was null or undefined when calling v1IntegrationGet.");
            }
            const localVarPath = "/api/v1/app/{app_id}/integration/{integ_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "integ_id" + "}", encodeURIComponent(String(integId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1IntegrationGetKey(appId, integId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1IntegrationGetKey.");
            }
            if (integId === null || integId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter integId was null or undefined when calling v1IntegrationGetKey.");
            }
            const localVarPath = "/api/v1/app/{app_id}/integration/{integ_id}/key/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "integ_id" + "}", encodeURIComponent(String(integId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1IntegrationList(appId, limit, iterator, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1IntegrationList.");
            }
            const localVarPath = "/api/v1/app/{app_id}/integration/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "uint64"));
            }
            if (iterator !== undefined) {
                requestContext.setQueryParam("iterator", ObjectSerializer_1.ObjectSerializer.serialize(iterator, "string", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1IntegrationRotateKey(appId, integId, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1IntegrationRotateKey.");
            }
            if (integId === null || integId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter integId was null or undefined when calling v1IntegrationRotateKey.");
            }
            const localVarPath = "/api/v1/app/{app_id}/integration/{integ_id}/key/rotate/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "integ_id" + "}", encodeURIComponent(String(integId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1IntegrationUpdate(appId, integId, integrationUpdate, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1IntegrationUpdate.");
            }
            if (integId === null || integId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter integId was null or undefined when calling v1IntegrationUpdate.");
            }
            if (integrationUpdate === null || integrationUpdate === undefined) {
                throw new baseapi_1.RequiredError("Required parameter integrationUpdate was null or undefined when calling v1IntegrationUpdate.");
            }
            const localVarPath = "/api/v1/app/{app_id}/integration/{integ_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "integ_id" + "}", encodeURIComponent(String(integId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.PUT);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(integrationUpdate, "IntegrationUpdate", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
}
exports.IntegrationApiRequestFactory = IntegrationApiRequestFactory;
class IntegrationApiResponseProcessor {
    v1IntegrationCreate(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("201", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "IntegrationOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "IntegrationOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1IntegrationDelete(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("204", response.httpStatusCode)) {
                return;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "void", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1IntegrationGet(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "IntegrationOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "IntegrationOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1IntegrationGetKey(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "IntegrationKeyOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "IntegrationKeyOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1IntegrationList(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseIntegrationOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseIntegrationOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1IntegrationRotateKey(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "IntegrationKeyOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "IntegrationKeyOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1IntegrationUpdate(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "IntegrationOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "IntegrationOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
}
exports.IntegrationApiResponseProcessor = IntegrationApiResponseProcessor; //# sourceMappingURL=IntegrationApi.js.map


/***/ }),

/***/ 69602:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageApiResponseProcessor = exports.MessageApiRequestFactory = void 0;
const baseapi_1 = __webpack_require__(47105);
const http_1 = __webpack_require__(35665);
const ObjectSerializer_1 = __webpack_require__(70309);
const exception_1 = __webpack_require__(10432);
const util_1 = __webpack_require__(53617);
class MessageApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    createMessageAttemptForEndpoint(appId, endpointId, messageIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling createMessageAttemptForEndpoint.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling createMessageAttemptForEndpoint.");
            }
            if (messageIn === null || messageIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter messageIn was null or undefined when calling createMessageAttemptForEndpoint.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/msg/test-attempt/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(messageIn, "MessageIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1MessageCreate(appId, messageIn, withContent, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1MessageCreate.");
            }
            if (messageIn === null || messageIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter messageIn was null or undefined when calling v1MessageCreate.");
            }
            const localVarPath = "/api/v1/app/{app_id}/msg/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (withContent !== undefined) {
                requestContext.setQueryParam("with_content", ObjectSerializer_1.ObjectSerializer.serialize(withContent, "boolean", ""));
            }
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(messageIn, "MessageIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1MessageExpungeContent(appId, msgId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1MessageExpungeContent.");
            }
            if (msgId === null || msgId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter msgId was null or undefined when calling v1MessageExpungeContent.");
            }
            const localVarPath = "/api/v1/app/{app_id}/msg/{msg_id}/content/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "msg_id" + "}", encodeURIComponent(String(msgId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.DELETE);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1MessageGet(appId, msgId, withContent, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1MessageGet.");
            }
            if (msgId === null || msgId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter msgId was null or undefined when calling v1MessageGet.");
            }
            const localVarPath = "/api/v1/app/{app_id}/msg/{msg_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "msg_id" + "}", encodeURIComponent(String(msgId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (withContent !== undefined) {
                requestContext.setQueryParam("with_content", ObjectSerializer_1.ObjectSerializer.serialize(withContent, "boolean", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1MessageGetRawPayload(appId, msgId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1MessageGetRawPayload.");
            }
            if (msgId === null || msgId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter msgId was null or undefined when calling v1MessageGetRawPayload.");
            }
            const localVarPath = "/api/v1/app/{app_id}/msg/{msg_id}/raw/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "msg_id" + "}", encodeURIComponent(String(msgId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1MessageList(appId, limit, iterator, channel, before, after, withContent, eventTypes, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1MessageList.");
            }
            const localVarPath = "/api/v1/app/{app_id}/msg/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "uint64"));
            }
            if (iterator !== undefined) {
                requestContext.setQueryParam("iterator", ObjectSerializer_1.ObjectSerializer.serialize(iterator, "string", ""));
            }
            if (channel !== undefined) {
                requestContext.setQueryParam("channel", ObjectSerializer_1.ObjectSerializer.serialize(channel, "string", ""));
            }
            if (before !== undefined) {
                requestContext.setQueryParam("before", ObjectSerializer_1.ObjectSerializer.serialize(before, "Date", "date-time"));
            }
            if (after !== undefined) {
                requestContext.setQueryParam("after", ObjectSerializer_1.ObjectSerializer.serialize(after, "Date", "date-time"));
            }
            if (withContent !== undefined) {
                requestContext.setQueryParam("with_content", ObjectSerializer_1.ObjectSerializer.serialize(withContent, "boolean", ""));
            }
            if (eventTypes !== undefined) {
                requestContext.setQueryParam("event_types", ObjectSerializer_1.ObjectSerializer.serialize(eventTypes, "Array<string>", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
}
exports.MessageApiRequestFactory = MessageApiRequestFactory;
class MessageApiResponseProcessor {
    createMessageAttemptForEndpoint(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("201", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "MessageAttemptOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "MessageAttemptOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1MessageCreate(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("202", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "MessageOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "MessageOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1MessageExpungeContent(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("204", response.httpStatusCode)) {
                return;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "void", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1MessageGet(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "MessageOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "MessageOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1MessageGetRawPayload(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "MessageRawPayloadOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "MessageRawPayloadOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1MessageList(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseMessageOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseMessageOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
}
exports.MessageApiResponseProcessor = MessageApiResponseProcessor; //# sourceMappingURL=MessageApi.js.map


/***/ }),

/***/ 35164:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageAttemptApiResponseProcessor = exports.MessageAttemptApiRequestFactory = void 0;
const baseapi_1 = __webpack_require__(47105);
const http_1 = __webpack_require__(35665);
const ObjectSerializer_1 = __webpack_require__(70309);
const exception_1 = __webpack_require__(10432);
const util_1 = __webpack_require__(53617);
class MessageAttemptApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    v1MessageAttemptExpungeContent(appId, msgId, attemptId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1MessageAttemptExpungeContent.");
            }
            if (msgId === null || msgId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter msgId was null or undefined when calling v1MessageAttemptExpungeContent.");
            }
            if (attemptId === null || attemptId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter attemptId was null or undefined when calling v1MessageAttemptExpungeContent.");
            }
            const localVarPath = "/api/v1/app/{app_id}/msg/{msg_id}/attempt/{attempt_id}/content/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "msg_id" + "}", encodeURIComponent(String(msgId))).replace("{" + "attempt_id" + "}", encodeURIComponent(String(attemptId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.DELETE);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1MessageAttemptGet(appId, msgId, attemptId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1MessageAttemptGet.");
            }
            if (msgId === null || msgId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter msgId was null or undefined when calling v1MessageAttemptGet.");
            }
            if (attemptId === null || attemptId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter attemptId was null or undefined when calling v1MessageAttemptGet.");
            }
            const localVarPath = "/api/v1/app/{app_id}/msg/{msg_id}/attempt/{attempt_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "msg_id" + "}", encodeURIComponent(String(msgId))).replace("{" + "attempt_id" + "}", encodeURIComponent(String(attemptId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1MessageAttemptGetHeaders(appId, msgId, attemptId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1MessageAttemptGetHeaders.");
            }
            if (msgId === null || msgId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter msgId was null or undefined when calling v1MessageAttemptGetHeaders.");
            }
            if (attemptId === null || attemptId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter attemptId was null or undefined when calling v1MessageAttemptGetHeaders.");
            }
            const localVarPath = "/api/v1/app/{app_id}/msg/{msg_id}/attempt/{attempt_id}/headers/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "msg_id" + "}", encodeURIComponent(String(msgId))).replace("{" + "attempt_id" + "}", encodeURIComponent(String(attemptId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1MessageAttemptListAttemptedDestinations(appId, msgId, limit, iterator, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1MessageAttemptListAttemptedDestinations.");
            }
            if (msgId === null || msgId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter msgId was null or undefined when calling v1MessageAttemptListAttemptedDestinations.");
            }
            const localVarPath = "/api/v1/app/{app_id}/msg/{msg_id}/endpoint/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "msg_id" + "}", encodeURIComponent(String(msgId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "uint64"));
            }
            if (iterator !== undefined) {
                requestContext.setQueryParam("iterator", ObjectSerializer_1.ObjectSerializer.serialize(iterator, "string", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1MessageAttemptListAttemptedMessages(appId, endpointId, limit, iterator, channel, status, before, after, withContent, eventTypes, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1MessageAttemptListAttemptedMessages.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1MessageAttemptListAttemptedMessages.");
            }
            const localVarPath = "/api/v1/app/{app_id}/endpoint/{endpoint_id}/msg/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "uint64"));
            }
            if (iterator !== undefined) {
                requestContext.setQueryParam("iterator", ObjectSerializer_1.ObjectSerializer.serialize(iterator, "string", ""));
            }
            if (channel !== undefined) {
                requestContext.setQueryParam("channel", ObjectSerializer_1.ObjectSerializer.serialize(channel, "string", ""));
            }
            if (status !== undefined) {
                requestContext.setQueryParam("status", ObjectSerializer_1.ObjectSerializer.serialize(status, "MessageStatus", ""));
            }
            if (before !== undefined) {
                requestContext.setQueryParam("before", ObjectSerializer_1.ObjectSerializer.serialize(before, "Date", "date-time"));
            }
            if (after !== undefined) {
                requestContext.setQueryParam("after", ObjectSerializer_1.ObjectSerializer.serialize(after, "Date", "date-time"));
            }
            if (withContent !== undefined) {
                requestContext.setQueryParam("with_content", ObjectSerializer_1.ObjectSerializer.serialize(withContent, "boolean", ""));
            }
            if (eventTypes !== undefined) {
                requestContext.setQueryParam("event_types", ObjectSerializer_1.ObjectSerializer.serialize(eventTypes, "Array<string>", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1MessageAttemptListByEndpoint(appId, endpointId, limit, iterator, status, statusCodeClass, channel, before, after, withContent, eventTypes, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1MessageAttemptListByEndpoint.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1MessageAttemptListByEndpoint.");
            }
            const localVarPath = "/api/v1/app/{app_id}/attempt/endpoint/{endpoint_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "uint64"));
            }
            if (iterator !== undefined) {
                requestContext.setQueryParam("iterator", ObjectSerializer_1.ObjectSerializer.serialize(iterator, "string", ""));
            }
            if (status !== undefined) {
                requestContext.setQueryParam("status", ObjectSerializer_1.ObjectSerializer.serialize(status, "MessageStatus", ""));
            }
            if (statusCodeClass !== undefined) {
                requestContext.setQueryParam("status_code_class", ObjectSerializer_1.ObjectSerializer.serialize(statusCodeClass, "StatusCodeClass", ""));
            }
            if (channel !== undefined) {
                requestContext.setQueryParam("channel", ObjectSerializer_1.ObjectSerializer.serialize(channel, "string", ""));
            }
            if (before !== undefined) {
                requestContext.setQueryParam("before", ObjectSerializer_1.ObjectSerializer.serialize(before, "Date", "date-time"));
            }
            if (after !== undefined) {
                requestContext.setQueryParam("after", ObjectSerializer_1.ObjectSerializer.serialize(after, "Date", "date-time"));
            }
            if (withContent !== undefined) {
                requestContext.setQueryParam("with_content", ObjectSerializer_1.ObjectSerializer.serialize(withContent, "boolean", ""));
            }
            if (eventTypes !== undefined) {
                requestContext.setQueryParam("event_types", ObjectSerializer_1.ObjectSerializer.serialize(eventTypes, "Array<string>", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1MessageAttemptListByEndpointDeprecated(appId, msgId, endpointId, limit, iterator, channel, status, before, after, eventTypes, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1MessageAttemptListByEndpointDeprecated.");
            }
            if (msgId === null || msgId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter msgId was null or undefined when calling v1MessageAttemptListByEndpointDeprecated.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1MessageAttemptListByEndpointDeprecated.");
            }
            const localVarPath = "/api/v1/app/{app_id}/msg/{msg_id}/endpoint/{endpoint_id}/attempt/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "msg_id" + "}", encodeURIComponent(String(msgId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "uint64"));
            }
            if (iterator !== undefined) {
                requestContext.setQueryParam("iterator", ObjectSerializer_1.ObjectSerializer.serialize(iterator, "string", ""));
            }
            if (channel !== undefined) {
                requestContext.setQueryParam("channel", ObjectSerializer_1.ObjectSerializer.serialize(channel, "string", ""));
            }
            if (status !== undefined) {
                requestContext.setQueryParam("status", ObjectSerializer_1.ObjectSerializer.serialize(status, "MessageStatus", ""));
            }
            if (before !== undefined) {
                requestContext.setQueryParam("before", ObjectSerializer_1.ObjectSerializer.serialize(before, "Date", "date-time"));
            }
            if (after !== undefined) {
                requestContext.setQueryParam("after", ObjectSerializer_1.ObjectSerializer.serialize(after, "Date", "date-time"));
            }
            if (eventTypes !== undefined) {
                requestContext.setQueryParam("event_types", ObjectSerializer_1.ObjectSerializer.serialize(eventTypes, "Array<string>", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1MessageAttemptListByMsg(appId, msgId, limit, iterator, status, statusCodeClass, channel, endpointId, before, after, withContent, eventTypes, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1MessageAttemptListByMsg.");
            }
            if (msgId === null || msgId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter msgId was null or undefined when calling v1MessageAttemptListByMsg.");
            }
            const localVarPath = "/api/v1/app/{app_id}/attempt/msg/{msg_id}/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "msg_id" + "}", encodeURIComponent(String(msgId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "uint64"));
            }
            if (iterator !== undefined) {
                requestContext.setQueryParam("iterator", ObjectSerializer_1.ObjectSerializer.serialize(iterator, "string", ""));
            }
            if (status !== undefined) {
                requestContext.setQueryParam("status", ObjectSerializer_1.ObjectSerializer.serialize(status, "MessageStatus", ""));
            }
            if (statusCodeClass !== undefined) {
                requestContext.setQueryParam("status_code_class", ObjectSerializer_1.ObjectSerializer.serialize(statusCodeClass, "StatusCodeClass", ""));
            }
            if (channel !== undefined) {
                requestContext.setQueryParam("channel", ObjectSerializer_1.ObjectSerializer.serialize(channel, "string", ""));
            }
            if (endpointId !== undefined) {
                requestContext.setQueryParam("endpoint_id", ObjectSerializer_1.ObjectSerializer.serialize(endpointId, "string", ""));
            }
            if (before !== undefined) {
                requestContext.setQueryParam("before", ObjectSerializer_1.ObjectSerializer.serialize(before, "Date", "date-time"));
            }
            if (after !== undefined) {
                requestContext.setQueryParam("after", ObjectSerializer_1.ObjectSerializer.serialize(after, "Date", "date-time"));
            }
            if (withContent !== undefined) {
                requestContext.setQueryParam("with_content", ObjectSerializer_1.ObjectSerializer.serialize(withContent, "boolean", ""));
            }
            if (eventTypes !== undefined) {
                requestContext.setQueryParam("event_types", ObjectSerializer_1.ObjectSerializer.serialize(eventTypes, "Array<string>", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1MessageAttemptListByMsgDeprecated(appId, msgId, limit, iterator, endpointId, channel, status, before, after, statusCodeClass, eventTypes, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1MessageAttemptListByMsgDeprecated.");
            }
            if (msgId === null || msgId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter msgId was null or undefined when calling v1MessageAttemptListByMsgDeprecated.");
            }
            const localVarPath = "/api/v1/app/{app_id}/msg/{msg_id}/attempt/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "msg_id" + "}", encodeURIComponent(String(msgId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "uint64"));
            }
            if (iterator !== undefined) {
                requestContext.setQueryParam("iterator", ObjectSerializer_1.ObjectSerializer.serialize(iterator, "string", ""));
            }
            if (endpointId !== undefined) {
                requestContext.setQueryParam("endpoint_id", ObjectSerializer_1.ObjectSerializer.serialize(endpointId, "string", ""));
            }
            if (channel !== undefined) {
                requestContext.setQueryParam("channel", ObjectSerializer_1.ObjectSerializer.serialize(channel, "string", ""));
            }
            if (status !== undefined) {
                requestContext.setQueryParam("status", ObjectSerializer_1.ObjectSerializer.serialize(status, "MessageStatus", ""));
            }
            if (before !== undefined) {
                requestContext.setQueryParam("before", ObjectSerializer_1.ObjectSerializer.serialize(before, "Date", "date-time"));
            }
            if (after !== undefined) {
                requestContext.setQueryParam("after", ObjectSerializer_1.ObjectSerializer.serialize(after, "Date", "date-time"));
            }
            if (statusCodeClass !== undefined) {
                requestContext.setQueryParam("status_code_class", ObjectSerializer_1.ObjectSerializer.serialize(statusCodeClass, "StatusCodeClass", ""));
            }
            if (eventTypes !== undefined) {
                requestContext.setQueryParam("event_types", ObjectSerializer_1.ObjectSerializer.serialize(eventTypes, "Array<string>", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1MessageAttemptResend(appId, msgId, endpointId, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1MessageAttemptResend.");
            }
            if (msgId === null || msgId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter msgId was null or undefined when calling v1MessageAttemptResend.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1MessageAttemptResend.");
            }
            const localVarPath = "/api/v1/app/{app_id}/msg/{msg_id}/endpoint/{endpoint_id}/resend/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "msg_id" + "}", encodeURIComponent(String(msgId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
}
exports.MessageAttemptApiRequestFactory = MessageAttemptApiRequestFactory;
class MessageAttemptApiResponseProcessor {
    v1MessageAttemptExpungeContent(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("204", response.httpStatusCode)) {
                return;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "void", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1MessageAttemptGet(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "MessageAttemptOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "MessageAttemptOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1MessageAttemptGetHeaders(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "MessageAttemptHeadersOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "MessageAttemptHeadersOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1MessageAttemptListAttemptedDestinations(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseMessageEndpointOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseMessageEndpointOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1MessageAttemptListAttemptedMessages(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseEndpointMessageOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseEndpointMessageOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1MessageAttemptListByEndpoint(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseMessageAttemptOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseMessageAttemptOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1MessageAttemptListByEndpointDeprecated(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseMessageAttemptEndpointOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseMessageAttemptEndpointOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1MessageAttemptListByMsg(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseMessageAttemptOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseMessageAttemptOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1MessageAttemptListByMsgDeprecated(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseMessageAttemptOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseMessageAttemptOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1MessageAttemptResend(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("202", response.httpStatusCode)) {
                return;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "void", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
}
exports.MessageAttemptApiResponseProcessor = MessageAttemptApiResponseProcessor; //# sourceMappingURL=MessageAttemptApi.js.map


/***/ }),

/***/ 13895:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.StatisticsApiResponseProcessor = exports.StatisticsApiRequestFactory = void 0;
const baseapi_1 = __webpack_require__(47105);
const http_1 = __webpack_require__(35665);
const ObjectSerializer_1 = __webpack_require__(70309);
const exception_1 = __webpack_require__(10432);
const util_1 = __webpack_require__(53617);
class StatisticsApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    calculateAggregateAppStats(appUsageStatsIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appUsageStatsIn === null || appUsageStatsIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appUsageStatsIn was null or undefined when calling calculateAggregateAppStats.");
            }
            const localVarPath = "/api/v1/stats/usage/app/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(appUsageStatsIn, "AppUsageStatsIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1StatsAppAttempts(appId, startDate, endDate, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1StatsAppAttempts.");
            }
            const localVarPath = "/api/v1/stats/app/{app_id}/attempt/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (startDate !== undefined) {
                requestContext.setQueryParam("startDate", ObjectSerializer_1.ObjectSerializer.serialize(startDate, "Date", "date-time"));
            }
            if (endDate !== undefined) {
                requestContext.setQueryParam("endDate", ObjectSerializer_1.ObjectSerializer.serialize(endDate, "Date", "date-time"));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1StatsEndpointAttempts(appId, endpointId, startDate, endDate, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter appId was null or undefined when calling v1StatsEndpointAttempts.");
            }
            if (endpointId === null || endpointId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter endpointId was null or undefined when calling v1StatsEndpointAttempts.");
            }
            const localVarPath = "/api/v1/stats/app/{app_id}/ep/{endpoint_id}/attempt/".replace("{" + "app_id" + "}", encodeURIComponent(String(appId))).replace("{" + "endpoint_id" + "}", encodeURIComponent(String(endpointId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (startDate !== undefined) {
                requestContext.setQueryParam("startDate", ObjectSerializer_1.ObjectSerializer.serialize(startDate, "Date", "date-time"));
            }
            if (endDate !== undefined) {
                requestContext.setQueryParam("endDate", ObjectSerializer_1.ObjectSerializer.serialize(endDate, "Date", "date-time"));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
}
exports.StatisticsApiRequestFactory = StatisticsApiRequestFactory;
class StatisticsApiResponseProcessor {
    calculateAggregateAppStats(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("202", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "AppUsageStatsOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "AppUsageStatsOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1StatsAppAttempts(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "AttemptStatisticsResponse", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "AttemptStatisticsResponse", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1StatsEndpointAttempts(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "AttemptStatisticsResponse", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "AttemptStatisticsResponse", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
}
exports.StatisticsApiResponseProcessor = StatisticsApiResponseProcessor; //# sourceMappingURL=StatisticsApi.js.map


/***/ }),

/***/ 3478:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TransformationTemplateApiResponseProcessor = exports.TransformationTemplateApiRequestFactory = void 0;
const baseapi_1 = __webpack_require__(47105);
const http_1 = __webpack_require__(35665);
const ObjectSerializer_1 = __webpack_require__(70309);
const exception_1 = __webpack_require__(10432);
const util_1 = __webpack_require__(53617);
class TransformationTemplateApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    v1TransformationTemplateCreate(templateIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (templateIn === null || templateIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter templateIn was null or undefined when calling v1TransformationTemplateCreate.");
            }
            const localVarPath = "/api/v1/transformation-template/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(templateIn, "TemplateIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1TransformationTemplateDelete(transformationTemplateId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (transformationTemplateId === null || transformationTemplateId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter transformationTemplateId was null or undefined when calling v1TransformationTemplateDelete.");
            }
            const localVarPath = "/api/v1/transformation-template/{transformation_template_id}".replace("{" + "transformation_template_id" + "}", encodeURIComponent(String(transformationTemplateId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.DELETE);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1TransformationTemplateGet(transformationTemplateId, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (transformationTemplateId === null || transformationTemplateId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter transformationTemplateId was null or undefined when calling v1TransformationTemplateGet.");
            }
            const localVarPath = "/api/v1/transformation-template/{transformation_template_id}".replace("{" + "transformation_template_id" + "}", encodeURIComponent(String(transformationTemplateId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1TransformationTemplateList(limit, iterator, order, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            const localVarPath = "/api/v1/transformation-template/";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "uint64"));
            }
            if (iterator !== undefined) {
                requestContext.setQueryParam("iterator", ObjectSerializer_1.ObjectSerializer.serialize(iterator, "string", ""));
            }
            if (order !== undefined) {
                requestContext.setQueryParam("order", ObjectSerializer_1.ObjectSerializer.serialize(order, "Ordering", ""));
            }
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1TransformationTemplatePatch(transformationTemplateId, templatePatch, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (transformationTemplateId === null || transformationTemplateId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter transformationTemplateId was null or undefined when calling v1TransformationTemplatePatch.");
            }
            if (templatePatch === null || templatePatch === undefined) {
                throw new baseapi_1.RequiredError("Required parameter templatePatch was null or undefined when calling v1TransformationTemplatePatch.");
            }
            const localVarPath = "/api/v1/transformation-template/{transformation_template_id}".replace("{" + "transformation_template_id" + "}", encodeURIComponent(String(transformationTemplateId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.PATCH);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(templatePatch, "TemplatePatch", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1TransformationTemplateSimulate(transformationSimulateIn, idempotencyKey, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (transformationSimulateIn === null || transformationSimulateIn === undefined) {
                throw new baseapi_1.RequiredError("Required parameter transformationSimulateIn was null or undefined when calling v1TransformationTemplateSimulate.");
            }
            const localVarPath = "/api/v1/transformation-template/simulate";
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            if (idempotencyKey !== undefined) {
                requestContext.setHeaderParam("idempotency-key", ObjectSerializer_1.ObjectSerializer.serialize(idempotencyKey, "string", ""));
            }
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(transformationSimulateIn, "TransformationSimulateIn", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
    v1TransformationTemplateUpdate(transformationTemplateId, templateUpdate, _options) {
        return __awaiter(this, void 0, void 0, function*() {
            let _config = _options || this.configuration;
            if (transformationTemplateId === null || transformationTemplateId === undefined) {
                throw new baseapi_1.RequiredError("Required parameter transformationTemplateId was null or undefined when calling v1TransformationTemplateUpdate.");
            }
            if (templateUpdate === null || templateUpdate === undefined) {
                throw new baseapi_1.RequiredError("Required parameter templateUpdate was null or undefined when calling v1TransformationTemplateUpdate.");
            }
            const localVarPath = "/api/v1/transformation-template/{transformation_template_id}".replace("{" + "transformation_template_id" + "}", encodeURIComponent(String(transformationTemplateId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.PUT);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const randomId = Math.floor(Math.random() * Math.pow(2, 32));
            requestContext.setHeaderParam("svix-req-id", randomId.toString());
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(templateUpdate, "TemplateUpdate", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod = null;
            authMethod = _config.authMethods["HTTPBearer"];
            if (authMethod) {
                yield authMethod.applySecurityAuthentication(requestContext);
            }
            return requestContext;
        });
    }
}
exports.TransformationTemplateApiRequestFactory = TransformationTemplateApiRequestFactory;
class TransformationTemplateApiResponseProcessor {
    v1TransformationTemplateCreate(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("201", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "TemplateOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "TemplateOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1TransformationTemplateDelete(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("204", response.httpStatusCode)) {
                return;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "void", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1TransformationTemplateGet(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "TemplateOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "TemplateOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1TransformationTemplateList(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseTemplateOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "ListResponseTemplateOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1TransformationTemplatePatch(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "TemplateOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "TemplateOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1TransformationTemplateSimulate(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "TransformationSimulateOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "TransformationSimulateOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
    v1TransformationTemplateUpdate(response) {
        return __awaiter(this, void 0, void 0, function*() {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if (util_1.isCodeInRange("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "TemplateOut", "");
                return body;
            }
            if (util_1.isCodeInRange("201", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "TemplateOut", "");
                return body;
            }
            if (util_1.isCodeInRange("400", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(400, body);
            }
            if (util_1.isCodeInRange("401", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(401, body);
            }
            if (util_1.isCodeInRange("403", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(403, body);
            }
            if (util_1.isCodeInRange("404", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(404, body);
            }
            if (util_1.isCodeInRange("409", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(409, body);
            }
            if (util_1.isCodeInRange("422", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HTTPValidationError", "");
                throw new exception_1.ApiException(422, body);
            }
            if (util_1.isCodeInRange("429", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "HttpErrorOut", "");
                throw new exception_1.ApiException(429, body);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse((yield response.body.text()), contentType), "TemplateOut", "");
                return body;
            }
            let body = response.body || "";
            throw new exception_1.ApiException(response.httpStatusCode, 'Unknown API Status Code!\nBody: "' + body + '"');
        });
    }
}
exports.TransformationTemplateApiResponseProcessor = TransformationTemplateApiResponseProcessor; //# sourceMappingURL=TransformationTemplateApi.js.map


/***/ }),

/***/ 47105:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.RequiredError = exports.BaseAPIRequestFactory = exports.COLLECTION_FORMATS = void 0;
exports.COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "	",
    pipes: "|"
};
class BaseAPIRequestFactory {
    constructor(configuration){
        this.configuration = configuration;
    }
}
exports.BaseAPIRequestFactory = BaseAPIRequestFactory;
;
class RequiredError extends Error {
    constructor(field, msg){
        super(msg);
        this.field = field;
        this.name = "RequiredError";
    }
}
exports.RequiredError = RequiredError; //# sourceMappingURL=baseapi.js.map


/***/ }),

/***/ 10432:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ApiException = void 0;
class ApiException extends Error {
    constructor(code, body){
        super("HTTP-Code: " + code + "\nMessage: " + JSON.stringify(body));
        this.code = code;
        this.body = body;
    }
}
exports.ApiException = ApiException; //# sourceMappingURL=exception.js.map


/***/ }),

/***/ 38773:
/***/ ((__unused_webpack_module, exports) => {


var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.configureAuthMethods = exports.HTTPBearerAuthentication = void 0;
class HTTPBearerAuthentication {
    constructor(tokenProvider){
        this.tokenProvider = tokenProvider;
    }
    getName() {
        return "HTTPBearer";
    }
    applySecurityAuthentication(context) {
        return __awaiter(this, void 0, void 0, function*() {
            context.setHeaderParam("Authorization", "Bearer " + (yield this.tokenProvider.getToken()));
        });
    }
}
exports.HTTPBearerAuthentication = HTTPBearerAuthentication;
function configureAuthMethods(config) {
    let authMethods = {};
    if (!config) {
        return authMethods;
    }
    if (config["HTTPBearer"]) {
        authMethods["HTTPBearer"] = new HTTPBearerAuthentication(config["HTTPBearer"]["tokenProvider"]);
    }
    return authMethods;
}
exports.configureAuthMethods = configureAuthMethods; //# sourceMappingURL=auth.js.map


/***/ }),

/***/ 47995:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.createConfiguration = void 0;
const middleware_1 = __webpack_require__(849);
const isomorphic_fetch_1 = __webpack_require__(47305);
const servers_1 = __webpack_require__(27225);
const auth_1 = __webpack_require__(38773);
function createConfiguration(conf = {}) {
    const configuration = {
        baseServer: conf.baseServer !== undefined ? conf.baseServer : servers_1.server1,
        httpApi: conf.httpApi || new isomorphic_fetch_1.IsomorphicFetchHttpLibrary(),
        middleware: conf.middleware || [],
        authMethods: auth_1.configureAuthMethods(conf.authMethods)
    };
    if (conf.promiseMiddleware) {
        conf.promiseMiddleware.forEach((m)=>configuration.middleware.push(new middleware_1.PromiseMiddlewareWrapper(m)));
    }
    return configuration;
}
exports.createConfiguration = createConfiguration; //# sourceMappingURL=configuration.js.map


/***/ }),

/***/ 35665:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __createBinding = (void 0) && (void 0).__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = (void 0) && (void 0).__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !exports1.hasOwnProperty(p)) __createBinding(exports1, m, p);
};
var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.wrapHttpLibrary = exports.ResponseContext = exports.SelfDecodingBody = exports.RequestContext = exports.HttpException = exports.HttpMethod = void 0;
const URLParse = __webpack_require__(24256);
const rxjsStub_1 = __webpack_require__(46223);
__exportStar(__webpack_require__(47305), exports);
var HttpMethod;
(function(HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["HEAD"] = "HEAD";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["CONNECT"] = "CONNECT";
    HttpMethod["OPTIONS"] = "OPTIONS";
    HttpMethod["TRACE"] = "TRACE";
    HttpMethod["PATCH"] = "PATCH";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
function qsStringify(queryParams) {
    const res = [];
    for(let paramName in queryParams)if (queryParams.hasOwnProperty(paramName)) {
        const value = queryParams[paramName];
        if (Array.isArray(value)) {
            for(let i = 0; i < value.length; i++){
                res.push(`${encodeURIComponent(paramName)}=${encodeURIComponent(value[i])}`);
            }
        } else {
            res.push(`${encodeURIComponent(paramName)}=${encodeURIComponent(value)}`);
        }
    }
    return res.join("&");
}
class HttpException extends Error {
    constructor(msg){
        super(msg);
    }
}
exports.HttpException = HttpException;
class RequestContext {
    constructor(url, httpMethod){
        this.httpMethod = httpMethod;
        this.headers = {};
        this.body = undefined;
        this.url = new URLParse(url, true);
    }
    getUrl() {
        return this.url.toString(qsStringify);
    }
    setUrl(url) {
        this.url = new URLParse(url, true);
    }
    setBody(body) {
        this.body = body;
    }
    getHttpMethod() {
        return this.httpMethod;
    }
    getHeaders() {
        return this.headers;
    }
    getBody() {
        return this.body;
    }
    setQueryParam(name, value) {
        let queryObj = this.url.query;
        queryObj[name] = value;
        this.url.set("query", queryObj);
    }
    addCookie(name, value) {
        if (!this.headers["Cookie"]) {
            this.headers["Cookie"] = "";
        }
        this.headers["Cookie"] += name + "=" + value + "; ";
    }
    setHeaderParam(key, value) {
        this.headers[key] = value;
    }
}
exports.RequestContext = RequestContext;
class SelfDecodingBody {
    constructor(dataSource){
        this.dataSource = dataSource;
    }
    binary() {
        return this.dataSource;
    }
    text() {
        return __awaiter(this, void 0, void 0, function*() {
            const data = yield this.dataSource;
            if (data.text) {
                return data.text();
            }
            return new Promise((resolve, reject)=>{
                const reader = new FileReader();
                reader.addEventListener("load", ()=>resolve(reader.result));
                reader.addEventListener("error", ()=>reject(reader.error));
                reader.readAsText(data);
            });
        });
    }
}
exports.SelfDecodingBody = SelfDecodingBody;
class ResponseContext {
    constructor(httpStatusCode, headers, body){
        this.httpStatusCode = httpStatusCode;
        this.headers = headers;
        this.body = body;
    }
    getParsedHeader(headerName) {
        const result = {};
        if (!this.headers[headerName]) {
            return result;
        }
        const parameters = this.headers[headerName].split(";");
        for (const parameter of parameters){
            let [key, value] = parameter.split("=", 2);
            key = key.toLowerCase().trim();
            if (value === undefined) {
                result[""] = key;
            } else {
                value = value.trim();
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length - 1);
                }
                result[key] = value;
            }
        }
        return result;
    }
    getBodyAsFile() {
        return __awaiter(this, void 0, void 0, function*() {
            const data = yield this.body.binary();
            const fileName = this.getParsedHeader("content-disposition")["filename"] || "";
            const contentType = this.headers["content-type"] || "";
            try {
                return new File([
                    data
                ], fileName, {
                    type: contentType
                });
            } catch (error) {
                return Object.assign(data, {
                    name: fileName,
                    type: contentType
                });
            }
        });
    }
}
exports.ResponseContext = ResponseContext;
function wrapHttpLibrary(promiseHttpLibrary) {
    return {
        send (request) {
            return rxjsStub_1.from(promiseHttpLibrary.send(request));
        }
    };
}
exports.wrapHttpLibrary = wrapHttpLibrary; //# sourceMappingURL=http.js.map


/***/ }),

/***/ 47305:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __awaiter = (void 0) && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.IsomorphicFetchHttpLibrary = void 0;
const http_1 = __webpack_require__(35665);
const rxjsStub_1 = __webpack_require__(46223);
__webpack_require__(21805);
const numRetries = 2;
const sleep = (interval)=>new Promise((resolve)=>setTimeout(resolve, interval));
class IsomorphicFetchHttpLibrary {
    send(request) {
        const resultPromise = this.sendWithRetry(request, numRetries, 50, 1);
        return rxjsStub_1.from(resultPromise);
    }
    sendWithRetry(request, triesLeft, nextInterval, retryCount) {
        return __awaiter(this, void 0, void 0, function*() {
            try {
                const response = yield this.sendOnce(request);
                if (triesLeft <= 0 || response.httpStatusCode < 500) {
                    return response;
                }
            } catch (e) {
                if (triesLeft <= 0) {
                    throw e;
                }
            }
            ;
            yield sleep(nextInterval);
            const headers = request.getHeaders();
            headers["svix-retry-count"] = retryCount.toString();
            return yield this.sendWithRetry(request, --triesLeft, nextInterval * 2, ++retryCount);
        });
    }
    sendOnce(request) {
        let method = request.getHttpMethod().toString();
        let body = request.getBody();
        return fetch(request.getUrl(), {
            method: method,
            body: body,
            headers: request.getHeaders(),
            credentials: "same-origin"
        }).then((resp)=>{
            const headers = {};
            resp.headers.forEach((value, name)=>{
                headers[name] = value;
            });
            const body = {
                text: ()=>resp.text(),
                binary: ()=>resp.blob()
            };
            return new http_1.ResponseContext(resp.status, headers, body);
        });
    }
}
exports.IsomorphicFetchHttpLibrary = IsomorphicFetchHttpLibrary; //# sourceMappingURL=isomorphic-fetch.js.map


/***/ }),

/***/ 18943:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __createBinding = (void 0) && (void 0).__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = (void 0) && (void 0).__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !exports1.hasOwnProperty(p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
__exportStar(__webpack_require__(35665), exports);
__exportStar(__webpack_require__(38773), exports);
__exportStar(__webpack_require__(11794), exports);
var configuration_1 = __webpack_require__(47995);
Object.defineProperty(exports, "createConfiguration", ({
    enumerable: true,
    get: function() {
        return configuration_1.createConfiguration;
    }
}));
__exportStar(__webpack_require__(10432), exports);
__exportStar(__webpack_require__(27225), exports);
var ObjectParamAPI_1 = __webpack_require__(23827);
Object.defineProperty(exports, "ApplicationApi", ({
    enumerable: true,
    get: function() {
        return ObjectParamAPI_1.ObjectApplicationApi;
    }
}));
Object.defineProperty(exports, "AuthenticationApi", ({
    enumerable: true,
    get: function() {
        return ObjectParamAPI_1.ObjectAuthenticationApi;
    }
}));
Object.defineProperty(exports, "BackgroundTasksApi", ({
    enumerable: true,
    get: function() {
        return ObjectParamAPI_1.ObjectBackgroundTasksApi;
    }
}));
Object.defineProperty(exports, "BroadcastApi", ({
    enumerable: true,
    get: function() {
        return ObjectParamAPI_1.ObjectBroadcastApi;
    }
}));
Object.defineProperty(exports, "EndpointApi", ({
    enumerable: true,
    get: function() {
        return ObjectParamAPI_1.ObjectEndpointApi;
    }
}));
Object.defineProperty(exports, "EnvironmentApi", ({
    enumerable: true,
    get: function() {
        return ObjectParamAPI_1.ObjectEnvironmentApi;
    }
}));
Object.defineProperty(exports, "EnvironmentSettingsApi", ({
    enumerable: true,
    get: function() {
        return ObjectParamAPI_1.ObjectEnvironmentSettingsApi;
    }
}));
Object.defineProperty(exports, "EventTypeApi", ({
    enumerable: true,
    get: function() {
        return ObjectParamAPI_1.ObjectEventTypeApi;
    }
}));
Object.defineProperty(exports, "HealthApi", ({
    enumerable: true,
    get: function() {
        return ObjectParamAPI_1.ObjectHealthApi;
    }
}));
Object.defineProperty(exports, "IntegrationApi", ({
    enumerable: true,
    get: function() {
        return ObjectParamAPI_1.ObjectIntegrationApi;
    }
}));
Object.defineProperty(exports, "MessageApi", ({
    enumerable: true,
    get: function() {
        return ObjectParamAPI_1.ObjectMessageApi;
    }
}));
Object.defineProperty(exports, "MessageAttemptApi", ({
    enumerable: true,
    get: function() {
        return ObjectParamAPI_1.ObjectMessageAttemptApi;
    }
}));
Object.defineProperty(exports, "StatisticsApi", ({
    enumerable: true,
    get: function() {
        return ObjectParamAPI_1.ObjectStatisticsApi;
    }
}));
Object.defineProperty(exports, "TransformationTemplateApi", ({
    enumerable: true,
    get: function() {
        return ObjectParamAPI_1.ObjectTransformationTemplateApi;
    }
})); //# sourceMappingURL=index.js.map


/***/ }),

/***/ 849:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.PromiseMiddlewareWrapper = void 0;
const rxjsStub_1 = __webpack_require__(46223);
class PromiseMiddlewareWrapper {
    constructor(middleware){
        this.middleware = middleware;
    }
    pre(context) {
        return rxjsStub_1.from(this.middleware.pre(context));
    }
    post(context) {
        return rxjsStub_1.from(this.middleware.post(context));
    }
}
exports.PromiseMiddlewareWrapper = PromiseMiddlewareWrapper; //# sourceMappingURL=middleware.js.map


/***/ }),

/***/ 21230:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.AppPortalAccessIn = void 0;
class AppPortalAccessIn {
    constructor(){}
    static getAttributeTypeMap() {
        return AppPortalAccessIn.attributeTypeMap;
    }
}
exports.AppPortalAccessIn = AppPortalAccessIn;
AppPortalAccessIn.discriminator = undefined;
AppPortalAccessIn.attributeTypeMap = [
    {
        "name": "featureFlags",
        "baseName": "featureFlags",
        "type": "Array<string>",
        "format": ""
    }
]; //# sourceMappingURL=AppPortalAccessIn.js.map


/***/ }),

/***/ 92514:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.AppPortalAccessOut = void 0;
class AppPortalAccessOut {
    constructor(){}
    static getAttributeTypeMap() {
        return AppPortalAccessOut.attributeTypeMap;
    }
}
exports.AppPortalAccessOut = AppPortalAccessOut;
AppPortalAccessOut.discriminator = undefined;
AppPortalAccessOut.attributeTypeMap = [
    {
        "name": "token",
        "baseName": "token",
        "type": "string",
        "format": ""
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "URI",
        "format": "uri"
    }
]; //# sourceMappingURL=AppPortalAccessOut.js.map


/***/ }),

/***/ 89144:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.AppUsageStatsIn = void 0;
class AppUsageStatsIn {
    constructor(){}
    static getAttributeTypeMap() {
        return AppUsageStatsIn.attributeTypeMap;
    }
}
exports.AppUsageStatsIn = AppUsageStatsIn;
AppUsageStatsIn.discriminator = undefined;
AppUsageStatsIn.attributeTypeMap = [
    {
        "name": "appIds",
        "baseName": "appIds",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "since",
        "baseName": "since",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "until",
        "baseName": "until",
        "type": "Date",
        "format": "date-time"
    }
]; //# sourceMappingURL=AppUsageStatsIn.js.map


/***/ }),

/***/ 68441:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.AppUsageStatsOut = void 0;
class AppUsageStatsOut {
    constructor(){}
    static getAttributeTypeMap() {
        return AppUsageStatsOut.attributeTypeMap;
    }
}
exports.AppUsageStatsOut = AppUsageStatsOut;
AppUsageStatsOut.discriminator = undefined;
AppUsageStatsOut.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "status",
        "baseName": "status",
        "type": "BackgroundTaskStatus",
        "format": ""
    },
    {
        "name": "task",
        "baseName": "task",
        "type": "BackgroundTaskType",
        "format": ""
    }
]; //# sourceMappingURL=AppUsageStatsOut.js.map


/***/ }),

/***/ 25987:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ApplicationIn = void 0;
class ApplicationIn {
    constructor(){}
    static getAttributeTypeMap() {
        return ApplicationIn.attributeTypeMap;
    }
}
exports.ApplicationIn = ApplicationIn;
ApplicationIn.discriminator = undefined;
ApplicationIn.attributeTypeMap = [
    {
        "name": "metadata",
        "baseName": "metadata",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "rateLimit",
        "baseName": "rateLimit",
        "type": "number",
        "format": "uint16"
    },
    {
        "name": "uid",
        "baseName": "uid",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=ApplicationIn.js.map


/***/ }),

/***/ 72123:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ApplicationOut = void 0;
class ApplicationOut {
    constructor(){}
    static getAttributeTypeMap() {
        return ApplicationOut.attributeTypeMap;
    }
}
exports.ApplicationOut = ApplicationOut;
ApplicationOut.discriminator = undefined;
ApplicationOut.attributeTypeMap = [
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "metadata",
        "baseName": "metadata",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "rateLimit",
        "baseName": "rateLimit",
        "type": "number",
        "format": "uint16"
    },
    {
        "name": "uid",
        "baseName": "uid",
        "type": "string",
        "format": ""
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    }
]; //# sourceMappingURL=ApplicationOut.js.map


/***/ }),

/***/ 38232:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ApplicationPatch = void 0;
class ApplicationPatch {
    constructor(){}
    static getAttributeTypeMap() {
        return ApplicationPatch.attributeTypeMap;
    }
}
exports.ApplicationPatch = ApplicationPatch;
ApplicationPatch.discriminator = undefined;
ApplicationPatch.attributeTypeMap = [
    {
        "name": "metadata",
        "baseName": "metadata",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "rateLimit",
        "baseName": "rateLimit",
        "type": "number",
        "format": "uint16"
    },
    {
        "name": "uid",
        "baseName": "uid",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=ApplicationPatch.js.map


/***/ }),

/***/ 82305:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ApplicationStats = void 0;
class ApplicationStats {
    constructor(){}
    static getAttributeTypeMap() {
        return ApplicationStats.attributeTypeMap;
    }
}
exports.ApplicationStats = ApplicationStats;
ApplicationStats.discriminator = undefined;
ApplicationStats.attributeTypeMap = [
    {
        "name": "appId",
        "baseName": "appId",
        "type": "string",
        "format": ""
    },
    {
        "name": "appUid",
        "baseName": "appUid",
        "type": "string",
        "format": ""
    },
    {
        "name": "messageDestinations",
        "baseName": "messageDestinations",
        "type": "number",
        "format": "int"
    }
]; //# sourceMappingURL=ApplicationStats.js.map


/***/ }),

/***/ 46225:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ApplicationTokenExpireIn = void 0;
class ApplicationTokenExpireIn {
    constructor(){}
    static getAttributeTypeMap() {
        return ApplicationTokenExpireIn.attributeTypeMap;
    }
}
exports.ApplicationTokenExpireIn = ApplicationTokenExpireIn;
ApplicationTokenExpireIn.discriminator = undefined;
ApplicationTokenExpireIn.attributeTypeMap = [
    {
        "name": "expiry",
        "baseName": "expiry",
        "type": "number",
        "format": "int64"
    }
]; //# sourceMappingURL=ApplicationTokenExpireIn.js.map


/***/ }),

/***/ 17015:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.AttemptStatisticsData = void 0;
class AttemptStatisticsData {
    constructor(){}
    static getAttributeTypeMap() {
        return AttemptStatisticsData.attributeTypeMap;
    }
}
exports.AttemptStatisticsData = AttemptStatisticsData;
AttemptStatisticsData.discriminator = undefined;
AttemptStatisticsData.attributeTypeMap = [
    {
        "name": "failureCount",
        "baseName": "failureCount",
        "type": "Array<number>",
        "format": "int"
    },
    {
        "name": "successCount",
        "baseName": "successCount",
        "type": "Array<number>",
        "format": "int"
    }
]; //# sourceMappingURL=AttemptStatisticsData.js.map


/***/ }),

/***/ 88858:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.AttemptStatisticsResponse = void 0;
class AttemptStatisticsResponse {
    constructor(){}
    static getAttributeTypeMap() {
        return AttemptStatisticsResponse.attributeTypeMap;
    }
}
exports.AttemptStatisticsResponse = AttemptStatisticsResponse;
AttemptStatisticsResponse.discriminator = undefined;
AttemptStatisticsResponse.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "AttemptStatisticsData",
        "format": ""
    },
    {
        "name": "endDate",
        "baseName": "endDate",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "period",
        "baseName": "period",
        "type": "StatisticsPeriod",
        "format": ""
    },
    {
        "name": "startDate",
        "baseName": "startDate",
        "type": "Date",
        "format": "date-time"
    }
]; //# sourceMappingURL=AttemptStatisticsResponse.js.map


/***/ }),

/***/ 82247:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.BackgroundTaskOut = void 0;
class BackgroundTaskOut {
    constructor(){}
    static getAttributeTypeMap() {
        return BackgroundTaskOut.attributeTypeMap;
    }
}
exports.BackgroundTaskOut = BackgroundTaskOut;
BackgroundTaskOut.discriminator = undefined;
BackgroundTaskOut.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "any",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "status",
        "baseName": "status",
        "type": "BackgroundTaskStatus",
        "format": ""
    },
    {
        "name": "task",
        "baseName": "task",
        "type": "BackgroundTaskType",
        "format": ""
    }
]; //# sourceMappingURL=BackgroundTaskOut.js.map


/***/ }),

/***/ 93916:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=BackgroundTaskStatus.js.map


/***/ }),

/***/ 99054:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=BackgroundTaskType.js.map


/***/ }),

/***/ 4364:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.BorderRadiusConfig = void 0;
class BorderRadiusConfig {
    constructor(){}
    static getAttributeTypeMap() {
        return BorderRadiusConfig.attributeTypeMap;
    }
}
exports.BorderRadiusConfig = BorderRadiusConfig;
BorderRadiusConfig.discriminator = undefined;
BorderRadiusConfig.attributeTypeMap = [
    {
        "name": "button",
        "baseName": "button",
        "type": "BorderRadiusEnum",
        "format": ""
    },
    {
        "name": "card",
        "baseName": "card",
        "type": "BorderRadiusEnum",
        "format": ""
    },
    {
        "name": "input",
        "baseName": "input",
        "type": "BorderRadiusEnum",
        "format": ""
    }
]; //# sourceMappingURL=BorderRadiusConfig.js.map


/***/ }),

/***/ 43392:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=BorderRadiusEnum.js.map


/***/ }),

/***/ 7383:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.CustomColorPalette = void 0;
class CustomColorPalette {
    constructor(){}
    static getAttributeTypeMap() {
        return CustomColorPalette.attributeTypeMap;
    }
}
exports.CustomColorPalette = CustomColorPalette;
CustomColorPalette.discriminator = undefined;
CustomColorPalette.attributeTypeMap = [
    {
        "name": "backgroundHover",
        "baseName": "backgroundHover",
        "type": "string",
        "format": "color"
    },
    {
        "name": "backgroundPrimary",
        "baseName": "backgroundPrimary",
        "type": "string",
        "format": "color"
    },
    {
        "name": "backgroundSecondary",
        "baseName": "backgroundSecondary",
        "type": "string",
        "format": "color"
    },
    {
        "name": "interactiveAccent",
        "baseName": "interactiveAccent",
        "type": "string",
        "format": "color"
    },
    {
        "name": "textDanger",
        "baseName": "textDanger",
        "type": "string",
        "format": "color"
    },
    {
        "name": "textPrimary",
        "baseName": "textPrimary",
        "type": "string",
        "format": "color"
    }
]; //# sourceMappingURL=CustomColorPalette.js.map


/***/ }),

/***/ 90846:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.CustomThemeOverride = void 0;
class CustomThemeOverride {
    constructor(){}
    static getAttributeTypeMap() {
        return CustomThemeOverride.attributeTypeMap;
    }
}
exports.CustomThemeOverride = CustomThemeOverride;
CustomThemeOverride.discriminator = undefined;
CustomThemeOverride.attributeTypeMap = [
    {
        "name": "borderRadius",
        "baseName": "borderRadius",
        "type": "BorderRadiusConfig",
        "format": ""
    },
    {
        "name": "fontSize",
        "baseName": "fontSize",
        "type": "FontSizeConfig",
        "format": ""
    }
]; //# sourceMappingURL=CustomThemeOverride.js.map


/***/ }),

/***/ 75870:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.DashboardAccessOut = void 0;
class DashboardAccessOut {
    constructor(){}
    static getAttributeTypeMap() {
        return DashboardAccessOut.attributeTypeMap;
    }
}
exports.DashboardAccessOut = DashboardAccessOut;
DashboardAccessOut.discriminator = undefined;
DashboardAccessOut.attributeTypeMap = [
    {
        "name": "token",
        "baseName": "token",
        "type": "string",
        "format": ""
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "URI",
        "format": "uri"
    }
]; //# sourceMappingURL=DashboardAccessOut.js.map


/***/ }),

/***/ 89724:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointCreatedEvent = void 0;
class EndpointCreatedEvent {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointCreatedEvent.attributeTypeMap;
    }
}
exports.EndpointCreatedEvent = EndpointCreatedEvent;
EndpointCreatedEvent.discriminator = undefined;
EndpointCreatedEvent.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "EndpointCreatedEventData",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "EndpointCreatedEventTypeEnum",
        "format": ""
    }
]; //# sourceMappingURL=EndpointCreatedEvent.js.map


/***/ }),

/***/ 64406:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointCreatedEventData = void 0;
class EndpointCreatedEventData {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointCreatedEventData.attributeTypeMap;
    }
}
exports.EndpointCreatedEventData = EndpointCreatedEventData;
EndpointCreatedEventData.discriminator = undefined;
EndpointCreatedEventData.attributeTypeMap = [
    {
        "name": "appId",
        "baseName": "appId",
        "type": "string",
        "format": ""
    },
    {
        "name": "appUid",
        "baseName": "appUid",
        "type": "string",
        "format": ""
    },
    {
        "name": "endpointId",
        "baseName": "endpointId",
        "type": "string",
        "format": ""
    },
    {
        "name": "endpointUid",
        "baseName": "endpointUid",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=EndpointCreatedEventData.js.map


/***/ }),

/***/ 79998:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointDeletedEvent = void 0;
class EndpointDeletedEvent {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointDeletedEvent.attributeTypeMap;
    }
}
exports.EndpointDeletedEvent = EndpointDeletedEvent;
EndpointDeletedEvent.discriminator = undefined;
EndpointDeletedEvent.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "EndpointDeletedEventData",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "EndpointDeletedEventTypeEnum",
        "format": ""
    }
]; //# sourceMappingURL=EndpointDeletedEvent.js.map


/***/ }),

/***/ 72718:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointDeletedEventData = void 0;
class EndpointDeletedEventData {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointDeletedEventData.attributeTypeMap;
    }
}
exports.EndpointDeletedEventData = EndpointDeletedEventData;
EndpointDeletedEventData.discriminator = undefined;
EndpointDeletedEventData.attributeTypeMap = [
    {
        "name": "appId",
        "baseName": "appId",
        "type": "string",
        "format": ""
    },
    {
        "name": "appUid",
        "baseName": "appUid",
        "type": "string",
        "format": ""
    },
    {
        "name": "endpointId",
        "baseName": "endpointId",
        "type": "string",
        "format": ""
    },
    {
        "name": "endpointUid",
        "baseName": "endpointUid",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=EndpointDeletedEventData.js.map


/***/ }),

/***/ 94065:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointDisabledEvent = void 0;
class EndpointDisabledEvent {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointDisabledEvent.attributeTypeMap;
    }
}
exports.EndpointDisabledEvent = EndpointDisabledEvent;
EndpointDisabledEvent.discriminator = undefined;
EndpointDisabledEvent.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "EndpointDisabledEventData",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "EndpointDisabledEventTypeEnum",
        "format": ""
    }
]; //# sourceMappingURL=EndpointDisabledEvent.js.map


/***/ }),

/***/ 92053:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointDisabledEventData = void 0;
class EndpointDisabledEventData {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointDisabledEventData.attributeTypeMap;
    }
}
exports.EndpointDisabledEventData = EndpointDisabledEventData;
EndpointDisabledEventData.discriminator = undefined;
EndpointDisabledEventData.attributeTypeMap = [
    {
        "name": "appId",
        "baseName": "appId",
        "type": "string",
        "format": ""
    },
    {
        "name": "appUid",
        "baseName": "appUid",
        "type": "string",
        "format": ""
    },
    {
        "name": "endpointId",
        "baseName": "endpointId",
        "type": "string",
        "format": ""
    },
    {
        "name": "endpointUid",
        "baseName": "endpointUid",
        "type": "string",
        "format": ""
    },
    {
        "name": "failSince",
        "baseName": "failSince",
        "type": "Date",
        "format": "date-time"
    }
]; //# sourceMappingURL=EndpointDisabledEventData.js.map


/***/ }),

/***/ 36888:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointHeadersIn = void 0;
class EndpointHeadersIn {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointHeadersIn.attributeTypeMap;
    }
}
exports.EndpointHeadersIn = EndpointHeadersIn;
EndpointHeadersIn.discriminator = undefined;
EndpointHeadersIn.attributeTypeMap = [
    {
        "name": "headers",
        "baseName": "headers",
        "type": "{ [key: string]: string; }",
        "format": ""
    }
]; //# sourceMappingURL=EndpointHeadersIn.js.map


/***/ }),

/***/ 80033:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointHeadersOut = void 0;
class EndpointHeadersOut {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointHeadersOut.attributeTypeMap;
    }
}
exports.EndpointHeadersOut = EndpointHeadersOut;
EndpointHeadersOut.discriminator = undefined;
EndpointHeadersOut.attributeTypeMap = [
    {
        "name": "headers",
        "baseName": "headers",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "sensitive",
        "baseName": "sensitive",
        "type": "Array<string>",
        "format": ""
    }
]; //# sourceMappingURL=EndpointHeadersOut.js.map


/***/ }),

/***/ 74661:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointHeadersPatchIn = void 0;
class EndpointHeadersPatchIn {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointHeadersPatchIn.attributeTypeMap;
    }
}
exports.EndpointHeadersPatchIn = EndpointHeadersPatchIn;
EndpointHeadersPatchIn.discriminator = undefined;
EndpointHeadersPatchIn.attributeTypeMap = [
    {
        "name": "headers",
        "baseName": "headers",
        "type": "{ [key: string]: string; }",
        "format": ""
    }
]; //# sourceMappingURL=EndpointHeadersPatchIn.js.map


/***/ }),

/***/ 19728:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointIn = void 0;
class EndpointIn {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointIn.attributeTypeMap;
    }
}
exports.EndpointIn = EndpointIn;
EndpointIn.discriminator = undefined;
EndpointIn.attributeTypeMap = [
    {
        "name": "channels",
        "baseName": "channels",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "description",
        "baseName": "description",
        "type": "string",
        "format": ""
    },
    {
        "name": "disabled",
        "baseName": "disabled",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "filterTypes",
        "baseName": "filterTypes",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "metadata",
        "baseName": "metadata",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "rateLimit",
        "baseName": "rateLimit",
        "type": "number",
        "format": "uint16"
    },
    {
        "name": "secret",
        "baseName": "secret",
        "type": "string",
        "format": ""
    },
    {
        "name": "uid",
        "baseName": "uid",
        "type": "string",
        "format": ""
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "URI",
        "format": "uri"
    },
    {
        "name": "version",
        "baseName": "version",
        "type": "number",
        "format": "uint16"
    }
]; //# sourceMappingURL=EndpointIn.js.map


/***/ }),

/***/ 84545:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointMessageOut = void 0;
class EndpointMessageOut {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointMessageOut.attributeTypeMap;
    }
}
exports.EndpointMessageOut = EndpointMessageOut;
EndpointMessageOut.discriminator = undefined;
EndpointMessageOut.attributeTypeMap = [
    {
        "name": "channels",
        "baseName": "channels",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "eventId",
        "baseName": "eventId",
        "type": "string",
        "format": ""
    },
    {
        "name": "eventType",
        "baseName": "eventType",
        "type": "string",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "nextAttempt",
        "baseName": "nextAttempt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "payload",
        "baseName": "payload",
        "type": "any",
        "format": ""
    },
    {
        "name": "status",
        "baseName": "status",
        "type": "MessageStatus",
        "format": ""
    },
    {
        "name": "timestamp",
        "baseName": "timestamp",
        "type": "Date",
        "format": "date-time"
    }
]; //# sourceMappingURL=EndpointMessageOut.js.map


/***/ }),

/***/ 89895:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointOut = void 0;
class EndpointOut {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointOut.attributeTypeMap;
    }
}
exports.EndpointOut = EndpointOut;
EndpointOut.discriminator = undefined;
EndpointOut.attributeTypeMap = [
    {
        "name": "channels",
        "baseName": "channels",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "description",
        "baseName": "description",
        "type": "string",
        "format": ""
    },
    {
        "name": "disabled",
        "baseName": "disabled",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "filterTypes",
        "baseName": "filterTypes",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "metadata",
        "baseName": "metadata",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "rateLimit",
        "baseName": "rateLimit",
        "type": "number",
        "format": "uint16"
    },
    {
        "name": "uid",
        "baseName": "uid",
        "type": "string",
        "format": ""
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "URI",
        "format": "uri"
    },
    {
        "name": "version",
        "baseName": "version",
        "type": "number",
        "format": "int32"
    }
]; //# sourceMappingURL=EndpointOut.js.map


/***/ }),

/***/ 69920:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointPatch = void 0;
class EndpointPatch {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointPatch.attributeTypeMap;
    }
}
exports.EndpointPatch = EndpointPatch;
EndpointPatch.discriminator = undefined;
EndpointPatch.attributeTypeMap = [
    {
        "name": "channels",
        "baseName": "channels",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "description",
        "baseName": "description",
        "type": "string",
        "format": ""
    },
    {
        "name": "disabled",
        "baseName": "disabled",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "filterTypes",
        "baseName": "filterTypes",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "metadata",
        "baseName": "metadata",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "rateLimit",
        "baseName": "rateLimit",
        "type": "number",
        "format": "uint16"
    },
    {
        "name": "secret",
        "baseName": "secret",
        "type": "string",
        "format": ""
    },
    {
        "name": "uid",
        "baseName": "uid",
        "type": "string",
        "format": ""
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "URI",
        "format": "uri"
    },
    {
        "name": "version",
        "baseName": "version",
        "type": "number",
        "format": "uint16"
    }
]; //# sourceMappingURL=EndpointPatch.js.map


/***/ }),

/***/ 8396:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointSecretOut = void 0;
class EndpointSecretOut {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointSecretOut.attributeTypeMap;
    }
}
exports.EndpointSecretOut = EndpointSecretOut;
EndpointSecretOut.discriminator = undefined;
EndpointSecretOut.attributeTypeMap = [
    {
        "name": "key",
        "baseName": "key",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=EndpointSecretOut.js.map


/***/ }),

/***/ 27546:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointSecretRotateIn = void 0;
class EndpointSecretRotateIn {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointSecretRotateIn.attributeTypeMap;
    }
}
exports.EndpointSecretRotateIn = EndpointSecretRotateIn;
EndpointSecretRotateIn.discriminator = undefined;
EndpointSecretRotateIn.attributeTypeMap = [
    {
        "name": "key",
        "baseName": "key",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=EndpointSecretRotateIn.js.map


/***/ }),

/***/ 3139:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointStats = void 0;
class EndpointStats {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointStats.attributeTypeMap;
    }
}
exports.EndpointStats = EndpointStats;
EndpointStats.discriminator = undefined;
EndpointStats.attributeTypeMap = [
    {
        "name": "fail",
        "baseName": "fail",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "pending",
        "baseName": "pending",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "sending",
        "baseName": "sending",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "success",
        "baseName": "success",
        "type": "number",
        "format": "int64"
    }
]; //# sourceMappingURL=EndpointStats.js.map


/***/ }),

/***/ 14020:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointTransformationIn = void 0;
class EndpointTransformationIn {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointTransformationIn.attributeTypeMap;
    }
}
exports.EndpointTransformationIn = EndpointTransformationIn;
EndpointTransformationIn.discriminator = undefined;
EndpointTransformationIn.attributeTypeMap = [
    {
        "name": "code",
        "baseName": "code",
        "type": "string",
        "format": ""
    },
    {
        "name": "enabled",
        "baseName": "enabled",
        "type": "boolean",
        "format": ""
    }
]; //# sourceMappingURL=EndpointTransformationIn.js.map


/***/ }),

/***/ 66945:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointTransformationOut = void 0;
class EndpointTransformationOut {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointTransformationOut.attributeTypeMap;
    }
}
exports.EndpointTransformationOut = EndpointTransformationOut;
EndpointTransformationOut.discriminator = undefined;
EndpointTransformationOut.attributeTypeMap = [
    {
        "name": "code",
        "baseName": "code",
        "type": "string",
        "format": ""
    },
    {
        "name": "enabled",
        "baseName": "enabled",
        "type": "boolean",
        "format": ""
    }
]; //# sourceMappingURL=EndpointTransformationOut.js.map


/***/ }),

/***/ 67388:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointTransformationSimulateIn = void 0;
class EndpointTransformationSimulateIn {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointTransformationSimulateIn.attributeTypeMap;
    }
}
exports.EndpointTransformationSimulateIn = EndpointTransformationSimulateIn;
EndpointTransformationSimulateIn.discriminator = undefined;
EndpointTransformationSimulateIn.attributeTypeMap = [
    {
        "name": "channels",
        "baseName": "channels",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "code",
        "baseName": "code",
        "type": "string",
        "format": ""
    },
    {
        "name": "eventType",
        "baseName": "eventType",
        "type": "string",
        "format": ""
    },
    {
        "name": "payload",
        "baseName": "payload",
        "type": "any",
        "format": ""
    }
]; //# sourceMappingURL=EndpointTransformationSimulateIn.js.map


/***/ }),

/***/ 97588:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointTransformationSimulateOut = void 0;
class EndpointTransformationSimulateOut {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointTransformationSimulateOut.attributeTypeMap;
    }
}
exports.EndpointTransformationSimulateOut = EndpointTransformationSimulateOut;
EndpointTransformationSimulateOut.discriminator = undefined;
EndpointTransformationSimulateOut.attributeTypeMap = [
    {
        "name": "method",
        "baseName": "method",
        "type": "TransformationHttpMethod",
        "format": ""
    },
    {
        "name": "payload",
        "baseName": "payload",
        "type": "string",
        "format": ""
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "URI",
        "format": "uri"
    }
]; //# sourceMappingURL=EndpointTransformationSimulateOut.js.map


/***/ }),

/***/ 26742:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointUpdate = void 0;
class EndpointUpdate {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointUpdate.attributeTypeMap;
    }
}
exports.EndpointUpdate = EndpointUpdate;
EndpointUpdate.discriminator = undefined;
EndpointUpdate.attributeTypeMap = [
    {
        "name": "channels",
        "baseName": "channels",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "description",
        "baseName": "description",
        "type": "string",
        "format": ""
    },
    {
        "name": "disabled",
        "baseName": "disabled",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "filterTypes",
        "baseName": "filterTypes",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "metadata",
        "baseName": "metadata",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "rateLimit",
        "baseName": "rateLimit",
        "type": "number",
        "format": "uint16"
    },
    {
        "name": "uid",
        "baseName": "uid",
        "type": "string",
        "format": ""
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "URI",
        "format": "uri"
    },
    {
        "name": "version",
        "baseName": "version",
        "type": "number",
        "format": "uint16"
    }
]; //# sourceMappingURL=EndpointUpdate.js.map


/***/ }),

/***/ 19564:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointUpdatedEvent = void 0;
class EndpointUpdatedEvent {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointUpdatedEvent.attributeTypeMap;
    }
}
exports.EndpointUpdatedEvent = EndpointUpdatedEvent;
EndpointUpdatedEvent.discriminator = undefined;
EndpointUpdatedEvent.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "EndpointUpdatedEventData",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "EndpointUpdatedEventTypeEnum",
        "format": ""
    }
]; //# sourceMappingURL=EndpointUpdatedEvent.js.map


/***/ }),

/***/ 2979:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EndpointUpdatedEventData = void 0;
class EndpointUpdatedEventData {
    constructor(){}
    static getAttributeTypeMap() {
        return EndpointUpdatedEventData.attributeTypeMap;
    }
}
exports.EndpointUpdatedEventData = EndpointUpdatedEventData;
EndpointUpdatedEventData.discriminator = undefined;
EndpointUpdatedEventData.attributeTypeMap = [
    {
        "name": "appId",
        "baseName": "appId",
        "type": "string",
        "format": ""
    },
    {
        "name": "appUid",
        "baseName": "appUid",
        "type": "string",
        "format": ""
    },
    {
        "name": "endpointId",
        "baseName": "endpointId",
        "type": "string",
        "format": ""
    },
    {
        "name": "endpointUid",
        "baseName": "endpointUid",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=EndpointUpdatedEventData.js.map


/***/ }),

/***/ 14702:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EnvironmentIn = void 0;
class EnvironmentIn {
    constructor(){}
    static getAttributeTypeMap() {
        return EnvironmentIn.attributeTypeMap;
    }
}
exports.EnvironmentIn = EnvironmentIn;
EnvironmentIn.discriminator = undefined;
EnvironmentIn.attributeTypeMap = [
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "eventTypes",
        "baseName": "eventTypes",
        "type": "Array<EventTypeIn>",
        "format": ""
    },
    {
        "name": "settings",
        "baseName": "settings",
        "type": "SettingsIn",
        "format": ""
    },
    {
        "name": "version",
        "baseName": "version",
        "type": "number",
        "format": "int"
    }
]; //# sourceMappingURL=EnvironmentIn.js.map


/***/ }),

/***/ 24817:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EnvironmentOut = void 0;
class EnvironmentOut {
    constructor(){}
    static getAttributeTypeMap() {
        return EnvironmentOut.attributeTypeMap;
    }
}
exports.EnvironmentOut = EnvironmentOut;
EnvironmentOut.discriminator = undefined;
EnvironmentOut.attributeTypeMap = [
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "eventTypes",
        "baseName": "eventTypes",
        "type": "Array<EventTypeOut>",
        "format": ""
    },
    {
        "name": "settings",
        "baseName": "settings",
        "type": "SettingsOut",
        "format": ""
    },
    {
        "name": "version",
        "baseName": "version",
        "type": "number",
        "format": "int"
    }
]; //# sourceMappingURL=EnvironmentOut.js.map


/***/ }),

/***/ 97070:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EnvironmentSettingsOut = void 0;
class EnvironmentSettingsOut {
    constructor(){}
    static getAttributeTypeMap() {
        return EnvironmentSettingsOut.attributeTypeMap;
    }
}
exports.EnvironmentSettingsOut = EnvironmentSettingsOut;
EnvironmentSettingsOut.discriminator = undefined;
EnvironmentSettingsOut.attributeTypeMap = [
    {
        "name": "colorPaletteDark",
        "baseName": "colorPaletteDark",
        "type": "CustomColorPalette",
        "format": ""
    },
    {
        "name": "colorPaletteLight",
        "baseName": "colorPaletteLight",
        "type": "CustomColorPalette",
        "format": ""
    },
    {
        "name": "customColor",
        "baseName": "customColor",
        "type": "string",
        "format": "color"
    },
    {
        "name": "customFontFamily",
        "baseName": "customFontFamily",
        "type": "string",
        "format": ""
    },
    {
        "name": "customLogoUrl",
        "baseName": "customLogoUrl",
        "type": "URI",
        "format": "uri"
    },
    {
        "name": "customThemeOverride",
        "baseName": "customThemeOverride",
        "type": "CustomThemeOverride",
        "format": ""
    },
    {
        "name": "enableChannels",
        "baseName": "enableChannels",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "enableIntegrationManagement",
        "baseName": "enableIntegrationManagement",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "enableTransformations",
        "baseName": "enableTransformations",
        "type": "boolean",
        "format": ""
    }
]; //# sourceMappingURL=EnvironmentSettingsOut.js.map


/***/ }),

/***/ 12872:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EventExampleIn = void 0;
class EventExampleIn {
    constructor(){}
    static getAttributeTypeMap() {
        return EventExampleIn.attributeTypeMap;
    }
}
exports.EventExampleIn = EventExampleIn;
EventExampleIn.discriminator = undefined;
EventExampleIn.attributeTypeMap = [
    {
        "name": "eventType",
        "baseName": "eventType",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=EventExampleIn.js.map


/***/ }),

/***/ 64143:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EventTypeExampleOut = void 0;
class EventTypeExampleOut {
    constructor(){}
    static getAttributeTypeMap() {
        return EventTypeExampleOut.attributeTypeMap;
    }
}
exports.EventTypeExampleOut = EventTypeExampleOut;
EventTypeExampleOut.discriminator = undefined;
EventTypeExampleOut.attributeTypeMap = [
    {
        "name": "example",
        "baseName": "example",
        "type": "{ [key: string]: any; }",
        "format": ""
    }
]; //# sourceMappingURL=EventTypeExampleOut.js.map


/***/ }),

/***/ 76224:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EventTypeImportOpenApiIn = void 0;
class EventTypeImportOpenApiIn {
    constructor(){}
    static getAttributeTypeMap() {
        return EventTypeImportOpenApiIn.attributeTypeMap;
    }
}
exports.EventTypeImportOpenApiIn = EventTypeImportOpenApiIn;
EventTypeImportOpenApiIn.discriminator = undefined;
EventTypeImportOpenApiIn.attributeTypeMap = [
    {
        "name": "spec",
        "baseName": "spec",
        "type": "{ [key: string]: any; }",
        "format": ""
    }
]; //# sourceMappingURL=EventTypeImportOpenApiIn.js.map


/***/ }),

/***/ 32218:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EventTypeImportOpenApiOut = void 0;
class EventTypeImportOpenApiOut {
    constructor(){}
    static getAttributeTypeMap() {
        return EventTypeImportOpenApiOut.attributeTypeMap;
    }
}
exports.EventTypeImportOpenApiOut = EventTypeImportOpenApiOut;
EventTypeImportOpenApiOut.discriminator = undefined;
EventTypeImportOpenApiOut.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "EventTypeImportOpenApiOutData",
        "format": ""
    }
]; //# sourceMappingURL=EventTypeImportOpenApiOut.js.map


/***/ }),

/***/ 84757:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EventTypeImportOpenApiOutData = void 0;
class EventTypeImportOpenApiOutData {
    constructor(){}
    static getAttributeTypeMap() {
        return EventTypeImportOpenApiOutData.attributeTypeMap;
    }
}
exports.EventTypeImportOpenApiOutData = EventTypeImportOpenApiOutData;
EventTypeImportOpenApiOutData.discriminator = undefined;
EventTypeImportOpenApiOutData.attributeTypeMap = [
    {
        "name": "modified",
        "baseName": "modified",
        "type": "Array<string>",
        "format": ""
    }
]; //# sourceMappingURL=EventTypeImportOpenApiOutData.js.map


/***/ }),

/***/ 40838:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EventTypeIn = void 0;
class EventTypeIn {
    constructor(){}
    static getAttributeTypeMap() {
        return EventTypeIn.attributeTypeMap;
    }
}
exports.EventTypeIn = EventTypeIn;
EventTypeIn.discriminator = undefined;
EventTypeIn.attributeTypeMap = [
    {
        "name": "archived",
        "baseName": "archived",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "description",
        "baseName": "description",
        "type": "string",
        "format": ""
    },
    {
        "name": "featureFlag",
        "baseName": "featureFlag",
        "type": "string",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "schemas",
        "baseName": "schemas",
        "type": "{ [key: string]: any; }",
        "format": ""
    }
]; //# sourceMappingURL=EventTypeIn.js.map


/***/ }),

/***/ 77334:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EventTypeOut = void 0;
class EventTypeOut {
    constructor(){}
    static getAttributeTypeMap() {
        return EventTypeOut.attributeTypeMap;
    }
}
exports.EventTypeOut = EventTypeOut;
EventTypeOut.discriminator = undefined;
EventTypeOut.attributeTypeMap = [
    {
        "name": "archived",
        "baseName": "archived",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "description",
        "baseName": "description",
        "type": "string",
        "format": ""
    },
    {
        "name": "featureFlag",
        "baseName": "featureFlag",
        "type": "string",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "schemas",
        "baseName": "schemas",
        "type": "{ [key: string]: any; }",
        "format": ""
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    }
]; //# sourceMappingURL=EventTypeOut.js.map


/***/ }),

/***/ 71771:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EventTypePatch = void 0;
class EventTypePatch {
    constructor(){}
    static getAttributeTypeMap() {
        return EventTypePatch.attributeTypeMap;
    }
}
exports.EventTypePatch = EventTypePatch;
EventTypePatch.discriminator = undefined;
EventTypePatch.attributeTypeMap = [
    {
        "name": "archived",
        "baseName": "archived",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "description",
        "baseName": "description",
        "type": "string",
        "format": ""
    },
    {
        "name": "featureFlag",
        "baseName": "featureFlag",
        "type": "string",
        "format": ""
    },
    {
        "name": "schemas",
        "baseName": "schemas",
        "type": "{ [key: string]: any; }",
        "format": ""
    }
]; //# sourceMappingURL=EventTypePatch.js.map


/***/ }),

/***/ 29634:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EventTypeSchemaIn = void 0;
class EventTypeSchemaIn {
    constructor(){}
    static getAttributeTypeMap() {
        return EventTypeSchemaIn.attributeTypeMap;
    }
}
exports.EventTypeSchemaIn = EventTypeSchemaIn;
EventTypeSchemaIn.discriminator = undefined;
EventTypeSchemaIn.attributeTypeMap = [
    {
        "name": "schema",
        "baseName": "schema",
        "type": "any",
        "format": ""
    }
]; //# sourceMappingURL=EventTypeSchemaIn.js.map


/***/ }),

/***/ 36864:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EventTypeUpdate = void 0;
class EventTypeUpdate {
    constructor(){}
    static getAttributeTypeMap() {
        return EventTypeUpdate.attributeTypeMap;
    }
}
exports.EventTypeUpdate = EventTypeUpdate;
EventTypeUpdate.discriminator = undefined;
EventTypeUpdate.attributeTypeMap = [
    {
        "name": "archived",
        "baseName": "archived",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "description",
        "baseName": "description",
        "type": "string",
        "format": ""
    },
    {
        "name": "featureFlag",
        "baseName": "featureFlag",
        "type": "string",
        "format": ""
    },
    {
        "name": "schemas",
        "baseName": "schemas",
        "type": "{ [key: string]: any; }",
        "format": ""
    }
]; //# sourceMappingURL=EventTypeUpdate.js.map


/***/ }),

/***/ 84813:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.FontSizeConfig = void 0;
class FontSizeConfig {
    constructor(){}
    static getAttributeTypeMap() {
        return FontSizeConfig.attributeTypeMap;
    }
}
exports.FontSizeConfig = FontSizeConfig;
FontSizeConfig.discriminator = undefined;
FontSizeConfig.attributeTypeMap = [
    {
        "name": "base",
        "baseName": "base",
        "type": "number",
        "format": "int"
    }
]; //# sourceMappingURL=FontSizeConfig.js.map


/***/ }),

/***/ 48673:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.HTTPValidationError = void 0;
class HTTPValidationError {
    constructor(){}
    static getAttributeTypeMap() {
        return HTTPValidationError.attributeTypeMap;
    }
}
exports.HTTPValidationError = HTTPValidationError;
HTTPValidationError.discriminator = undefined;
HTTPValidationError.attributeTypeMap = [
    {
        "name": "detail",
        "baseName": "detail",
        "type": "Array<ValidationError>",
        "format": ""
    }
]; //# sourceMappingURL=HTTPValidationError.js.map


/***/ }),

/***/ 54017:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.HttpErrorOut = void 0;
class HttpErrorOut {
    constructor(){}
    static getAttributeTypeMap() {
        return HttpErrorOut.attributeTypeMap;
    }
}
exports.HttpErrorOut = HttpErrorOut;
HttpErrorOut.discriminator = undefined;
HttpErrorOut.attributeTypeMap = [
    {
        "name": "code",
        "baseName": "code",
        "type": "string",
        "format": ""
    },
    {
        "name": "detail",
        "baseName": "detail",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=HttpErrorOut.js.map


/***/ }),

/***/ 85712:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.IntegrationIn = void 0;
class IntegrationIn {
    constructor(){}
    static getAttributeTypeMap() {
        return IntegrationIn.attributeTypeMap;
    }
}
exports.IntegrationIn = IntegrationIn;
IntegrationIn.discriminator = undefined;
IntegrationIn.attributeTypeMap = [
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=IntegrationIn.js.map


/***/ }),

/***/ 3570:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.IntegrationKeyOut = void 0;
class IntegrationKeyOut {
    constructor(){}
    static getAttributeTypeMap() {
        return IntegrationKeyOut.attributeTypeMap;
    }
}
exports.IntegrationKeyOut = IntegrationKeyOut;
IntegrationKeyOut.discriminator = undefined;
IntegrationKeyOut.attributeTypeMap = [
    {
        "name": "key",
        "baseName": "key",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=IntegrationKeyOut.js.map


/***/ }),

/***/ 10890:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.IntegrationOut = void 0;
class IntegrationOut {
    constructor(){}
    static getAttributeTypeMap() {
        return IntegrationOut.attributeTypeMap;
    }
}
exports.IntegrationOut = IntegrationOut;
IntegrationOut.discriminator = undefined;
IntegrationOut.attributeTypeMap = [
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    }
]; //# sourceMappingURL=IntegrationOut.js.map


/***/ }),

/***/ 96125:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.IntegrationUpdate = void 0;
class IntegrationUpdate {
    constructor(){}
    static getAttributeTypeMap() {
        return IntegrationUpdate.attributeTypeMap;
    }
}
exports.IntegrationUpdate = IntegrationUpdate;
IntegrationUpdate.discriminator = undefined;
IntegrationUpdate.attributeTypeMap = [
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=IntegrationUpdate.js.map


/***/ }),

/***/ 13502:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ListResponseApplicationOut = void 0;
class ListResponseApplicationOut {
    constructor(){}
    static getAttributeTypeMap() {
        return ListResponseApplicationOut.attributeTypeMap;
    }
}
exports.ListResponseApplicationOut = ListResponseApplicationOut;
ListResponseApplicationOut.discriminator = undefined;
ListResponseApplicationOut.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "Array<ApplicationOut>",
        "format": ""
    },
    {
        "name": "done",
        "baseName": "done",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "iterator",
        "baseName": "iterator",
        "type": "string",
        "format": ""
    },
    {
        "name": "prevIterator",
        "baseName": "prevIterator",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=ListResponseApplicationOut.js.map


/***/ }),

/***/ 5178:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ListResponseApplicationStats = void 0;
class ListResponseApplicationStats {
    constructor(){}
    static getAttributeTypeMap() {
        return ListResponseApplicationStats.attributeTypeMap;
    }
}
exports.ListResponseApplicationStats = ListResponseApplicationStats;
ListResponseApplicationStats.discriminator = undefined;
ListResponseApplicationStats.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "Array<ApplicationStats>",
        "format": ""
    },
    {
        "name": "done",
        "baseName": "done",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "iterator",
        "baseName": "iterator",
        "type": "string",
        "format": ""
    },
    {
        "name": "prevIterator",
        "baseName": "prevIterator",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=ListResponseApplicationStats.js.map


/***/ }),

/***/ 77035:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ListResponseBackgroundTaskOut = void 0;
class ListResponseBackgroundTaskOut {
    constructor(){}
    static getAttributeTypeMap() {
        return ListResponseBackgroundTaskOut.attributeTypeMap;
    }
}
exports.ListResponseBackgroundTaskOut = ListResponseBackgroundTaskOut;
ListResponseBackgroundTaskOut.discriminator = undefined;
ListResponseBackgroundTaskOut.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "Array<BackgroundTaskOut>",
        "format": ""
    },
    {
        "name": "done",
        "baseName": "done",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "iterator",
        "baseName": "iterator",
        "type": "string",
        "format": ""
    },
    {
        "name": "prevIterator",
        "baseName": "prevIterator",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=ListResponseBackgroundTaskOut.js.map


/***/ }),

/***/ 22955:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ListResponseEndpointMessageOut = void 0;
class ListResponseEndpointMessageOut {
    constructor(){}
    static getAttributeTypeMap() {
        return ListResponseEndpointMessageOut.attributeTypeMap;
    }
}
exports.ListResponseEndpointMessageOut = ListResponseEndpointMessageOut;
ListResponseEndpointMessageOut.discriminator = undefined;
ListResponseEndpointMessageOut.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "Array<EndpointMessageOut>",
        "format": ""
    },
    {
        "name": "done",
        "baseName": "done",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "iterator",
        "baseName": "iterator",
        "type": "string",
        "format": ""
    },
    {
        "name": "prevIterator",
        "baseName": "prevIterator",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=ListResponseEndpointMessageOut.js.map


/***/ }),

/***/ 44378:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ListResponseEndpointOut = void 0;
class ListResponseEndpointOut {
    constructor(){}
    static getAttributeTypeMap() {
        return ListResponseEndpointOut.attributeTypeMap;
    }
}
exports.ListResponseEndpointOut = ListResponseEndpointOut;
ListResponseEndpointOut.discriminator = undefined;
ListResponseEndpointOut.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "Array<EndpointOut>",
        "format": ""
    },
    {
        "name": "done",
        "baseName": "done",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "iterator",
        "baseName": "iterator",
        "type": "string",
        "format": ""
    },
    {
        "name": "prevIterator",
        "baseName": "prevIterator",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=ListResponseEndpointOut.js.map


/***/ }),

/***/ 45801:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ListResponseEventTypeOut = void 0;
class ListResponseEventTypeOut {
    constructor(){}
    static getAttributeTypeMap() {
        return ListResponseEventTypeOut.attributeTypeMap;
    }
}
exports.ListResponseEventTypeOut = ListResponseEventTypeOut;
ListResponseEventTypeOut.discriminator = undefined;
ListResponseEventTypeOut.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "Array<EventTypeOut>",
        "format": ""
    },
    {
        "name": "done",
        "baseName": "done",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "iterator",
        "baseName": "iterator",
        "type": "string",
        "format": ""
    },
    {
        "name": "prevIterator",
        "baseName": "prevIterator",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=ListResponseEventTypeOut.js.map


/***/ }),

/***/ 70725:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ListResponseIntegrationOut = void 0;
class ListResponseIntegrationOut {
    constructor(){}
    static getAttributeTypeMap() {
        return ListResponseIntegrationOut.attributeTypeMap;
    }
}
exports.ListResponseIntegrationOut = ListResponseIntegrationOut;
ListResponseIntegrationOut.discriminator = undefined;
ListResponseIntegrationOut.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "Array<IntegrationOut>",
        "format": ""
    },
    {
        "name": "done",
        "baseName": "done",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "iterator",
        "baseName": "iterator",
        "type": "string",
        "format": ""
    },
    {
        "name": "prevIterator",
        "baseName": "prevIterator",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=ListResponseIntegrationOut.js.map


/***/ }),

/***/ 2505:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ListResponseMessageAttemptEndpointOut = void 0;
class ListResponseMessageAttemptEndpointOut {
    constructor(){}
    static getAttributeTypeMap() {
        return ListResponseMessageAttemptEndpointOut.attributeTypeMap;
    }
}
exports.ListResponseMessageAttemptEndpointOut = ListResponseMessageAttemptEndpointOut;
ListResponseMessageAttemptEndpointOut.discriminator = undefined;
ListResponseMessageAttemptEndpointOut.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "Array<MessageAttemptEndpointOut>",
        "format": ""
    },
    {
        "name": "done",
        "baseName": "done",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "iterator",
        "baseName": "iterator",
        "type": "string",
        "format": ""
    },
    {
        "name": "prevIterator",
        "baseName": "prevIterator",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=ListResponseMessageAttemptEndpointOut.js.map


/***/ }),

/***/ 49226:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ListResponseMessageAttemptOut = void 0;
class ListResponseMessageAttemptOut {
    constructor(){}
    static getAttributeTypeMap() {
        return ListResponseMessageAttemptOut.attributeTypeMap;
    }
}
exports.ListResponseMessageAttemptOut = ListResponseMessageAttemptOut;
ListResponseMessageAttemptOut.discriminator = undefined;
ListResponseMessageAttemptOut.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "Array<MessageAttemptOut>",
        "format": ""
    },
    {
        "name": "done",
        "baseName": "done",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "iterator",
        "baseName": "iterator",
        "type": "string",
        "format": ""
    },
    {
        "name": "prevIterator",
        "baseName": "prevIterator",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=ListResponseMessageAttemptOut.js.map


/***/ }),

/***/ 33286:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ListResponseMessageEndpointOut = void 0;
class ListResponseMessageEndpointOut {
    constructor(){}
    static getAttributeTypeMap() {
        return ListResponseMessageEndpointOut.attributeTypeMap;
    }
}
exports.ListResponseMessageEndpointOut = ListResponseMessageEndpointOut;
ListResponseMessageEndpointOut.discriminator = undefined;
ListResponseMessageEndpointOut.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "Array<MessageEndpointOut>",
        "format": ""
    },
    {
        "name": "done",
        "baseName": "done",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "iterator",
        "baseName": "iterator",
        "type": "string",
        "format": ""
    },
    {
        "name": "prevIterator",
        "baseName": "prevIterator",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=ListResponseMessageEndpointOut.js.map


/***/ }),

/***/ 1800:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ListResponseMessageOut = void 0;
class ListResponseMessageOut {
    constructor(){}
    static getAttributeTypeMap() {
        return ListResponseMessageOut.attributeTypeMap;
    }
}
exports.ListResponseMessageOut = ListResponseMessageOut;
ListResponseMessageOut.discriminator = undefined;
ListResponseMessageOut.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "Array<MessageOut>",
        "format": ""
    },
    {
        "name": "done",
        "baseName": "done",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "iterator",
        "baseName": "iterator",
        "type": "string",
        "format": ""
    },
    {
        "name": "prevIterator",
        "baseName": "prevIterator",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=ListResponseMessageOut.js.map


/***/ }),

/***/ 82594:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ListResponseTemplateOut = void 0;
class ListResponseTemplateOut {
    constructor(){}
    static getAttributeTypeMap() {
        return ListResponseTemplateOut.attributeTypeMap;
    }
}
exports.ListResponseTemplateOut = ListResponseTemplateOut;
ListResponseTemplateOut.discriminator = undefined;
ListResponseTemplateOut.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "Array<TemplateOut>",
        "format": ""
    },
    {
        "name": "done",
        "baseName": "done",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "iterator",
        "baseName": "iterator",
        "type": "string",
        "format": ""
    },
    {
        "name": "prevIterator",
        "baseName": "prevIterator",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=ListResponseTemplateOut.js.map


/***/ }),

/***/ 33167:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageAttemptEndpointOut = void 0;
class MessageAttemptEndpointOut {
    constructor(){}
    static getAttributeTypeMap() {
        return MessageAttemptEndpointOut.attributeTypeMap;
    }
}
exports.MessageAttemptEndpointOut = MessageAttemptEndpointOut;
MessageAttemptEndpointOut.discriminator = undefined;
MessageAttemptEndpointOut.attributeTypeMap = [
    {
        "name": "endpointId",
        "baseName": "endpointId",
        "type": "string",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "msgId",
        "baseName": "msgId",
        "type": "string",
        "format": ""
    },
    {
        "name": "response",
        "baseName": "response",
        "type": "string",
        "format": ""
    },
    {
        "name": "responseStatusCode",
        "baseName": "responseStatusCode",
        "type": "number",
        "format": "int16"
    },
    {
        "name": "status",
        "baseName": "status",
        "type": "MessageStatus",
        "format": ""
    },
    {
        "name": "timestamp",
        "baseName": "timestamp",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "triggerType",
        "baseName": "triggerType",
        "type": "MessageAttemptTriggerType",
        "format": ""
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "URI",
        "format": "uri"
    }
]; //# sourceMappingURL=MessageAttemptEndpointOut.js.map


/***/ }),

/***/ 42928:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageAttemptExhaustedEvent = void 0;
class MessageAttemptExhaustedEvent {
    constructor(){}
    static getAttributeTypeMap() {
        return MessageAttemptExhaustedEvent.attributeTypeMap;
    }
}
exports.MessageAttemptExhaustedEvent = MessageAttemptExhaustedEvent;
MessageAttemptExhaustedEvent.discriminator = undefined;
MessageAttemptExhaustedEvent.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "MessageAttemptExhaustedEventData",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "MessageAttemptExhaustedEventTypeEnum",
        "format": ""
    }
]; //# sourceMappingURL=MessageAttemptExhaustedEvent.js.map


/***/ }),

/***/ 93145:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageAttemptExhaustedEventData = void 0;
class MessageAttemptExhaustedEventData {
    constructor(){}
    static getAttributeTypeMap() {
        return MessageAttemptExhaustedEventData.attributeTypeMap;
    }
}
exports.MessageAttemptExhaustedEventData = MessageAttemptExhaustedEventData;
MessageAttemptExhaustedEventData.discriminator = undefined;
MessageAttemptExhaustedEventData.attributeTypeMap = [
    {
        "name": "appId",
        "baseName": "appId",
        "type": "string",
        "format": ""
    },
    {
        "name": "appUid",
        "baseName": "appUid",
        "type": "string",
        "format": ""
    },
    {
        "name": "endpointId",
        "baseName": "endpointId",
        "type": "string",
        "format": ""
    },
    {
        "name": "lastAttempt",
        "baseName": "lastAttempt",
        "type": "MessageAttemptFailedData",
        "format": ""
    },
    {
        "name": "msgEventId",
        "baseName": "msgEventId",
        "type": "string",
        "format": ""
    },
    {
        "name": "msgId",
        "baseName": "msgId",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=MessageAttemptExhaustedEventData.js.map


/***/ }),

/***/ 97348:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageAttemptFailedData = void 0;
class MessageAttemptFailedData {
    constructor(){}
    static getAttributeTypeMap() {
        return MessageAttemptFailedData.attributeTypeMap;
    }
}
exports.MessageAttemptFailedData = MessageAttemptFailedData;
MessageAttemptFailedData.discriminator = undefined;
MessageAttemptFailedData.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "responseStatusCode",
        "baseName": "responseStatusCode",
        "type": "number",
        "format": "int16"
    },
    {
        "name": "timestamp",
        "baseName": "timestamp",
        "type": "Date",
        "format": "date-time"
    }
]; //# sourceMappingURL=MessageAttemptFailedData.js.map


/***/ }),

/***/ 45611:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageAttemptFailingEvent = void 0;
class MessageAttemptFailingEvent {
    constructor(){}
    static getAttributeTypeMap() {
        return MessageAttemptFailingEvent.attributeTypeMap;
    }
}
exports.MessageAttemptFailingEvent = MessageAttemptFailingEvent;
MessageAttemptFailingEvent.discriminator = undefined;
MessageAttemptFailingEvent.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "MessageAttemptFailingEventData",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "MessageAttemptFailingEventTypeEnum",
        "format": ""
    }
]; //# sourceMappingURL=MessageAttemptFailingEvent.js.map


/***/ }),

/***/ 83282:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageAttemptFailingEventData = void 0;
class MessageAttemptFailingEventData {
    constructor(){}
    static getAttributeTypeMap() {
        return MessageAttemptFailingEventData.attributeTypeMap;
    }
}
exports.MessageAttemptFailingEventData = MessageAttemptFailingEventData;
MessageAttemptFailingEventData.discriminator = undefined;
MessageAttemptFailingEventData.attributeTypeMap = [
    {
        "name": "appId",
        "baseName": "appId",
        "type": "string",
        "format": ""
    },
    {
        "name": "appUid",
        "baseName": "appUid",
        "type": "string",
        "format": ""
    },
    {
        "name": "endpointId",
        "baseName": "endpointId",
        "type": "string",
        "format": ""
    },
    {
        "name": "lastAttempt",
        "baseName": "lastAttempt",
        "type": "MessageAttemptFailedData",
        "format": ""
    },
    {
        "name": "msgEventId",
        "baseName": "msgEventId",
        "type": "string",
        "format": ""
    },
    {
        "name": "msgId",
        "baseName": "msgId",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=MessageAttemptFailingEventData.js.map


/***/ }),

/***/ 55495:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageAttemptHeadersOut = void 0;
class MessageAttemptHeadersOut {
    constructor(){}
    static getAttributeTypeMap() {
        return MessageAttemptHeadersOut.attributeTypeMap;
    }
}
exports.MessageAttemptHeadersOut = MessageAttemptHeadersOut;
MessageAttemptHeadersOut.discriminator = undefined;
MessageAttemptHeadersOut.attributeTypeMap = [
    {
        "name": "sensitive",
        "baseName": "sensitive",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "sentHeaders",
        "baseName": "sentHeaders",
        "type": "{ [key: string]: string; }",
        "format": ""
    }
]; //# sourceMappingURL=MessageAttemptHeadersOut.js.map


/***/ }),

/***/ 61835:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageAttemptOut = void 0;
class MessageAttemptOut {
    constructor(){}
    static getAttributeTypeMap() {
        return MessageAttemptOut.attributeTypeMap;
    }
}
exports.MessageAttemptOut = MessageAttemptOut;
MessageAttemptOut.discriminator = undefined;
MessageAttemptOut.attributeTypeMap = [
    {
        "name": "endpointId",
        "baseName": "endpointId",
        "type": "string",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "msgId",
        "baseName": "msgId",
        "type": "string",
        "format": ""
    },
    {
        "name": "response",
        "baseName": "response",
        "type": "string",
        "format": ""
    },
    {
        "name": "responseStatusCode",
        "baseName": "responseStatusCode",
        "type": "number",
        "format": "int16"
    },
    {
        "name": "status",
        "baseName": "status",
        "type": "MessageStatus",
        "format": ""
    },
    {
        "name": "timestamp",
        "baseName": "timestamp",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "triggerType",
        "baseName": "triggerType",
        "type": "MessageAttemptTriggerType",
        "format": ""
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "URI",
        "format": "uri"
    }
]; //# sourceMappingURL=MessageAttemptOut.js.map


/***/ }),

/***/ 41459:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageAttemptRecoveredEvent = void 0;
class MessageAttemptRecoveredEvent {
    constructor(){}
    static getAttributeTypeMap() {
        return MessageAttemptRecoveredEvent.attributeTypeMap;
    }
}
exports.MessageAttemptRecoveredEvent = MessageAttemptRecoveredEvent;
MessageAttemptRecoveredEvent.discriminator = undefined;
MessageAttemptRecoveredEvent.attributeTypeMap = [
    {
        "name": "data",
        "baseName": "data",
        "type": "MessageAttemptRecoveredEventData",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "MessageAttemptRecoveredEventTypeEnum",
        "format": ""
    }
]; //# sourceMappingURL=MessageAttemptRecoveredEvent.js.map


/***/ }),

/***/ 27072:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageAttemptRecoveredEventData = void 0;
class MessageAttemptRecoveredEventData {
    constructor(){}
    static getAttributeTypeMap() {
        return MessageAttemptRecoveredEventData.attributeTypeMap;
    }
}
exports.MessageAttemptRecoveredEventData = MessageAttemptRecoveredEventData;
MessageAttemptRecoveredEventData.discriminator = undefined;
MessageAttemptRecoveredEventData.attributeTypeMap = [
    {
        "name": "appId",
        "baseName": "appId",
        "type": "string",
        "format": ""
    },
    {
        "name": "appUid",
        "baseName": "appUid",
        "type": "string",
        "format": ""
    },
    {
        "name": "endpointId",
        "baseName": "endpointId",
        "type": "string",
        "format": ""
    },
    {
        "name": "lastAttempt",
        "baseName": "lastAttempt",
        "type": "MessageAttemptFailedData",
        "format": ""
    },
    {
        "name": "msgEventId",
        "baseName": "msgEventId",
        "type": "string",
        "format": ""
    },
    {
        "name": "msgId",
        "baseName": "msgId",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=MessageAttemptRecoveredEventData.js.map


/***/ }),

/***/ 6200:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=MessageAttemptTriggerType.js.map


/***/ }),

/***/ 22346:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageBroadcastIn = void 0;
class MessageBroadcastIn {
    constructor(){}
    static getAttributeTypeMap() {
        return MessageBroadcastIn.attributeTypeMap;
    }
}
exports.MessageBroadcastIn = MessageBroadcastIn;
MessageBroadcastIn.discriminator = undefined;
MessageBroadcastIn.attributeTypeMap = [
    {
        "name": "channels",
        "baseName": "channels",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "eventId",
        "baseName": "eventId",
        "type": "string",
        "format": ""
    },
    {
        "name": "eventType",
        "baseName": "eventType",
        "type": "string",
        "format": ""
    },
    {
        "name": "payload",
        "baseName": "payload",
        "type": "any",
        "format": ""
    },
    {
        "name": "payloadRetentionPeriod",
        "baseName": "payloadRetentionPeriod",
        "type": "number",
        "format": "int64"
    }
]; //# sourceMappingURL=MessageBroadcastIn.js.map


/***/ }),

/***/ 19480:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageBroadcastOut = void 0;
class MessageBroadcastOut {
    constructor(){}
    static getAttributeTypeMap() {
        return MessageBroadcastOut.attributeTypeMap;
    }
}
exports.MessageBroadcastOut = MessageBroadcastOut;
MessageBroadcastOut.discriminator = undefined;
MessageBroadcastOut.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "status",
        "baseName": "status",
        "type": "BackgroundTaskStatus",
        "format": ""
    },
    {
        "name": "task",
        "baseName": "task",
        "type": "BackgroundTaskType",
        "format": ""
    }
]; //# sourceMappingURL=MessageBroadcastOut.js.map


/***/ }),

/***/ 92186:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageEndpointOut = void 0;
class MessageEndpointOut {
    constructor(){}
    static getAttributeTypeMap() {
        return MessageEndpointOut.attributeTypeMap;
    }
}
exports.MessageEndpointOut = MessageEndpointOut;
MessageEndpointOut.discriminator = undefined;
MessageEndpointOut.attributeTypeMap = [
    {
        "name": "channels",
        "baseName": "channels",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "description",
        "baseName": "description",
        "type": "string",
        "format": ""
    },
    {
        "name": "disabled",
        "baseName": "disabled",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "filterTypes",
        "baseName": "filterTypes",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "nextAttempt",
        "baseName": "nextAttempt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "rateLimit",
        "baseName": "rateLimit",
        "type": "number",
        "format": "uint16"
    },
    {
        "name": "status",
        "baseName": "status",
        "type": "MessageStatus",
        "format": ""
    },
    {
        "name": "uid",
        "baseName": "uid",
        "type": "string",
        "format": ""
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "URI",
        "format": "uri"
    },
    {
        "name": "version",
        "baseName": "version",
        "type": "number",
        "format": "int32"
    }
]; //# sourceMappingURL=MessageEndpointOut.js.map


/***/ }),

/***/ 98528:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageIn = void 0;
class MessageIn {
    constructor(){}
    static getAttributeTypeMap() {
        return MessageIn.attributeTypeMap;
    }
}
exports.MessageIn = MessageIn;
MessageIn.discriminator = undefined;
MessageIn.attributeTypeMap = [
    {
        "name": "application",
        "baseName": "application",
        "type": "ApplicationIn",
        "format": ""
    },
    {
        "name": "channels",
        "baseName": "channels",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "eventId",
        "baseName": "eventId",
        "type": "string",
        "format": ""
    },
    {
        "name": "eventType",
        "baseName": "eventType",
        "type": "string",
        "format": ""
    },
    {
        "name": "payload",
        "baseName": "payload",
        "type": "any",
        "format": ""
    },
    {
        "name": "payloadRetentionPeriod",
        "baseName": "payloadRetentionPeriod",
        "type": "number",
        "format": "int64"
    }
]; //# sourceMappingURL=MessageIn.js.map


/***/ }),

/***/ 61586:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageOut = void 0;
class MessageOut {
    constructor(){}
    static getAttributeTypeMap() {
        return MessageOut.attributeTypeMap;
    }
}
exports.MessageOut = MessageOut;
MessageOut.discriminator = undefined;
MessageOut.attributeTypeMap = [
    {
        "name": "channels",
        "baseName": "channels",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "eventId",
        "baseName": "eventId",
        "type": "string",
        "format": ""
    },
    {
        "name": "eventType",
        "baseName": "eventType",
        "type": "string",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "payload",
        "baseName": "payload",
        "type": "any",
        "format": ""
    },
    {
        "name": "timestamp",
        "baseName": "timestamp",
        "type": "Date",
        "format": "date-time"
    }
]; //# sourceMappingURL=MessageOut.js.map


/***/ }),

/***/ 20015:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageRawPayloadOut = void 0;
class MessageRawPayloadOut {
    constructor(){}
    static getAttributeTypeMap() {
        return MessageRawPayloadOut.attributeTypeMap;
    }
}
exports.MessageRawPayloadOut = MessageRawPayloadOut;
MessageRawPayloadOut.discriminator = undefined;
MessageRawPayloadOut.attributeTypeMap = [
    {
        "name": "payload",
        "baseName": "payload",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=MessageRawPayloadOut.js.map


/***/ }),

/***/ 66737:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.MessageStatus = void 0;
var MessageStatus;
(function(MessageStatus) {
    MessageStatus[MessageStatus["Success"] = 0] = "Success";
    MessageStatus[MessageStatus["Pending"] = 1] = "Pending";
    MessageStatus[MessageStatus["Fail"] = 2] = "Fail";
    MessageStatus[MessageStatus["Sending"] = 3] = "Sending";
})(MessageStatus = exports.MessageStatus || (exports.MessageStatus = {}));
; //# sourceMappingURL=MessageStatus.js.map


/***/ }),

/***/ 70309:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __createBinding = (void 0) && (void 0).__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = (void 0) && (void 0).__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !exports1.hasOwnProperty(p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ObjectSerializer = void 0;
__exportStar(__webpack_require__(21230), exports);
__exportStar(__webpack_require__(92514), exports);
__exportStar(__webpack_require__(89144), exports);
__exportStar(__webpack_require__(68441), exports);
__exportStar(__webpack_require__(25987), exports);
__exportStar(__webpack_require__(72123), exports);
__exportStar(__webpack_require__(38232), exports);
__exportStar(__webpack_require__(82305), exports);
__exportStar(__webpack_require__(46225), exports);
__exportStar(__webpack_require__(17015), exports);
__exportStar(__webpack_require__(88858), exports);
__exportStar(__webpack_require__(82247), exports);
__exportStar(__webpack_require__(93916), exports);
__exportStar(__webpack_require__(99054), exports);
__exportStar(__webpack_require__(4364), exports);
__exportStar(__webpack_require__(43392), exports);
__exportStar(__webpack_require__(7383), exports);
__exportStar(__webpack_require__(90846), exports);
__exportStar(__webpack_require__(75870), exports);
__exportStar(__webpack_require__(89724), exports);
__exportStar(__webpack_require__(64406), exports);
__exportStar(__webpack_require__(79998), exports);
__exportStar(__webpack_require__(72718), exports);
__exportStar(__webpack_require__(94065), exports);
__exportStar(__webpack_require__(92053), exports);
__exportStar(__webpack_require__(36888), exports);
__exportStar(__webpack_require__(80033), exports);
__exportStar(__webpack_require__(74661), exports);
__exportStar(__webpack_require__(19728), exports);
__exportStar(__webpack_require__(84545), exports);
__exportStar(__webpack_require__(89895), exports);
__exportStar(__webpack_require__(69920), exports);
__exportStar(__webpack_require__(8396), exports);
__exportStar(__webpack_require__(27546), exports);
__exportStar(__webpack_require__(3139), exports);
__exportStar(__webpack_require__(14020), exports);
__exportStar(__webpack_require__(66945), exports);
__exportStar(__webpack_require__(67388), exports);
__exportStar(__webpack_require__(97588), exports);
__exportStar(__webpack_require__(26742), exports);
__exportStar(__webpack_require__(19564), exports);
__exportStar(__webpack_require__(2979), exports);
__exportStar(__webpack_require__(14702), exports);
__exportStar(__webpack_require__(24817), exports);
__exportStar(__webpack_require__(97070), exports);
__exportStar(__webpack_require__(12872), exports);
__exportStar(__webpack_require__(64143), exports);
__exportStar(__webpack_require__(76224), exports);
__exportStar(__webpack_require__(32218), exports);
__exportStar(__webpack_require__(84757), exports);
__exportStar(__webpack_require__(40838), exports);
__exportStar(__webpack_require__(77334), exports);
__exportStar(__webpack_require__(71771), exports);
__exportStar(__webpack_require__(29634), exports);
__exportStar(__webpack_require__(36864), exports);
__exportStar(__webpack_require__(84813), exports);
__exportStar(__webpack_require__(48673), exports);
__exportStar(__webpack_require__(54017), exports);
__exportStar(__webpack_require__(85712), exports);
__exportStar(__webpack_require__(3570), exports);
__exportStar(__webpack_require__(10890), exports);
__exportStar(__webpack_require__(96125), exports);
__exportStar(__webpack_require__(13502), exports);
__exportStar(__webpack_require__(5178), exports);
__exportStar(__webpack_require__(77035), exports);
__exportStar(__webpack_require__(22955), exports);
__exportStar(__webpack_require__(44378), exports);
__exportStar(__webpack_require__(45801), exports);
__exportStar(__webpack_require__(70725), exports);
__exportStar(__webpack_require__(2505), exports);
__exportStar(__webpack_require__(49226), exports);
__exportStar(__webpack_require__(33286), exports);
__exportStar(__webpack_require__(1800), exports);
__exportStar(__webpack_require__(82594), exports);
__exportStar(__webpack_require__(33167), exports);
__exportStar(__webpack_require__(42928), exports);
__exportStar(__webpack_require__(93145), exports);
__exportStar(__webpack_require__(97348), exports);
__exportStar(__webpack_require__(45611), exports);
__exportStar(__webpack_require__(83282), exports);
__exportStar(__webpack_require__(55495), exports);
__exportStar(__webpack_require__(61835), exports);
__exportStar(__webpack_require__(41459), exports);
__exportStar(__webpack_require__(27072), exports);
__exportStar(__webpack_require__(6200), exports);
__exportStar(__webpack_require__(22346), exports);
__exportStar(__webpack_require__(19480), exports);
__exportStar(__webpack_require__(92186), exports);
__exportStar(__webpack_require__(98528), exports);
__exportStar(__webpack_require__(61586), exports);
__exportStar(__webpack_require__(20015), exports);
__exportStar(__webpack_require__(66737), exports);
__exportStar(__webpack_require__(42235), exports);
__exportStar(__webpack_require__(94103), exports);
__exportStar(__webpack_require__(85950), exports);
__exportStar(__webpack_require__(14985), exports);
__exportStar(__webpack_require__(13165), exports);
__exportStar(__webpack_require__(99515), exports);
__exportStar(__webpack_require__(84336), exports);
__exportStar(__webpack_require__(38388), exports);
__exportStar(__webpack_require__(90006), exports);
__exportStar(__webpack_require__(56929), exports);
__exportStar(__webpack_require__(50279), exports);
__exportStar(__webpack_require__(90478), exports);
__exportStar(__webpack_require__(8778), exports);
__exportStar(__webpack_require__(13164), exports);
__exportStar(__webpack_require__(9300), exports);
__exportStar(__webpack_require__(99865), exports);
__exportStar(__webpack_require__(54480), exports);
__exportStar(__webpack_require__(11140), exports);
__exportStar(__webpack_require__(57568), exports);
__exportStar(__webpack_require__(38767), exports);
const AppPortalAccessIn_1 = __webpack_require__(21230);
const AppPortalAccessOut_1 = __webpack_require__(92514);
const AppUsageStatsIn_1 = __webpack_require__(89144);
const AppUsageStatsOut_1 = __webpack_require__(68441);
const ApplicationIn_1 = __webpack_require__(25987);
const ApplicationOut_1 = __webpack_require__(72123);
const ApplicationPatch_1 = __webpack_require__(38232);
const ApplicationStats_1 = __webpack_require__(82305);
const ApplicationTokenExpireIn_1 = __webpack_require__(46225);
const AttemptStatisticsData_1 = __webpack_require__(17015);
const AttemptStatisticsResponse_1 = __webpack_require__(88858);
const BackgroundTaskOut_1 = __webpack_require__(82247);
const BorderRadiusConfig_1 = __webpack_require__(4364);
const CustomColorPalette_1 = __webpack_require__(7383);
const CustomThemeOverride_1 = __webpack_require__(90846);
const DashboardAccessOut_1 = __webpack_require__(75870);
const EndpointCreatedEvent_1 = __webpack_require__(89724);
const EndpointCreatedEventData_1 = __webpack_require__(64406);
const EndpointDeletedEvent_1 = __webpack_require__(79998);
const EndpointDeletedEventData_1 = __webpack_require__(72718);
const EndpointDisabledEvent_1 = __webpack_require__(94065);
const EndpointDisabledEventData_1 = __webpack_require__(92053);
const EndpointHeadersIn_1 = __webpack_require__(36888);
const EndpointHeadersOut_1 = __webpack_require__(80033);
const EndpointHeadersPatchIn_1 = __webpack_require__(74661);
const EndpointIn_1 = __webpack_require__(19728);
const EndpointMessageOut_1 = __webpack_require__(84545);
const EndpointOut_1 = __webpack_require__(89895);
const EndpointPatch_1 = __webpack_require__(69920);
const EndpointSecretOut_1 = __webpack_require__(8396);
const EndpointSecretRotateIn_1 = __webpack_require__(27546);
const EndpointStats_1 = __webpack_require__(3139);
const EndpointTransformationIn_1 = __webpack_require__(14020);
const EndpointTransformationOut_1 = __webpack_require__(66945);
const EndpointTransformationSimulateIn_1 = __webpack_require__(67388);
const EndpointTransformationSimulateOut_1 = __webpack_require__(97588);
const EndpointUpdate_1 = __webpack_require__(26742);
const EndpointUpdatedEvent_1 = __webpack_require__(19564);
const EndpointUpdatedEventData_1 = __webpack_require__(2979);
const EnvironmentIn_1 = __webpack_require__(14702);
const EnvironmentOut_1 = __webpack_require__(24817);
const EnvironmentSettingsOut_1 = __webpack_require__(97070);
const EventExampleIn_1 = __webpack_require__(12872);
const EventTypeExampleOut_1 = __webpack_require__(64143);
const EventTypeImportOpenApiIn_1 = __webpack_require__(76224);
const EventTypeImportOpenApiOut_1 = __webpack_require__(32218);
const EventTypeImportOpenApiOutData_1 = __webpack_require__(84757);
const EventTypeIn_1 = __webpack_require__(40838);
const EventTypeOut_1 = __webpack_require__(77334);
const EventTypePatch_1 = __webpack_require__(71771);
const EventTypeSchemaIn_1 = __webpack_require__(29634);
const EventTypeUpdate_1 = __webpack_require__(36864);
const FontSizeConfig_1 = __webpack_require__(84813);
const HTTPValidationError_1 = __webpack_require__(48673);
const HttpErrorOut_1 = __webpack_require__(54017);
const IntegrationIn_1 = __webpack_require__(85712);
const IntegrationKeyOut_1 = __webpack_require__(3570);
const IntegrationOut_1 = __webpack_require__(10890);
const IntegrationUpdate_1 = __webpack_require__(96125);
const ListResponseApplicationOut_1 = __webpack_require__(13502);
const ListResponseApplicationStats_1 = __webpack_require__(5178);
const ListResponseBackgroundTaskOut_1 = __webpack_require__(77035);
const ListResponseEndpointMessageOut_1 = __webpack_require__(22955);
const ListResponseEndpointOut_1 = __webpack_require__(44378);
const ListResponseEventTypeOut_1 = __webpack_require__(45801);
const ListResponseIntegrationOut_1 = __webpack_require__(70725);
const ListResponseMessageAttemptEndpointOut_1 = __webpack_require__(2505);
const ListResponseMessageAttemptOut_1 = __webpack_require__(49226);
const ListResponseMessageEndpointOut_1 = __webpack_require__(33286);
const ListResponseMessageOut_1 = __webpack_require__(1800);
const ListResponseTemplateOut_1 = __webpack_require__(82594);
const MessageAttemptEndpointOut_1 = __webpack_require__(33167);
const MessageAttemptExhaustedEvent_1 = __webpack_require__(42928);
const MessageAttemptExhaustedEventData_1 = __webpack_require__(93145);
const MessageAttemptFailedData_1 = __webpack_require__(97348);
const MessageAttemptFailingEvent_1 = __webpack_require__(45611);
const MessageAttemptFailingEventData_1 = __webpack_require__(83282);
const MessageAttemptHeadersOut_1 = __webpack_require__(55495);
const MessageAttemptOut_1 = __webpack_require__(61835);
const MessageAttemptRecoveredEvent_1 = __webpack_require__(41459);
const MessageAttemptRecoveredEventData_1 = __webpack_require__(27072);
const MessageBroadcastIn_1 = __webpack_require__(22346);
const MessageBroadcastOut_1 = __webpack_require__(19480);
const MessageEndpointOut_1 = __webpack_require__(92186);
const MessageIn_1 = __webpack_require__(98528);
const MessageOut_1 = __webpack_require__(61586);
const MessageRawPayloadOut_1 = __webpack_require__(20015);
const OneTimeTokenIn_1 = __webpack_require__(42235);
const OneTimeTokenOut_1 = __webpack_require__(94103);
const RecoverIn_1 = __webpack_require__(14985);
const RecoverOut_1 = __webpack_require__(13165);
const ReplayIn_1 = __webpack_require__(99515);
const ReplayOut_1 = __webpack_require__(84336);
const SettingsIn_1 = __webpack_require__(38388);
const SettingsOut_1 = __webpack_require__(90006);
const TemplateIn_1 = __webpack_require__(90478);
const TemplateOut_1 = __webpack_require__(8778);
const TemplatePatch_1 = __webpack_require__(13164);
const TemplateUpdate_1 = __webpack_require__(9300);
const TransformationSimulateIn_1 = __webpack_require__(54480);
const TransformationSimulateOut_1 = __webpack_require__(11140);
const ValidationError_1 = __webpack_require__(38767);
let primitives = [
    "string",
    "boolean",
    "double",
    "integer",
    "long",
    "float",
    "number",
    "any"
];
const supportedMediaTypes = {
    "application/json": Infinity,
    "application/octet-stream": 0
};
let enumsMap = new Set([
    "BackgroundTaskStatus",
    "BackgroundTaskType",
    "BorderRadiusEnum",
    "EndpointCreatedEventTypeEnum",
    "EndpointDeletedEventTypeEnum",
    "EndpointDisabledEventTypeEnum",
    "EndpointUpdatedEventTypeEnum",
    "MessageAttemptExhaustedEventTypeEnum",
    "MessageAttemptFailingEventTypeEnum",
    "MessageAttemptRecoveredEventTypeEnum",
    "MessageAttemptTriggerType",
    "MessageStatus",
    "Ordering",
    "StatisticsPeriod",
    "StatusCodeClass",
    "TransformationHttpMethod",
    "TransformationTemplateKind"
]);
let typeMap = {
    "AppPortalAccessIn": AppPortalAccessIn_1.AppPortalAccessIn,
    "AppPortalAccessOut": AppPortalAccessOut_1.AppPortalAccessOut,
    "AppUsageStatsIn": AppUsageStatsIn_1.AppUsageStatsIn,
    "AppUsageStatsOut": AppUsageStatsOut_1.AppUsageStatsOut,
    "ApplicationIn": ApplicationIn_1.ApplicationIn,
    "ApplicationOut": ApplicationOut_1.ApplicationOut,
    "ApplicationPatch": ApplicationPatch_1.ApplicationPatch,
    "ApplicationStats": ApplicationStats_1.ApplicationStats,
    "ApplicationTokenExpireIn": ApplicationTokenExpireIn_1.ApplicationTokenExpireIn,
    "AttemptStatisticsData": AttemptStatisticsData_1.AttemptStatisticsData,
    "AttemptStatisticsResponse": AttemptStatisticsResponse_1.AttemptStatisticsResponse,
    "BackgroundTaskOut": BackgroundTaskOut_1.BackgroundTaskOut,
    "BorderRadiusConfig": BorderRadiusConfig_1.BorderRadiusConfig,
    "CustomColorPalette": CustomColorPalette_1.CustomColorPalette,
    "CustomThemeOverride": CustomThemeOverride_1.CustomThemeOverride,
    "DashboardAccessOut": DashboardAccessOut_1.DashboardAccessOut,
    "EndpointCreatedEvent": EndpointCreatedEvent_1.EndpointCreatedEvent,
    "EndpointCreatedEventData": EndpointCreatedEventData_1.EndpointCreatedEventData,
    "EndpointDeletedEvent": EndpointDeletedEvent_1.EndpointDeletedEvent,
    "EndpointDeletedEventData": EndpointDeletedEventData_1.EndpointDeletedEventData,
    "EndpointDisabledEvent": EndpointDisabledEvent_1.EndpointDisabledEvent,
    "EndpointDisabledEventData": EndpointDisabledEventData_1.EndpointDisabledEventData,
    "EndpointHeadersIn": EndpointHeadersIn_1.EndpointHeadersIn,
    "EndpointHeadersOut": EndpointHeadersOut_1.EndpointHeadersOut,
    "EndpointHeadersPatchIn": EndpointHeadersPatchIn_1.EndpointHeadersPatchIn,
    "EndpointIn": EndpointIn_1.EndpointIn,
    "EndpointMessageOut": EndpointMessageOut_1.EndpointMessageOut,
    "EndpointOut": EndpointOut_1.EndpointOut,
    "EndpointPatch": EndpointPatch_1.EndpointPatch,
    "EndpointSecretOut": EndpointSecretOut_1.EndpointSecretOut,
    "EndpointSecretRotateIn": EndpointSecretRotateIn_1.EndpointSecretRotateIn,
    "EndpointStats": EndpointStats_1.EndpointStats,
    "EndpointTransformationIn": EndpointTransformationIn_1.EndpointTransformationIn,
    "EndpointTransformationOut": EndpointTransformationOut_1.EndpointTransformationOut,
    "EndpointTransformationSimulateIn": EndpointTransformationSimulateIn_1.EndpointTransformationSimulateIn,
    "EndpointTransformationSimulateOut": EndpointTransformationSimulateOut_1.EndpointTransformationSimulateOut,
    "EndpointUpdate": EndpointUpdate_1.EndpointUpdate,
    "EndpointUpdatedEvent": EndpointUpdatedEvent_1.EndpointUpdatedEvent,
    "EndpointUpdatedEventData": EndpointUpdatedEventData_1.EndpointUpdatedEventData,
    "EnvironmentIn": EnvironmentIn_1.EnvironmentIn,
    "EnvironmentOut": EnvironmentOut_1.EnvironmentOut,
    "EnvironmentSettingsOut": EnvironmentSettingsOut_1.EnvironmentSettingsOut,
    "EventExampleIn": EventExampleIn_1.EventExampleIn,
    "EventTypeExampleOut": EventTypeExampleOut_1.EventTypeExampleOut,
    "EventTypeImportOpenApiIn": EventTypeImportOpenApiIn_1.EventTypeImportOpenApiIn,
    "EventTypeImportOpenApiOut": EventTypeImportOpenApiOut_1.EventTypeImportOpenApiOut,
    "EventTypeImportOpenApiOutData": EventTypeImportOpenApiOutData_1.EventTypeImportOpenApiOutData,
    "EventTypeIn": EventTypeIn_1.EventTypeIn,
    "EventTypeOut": EventTypeOut_1.EventTypeOut,
    "EventTypePatch": EventTypePatch_1.EventTypePatch,
    "EventTypeSchemaIn": EventTypeSchemaIn_1.EventTypeSchemaIn,
    "EventTypeUpdate": EventTypeUpdate_1.EventTypeUpdate,
    "FontSizeConfig": FontSizeConfig_1.FontSizeConfig,
    "HTTPValidationError": HTTPValidationError_1.HTTPValidationError,
    "HttpErrorOut": HttpErrorOut_1.HttpErrorOut,
    "IntegrationIn": IntegrationIn_1.IntegrationIn,
    "IntegrationKeyOut": IntegrationKeyOut_1.IntegrationKeyOut,
    "IntegrationOut": IntegrationOut_1.IntegrationOut,
    "IntegrationUpdate": IntegrationUpdate_1.IntegrationUpdate,
    "ListResponseApplicationOut": ListResponseApplicationOut_1.ListResponseApplicationOut,
    "ListResponseApplicationStats": ListResponseApplicationStats_1.ListResponseApplicationStats,
    "ListResponseBackgroundTaskOut": ListResponseBackgroundTaskOut_1.ListResponseBackgroundTaskOut,
    "ListResponseEndpointMessageOut": ListResponseEndpointMessageOut_1.ListResponseEndpointMessageOut,
    "ListResponseEndpointOut": ListResponseEndpointOut_1.ListResponseEndpointOut,
    "ListResponseEventTypeOut": ListResponseEventTypeOut_1.ListResponseEventTypeOut,
    "ListResponseIntegrationOut": ListResponseIntegrationOut_1.ListResponseIntegrationOut,
    "ListResponseMessageAttemptEndpointOut": ListResponseMessageAttemptEndpointOut_1.ListResponseMessageAttemptEndpointOut,
    "ListResponseMessageAttemptOut": ListResponseMessageAttemptOut_1.ListResponseMessageAttemptOut,
    "ListResponseMessageEndpointOut": ListResponseMessageEndpointOut_1.ListResponseMessageEndpointOut,
    "ListResponseMessageOut": ListResponseMessageOut_1.ListResponseMessageOut,
    "ListResponseTemplateOut": ListResponseTemplateOut_1.ListResponseTemplateOut,
    "MessageAttemptEndpointOut": MessageAttemptEndpointOut_1.MessageAttemptEndpointOut,
    "MessageAttemptExhaustedEvent": MessageAttemptExhaustedEvent_1.MessageAttemptExhaustedEvent,
    "MessageAttemptExhaustedEventData": MessageAttemptExhaustedEventData_1.MessageAttemptExhaustedEventData,
    "MessageAttemptFailedData": MessageAttemptFailedData_1.MessageAttemptFailedData,
    "MessageAttemptFailingEvent": MessageAttemptFailingEvent_1.MessageAttemptFailingEvent,
    "MessageAttemptFailingEventData": MessageAttemptFailingEventData_1.MessageAttemptFailingEventData,
    "MessageAttemptHeadersOut": MessageAttemptHeadersOut_1.MessageAttemptHeadersOut,
    "MessageAttemptOut": MessageAttemptOut_1.MessageAttemptOut,
    "MessageAttemptRecoveredEvent": MessageAttemptRecoveredEvent_1.MessageAttemptRecoveredEvent,
    "MessageAttemptRecoveredEventData": MessageAttemptRecoveredEventData_1.MessageAttemptRecoveredEventData,
    "MessageBroadcastIn": MessageBroadcastIn_1.MessageBroadcastIn,
    "MessageBroadcastOut": MessageBroadcastOut_1.MessageBroadcastOut,
    "MessageEndpointOut": MessageEndpointOut_1.MessageEndpointOut,
    "MessageIn": MessageIn_1.MessageIn,
    "MessageOut": MessageOut_1.MessageOut,
    "MessageRawPayloadOut": MessageRawPayloadOut_1.MessageRawPayloadOut,
    "OneTimeTokenIn": OneTimeTokenIn_1.OneTimeTokenIn,
    "OneTimeTokenOut": OneTimeTokenOut_1.OneTimeTokenOut,
    "RecoverIn": RecoverIn_1.RecoverIn,
    "RecoverOut": RecoverOut_1.RecoverOut,
    "ReplayIn": ReplayIn_1.ReplayIn,
    "ReplayOut": ReplayOut_1.ReplayOut,
    "SettingsIn": SettingsIn_1.SettingsIn,
    "SettingsOut": SettingsOut_1.SettingsOut,
    "TemplateIn": TemplateIn_1.TemplateIn,
    "TemplateOut": TemplateOut_1.TemplateOut,
    "TemplatePatch": TemplatePatch_1.TemplatePatch,
    "TemplateUpdate": TemplateUpdate_1.TemplateUpdate,
    "TransformationSimulateIn": TransformationSimulateIn_1.TransformationSimulateIn,
    "TransformationSimulateOut": TransformationSimulateOut_1.TransformationSimulateOut,
    "ValidationError": ValidationError_1.ValidationError
};
class ObjectSerializer {
    static findCorrectType(data, expectedType) {
        if (data == undefined) {
            return expectedType;
        } else if (primitives.indexOf(expectedType.toLowerCase()) !== -1) {
            return expectedType;
        } else if (expectedType === "Date") {
            return expectedType;
        } else {
            if (enumsMap.has(expectedType)) {
                return expectedType;
            }
            if (!typeMap[expectedType]) {
                return expectedType;
            }
            let discriminatorProperty = typeMap[expectedType].discriminator;
            if (discriminatorProperty == null) {
                return expectedType;
            } else {
                if (data[discriminatorProperty]) {
                    var discriminatorType = data[discriminatorProperty];
                    if (typeMap[discriminatorType]) {
                        return discriminatorType;
                    } else {
                        return expectedType;
                    }
                } else {
                    return expectedType;
                }
            }
        }
    }
    static serialize(data, type, format) {
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (type.lastIndexOf("Array<", 0) === 0) {
            let subType = type.replace("Array<", "");
            subType = subType.substring(0, subType.length - 1);
            let transformedData = [];
            for(let index in data){
                let date = data[index];
                transformedData.push(ObjectSerializer.serialize(date, subType, format));
            }
            return transformedData;
        } else if (type === "Date") {
            if (format == "date") {
                let month = data.getMonth() + 1;
                month = month < 10 ? "0" + month.toString() : month.toString();
                let day = data.getDate();
                day = day < 10 ? "0" + day.toString() : day.toString();
                return data.getFullYear() + "-" + month + "-" + day;
            } else {
                return data.toISOString();
            }
        } else {
            if (enumsMap.has(type)) {
                return data;
            }
            if (!typeMap[type]) {
                return data;
            }
            type = this.findCorrectType(data, type);
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            let instance = {};
            for(let index in attributeTypes){
                let attributeType = attributeTypes[index];
                instance[attributeType.baseName] = ObjectSerializer.serialize(data[attributeType.name], attributeType.type, attributeType.format);
            }
            return instance;
        }
    }
    static deserialize(data, type, format) {
        type = ObjectSerializer.findCorrectType(data, type);
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (type.lastIndexOf("Array<", 0) === 0) {
            let subType = type.replace("Array<", "");
            subType = subType.substring(0, subType.length - 1);
            let transformedData = [];
            for(let index in data){
                let date = data[index];
                transformedData.push(ObjectSerializer.deserialize(date, subType, format));
            }
            return transformedData;
        } else if (type === "Date") {
            return new Date(data);
        } else {
            if (enumsMap.has(type)) {
                return data;
            }
            if (!typeMap[type]) {
                return data;
            }
            let instance = new typeMap[type]();
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            for(let index in attributeTypes){
                let attributeType = attributeTypes[index];
                instance[attributeType.name] = ObjectSerializer.deserialize(data[attributeType.baseName], attributeType.type, attributeType.format);
            }
            return instance;
        }
    }
    static normalizeMediaType(mediaType) {
        if (mediaType === undefined) {
            return undefined;
        }
        return mediaType.split(";")[0].trim().toLowerCase();
    }
    static getPreferredMediaType(mediaTypes) {
        if (!mediaTypes) {
            return "application/json";
        }
        const normalMediaTypes = mediaTypes.map(this.normalizeMediaType);
        let selectedMediaType = undefined;
        let selectedRank = -Infinity;
        for (const mediaType of normalMediaTypes){
            if (supportedMediaTypes[mediaType] > selectedRank) {
                selectedMediaType = mediaType;
                selectedRank = supportedMediaTypes[mediaType];
            }
        }
        if (selectedMediaType === undefined) {
            throw new Error("None of the given media types are supported: " + mediaTypes.join(", "));
        }
        return selectedMediaType;
    }
    static stringify(data, mediaType) {
        if (mediaType === "application/json") {
            return JSON.stringify(data);
        }
        throw new Error("The mediaType " + mediaType + " is not supported by ObjectSerializer.stringify.");
    }
    static parse(rawData, mediaType) {
        if (mediaType === undefined) {
            throw new Error("Cannot parse content. No Content-Type defined.");
        }
        if (mediaType === "application/json") {
            return JSON.parse(rawData);
        }
        throw new Error("The mediaType " + mediaType + " is not supported by ObjectSerializer.parse.");
    }
}
exports.ObjectSerializer = ObjectSerializer; //# sourceMappingURL=ObjectSerializer.js.map


/***/ }),

/***/ 42235:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.OneTimeTokenIn = void 0;
class OneTimeTokenIn {
    constructor(){}
    static getAttributeTypeMap() {
        return OneTimeTokenIn.attributeTypeMap;
    }
}
exports.OneTimeTokenIn = OneTimeTokenIn;
OneTimeTokenIn.discriminator = undefined;
OneTimeTokenIn.attributeTypeMap = [
    {
        "name": "oneTimeToken",
        "baseName": "oneTimeToken",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=OneTimeTokenIn.js.map


/***/ }),

/***/ 94103:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.OneTimeTokenOut = void 0;
class OneTimeTokenOut {
    constructor(){}
    static getAttributeTypeMap() {
        return OneTimeTokenOut.attributeTypeMap;
    }
}
exports.OneTimeTokenOut = OneTimeTokenOut;
OneTimeTokenOut.discriminator = undefined;
OneTimeTokenOut.attributeTypeMap = [
    {
        "name": "token",
        "baseName": "token",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=OneTimeTokenOut.js.map


/***/ }),

/***/ 85950:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=Ordering.js.map


/***/ }),

/***/ 14985:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.RecoverIn = void 0;
class RecoverIn {
    constructor(){}
    static getAttributeTypeMap() {
        return RecoverIn.attributeTypeMap;
    }
}
exports.RecoverIn = RecoverIn;
RecoverIn.discriminator = undefined;
RecoverIn.attributeTypeMap = [
    {
        "name": "since",
        "baseName": "since",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "until",
        "baseName": "until",
        "type": "Date",
        "format": "date-time"
    }
]; //# sourceMappingURL=RecoverIn.js.map


/***/ }),

/***/ 13165:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.RecoverOut = void 0;
class RecoverOut {
    constructor(){}
    static getAttributeTypeMap() {
        return RecoverOut.attributeTypeMap;
    }
}
exports.RecoverOut = RecoverOut;
RecoverOut.discriminator = undefined;
RecoverOut.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "status",
        "baseName": "status",
        "type": "BackgroundTaskStatus",
        "format": ""
    },
    {
        "name": "task",
        "baseName": "task",
        "type": "BackgroundTaskType",
        "format": ""
    }
]; //# sourceMappingURL=RecoverOut.js.map


/***/ }),

/***/ 99515:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ReplayIn = void 0;
class ReplayIn {
    constructor(){}
    static getAttributeTypeMap() {
        return ReplayIn.attributeTypeMap;
    }
}
exports.ReplayIn = ReplayIn;
ReplayIn.discriminator = undefined;
ReplayIn.attributeTypeMap = [
    {
        "name": "since",
        "baseName": "since",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "until",
        "baseName": "until",
        "type": "Date",
        "format": "date-time"
    }
]; //# sourceMappingURL=ReplayIn.js.map


/***/ }),

/***/ 84336:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ReplayOut = void 0;
class ReplayOut {
    constructor(){}
    static getAttributeTypeMap() {
        return ReplayOut.attributeTypeMap;
    }
}
exports.ReplayOut = ReplayOut;
ReplayOut.discriminator = undefined;
ReplayOut.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "status",
        "baseName": "status",
        "type": "BackgroundTaskStatus",
        "format": ""
    },
    {
        "name": "task",
        "baseName": "task",
        "type": "BackgroundTaskType",
        "format": ""
    }
]; //# sourceMappingURL=ReplayOut.js.map


/***/ }),

/***/ 38388:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.SettingsIn = void 0;
class SettingsIn {
    constructor(){}
    static getAttributeTypeMap() {
        return SettingsIn.attributeTypeMap;
    }
}
exports.SettingsIn = SettingsIn;
SettingsIn.discriminator = undefined;
SettingsIn.attributeTypeMap = [
    {
        "name": "colorPaletteDark",
        "baseName": "colorPaletteDark",
        "type": "CustomColorPalette",
        "format": ""
    },
    {
        "name": "colorPaletteLight",
        "baseName": "colorPaletteLight",
        "type": "CustomColorPalette",
        "format": ""
    },
    {
        "name": "customBaseFontSize",
        "baseName": "customBaseFontSize",
        "type": "number",
        "format": "int"
    },
    {
        "name": "customColor",
        "baseName": "customColor",
        "type": "string",
        "format": "color"
    },
    {
        "name": "customFontFamily",
        "baseName": "customFontFamily",
        "type": "string",
        "format": ""
    },
    {
        "name": "customLogoUrl",
        "baseName": "customLogoUrl",
        "type": "URI",
        "format": "uri"
    },
    {
        "name": "customThemeOverride",
        "baseName": "customThemeOverride",
        "type": "CustomThemeOverride",
        "format": ""
    },
    {
        "name": "disableEndpointOnFailure",
        "baseName": "disableEndpointOnFailure",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "displayName",
        "baseName": "displayName",
        "type": "string",
        "format": ""
    },
    {
        "name": "enableChannels",
        "baseName": "enableChannels",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "enableIntegrationManagement",
        "baseName": "enableIntegrationManagement",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "enableTransformations",
        "baseName": "enableTransformations",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "enforceHttps",
        "baseName": "enforceHttps",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "eventCatalogPublished",
        "baseName": "eventCatalogPublished",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "readOnly",
        "baseName": "readOnly",
        "type": "boolean",
        "format": ""
    }
]; //# sourceMappingURL=SettingsIn.js.map


/***/ }),

/***/ 90006:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.SettingsOut = void 0;
class SettingsOut {
    constructor(){}
    static getAttributeTypeMap() {
        return SettingsOut.attributeTypeMap;
    }
}
exports.SettingsOut = SettingsOut;
SettingsOut.discriminator = undefined;
SettingsOut.attributeTypeMap = [
    {
        "name": "colorPaletteDark",
        "baseName": "colorPaletteDark",
        "type": "CustomColorPalette",
        "format": ""
    },
    {
        "name": "colorPaletteLight",
        "baseName": "colorPaletteLight",
        "type": "CustomColorPalette",
        "format": ""
    },
    {
        "name": "customBaseFontSize",
        "baseName": "customBaseFontSize",
        "type": "number",
        "format": "int"
    },
    {
        "name": "customColor",
        "baseName": "customColor",
        "type": "string",
        "format": "color"
    },
    {
        "name": "customFontFamily",
        "baseName": "customFontFamily",
        "type": "string",
        "format": ""
    },
    {
        "name": "customLogoUrl",
        "baseName": "customLogoUrl",
        "type": "URI",
        "format": "uri"
    },
    {
        "name": "customThemeOverride",
        "baseName": "customThemeOverride",
        "type": "CustomThemeOverride",
        "format": ""
    },
    {
        "name": "disableEndpointOnFailure",
        "baseName": "disableEndpointOnFailure",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "displayName",
        "baseName": "displayName",
        "type": "string",
        "format": ""
    },
    {
        "name": "enableChannels",
        "baseName": "enableChannels",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "enableIntegrationManagement",
        "baseName": "enableIntegrationManagement",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "enableTransformations",
        "baseName": "enableTransformations",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "enforceHttps",
        "baseName": "enforceHttps",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "eventCatalogPublished",
        "baseName": "eventCatalogPublished",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "readOnly",
        "baseName": "readOnly",
        "type": "boolean",
        "format": ""
    }
]; //# sourceMappingURL=SettingsOut.js.map


/***/ }),

/***/ 56929:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=StatisticsPeriod.js.map


/***/ }),

/***/ 50279:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=StatusCodeClass.js.map


/***/ }),

/***/ 90478:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TemplateIn = void 0;
class TemplateIn {
    constructor(){}
    static getAttributeTypeMap() {
        return TemplateIn.attributeTypeMap;
    }
}
exports.TemplateIn = TemplateIn;
TemplateIn.discriminator = undefined;
TemplateIn.attributeTypeMap = [
    {
        "name": "description",
        "baseName": "description",
        "type": "string",
        "format": ""
    },
    {
        "name": "filterTypes",
        "baseName": "filterTypes",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "instructions",
        "baseName": "instructions",
        "type": "string",
        "format": ""
    },
    {
        "name": "instructionsLink",
        "baseName": "instructionsLink",
        "type": "URI",
        "format": "uri"
    },
    {
        "name": "logo",
        "baseName": "logo",
        "type": "URI",
        "format": "uri"
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "transformation",
        "baseName": "transformation",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=TemplateIn.js.map


/***/ }),

/***/ 8778:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TemplateOut = void 0;
class TemplateOut {
    constructor(){}
    static getAttributeTypeMap() {
        return TemplateOut.attributeTypeMap;
    }
}
exports.TemplateOut = TemplateOut;
TemplateOut.discriminator = undefined;
TemplateOut.attributeTypeMap = [
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "description",
        "baseName": "description",
        "type": "string",
        "format": ""
    },
    {
        "name": "filterTypes",
        "baseName": "filterTypes",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "instructions",
        "baseName": "instructions",
        "type": "string",
        "format": ""
    },
    {
        "name": "instructionsLink",
        "baseName": "instructionsLink",
        "type": "URI",
        "format": "uri"
    },
    {
        "name": "kind",
        "baseName": "kind",
        "type": "TransformationTemplateKind",
        "format": ""
    },
    {
        "name": "logo",
        "baseName": "logo",
        "type": "URI",
        "format": "uri"
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "orgId",
        "baseName": "orgId",
        "type": "string",
        "format": ""
    },
    {
        "name": "transformation",
        "baseName": "transformation",
        "type": "string",
        "format": ""
    },
    {
        "name": "updatedAt",
        "baseName": "updatedAt",
        "type": "Date",
        "format": "date-time"
    }
]; //# sourceMappingURL=TemplateOut.js.map


/***/ }),

/***/ 13164:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TemplatePatch = void 0;
class TemplatePatch {
    constructor(){}
    static getAttributeTypeMap() {
        return TemplatePatch.attributeTypeMap;
    }
}
exports.TemplatePatch = TemplatePatch;
TemplatePatch.discriminator = undefined;
TemplatePatch.attributeTypeMap = [
    {
        "name": "description",
        "baseName": "description",
        "type": "string",
        "format": ""
    },
    {
        "name": "filterTypes",
        "baseName": "filterTypes",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "instructions",
        "baseName": "instructions",
        "type": "string",
        "format": ""
    },
    {
        "name": "instructionsLink",
        "baseName": "instructionsLink",
        "type": "URI",
        "format": "uri"
    },
    {
        "name": "logo",
        "baseName": "logo",
        "type": "URI",
        "format": "uri"
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "transformation",
        "baseName": "transformation",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=TemplatePatch.js.map


/***/ }),

/***/ 9300:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TemplateUpdate = void 0;
class TemplateUpdate {
    constructor(){}
    static getAttributeTypeMap() {
        return TemplateUpdate.attributeTypeMap;
    }
}
exports.TemplateUpdate = TemplateUpdate;
TemplateUpdate.discriminator = undefined;
TemplateUpdate.attributeTypeMap = [
    {
        "name": "description",
        "baseName": "description",
        "type": "string",
        "format": ""
    },
    {
        "name": "filterTypes",
        "baseName": "filterTypes",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "instructions",
        "baseName": "instructions",
        "type": "string",
        "format": ""
    },
    {
        "name": "instructionsLink",
        "baseName": "instructionsLink",
        "type": "URI",
        "format": "uri"
    },
    {
        "name": "logo",
        "baseName": "logo",
        "type": "URI",
        "format": "uri"
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "transformation",
        "baseName": "transformation",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=TemplateUpdate.js.map


/***/ }),

/***/ 99865:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=TransformationHttpMethod.js.map


/***/ }),

/***/ 54480:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TransformationSimulateIn = void 0;
class TransformationSimulateIn {
    constructor(){}
    static getAttributeTypeMap() {
        return TransformationSimulateIn.attributeTypeMap;
    }
}
exports.TransformationSimulateIn = TransformationSimulateIn;
TransformationSimulateIn.discriminator = undefined;
TransformationSimulateIn.attributeTypeMap = [
    {
        "name": "channels",
        "baseName": "channels",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "code",
        "baseName": "code",
        "type": "string",
        "format": ""
    },
    {
        "name": "eventType",
        "baseName": "eventType",
        "type": "string",
        "format": ""
    },
    {
        "name": "payload",
        "baseName": "payload",
        "type": "any",
        "format": ""
    }
]; //# sourceMappingURL=TransformationSimulateIn.js.map


/***/ }),

/***/ 11140:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TransformationSimulateOut = void 0;
class TransformationSimulateOut {
    constructor(){}
    static getAttributeTypeMap() {
        return TransformationSimulateOut.attributeTypeMap;
    }
}
exports.TransformationSimulateOut = TransformationSimulateOut;
TransformationSimulateOut.discriminator = undefined;
TransformationSimulateOut.attributeTypeMap = [
    {
        "name": "method",
        "baseName": "method",
        "type": "TransformationHttpMethod",
        "format": ""
    },
    {
        "name": "payload",
        "baseName": "payload",
        "type": "string",
        "format": ""
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "URI",
        "format": "uri"
    }
]; //# sourceMappingURL=TransformationSimulateOut.js.map


/***/ }),

/***/ 57568:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=TransformationTemplateKind.js.map


/***/ }),

/***/ 38767:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ValidationError = void 0;
class ValidationError {
    constructor(){}
    static getAttributeTypeMap() {
        return ValidationError.attributeTypeMap;
    }
}
exports.ValidationError = ValidationError;
ValidationError.discriminator = undefined;
ValidationError.attributeTypeMap = [
    {
        "name": "loc",
        "baseName": "loc",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "msg",
        "baseName": "msg",
        "type": "string",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "string",
        "format": ""
    }
]; //# sourceMappingURL=ValidationError.js.map


/***/ }),

/***/ 11794:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var __createBinding = (void 0) && (void 0).__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = (void 0) && (void 0).__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !exports1.hasOwnProperty(p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
__exportStar(__webpack_require__(21230), exports);
__exportStar(__webpack_require__(92514), exports);
__exportStar(__webpack_require__(89144), exports);
__exportStar(__webpack_require__(68441), exports);
__exportStar(__webpack_require__(25987), exports);
__exportStar(__webpack_require__(72123), exports);
__exportStar(__webpack_require__(38232), exports);
__exportStar(__webpack_require__(82305), exports);
__exportStar(__webpack_require__(46225), exports);
__exportStar(__webpack_require__(17015), exports);
__exportStar(__webpack_require__(88858), exports);
__exportStar(__webpack_require__(82247), exports);
__exportStar(__webpack_require__(93916), exports);
__exportStar(__webpack_require__(99054), exports);
__exportStar(__webpack_require__(4364), exports);
__exportStar(__webpack_require__(43392), exports);
__exportStar(__webpack_require__(7383), exports);
__exportStar(__webpack_require__(90846), exports);
__exportStar(__webpack_require__(75870), exports);
__exportStar(__webpack_require__(89724), exports);
__exportStar(__webpack_require__(64406), exports);
__exportStar(__webpack_require__(79998), exports);
__exportStar(__webpack_require__(72718), exports);
__exportStar(__webpack_require__(94065), exports);
__exportStar(__webpack_require__(92053), exports);
__exportStar(__webpack_require__(36888), exports);
__exportStar(__webpack_require__(80033), exports);
__exportStar(__webpack_require__(74661), exports);
__exportStar(__webpack_require__(19728), exports);
__exportStar(__webpack_require__(84545), exports);
__exportStar(__webpack_require__(89895), exports);
__exportStar(__webpack_require__(69920), exports);
__exportStar(__webpack_require__(8396), exports);
__exportStar(__webpack_require__(27546), exports);
__exportStar(__webpack_require__(3139), exports);
__exportStar(__webpack_require__(14020), exports);
__exportStar(__webpack_require__(66945), exports);
__exportStar(__webpack_require__(67388), exports);
__exportStar(__webpack_require__(97588), exports);
__exportStar(__webpack_require__(26742), exports);
__exportStar(__webpack_require__(19564), exports);
__exportStar(__webpack_require__(2979), exports);
__exportStar(__webpack_require__(14702), exports);
__exportStar(__webpack_require__(24817), exports);
__exportStar(__webpack_require__(97070), exports);
__exportStar(__webpack_require__(12872), exports);
__exportStar(__webpack_require__(64143), exports);
__exportStar(__webpack_require__(76224), exports);
__exportStar(__webpack_require__(32218), exports);
__exportStar(__webpack_require__(84757), exports);
__exportStar(__webpack_require__(40838), exports);
__exportStar(__webpack_require__(77334), exports);
__exportStar(__webpack_require__(71771), exports);
__exportStar(__webpack_require__(29634), exports);
__exportStar(__webpack_require__(36864), exports);
__exportStar(__webpack_require__(84813), exports);
__exportStar(__webpack_require__(48673), exports);
__exportStar(__webpack_require__(54017), exports);
__exportStar(__webpack_require__(85712), exports);
__exportStar(__webpack_require__(3570), exports);
__exportStar(__webpack_require__(10890), exports);
__exportStar(__webpack_require__(96125), exports);
__exportStar(__webpack_require__(13502), exports);
__exportStar(__webpack_require__(5178), exports);
__exportStar(__webpack_require__(77035), exports);
__exportStar(__webpack_require__(22955), exports);
__exportStar(__webpack_require__(44378), exports);
__exportStar(__webpack_require__(45801), exports);
__exportStar(__webpack_require__(70725), exports);
__exportStar(__webpack_require__(2505), exports);
__exportStar(__webpack_require__(49226), exports);
__exportStar(__webpack_require__(33286), exports);
__exportStar(__webpack_require__(1800), exports);
__exportStar(__webpack_require__(82594), exports);
__exportStar(__webpack_require__(33167), exports);
__exportStar(__webpack_require__(42928), exports);
__exportStar(__webpack_require__(93145), exports);
__exportStar(__webpack_require__(97348), exports);
__exportStar(__webpack_require__(45611), exports);
__exportStar(__webpack_require__(83282), exports);
__exportStar(__webpack_require__(55495), exports);
__exportStar(__webpack_require__(61835), exports);
__exportStar(__webpack_require__(41459), exports);
__exportStar(__webpack_require__(27072), exports);
__exportStar(__webpack_require__(6200), exports);
__exportStar(__webpack_require__(22346), exports);
__exportStar(__webpack_require__(19480), exports);
__exportStar(__webpack_require__(92186), exports);
__exportStar(__webpack_require__(98528), exports);
__exportStar(__webpack_require__(61586), exports);
__exportStar(__webpack_require__(20015), exports);
__exportStar(__webpack_require__(66737), exports);
__exportStar(__webpack_require__(42235), exports);
__exportStar(__webpack_require__(94103), exports);
__exportStar(__webpack_require__(85950), exports);
__exportStar(__webpack_require__(14985), exports);
__exportStar(__webpack_require__(13165), exports);
__exportStar(__webpack_require__(99515), exports);
__exportStar(__webpack_require__(84336), exports);
__exportStar(__webpack_require__(38388), exports);
__exportStar(__webpack_require__(90006), exports);
__exportStar(__webpack_require__(56929), exports);
__exportStar(__webpack_require__(50279), exports);
__exportStar(__webpack_require__(90478), exports);
__exportStar(__webpack_require__(8778), exports);
__exportStar(__webpack_require__(13164), exports);
__exportStar(__webpack_require__(9300), exports);
__exportStar(__webpack_require__(99865), exports);
__exportStar(__webpack_require__(54480), exports);
__exportStar(__webpack_require__(11140), exports);
__exportStar(__webpack_require__(57568), exports);
__exportStar(__webpack_require__(38767), exports); //# sourceMappingURL=all.js.map


/***/ }),

/***/ 46223:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.map = exports.mergeMap = exports.of = exports.from = exports.Observable = void 0;
class Observable {
    constructor(promise){
        this.promise = promise;
    }
    toPromise() {
        return this.promise;
    }
    pipe(callback) {
        return new Observable(this.promise.then(callback));
    }
}
exports.Observable = Observable;
function from(promise) {
    return new Observable(promise);
}
exports.from = from;
function of(value) {
    return new Observable(Promise.resolve(value));
}
exports.of = of;
function mergeMap(callback) {
    return (value)=>callback(value).toPromise();
}
exports.mergeMap = mergeMap;
function map(callback) {
    return callback;
}
exports.map = map; //# sourceMappingURL=rxjsStub.js.map


/***/ }),

/***/ 27225:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.servers = exports.server2 = exports.server1 = exports.ServerConfiguration = void 0;
const http_1 = __webpack_require__(35665);
class ServerConfiguration {
    constructor(url, variableConfiguration){
        this.url = url;
        this.variableConfiguration = variableConfiguration;
    }
    setVariables(variableConfiguration) {
        Object.assign(this.variableConfiguration, variableConfiguration);
    }
    getConfiguration() {
        return this.variableConfiguration;
    }
    getUrl() {
        let replacedUrl = this.url;
        for(const key in this.variableConfiguration){
            var re = new RegExp("{" + key + "}", "g");
            replacedUrl = replacedUrl.replace(re, this.variableConfiguration[key]);
        }
        return replacedUrl;
    }
    makeRequestContext(endpoint, httpMethod) {
        return new http_1.RequestContext(this.getUrl() + endpoint, httpMethod);
    }
}
exports.ServerConfiguration = ServerConfiguration;
exports.server1 = new ServerConfiguration("https://api.eu.svix.com", {});
exports.server2 = new ServerConfiguration("https://api.us.svix.com", {});
exports.servers = [
    exports.server1,
    exports.server2
]; //# sourceMappingURL=servers.js.map


/***/ }),

/***/ 23827:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ObjectTransformationTemplateApi = exports.ObjectStatisticsApi = exports.ObjectMessageAttemptApi = exports.ObjectMessageApi = exports.ObjectIntegrationApi = exports.ObjectHealthApi = exports.ObjectEventTypeApi = exports.ObjectEnvironmentSettingsApi = exports.ObjectEnvironmentApi = exports.ObjectEndpointApi = exports.ObjectBroadcastApi = exports.ObjectBackgroundTasksApi = exports.ObjectAuthenticationApi = exports.ObjectApplicationApi = void 0;
const ObservableAPI_1 = __webpack_require__(68748);
class ObjectApplicationApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.api = new ObservableAPI_1.ObservableApplicationApi(configuration, requestFactory, responseProcessor);
    }
    getAppUsageStatsApiV1AppStatsUsageGet(param, options) {
        return this.api.getAppUsageStatsApiV1AppStatsUsageGet(param.since, param.until, param.limit, param.iterator, options).toPromise();
    }
    v1ApplicationCreate(param, options) {
        return this.api.v1ApplicationCreate(param.applicationIn, param.getIfExists, param.idempotencyKey, options).toPromise();
    }
    v1ApplicationDelete(param, options) {
        return this.api.v1ApplicationDelete(param.appId, options).toPromise();
    }
    v1ApplicationGet(param, options) {
        return this.api.v1ApplicationGet(param.appId, options).toPromise();
    }
    v1ApplicationGetStats(param, options) {
        return this.api.v1ApplicationGetStats(param.since, param.until, param.appId, options).toPromise();
    }
    v1ApplicationList(param, options) {
        return this.api.v1ApplicationList(param.limit, param.iterator, param.order, options).toPromise();
    }
    v1ApplicationPatch(param, options) {
        return this.api.v1ApplicationPatch(param.appId, param.applicationPatch, options).toPromise();
    }
    v1ApplicationUpdate(param, options) {
        return this.api.v1ApplicationUpdate(param.appId, param.applicationIn, options).toPromise();
    }
}
exports.ObjectApplicationApi = ObjectApplicationApi;
const ObservableAPI_2 = __webpack_require__(68748);
class ObjectAuthenticationApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.api = new ObservableAPI_2.ObservableAuthenticationApi(configuration, requestFactory, responseProcessor);
    }
    v1AuthenticationAppPortalAccess(param, options) {
        return this.api.v1AuthenticationAppPortalAccess(param.appId, param.appPortalAccessIn, param.idempotencyKey, options).toPromise();
    }
    v1AuthenticationDashboardAccess(param, options) {
        return this.api.v1AuthenticationDashboardAccess(param.appId, param.idempotencyKey, options).toPromise();
    }
    v1AuthenticationExchangeOneTimeToken(param, options) {
        return this.api.v1AuthenticationExchangeOneTimeToken(param.oneTimeTokenIn, param.idempotencyKey, options).toPromise();
    }
    v1AuthenticationExpireAll(param, options) {
        return this.api.v1AuthenticationExpireAll(param.appId, param.applicationTokenExpireIn, param.idempotencyKey, options).toPromise();
    }
    v1AuthenticationLogout(param, options) {
        return this.api.v1AuthenticationLogout(param.idempotencyKey, options).toPromise();
    }
}
exports.ObjectAuthenticationApi = ObjectAuthenticationApi;
const ObservableAPI_3 = __webpack_require__(68748);
class ObjectBackgroundTasksApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.api = new ObservableAPI_3.ObservableBackgroundTasksApi(configuration, requestFactory, responseProcessor);
    }
    getBackgroundTask(param, options) {
        return this.api.getBackgroundTask(param.taskId, options).toPromise();
    }
    listBackgroundTasks(param, options) {
        return this.api.listBackgroundTasks(param.status, param.task, param.limit, param.iterator, param.order, options).toPromise();
    }
}
exports.ObjectBackgroundTasksApi = ObjectBackgroundTasksApi;
const ObservableAPI_4 = __webpack_require__(68748);
class ObjectBroadcastApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.api = new ObservableAPI_4.ObservableBroadcastApi(configuration, requestFactory, responseProcessor);
    }
    createBroadcastMessage(param, options) {
        return this.api.createBroadcastMessage(param.messageBroadcastIn, param.idempotencyKey, options).toPromise();
    }
}
exports.ObjectBroadcastApi = ObjectBroadcastApi;
const ObservableAPI_5 = __webpack_require__(68748);
class ObjectEndpointApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.api = new ObservableAPI_5.ObservableEndpointApi(configuration, requestFactory, responseProcessor);
    }
    v1EndpointCreate(param, options) {
        return this.api.v1EndpointCreate(param.appId, param.endpointIn, param.idempotencyKey, options).toPromise();
    }
    v1EndpointDelete(param, options) {
        return this.api.v1EndpointDelete(param.appId, param.endpointId, options).toPromise();
    }
    v1EndpointGet(param, options) {
        return this.api.v1EndpointGet(param.appId, param.endpointId, options).toPromise();
    }
    v1EndpointGetHeaders(param, options) {
        return this.api.v1EndpointGetHeaders(param.appId, param.endpointId, options).toPromise();
    }
    v1EndpointGetSecret(param, options) {
        return this.api.v1EndpointGetSecret(param.appId, param.endpointId, options).toPromise();
    }
    v1EndpointGetStats(param, options) {
        return this.api.v1EndpointGetStats(param.appId, param.endpointId, param.since, param.until, options).toPromise();
    }
    v1EndpointList(param, options) {
        return this.api.v1EndpointList(param.appId, param.limit, param.iterator, param.order, options).toPromise();
    }
    v1EndpointPatch(param, options) {
        return this.api.v1EndpointPatch(param.appId, param.endpointId, param.endpointPatch, options).toPromise();
    }
    v1EndpointPatchHeaders(param, options) {
        return this.api.v1EndpointPatchHeaders(param.appId, param.endpointId, param.endpointHeadersPatchIn, options).toPromise();
    }
    v1EndpointRecover(param, options) {
        return this.api.v1EndpointRecover(param.appId, param.endpointId, param.recoverIn, param.idempotencyKey, options).toPromise();
    }
    v1EndpointReplay(param, options) {
        return this.api.v1EndpointReplay(param.appId, param.endpointId, param.replayIn, param.idempotencyKey, options).toPromise();
    }
    v1EndpointRotateSecret(param, options) {
        return this.api.v1EndpointRotateSecret(param.appId, param.endpointId, param.endpointSecretRotateIn, param.idempotencyKey, options).toPromise();
    }
    v1EndpointSendExample(param, options) {
        return this.api.v1EndpointSendExample(param.appId, param.endpointId, param.eventExampleIn, param.idempotencyKey, options).toPromise();
    }
    v1EndpointTransformationGet(param, options) {
        return this.api.v1EndpointTransformationGet(param.appId, param.endpointId, options).toPromise();
    }
    v1EndpointTransformationPartialUpdate(param, options) {
        return this.api.v1EndpointTransformationPartialUpdate(param.appId, param.endpointId, param.endpointTransformationIn, options).toPromise();
    }
    v1EndpointTransformationSimulate(param, options) {
        return this.api.v1EndpointTransformationSimulate(param.appId, param.endpointId, param.endpointTransformationSimulateIn, param.idempotencyKey, options).toPromise();
    }
    v1EndpointUpdate(param, options) {
        return this.api.v1EndpointUpdate(param.appId, param.endpointId, param.endpointUpdate, options).toPromise();
    }
    v1EndpointUpdateHeaders(param, options) {
        return this.api.v1EndpointUpdateHeaders(param.appId, param.endpointId, param.endpointHeadersIn, options).toPromise();
    }
}
exports.ObjectEndpointApi = ObjectEndpointApi;
const ObservableAPI_6 = __webpack_require__(68748);
class ObjectEnvironmentApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.api = new ObservableAPI_6.ObservableEnvironmentApi(configuration, requestFactory, responseProcessor);
    }
    v1EnvironmentExport(param, options) {
        return this.api.v1EnvironmentExport(param.body, param.idempotencyKey, options).toPromise();
    }
    v1EnvironmentImport(param, options) {
        return this.api.v1EnvironmentImport(param.environmentIn, param.idempotencyKey, options).toPromise();
    }
}
exports.ObjectEnvironmentApi = ObjectEnvironmentApi;
const ObservableAPI_7 = __webpack_require__(68748);
class ObjectEnvironmentSettingsApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.api = new ObservableAPI_7.ObservableEnvironmentSettingsApi(configuration, requestFactory, responseProcessor);
    }
    v1EnvironmentGetSettings(param, options) {
        return this.api.v1EnvironmentGetSettings(options).toPromise();
    }
}
exports.ObjectEnvironmentSettingsApi = ObjectEnvironmentSettingsApi;
const ObservableAPI_8 = __webpack_require__(68748);
class ObjectEventTypeApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.api = new ObservableAPI_8.ObservableEventTypeApi(configuration, requestFactory, responseProcessor);
    }
    v1EventTypeCreate(param, options) {
        return this.api.v1EventTypeCreate(param.eventTypeIn, param.idempotencyKey, options).toPromise();
    }
    v1EventTypeDelete(param, options) {
        return this.api.v1EventTypeDelete(param.eventTypeName, param.expunge, options).toPromise();
    }
    v1EventTypeGenerateExample(param, options) {
        return this.api.v1EventTypeGenerateExample(param.eventTypeSchemaIn, param.idempotencyKey, options).toPromise();
    }
    v1EventTypeGet(param, options) {
        return this.api.v1EventTypeGet(param.eventTypeName, options).toPromise();
    }
    v1EventTypeImportOpenapi(param, options) {
        return this.api.v1EventTypeImportOpenapi(param.eventTypeImportOpenApiIn, param.idempotencyKey, options).toPromise();
    }
    v1EventTypeList(param, options) {
        return this.api.v1EventTypeList(param.limit, param.iterator, param.order, param.includeArchived, param.withContent, options).toPromise();
    }
    v1EventTypePatch(param, options) {
        return this.api.v1EventTypePatch(param.eventTypeName, param.eventTypePatch, options).toPromise();
    }
    v1EventTypeUpdate(param, options) {
        return this.api.v1EventTypeUpdate(param.eventTypeName, param.eventTypeUpdate, options).toPromise();
    }
}
exports.ObjectEventTypeApi = ObjectEventTypeApi;
const ObservableAPI_9 = __webpack_require__(68748);
class ObjectHealthApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.api = new ObservableAPI_9.ObservableHealthApi(configuration, requestFactory, responseProcessor);
    }
    v1HealthGet(param, options) {
        return this.api.v1HealthGet(options).toPromise();
    }
}
exports.ObjectHealthApi = ObjectHealthApi;
const ObservableAPI_10 = __webpack_require__(68748);
class ObjectIntegrationApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.api = new ObservableAPI_10.ObservableIntegrationApi(configuration, requestFactory, responseProcessor);
    }
    v1IntegrationCreate(param, options) {
        return this.api.v1IntegrationCreate(param.appId, param.integrationIn, param.idempotencyKey, options).toPromise();
    }
    v1IntegrationDelete(param, options) {
        return this.api.v1IntegrationDelete(param.appId, param.integId, options).toPromise();
    }
    v1IntegrationGet(param, options) {
        return this.api.v1IntegrationGet(param.appId, param.integId, options).toPromise();
    }
    v1IntegrationGetKey(param, options) {
        return this.api.v1IntegrationGetKey(param.appId, param.integId, options).toPromise();
    }
    v1IntegrationList(param, options) {
        return this.api.v1IntegrationList(param.appId, param.limit, param.iterator, options).toPromise();
    }
    v1IntegrationRotateKey(param, options) {
        return this.api.v1IntegrationRotateKey(param.appId, param.integId, param.idempotencyKey, options).toPromise();
    }
    v1IntegrationUpdate(param, options) {
        return this.api.v1IntegrationUpdate(param.appId, param.integId, param.integrationUpdate, options).toPromise();
    }
}
exports.ObjectIntegrationApi = ObjectIntegrationApi;
const ObservableAPI_11 = __webpack_require__(68748);
class ObjectMessageApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.api = new ObservableAPI_11.ObservableMessageApi(configuration, requestFactory, responseProcessor);
    }
    createMessageAttemptForEndpoint(param, options) {
        return this.api.createMessageAttemptForEndpoint(param.appId, param.endpointId, param.messageIn, param.idempotencyKey, options).toPromise();
    }
    v1MessageCreate(param, options) {
        return this.api.v1MessageCreate(param.appId, param.messageIn, param.withContent, param.idempotencyKey, options).toPromise();
    }
    v1MessageExpungeContent(param, options) {
        return this.api.v1MessageExpungeContent(param.appId, param.msgId, options).toPromise();
    }
    v1MessageGet(param, options) {
        return this.api.v1MessageGet(param.appId, param.msgId, param.withContent, options).toPromise();
    }
    v1MessageGetRawPayload(param, options) {
        return this.api.v1MessageGetRawPayload(param.appId, param.msgId, options).toPromise();
    }
    v1MessageList(param, options) {
        return this.api.v1MessageList(param.appId, param.limit, param.iterator, param.channel, param.before, param.after, param.withContent, param.eventTypes, options).toPromise();
    }
}
exports.ObjectMessageApi = ObjectMessageApi;
const ObservableAPI_12 = __webpack_require__(68748);
class ObjectMessageAttemptApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.api = new ObservableAPI_12.ObservableMessageAttemptApi(configuration, requestFactory, responseProcessor);
    }
    v1MessageAttemptExpungeContent(param, options) {
        return this.api.v1MessageAttemptExpungeContent(param.appId, param.msgId, param.attemptId, options).toPromise();
    }
    v1MessageAttemptGet(param, options) {
        return this.api.v1MessageAttemptGet(param.appId, param.msgId, param.attemptId, options).toPromise();
    }
    v1MessageAttemptGetHeaders(param, options) {
        return this.api.v1MessageAttemptGetHeaders(param.appId, param.msgId, param.attemptId, options).toPromise();
    }
    v1MessageAttemptListAttemptedDestinations(param, options) {
        return this.api.v1MessageAttemptListAttemptedDestinations(param.appId, param.msgId, param.limit, param.iterator, options).toPromise();
    }
    v1MessageAttemptListAttemptedMessages(param, options) {
        return this.api.v1MessageAttemptListAttemptedMessages(param.appId, param.endpointId, param.limit, param.iterator, param.channel, param.status, param.before, param.after, param.withContent, param.eventTypes, options).toPromise();
    }
    v1MessageAttemptListByEndpoint(param, options) {
        return this.api.v1MessageAttemptListByEndpoint(param.appId, param.endpointId, param.limit, param.iterator, param.status, param.statusCodeClass, param.channel, param.before, param.after, param.withContent, param.eventTypes, options).toPromise();
    }
    v1MessageAttemptListByEndpointDeprecated(param, options) {
        return this.api.v1MessageAttemptListByEndpointDeprecated(param.appId, param.msgId, param.endpointId, param.limit, param.iterator, param.channel, param.status, param.before, param.after, param.eventTypes, options).toPromise();
    }
    v1MessageAttemptListByMsg(param, options) {
        return this.api.v1MessageAttemptListByMsg(param.appId, param.msgId, param.limit, param.iterator, param.status, param.statusCodeClass, param.channel, param.endpointId, param.before, param.after, param.withContent, param.eventTypes, options).toPromise();
    }
    v1MessageAttemptListByMsgDeprecated(param, options) {
        return this.api.v1MessageAttemptListByMsgDeprecated(param.appId, param.msgId, param.limit, param.iterator, param.endpointId, param.channel, param.status, param.before, param.after, param.statusCodeClass, param.eventTypes, options).toPromise();
    }
    v1MessageAttemptResend(param, options) {
        return this.api.v1MessageAttemptResend(param.appId, param.msgId, param.endpointId, param.idempotencyKey, options).toPromise();
    }
}
exports.ObjectMessageAttemptApi = ObjectMessageAttemptApi;
const ObservableAPI_13 = __webpack_require__(68748);
class ObjectStatisticsApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.api = new ObservableAPI_13.ObservableStatisticsApi(configuration, requestFactory, responseProcessor);
    }
    calculateAggregateAppStats(param, options) {
        return this.api.calculateAggregateAppStats(param.appUsageStatsIn, param.idempotencyKey, options).toPromise();
    }
    v1StatsAppAttempts(param, options) {
        return this.api.v1StatsAppAttempts(param.appId, param.startDate, param.endDate, options).toPromise();
    }
    v1StatsEndpointAttempts(param, options) {
        return this.api.v1StatsEndpointAttempts(param.appId, param.endpointId, param.startDate, param.endDate, options).toPromise();
    }
}
exports.ObjectStatisticsApi = ObjectStatisticsApi;
const ObservableAPI_14 = __webpack_require__(68748);
class ObjectTransformationTemplateApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.api = new ObservableAPI_14.ObservableTransformationTemplateApi(configuration, requestFactory, responseProcessor);
    }
    v1TransformationTemplateCreate(param, options) {
        return this.api.v1TransformationTemplateCreate(param.templateIn, param.idempotencyKey, options).toPromise();
    }
    v1TransformationTemplateDelete(param, options) {
        return this.api.v1TransformationTemplateDelete(param.transformationTemplateId, options).toPromise();
    }
    v1TransformationTemplateGet(param, options) {
        return this.api.v1TransformationTemplateGet(param.transformationTemplateId, options).toPromise();
    }
    v1TransformationTemplateList(param, options) {
        return this.api.v1TransformationTemplateList(param.limit, param.iterator, param.order, options).toPromise();
    }
    v1TransformationTemplatePatch(param, options) {
        return this.api.v1TransformationTemplatePatch(param.transformationTemplateId, param.templatePatch, options).toPromise();
    }
    v1TransformationTemplateSimulate(param, options) {
        return this.api.v1TransformationTemplateSimulate(param.transformationSimulateIn, param.idempotencyKey, options).toPromise();
    }
    v1TransformationTemplateUpdate(param, options) {
        return this.api.v1TransformationTemplateUpdate(param.transformationTemplateId, param.templateUpdate, options).toPromise();
    }
}
exports.ObjectTransformationTemplateApi = ObjectTransformationTemplateApi; //# sourceMappingURL=ObjectParamAPI.js.map


/***/ }),

/***/ 68748:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ObservableTransformationTemplateApi = exports.ObservableStatisticsApi = exports.ObservableMessageAttemptApi = exports.ObservableMessageApi = exports.ObservableIntegrationApi = exports.ObservableHealthApi = exports.ObservableEventTypeApi = exports.ObservableEnvironmentSettingsApi = exports.ObservableEnvironmentApi = exports.ObservableEndpointApi = exports.ObservableBroadcastApi = exports.ObservableBackgroundTasksApi = exports.ObservableAuthenticationApi = exports.ObservableApplicationApi = void 0;
const rxjsStub_1 = __webpack_require__(46223);
const rxjsStub_2 = __webpack_require__(46223);
const ApplicationApi_1 = __webpack_require__(83117);
class ObservableApplicationApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.configuration = configuration;
        this.requestFactory = requestFactory || new ApplicationApi_1.ApplicationApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new ApplicationApi_1.ApplicationApiResponseProcessor();
    }
    getAppUsageStatsApiV1AppStatsUsageGet(since, until, limit, iterator, _options) {
        const requestContextPromise = this.requestFactory.getAppUsageStatsApiV1AppStatsUsageGet(since, until, limit, iterator, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.getAppUsageStatsApiV1AppStatsUsageGet(rsp)));
        }));
    }
    v1ApplicationCreate(applicationIn, getIfExists, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1ApplicationCreate(applicationIn, getIfExists, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1ApplicationCreate(rsp)));
        }));
    }
    v1ApplicationDelete(appId, _options) {
        const requestContextPromise = this.requestFactory.v1ApplicationDelete(appId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1ApplicationDelete(rsp)));
        }));
    }
    v1ApplicationGet(appId, _options) {
        const requestContextPromise = this.requestFactory.v1ApplicationGet(appId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1ApplicationGet(rsp)));
        }));
    }
    v1ApplicationGetStats(since, until, appId, _options) {
        const requestContextPromise = this.requestFactory.v1ApplicationGetStats(since, until, appId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1ApplicationGetStats(rsp)));
        }));
    }
    v1ApplicationList(limit, iterator, order, _options) {
        const requestContextPromise = this.requestFactory.v1ApplicationList(limit, iterator, order, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1ApplicationList(rsp)));
        }));
    }
    v1ApplicationPatch(appId, applicationPatch, _options) {
        const requestContextPromise = this.requestFactory.v1ApplicationPatch(appId, applicationPatch, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1ApplicationPatch(rsp)));
        }));
    }
    v1ApplicationUpdate(appId, applicationIn, _options) {
        const requestContextPromise = this.requestFactory.v1ApplicationUpdate(appId, applicationIn, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1ApplicationUpdate(rsp)));
        }));
    }
}
exports.ObservableApplicationApi = ObservableApplicationApi;
const AuthenticationApi_1 = __webpack_require__(97987);
class ObservableAuthenticationApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.configuration = configuration;
        this.requestFactory = requestFactory || new AuthenticationApi_1.AuthenticationApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new AuthenticationApi_1.AuthenticationApiResponseProcessor();
    }
    v1AuthenticationAppPortalAccess(appId, appPortalAccessIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1AuthenticationAppPortalAccess(appId, appPortalAccessIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1AuthenticationAppPortalAccess(rsp)));
        }));
    }
    v1AuthenticationDashboardAccess(appId, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1AuthenticationDashboardAccess(appId, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1AuthenticationDashboardAccess(rsp)));
        }));
    }
    v1AuthenticationExchangeOneTimeToken(oneTimeTokenIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1AuthenticationExchangeOneTimeToken(oneTimeTokenIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1AuthenticationExchangeOneTimeToken(rsp)));
        }));
    }
    v1AuthenticationExpireAll(appId, applicationTokenExpireIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1AuthenticationExpireAll(appId, applicationTokenExpireIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1AuthenticationExpireAll(rsp)));
        }));
    }
    v1AuthenticationLogout(idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1AuthenticationLogout(idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1AuthenticationLogout(rsp)));
        }));
    }
}
exports.ObservableAuthenticationApi = ObservableAuthenticationApi;
const BackgroundTasksApi_1 = __webpack_require__(54025);
class ObservableBackgroundTasksApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.configuration = configuration;
        this.requestFactory = requestFactory || new BackgroundTasksApi_1.BackgroundTasksApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new BackgroundTasksApi_1.BackgroundTasksApiResponseProcessor();
    }
    getBackgroundTask(taskId, _options) {
        const requestContextPromise = this.requestFactory.getBackgroundTask(taskId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.getBackgroundTask(rsp)));
        }));
    }
    listBackgroundTasks(status, task, limit, iterator, order, _options) {
        const requestContextPromise = this.requestFactory.listBackgroundTasks(status, task, limit, iterator, order, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.listBackgroundTasks(rsp)));
        }));
    }
}
exports.ObservableBackgroundTasksApi = ObservableBackgroundTasksApi;
const BroadcastApi_1 = __webpack_require__(25199);
class ObservableBroadcastApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.configuration = configuration;
        this.requestFactory = requestFactory || new BroadcastApi_1.BroadcastApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new BroadcastApi_1.BroadcastApiResponseProcessor();
    }
    createBroadcastMessage(messageBroadcastIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.createBroadcastMessage(messageBroadcastIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.createBroadcastMessage(rsp)));
        }));
    }
}
exports.ObservableBroadcastApi = ObservableBroadcastApi;
const EndpointApi_1 = __webpack_require__(29170);
class ObservableEndpointApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.configuration = configuration;
        this.requestFactory = requestFactory || new EndpointApi_1.EndpointApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new EndpointApi_1.EndpointApiResponseProcessor();
    }
    v1EndpointCreate(appId, endpointIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointCreate(appId, endpointIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointCreate(rsp)));
        }));
    }
    v1EndpointDelete(appId, endpointId, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointDelete(appId, endpointId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointDelete(rsp)));
        }));
    }
    v1EndpointGet(appId, endpointId, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointGet(appId, endpointId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointGet(rsp)));
        }));
    }
    v1EndpointGetHeaders(appId, endpointId, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointGetHeaders(appId, endpointId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointGetHeaders(rsp)));
        }));
    }
    v1EndpointGetSecret(appId, endpointId, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointGetSecret(appId, endpointId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointGetSecret(rsp)));
        }));
    }
    v1EndpointGetStats(appId, endpointId, since, until, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointGetStats(appId, endpointId, since, until, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointGetStats(rsp)));
        }));
    }
    v1EndpointList(appId, limit, iterator, order, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointList(appId, limit, iterator, order, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointList(rsp)));
        }));
    }
    v1EndpointPatch(appId, endpointId, endpointPatch, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointPatch(appId, endpointId, endpointPatch, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointPatch(rsp)));
        }));
    }
    v1EndpointPatchHeaders(appId, endpointId, endpointHeadersPatchIn, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointPatchHeaders(appId, endpointId, endpointHeadersPatchIn, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointPatchHeaders(rsp)));
        }));
    }
    v1EndpointRecover(appId, endpointId, recoverIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointRecover(appId, endpointId, recoverIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointRecover(rsp)));
        }));
    }
    v1EndpointReplay(appId, endpointId, replayIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointReplay(appId, endpointId, replayIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointReplay(rsp)));
        }));
    }
    v1EndpointRotateSecret(appId, endpointId, endpointSecretRotateIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointRotateSecret(appId, endpointId, endpointSecretRotateIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointRotateSecret(rsp)));
        }));
    }
    v1EndpointSendExample(appId, endpointId, eventExampleIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointSendExample(appId, endpointId, eventExampleIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointSendExample(rsp)));
        }));
    }
    v1EndpointTransformationGet(appId, endpointId, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointTransformationGet(appId, endpointId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointTransformationGet(rsp)));
        }));
    }
    v1EndpointTransformationPartialUpdate(appId, endpointId, endpointTransformationIn, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointTransformationPartialUpdate(appId, endpointId, endpointTransformationIn, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointTransformationPartialUpdate(rsp)));
        }));
    }
    v1EndpointTransformationSimulate(appId, endpointId, endpointTransformationSimulateIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointTransformationSimulate(appId, endpointId, endpointTransformationSimulateIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointTransformationSimulate(rsp)));
        }));
    }
    v1EndpointUpdate(appId, endpointId, endpointUpdate, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointUpdate(appId, endpointId, endpointUpdate, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointUpdate(rsp)));
        }));
    }
    v1EndpointUpdateHeaders(appId, endpointId, endpointHeadersIn, _options) {
        const requestContextPromise = this.requestFactory.v1EndpointUpdateHeaders(appId, endpointId, endpointHeadersIn, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EndpointUpdateHeaders(rsp)));
        }));
    }
}
exports.ObservableEndpointApi = ObservableEndpointApi;
const EnvironmentApi_1 = __webpack_require__(36398);
class ObservableEnvironmentApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.configuration = configuration;
        this.requestFactory = requestFactory || new EnvironmentApi_1.EnvironmentApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new EnvironmentApi_1.EnvironmentApiResponseProcessor();
    }
    v1EnvironmentExport(body, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1EnvironmentExport(body, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EnvironmentExport(rsp)));
        }));
    }
    v1EnvironmentImport(environmentIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1EnvironmentImport(environmentIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EnvironmentImport(rsp)));
        }));
    }
}
exports.ObservableEnvironmentApi = ObservableEnvironmentApi;
const EnvironmentSettingsApi_1 = __webpack_require__(81394);
class ObservableEnvironmentSettingsApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.configuration = configuration;
        this.requestFactory = requestFactory || new EnvironmentSettingsApi_1.EnvironmentSettingsApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new EnvironmentSettingsApi_1.EnvironmentSettingsApiResponseProcessor();
    }
    v1EnvironmentGetSettings(_options) {
        const requestContextPromise = this.requestFactory.v1EnvironmentGetSettings(_options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EnvironmentGetSettings(rsp)));
        }));
    }
}
exports.ObservableEnvironmentSettingsApi = ObservableEnvironmentSettingsApi;
const EventTypeApi_1 = __webpack_require__(86560);
class ObservableEventTypeApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.configuration = configuration;
        this.requestFactory = requestFactory || new EventTypeApi_1.EventTypeApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new EventTypeApi_1.EventTypeApiResponseProcessor();
    }
    v1EventTypeCreate(eventTypeIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1EventTypeCreate(eventTypeIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EventTypeCreate(rsp)));
        }));
    }
    v1EventTypeDelete(eventTypeName, expunge, _options) {
        const requestContextPromise = this.requestFactory.v1EventTypeDelete(eventTypeName, expunge, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EventTypeDelete(rsp)));
        }));
    }
    v1EventTypeGenerateExample(eventTypeSchemaIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1EventTypeGenerateExample(eventTypeSchemaIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EventTypeGenerateExample(rsp)));
        }));
    }
    v1EventTypeGet(eventTypeName, _options) {
        const requestContextPromise = this.requestFactory.v1EventTypeGet(eventTypeName, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EventTypeGet(rsp)));
        }));
    }
    v1EventTypeImportOpenapi(eventTypeImportOpenApiIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1EventTypeImportOpenapi(eventTypeImportOpenApiIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EventTypeImportOpenapi(rsp)));
        }));
    }
    v1EventTypeList(limit, iterator, order, includeArchived, withContent, _options) {
        const requestContextPromise = this.requestFactory.v1EventTypeList(limit, iterator, order, includeArchived, withContent, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EventTypeList(rsp)));
        }));
    }
    v1EventTypePatch(eventTypeName, eventTypePatch, _options) {
        const requestContextPromise = this.requestFactory.v1EventTypePatch(eventTypeName, eventTypePatch, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EventTypePatch(rsp)));
        }));
    }
    v1EventTypeUpdate(eventTypeName, eventTypeUpdate, _options) {
        const requestContextPromise = this.requestFactory.v1EventTypeUpdate(eventTypeName, eventTypeUpdate, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1EventTypeUpdate(rsp)));
        }));
    }
}
exports.ObservableEventTypeApi = ObservableEventTypeApi;
const HealthApi_1 = __webpack_require__(21031);
class ObservableHealthApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.configuration = configuration;
        this.requestFactory = requestFactory || new HealthApi_1.HealthApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new HealthApi_1.HealthApiResponseProcessor();
    }
    v1HealthGet(_options) {
        const requestContextPromise = this.requestFactory.v1HealthGet(_options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1HealthGet(rsp)));
        }));
    }
}
exports.ObservableHealthApi = ObservableHealthApi;
const IntegrationApi_1 = __webpack_require__(54497);
class ObservableIntegrationApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.configuration = configuration;
        this.requestFactory = requestFactory || new IntegrationApi_1.IntegrationApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new IntegrationApi_1.IntegrationApiResponseProcessor();
    }
    v1IntegrationCreate(appId, integrationIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1IntegrationCreate(appId, integrationIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1IntegrationCreate(rsp)));
        }));
    }
    v1IntegrationDelete(appId, integId, _options) {
        const requestContextPromise = this.requestFactory.v1IntegrationDelete(appId, integId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1IntegrationDelete(rsp)));
        }));
    }
    v1IntegrationGet(appId, integId, _options) {
        const requestContextPromise = this.requestFactory.v1IntegrationGet(appId, integId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1IntegrationGet(rsp)));
        }));
    }
    v1IntegrationGetKey(appId, integId, _options) {
        const requestContextPromise = this.requestFactory.v1IntegrationGetKey(appId, integId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1IntegrationGetKey(rsp)));
        }));
    }
    v1IntegrationList(appId, limit, iterator, _options) {
        const requestContextPromise = this.requestFactory.v1IntegrationList(appId, limit, iterator, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1IntegrationList(rsp)));
        }));
    }
    v1IntegrationRotateKey(appId, integId, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1IntegrationRotateKey(appId, integId, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1IntegrationRotateKey(rsp)));
        }));
    }
    v1IntegrationUpdate(appId, integId, integrationUpdate, _options) {
        const requestContextPromise = this.requestFactory.v1IntegrationUpdate(appId, integId, integrationUpdate, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1IntegrationUpdate(rsp)));
        }));
    }
}
exports.ObservableIntegrationApi = ObservableIntegrationApi;
const MessageApi_1 = __webpack_require__(69602);
class ObservableMessageApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.configuration = configuration;
        this.requestFactory = requestFactory || new MessageApi_1.MessageApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new MessageApi_1.MessageApiResponseProcessor();
    }
    createMessageAttemptForEndpoint(appId, endpointId, messageIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.createMessageAttemptForEndpoint(appId, endpointId, messageIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.createMessageAttemptForEndpoint(rsp)));
        }));
    }
    v1MessageCreate(appId, messageIn, withContent, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1MessageCreate(appId, messageIn, withContent, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1MessageCreate(rsp)));
        }));
    }
    v1MessageExpungeContent(appId, msgId, _options) {
        const requestContextPromise = this.requestFactory.v1MessageExpungeContent(appId, msgId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1MessageExpungeContent(rsp)));
        }));
    }
    v1MessageGet(appId, msgId, withContent, _options) {
        const requestContextPromise = this.requestFactory.v1MessageGet(appId, msgId, withContent, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1MessageGet(rsp)));
        }));
    }
    v1MessageGetRawPayload(appId, msgId, _options) {
        const requestContextPromise = this.requestFactory.v1MessageGetRawPayload(appId, msgId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1MessageGetRawPayload(rsp)));
        }));
    }
    v1MessageList(appId, limit, iterator, channel, before, after, withContent, eventTypes, _options) {
        const requestContextPromise = this.requestFactory.v1MessageList(appId, limit, iterator, channel, before, after, withContent, eventTypes, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1MessageList(rsp)));
        }));
    }
}
exports.ObservableMessageApi = ObservableMessageApi;
const MessageAttemptApi_1 = __webpack_require__(35164);
class ObservableMessageAttemptApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.configuration = configuration;
        this.requestFactory = requestFactory || new MessageAttemptApi_1.MessageAttemptApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new MessageAttemptApi_1.MessageAttemptApiResponseProcessor();
    }
    v1MessageAttemptExpungeContent(appId, msgId, attemptId, _options) {
        const requestContextPromise = this.requestFactory.v1MessageAttemptExpungeContent(appId, msgId, attemptId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1MessageAttemptExpungeContent(rsp)));
        }));
    }
    v1MessageAttemptGet(appId, msgId, attemptId, _options) {
        const requestContextPromise = this.requestFactory.v1MessageAttemptGet(appId, msgId, attemptId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1MessageAttemptGet(rsp)));
        }));
    }
    v1MessageAttemptGetHeaders(appId, msgId, attemptId, _options) {
        const requestContextPromise = this.requestFactory.v1MessageAttemptGetHeaders(appId, msgId, attemptId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1MessageAttemptGetHeaders(rsp)));
        }));
    }
    v1MessageAttemptListAttemptedDestinations(appId, msgId, limit, iterator, _options) {
        const requestContextPromise = this.requestFactory.v1MessageAttemptListAttemptedDestinations(appId, msgId, limit, iterator, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1MessageAttemptListAttemptedDestinations(rsp)));
        }));
    }
    v1MessageAttemptListAttemptedMessages(appId, endpointId, limit, iterator, channel, status, before, after, withContent, eventTypes, _options) {
        const requestContextPromise = this.requestFactory.v1MessageAttemptListAttemptedMessages(appId, endpointId, limit, iterator, channel, status, before, after, withContent, eventTypes, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1MessageAttemptListAttemptedMessages(rsp)));
        }));
    }
    v1MessageAttemptListByEndpoint(appId, endpointId, limit, iterator, status, statusCodeClass, channel, before, after, withContent, eventTypes, _options) {
        const requestContextPromise = this.requestFactory.v1MessageAttemptListByEndpoint(appId, endpointId, limit, iterator, status, statusCodeClass, channel, before, after, withContent, eventTypes, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1MessageAttemptListByEndpoint(rsp)));
        }));
    }
    v1MessageAttemptListByEndpointDeprecated(appId, msgId, endpointId, limit, iterator, channel, status, before, after, eventTypes, _options) {
        const requestContextPromise = this.requestFactory.v1MessageAttemptListByEndpointDeprecated(appId, msgId, endpointId, limit, iterator, channel, status, before, after, eventTypes, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1MessageAttemptListByEndpointDeprecated(rsp)));
        }));
    }
    v1MessageAttemptListByMsg(appId, msgId, limit, iterator, status, statusCodeClass, channel, endpointId, before, after, withContent, eventTypes, _options) {
        const requestContextPromise = this.requestFactory.v1MessageAttemptListByMsg(appId, msgId, limit, iterator, status, statusCodeClass, channel, endpointId, before, after, withContent, eventTypes, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1MessageAttemptListByMsg(rsp)));
        }));
    }
    v1MessageAttemptListByMsgDeprecated(appId, msgId, limit, iterator, endpointId, channel, status, before, after, statusCodeClass, eventTypes, _options) {
        const requestContextPromise = this.requestFactory.v1MessageAttemptListByMsgDeprecated(appId, msgId, limit, iterator, endpointId, channel, status, before, after, statusCodeClass, eventTypes, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1MessageAttemptListByMsgDeprecated(rsp)));
        }));
    }
    v1MessageAttemptResend(appId, msgId, endpointId, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1MessageAttemptResend(appId, msgId, endpointId, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1MessageAttemptResend(rsp)));
        }));
    }
}
exports.ObservableMessageAttemptApi = ObservableMessageAttemptApi;
const StatisticsApi_1 = __webpack_require__(13895);
class ObservableStatisticsApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.configuration = configuration;
        this.requestFactory = requestFactory || new StatisticsApi_1.StatisticsApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new StatisticsApi_1.StatisticsApiResponseProcessor();
    }
    calculateAggregateAppStats(appUsageStatsIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.calculateAggregateAppStats(appUsageStatsIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.calculateAggregateAppStats(rsp)));
        }));
    }
    v1StatsAppAttempts(appId, startDate, endDate, _options) {
        const requestContextPromise = this.requestFactory.v1StatsAppAttempts(appId, startDate, endDate, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1StatsAppAttempts(rsp)));
        }));
    }
    v1StatsEndpointAttempts(appId, endpointId, startDate, endDate, _options) {
        const requestContextPromise = this.requestFactory.v1StatsEndpointAttempts(appId, endpointId, startDate, endDate, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1StatsEndpointAttempts(rsp)));
        }));
    }
}
exports.ObservableStatisticsApi = ObservableStatisticsApi;
const TransformationTemplateApi_1 = __webpack_require__(3478);
class ObservableTransformationTemplateApi {
    constructor(configuration, requestFactory, responseProcessor){
        this.configuration = configuration;
        this.requestFactory = requestFactory || new TransformationTemplateApi_1.TransformationTemplateApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new TransformationTemplateApi_1.TransformationTemplateApiResponseProcessor();
    }
    v1TransformationTemplateCreate(templateIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1TransformationTemplateCreate(templateIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1TransformationTemplateCreate(rsp)));
        }));
    }
    v1TransformationTemplateDelete(transformationTemplateId, _options) {
        const requestContextPromise = this.requestFactory.v1TransformationTemplateDelete(transformationTemplateId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1TransformationTemplateDelete(rsp)));
        }));
    }
    v1TransformationTemplateGet(transformationTemplateId, _options) {
        const requestContextPromise = this.requestFactory.v1TransformationTemplateGet(transformationTemplateId, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1TransformationTemplateGet(rsp)));
        }));
    }
    v1TransformationTemplateList(limit, iterator, order, _options) {
        const requestContextPromise = this.requestFactory.v1TransformationTemplateList(limit, iterator, order, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1TransformationTemplateList(rsp)));
        }));
    }
    v1TransformationTemplatePatch(transformationTemplateId, templatePatch, _options) {
        const requestContextPromise = this.requestFactory.v1TransformationTemplatePatch(transformationTemplateId, templatePatch, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1TransformationTemplatePatch(rsp)));
        }));
    }
    v1TransformationTemplateSimulate(transformationSimulateIn, idempotencyKey, _options) {
        const requestContextPromise = this.requestFactory.v1TransformationTemplateSimulate(transformationSimulateIn, idempotencyKey, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1TransformationTemplateSimulate(rsp)));
        }));
    }
    v1TransformationTemplateUpdate(transformationTemplateId, templateUpdate, _options) {
        const requestContextPromise = this.requestFactory.v1TransformationTemplateUpdate(transformationTemplateId, templateUpdate, _options);
        let middlewarePreObservable = rxjsStub_1.from(requestContextPromise);
        for (let middleware of this.configuration.middleware){
            middlewarePreObservable = middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>middleware.pre(ctx)));
        }
        return middlewarePreObservable.pipe(rxjsStub_2.mergeMap((ctx)=>this.configuration.httpApi.send(ctx))).pipe(rxjsStub_2.mergeMap((response)=>{
            let middlewarePostObservable = rxjsStub_1.of(response);
            for (let middleware of this.configuration.middleware){
                middlewarePostObservable = middlewarePostObservable.pipe(rxjsStub_2.mergeMap((rsp)=>middleware.post(rsp)));
            }
            return middlewarePostObservable.pipe(rxjsStub_2.map((rsp)=>this.responseProcessor.v1TransformationTemplateUpdate(rsp)));
        }));
    }
}
exports.ObservableTransformationTemplateApi = ObservableTransformationTemplateApi; //# sourceMappingURL=ObservableAPI.js.map


/***/ }),

/***/ 53617:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.isCodeInRange = void 0;
function isCodeInRange(codeRange, code) {
    if (codeRange === "0") {
        return true;
    }
    if (codeRange == code.toString()) {
        return true;
    } else {
        const codeString = code.toString();
        if (codeString.length != codeRange.length) {
            return false;
        }
        for(let i = 0; i < codeString.length; i++){
            if (codeRange.charAt(i) != "X" && codeRange.charAt(i) != codeString.charAt(i)) {
                return false;
            }
        }
        return true;
    }
}
exports.isCodeInRange = isCodeInRange; //# sourceMappingURL=util.js.map


/***/ }),

/***/ 94972:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.timingSafeEqual = void 0;
function assert(expr, msg = "") {
    if (!expr) {
        throw new Error(msg);
    }
}
function timingSafeEqual(a, b) {
    if (a.byteLength !== b.byteLength) {
        return false;
    }
    if (!(a instanceof DataView)) {
        a = new DataView(ArrayBuffer.isView(a) ? a.buffer : a);
    }
    if (!(b instanceof DataView)) {
        b = new DataView(ArrayBuffer.isView(b) ? b.buffer : b);
    }
    assert(a instanceof DataView);
    assert(b instanceof DataView);
    const length = a.byteLength;
    let out = 0;
    let i = -1;
    while(++i < length){
        out |= a.getUint8(i) ^ b.getUint8(i);
    }
    return out === 0;
}
exports.timingSafeEqual = timingSafeEqual; //# sourceMappingURL=timing_safe_equal.js.map


/***/ }),

/***/ 52676:
/***/ ((module) => {


/***/ })

};
;