/**
 * Copyright 2013-2014 Yoel Nunez <dev@nunez.guru>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
var openbarcode = (function () {
    var barcode = {};

    barcode.Linear = function () {
        this._bars = [];
        this._code = null;

        /**
         *
         * @returns {Array} - list of bars 1:black 0:white
         */
        this.bars = function () {
            return this._bars;
        };

        /**
         *
         * @returns {*} - original code
         */
        this.code = function () {
            return this._code;
        };
    };

    /**
     * UPC Barcode
     * @param {number} code - number to be encoded
     * @constructor
     */
    barcode.UPC = function (code) {
        barcode.Linear.call(this);

        if (typeof code == "string") {
            code = parseInt(code).toString();
        }

        if (code.toString().length != 11 && code.toString().length != 12) {
            throw new barcode.Exception("Invalid UPC barcode length")
        }

        this._code = code.toString().substr(0, 11);

        this._generateBars();
    };

    /**
     *
     * @type {barcode.Linear}
     */
    barcode.UPC.prototype = Object.create(barcode.Linear.prototype);
    barcode.UPC.constructor = barcode.UPC;

    /**
     *
     * @returns {number}
     * @private
     */
    barcode.UPC.prototype._checkDigit = function () {
        var sum = 0, digit = 0;

        for (var i = 0; i < 11; i++) {
            digit = parseInt(this._code[i]);
            if (i % 2 == 0) {
                sum += digit * 3;
            }
            else {
                sum += digit;
            }
        }

        sum %= 10;

        return (sum != 0) ? 10 - sum : sum;
    };

    /**
     *
     * @private
     */
    barcode.UPC.prototype._generateBars = function () {
        this._code += this._checkDigit();

        var code = "*" + this._code.substr(0, 6) + "#" + this._code.substr(6, 6) + "*";

        for (var i = 0; i < code.length; i++) {
            this._bars = this._bars.concat(this._mapper(code[i], i));
        }
    };

    /**
     *
     * @param char
     * @param index
     * @returns {*}
     * @private
     */
    barcode.UPC.prototype._mapper = function (char, index) {
        var sequence = {
            "0": [0, 0, 0, 1, 1, 0, 1], "1": [0, 0, 1, 1, 0, 0, 1], "2": [0, 0, 1, 0, 0, 1, 1],
            "3": [0, 1, 1, 1, 1, 0, 1], "4": [0, 1, 0, 0, 0, 1, 1], "5": [0, 1, 1, 0, 0, 0, 1],
            "6": [0, 1, 0, 1, 1, 1, 1], "7": [0, 1, 1, 1, 0, 1, 1], "8": [0, 1, 1, 0, 1, 1, 1],
            "9": [0, 0, 0, 1, 0, 1, 1], "#": [0, 1, 0, 1, 0], "*": [1, 0, 1]
        };

        if (index >= 7) {
            sequence["0"] = [1, 1, 1, 0, 0, 1, 0];
            sequence["1"] = [1, 1, 0, 0, 1, 1, 0];
            sequence["2"] = [1, 1, 0, 1, 1, 0, 0];
            sequence["3"] = [1, 0, 0, 0, 0, 1, 0];
            sequence["4"] = [1, 0, 1, 1, 1, 0, 0];
            sequence["5"] = [1, 0, 0, 1, 1, 1, 0];
            sequence["6"] = [1, 0, 1, 0, 0, 0, 0];
            sequence["7"] = [1, 0, 0, 0, 1, 0, 0];
            sequence["8"] = [1, 0, 0, 1, 0, 0, 0];
            sequence["9"] = [1, 1, 1, 0, 1, 0, 0];
        }

        return sequence[char];
    };

    /**
     * EAN13 Barcode
     * @param {number} code - number to be encoded
     * @constructor
     */
    barcode.EAN = function (code) {
        barcode.Linear.call(this);

        if (typeof code == "string") {
            code = parseInt(code).toString();
        }

        if (code.toString().length != 12 && code.toString().length != 13) {
            throw new barcode.Exception("Invalid EAN barcode length")
        }

        this._base = parseInt(code[0]);
        this._code = code.toString().substr(0, 12);


        this._generateBars();
    };

    /**
     *
     * @type {barcode.Linear}
     */
    barcode.EAN.prototype = Object.create(barcode.Linear.prototype);
    barcode.EAN.constructor = barcode.EAN;

    /**
     *
     * @returns {number}
     * @private
     */
    barcode.EAN.prototype._checkDigit = function () {
        var sum = 0, digit = 0;

        for (var i = 0; i < 12; i++) {
            digit = parseInt(this._code[i]);
            if (i % 2 == 1) {
                sum += digit * 3;
            } else {
                sum += digit;
            }
        }

        sum %= 10;

        return (sum != 0) ? 10 - sum : sum;
    };

    barcode.EAN.prototype._codeL = function codeL() {
        return {
            "0": [0, 0, 0, 1, 1, 0, 1],
            "1": [0, 0, 1, 1, 0, 0, 1],
            "2": [0, 0, 1, 0, 0, 1, 1],
            "3": [0, 1, 1, 1, 1, 0, 1],
            "4": [0, 1, 0, 0, 0, 1, 1],
            "5": [0, 1, 1, 0, 0, 0, 1],
            "6": [0, 1, 0, 1, 1, 1, 1],
            "7": [0, 1, 1, 1, 0, 1, 1],
            "8": [0, 1, 1, 0, 1, 1, 1],
            "9": [0, 0, 0, 1, 0, 1, 1],
            "#": [0, 1, 0, 1, 0],
            "*": [1, 0, 1]
        };
    };

    barcode.EAN.prototype._codeG = function () {
        var base = this._codeL();

        base["0"] = [0, 1, 0, 0, 1, 1, 1];
        base["1"] = [0, 1, 1, 0, 0, 1, 1];
        base["2"] = [0, 0, 1, 1, 0, 1, 1];
        base["3"] = [0, 1, 0, 0, 0, 0, 1];
        base["4"] = [0, 0, 1, 1, 1, 0, 1];
        base["5"] = [0, 1, 1, 1, 0, 0, 1];
        base["6"] = [0, 0, 0, 0, 1, 0, 1];
        base["7"] = [0, 0, 1, 0, 0, 0, 1];
        base["8"] = [0, 0, 0, 1, 0, 0, 1];
        base["9"] = [0, 0, 1, 0, 1, 1, 1];

        return base;
    };

    barcode.EAN.prototype._codeR = function () {
        var base = this._codeL();

        base["0"] = [1, 1, 1, 0, 0, 1, 0];
        base["1"] = [1, 1, 0, 0, 1, 1, 0];
        base["2"] = [1, 1, 0, 1, 1, 0, 0];
        base["3"] = [1, 0, 0, 0, 0, 1, 0];
        base["4"] = [1, 0, 1, 1, 1, 0, 0];
        base["5"] = [1, 0, 0, 1, 1, 1, 0];
        base["6"] = [1, 0, 1, 0, 0, 0, 0];
        base["7"] = [1, 0, 0, 0, 1, 0, 0];
        base["8"] = [1, 0, 0, 1, 0, 0, 0];
        base["9"] = [1, 1, 1, 0, 1, 0, 0];

        return base;
    };

    /**
     *
     * @private
     */
    barcode.EAN.prototype._generateBars = function () {
        this._code += this._checkDigit();

        var code = "*" + this._code.substr(1, 6) + "#" + this._code.substr(7, 6) + "*";

        for (i = 0; i < code.length; i++) {
            this._bars = this._bars.concat(this._mapper(code[i], i));
        }
    };

    /**
     *
     * @param char
     * @param index
     * @returns {*}
     * @private
     */
    barcode.EAN.prototype._mapper = function (char, index) {
        var sequence = {};

        var b = this._base;


        if (index > 6) {
            sequence = this._codeR();
        } else {
            switch (b) {
                case 0:
                    sequence = this._codeL();
                    break;
                case 1:
                    if (index == 1 || index == 2 || index == 4) {
                        sequence = this._codeL();
                    } else {
                        sequence = this._codeG();
                    }
                    break;
                case 2:
                    if (index == 1 || index == 2 || index == 5) {
                        sequence = this._codeL();
                    } else {
                        sequence = this._codeG();
                    }
                    break;
                case 3:
                    if (index == 1 || index == 2 || index == 6) {
                        sequence = this._codeL();
                    } else {
                        sequence = this._codeG();
                    }
                    break;
                case 4:
                    if (index == 1 || index == 3 || index == 4) {
                        sequence = this._codeL();
                    } else {
                        sequence = this._codeG();
                    }
                    break;
                case 5:
                    if (index == 1 || index == 4 || index == 5) {
                        sequence = this._codeL();
                    } else {
                        sequence = this._codeG();
                    }
                    break;
                case 6:
                    if (index == 1 || index == 5 || index == 6) {
                        sequence = this._codeL();
                    } else {
                        sequence = this._codeG();
                    }
                    break;
                case 7:
                    if (index == 1 || index == 3 || index == 5) {
                        sequence = this._codeL();
                    } else {
                        sequence = this._codeG();
                    }
                    break;
                case 8:
                    if (index == 1 || index == 3 || index == 6) {
                        sequence = this._codeL();
                    } else {
                        sequence = this._codeG();
                    }
                    break;
                case 9:
                    if (index == 1 || index == 4 || index == 6) {
                        sequence = this._codeL();
                    } else {
                        sequence = this._codeG();
                    }
                    break;
            }
        }


        return sequence[char];
    };

    /**
     * Code39 Barcode
     * @param {string} code - data to be encoded
     * @constructor
     */
    barcode.Code39 = function (code) {
        barcode.Linear.call(this);

        this._code = code.toUpperCase();
        this._generateBars();
    };

    /**
     *
     * @type {barcode.Linear}
     */
    barcode.Code39.prototype = Object.create(barcode.Linear.prototype);
    barcode.Code39.constructor = barcode.Code39;

    /**
     *
     * @private
     */
    barcode.Code39.prototype._generateBars = function () {
        var code = "*" + this._code + "*";

        for (var i = 0; i < code.length; i++) {
            this._bars = this._bars.concat(this._mapper(code[i], i));
        }
    };

    /**
     *
     * @param char
     * @returns {*}
     * @private
     */
    barcode.Code39.prototype._mapper = function (char) {
        var sequence = {
            "0": [1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1],
            "1": [1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1],
            "2": [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1],
            "3": [1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1],
            "4": [1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1],
            "5": [1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1],
            "6": [1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1],
            "7": [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1],
            "8": [1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1],
            "9": [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1],
            "A": [1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1],
            "B": [1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1],
            "C": [1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1],
            "D": [1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1],
            "E": [1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1],
            "F": [1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1],
            "G": [1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1],
            "H": [1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1],
            "I": [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1],
            "J": [1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
            "K": [1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1],
            "L": [1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1],
            "M": [1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1],
            "N": [1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1],
            "O": [1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1],
            "P": [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1],
            "Q": [1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1],
            "R": [1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1],
            "S": [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1],
            "T": [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1],
            "U": [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1],
            "V": [1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1],
            "W": [1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1],
            "X": [1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],
            "Y": [1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1],
            "Z": [1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1],
            "-": [1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1],
            ".": [1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1],
            " ": [1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
            "$": [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
            "/": [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
            "+": [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
            "%": [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
            "*": [1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1]
        };

        return sequence[char].concat([0]);
    };


    /**
     * Barcode Generation Exception
     * @param {string} message - error message
     * @constructor
     */
    barcode.Exception = function (message) {
        this.message = message;
    };

    return barcode;

})();