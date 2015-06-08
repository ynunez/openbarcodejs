# openbarcode

Usage with **Node.js**

Install by using `npm install openbarcode`

    var openbarcode = require("openbarcode");

    try {
        var upc = new openbarcode.UPC("12345678901");

        console.log(upc.bars());
        console.log(upc.code());
        
        var ean = new openbarcode.UPC("123456789012");

        console.log(ean.bars());
        console.log(ean.code());

        var code39 = new openbarcode.Code39("Hello World");

        console.log(code39.bars());
        console.log(code39.code());;
    } catch (e) {
        console.log(e);
    }
