'use babel';

var TokenType = require('./const').TokenType;
var IS_PUNCTUATION = require('./const').IS_PUNCTUATION;
var SYMBOL_CATEGORY = require('./const').SYMBOL_CATEGORY;
var SYMBOL_CATEGORY_LENGTH = SYMBOL_CATEGORY.length;

var WHITESPACE = TokenType.Whitespace;
var IDENTIFIER = TokenType.Identifier;
var NUMBER = TokenType.Number;
var STRING = TokenType.String;
var COMMENT = TokenType.Comment;
var PUNCTUATION = TokenType.Punctuation;

var TAB = 9;
var N = 10;
var F = 12;
var R = 13;
var SPACE = 32;
var STAR = 42;
var SLASH = 47;
var BACK_SLASH = 92;
var FULLSTOP = TokenType.FullStop;
var PLUSSIGN = TokenType.PlusSign;
var HYPHENMINUS = TokenType.HyphenMinus;
var E = 101; // 'e'.charCodeAt(0)

var MIN_ARRAY_SIZE = 16 * 1024;
var lastIndexOf = Array.prototype.lastIndexOf; // some browser implementations have no TypedArray#lastIndexOf
var LongArray = typeof Uint32Array !== 'undefined' ? Uint32Array : Array;

var lines = null;

function isHex(code) {
    return (code >= 48 && code <= 57) || // 0 .. 9
        (code >= 65 && code <= 70) || // A .. F
        (code >= 97 && code <= 102);  // a .. f
}

function firstCharOffset(source) {
    return source.charCodeAt(0) === 0xFEFF ? 1 : 0;
}

function isNumber(code) {
    return code >= 48 && code <= 57;
}

function isNewline(source, offset, code) {
    if (code === N || code === F || code === R) {
        if (code === R && offset + 1 < source.length && source.charCodeAt(offset + 1) === N) {
            return 2;
        }

        return 1;
    }

    return 0;
}

function findWhitespaceEnd(source, offset) {
    for (; offset < source.length; offset++) {
        var code = source.charCodeAt(offset);

        if (code !== SPACE && code !== TAB && code !== R && code !== N && code !== F) {
            break;
        }
    }

    return offset;
}

function findCommentEnd(source, offset) {
    var commentEnd = source.indexOf('*/', offset);

    if (commentEnd === -1) {
        return source.length;
    }

    return commentEnd + 2;
}

function findStringEnd(source, offset, quote) {
    for (; offset < source.length; offset++) {
        var code = source.charCodeAt(offset);

        // TODO: bad string
        if (code === BACK_SLASH) {
            offset++;
        } else if (code === quote) {
            offset++;
            break;
        }
    }

    return offset;
}

function findDecimalNumberEnd(source, offset) {
    for (; offset < source.length; offset++) {
        var code = source.charCodeAt(offset);

        if (code < 48 || code > 57) {  // not a 0 .. 9
            break;
        }
    }

    return offset;
}

function findNumberEnd(source, offset, allowFraction) {
    var code;

    offset = findDecimalNumberEnd(source, offset);

    // fraction: .\d+
    if (allowFraction && offset + 1 < source.length && source.charCodeAt(offset) === FULLSTOP) {
        code = source.charCodeAt(offset + 1);

        if (isNumber(code)) {
            offset = findDecimalNumberEnd(source, offset + 1);
        }
    }

    // exponent: e[+-]\d+
    if (offset + 1 < source.length) {
        if ((source.charCodeAt(offset) | 32) === E) { // case insensitive check for `e`
            code = source.charCodeAt(offset + 1);

            if (code === PLUSSIGN || code === HYPHENMINUS) {
                if (offset + 2 < source.length) {
                    code = source.charCodeAt(offset + 2);
                }
            }

            if (isNumber(code)) {
                offset = findDecimalNumberEnd(source, offset + 2);
            }
        }
    }

    return offset;
}

// skip escaped unicode sequence that can ends with space
// [0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?
function findEscaseEnd(source, offset) {
    for (var i = 0; i < 7 && offset + i < source.length; i++) {
        var code = source.charCodeAt(offset + i);

        if (i !== 6 && isHex(code)) {
            continue;
        }

        if (i > 0) {
            offset += i - 1 + isNewline(source, offset + i, code);
            if (code === SPACE || code === TAB) {
                offset++;
            }
        }

        break;
    }

    return offset;
}

function findIdentifierEnd(source, offset) {
    for (; offset < source.length; offset++) {
        var code = source.charCodeAt(offset);

        if (code === BACK_SLASH) {
            offset = findEscaseEnd(source, offset + 1);
        } else if (code < SYMBOL_CATEGORY_LENGTH && IS_PUNCTUATION[code] === PUNCTUATION) {
            break;
        }
    }

    return offset;
}

function findEnd(source, startPos) {
    var sourceLength = source.length;
    var prevType = 0;
    var offset = startPos;

    var code = source.charCodeAt(offset);
    var type = code < SYMBOL_CATEGORY_LENGTH ? SYMBOL_CATEGORY[code] : IDENTIFIER;

    switch (type) {
        case WHITESPACE:
            offset = findWhitespaceEnd(source, offset + 1);
            break;

        case PUNCTUATION:
            if (code === STAR && prevType === SLASH) { // /*
                type = COMMENT;
                offset = findCommentEnd(source, offset + 1);
            } else {
                // edge case for -.123 and +.123
                if (code === FULLSTOP && (prevType === PLUSSIGN || prevType === HYPHENMINUS)) {
                    if (offset + 1 < sourceLength && isNumber(source.charCodeAt(offset + 1))) {
                        type = NUMBER;
                        offset = findNumberEnd(source, offset + 2, false);
                        break;
                    }
                }

                type = code;
                offset = offset + 1;
            }

            break;

        case NUMBER:
            offset = findNumberEnd(source, offset + 1, prevType !== FULLSTOP);
            break;

        case STRING:
            offset = findStringEnd(source, offset + 1, code);
            break;

        default:
            offset = findIdentifierEnd(source, offset);

        return offset;
    }

    return offset;
}

exports.findEnd = findEnd;
