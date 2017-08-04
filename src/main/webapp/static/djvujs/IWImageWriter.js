'use strict';

class IWImageWriter {

    constructor(slicenumber, delayInit, grayscale) {
        // число кусочков кодируемых
        this.slicenumber = slicenumber || 100;
        // серые ли изображения
        this.grayscale = grayscale || 0;
        // задержка кодирования цветовой информации
        this.delayInit = (delayInit & 127) || 0;
        this.onprocess = undefined; // обработчик события записи страницы
    }

    get width() {
        return this.imageData.width;
    }
    get height() {
        return this.imageData.height;
    }

    startMultyPageDocument() {
        this.dw = new DjVuWriter();
        this.dw.startDJVM();
        this.pageBuffers = [];
        var dirm = {};
        this.dirm = dirm;
        dirm.offsets = [];
        dirm.dflags = 129; // 1000 0001
        dirm.flags = [];
        dirm.ids = [];
        dirm.sizes = []; 
        // titles and names are not used by this encoder
    }

    addPageToDocument(imageData) {
        var tbsw = new ByteStreamWriter(); // временный буфер для записи
        this.writeImagePage(tbsw, imageData);
        var buffer = tbsw.getBuffer();
        this.pageBuffers.push(buffer);
        this.dirm.flags.push(1); // страница без имени и заголовка
        this.dirm.ids.push('p' + this.dirm.ids.length); // просто уникальный id
        this.dirm.sizes.push(buffer.byteLength); // размеры
    }

    endMultyPageDocument() {
        this.dw.writeDirmChunk(this.dirm);
        var len = this.pageBuffers.length;
        for (var i = 0; i < len; i++) {
            this.dw.writeFormChunkBuffer(this.pageBuffers.shift());
        }
        var buffer = this.dw.getBuffer();
        delete this.dw;
        delete this.pageBuffers;
        delete this.dirm;
        return buffer;
    }

    createMultyPageDocument(imageArray) {
        var dw = new DjVuWriter();
        dw.startDJVM();
        var length = imageArray.length;
        var pageBuffers = new Array(imageArray.length);
        var dirm = {};
        this.dirm = dirm;
        dirm.offsets = [];
        dirm.dflags = 129; // 1000 0001
        dirm.flags = new Array(imageArray.length);
        dirm.ids = new Array(imageArray.length);
        dirm.sizes = new Array(imageArray.length);
        var tbsw = new ByteStreamWriter(); // временный буфер для записи
        // генерируем все необходимые данные
        for (var i = 0; i < imageArray.length; i++) {
            this.writeImagePage(tbsw, imageArray[i]);
            var buffer = tbsw.getBuffer();
            pageBuffers[i] = buffer;
            tbsw.reset();
            dirm.flags[i] = 1; // страница без имени и заголовка
            dirm.ids[i] = 'p' + i; // просто уникальный id
            dirm.sizes[i] = buffer.byteLength; // размеры
            this.onprocess ? this.onprocess((i + 1) / length) : 0; // событие обработки очередной страницы
        }
        dw.writeDirmChunk(dirm);
        for (var i = 0; i < imageArray.length; i++) {
            dw.writeFormChunkBuffer(pageBuffers[i]);
        }

        return new DjVuDocument(dw.getBuffer());
    }

    /**
     * Кодирует и записывает в поток 1 картинку
     */
    writeImagePage(bsw, imageData) {
        // пропускаем 4 байта для длины файла
        bsw.writeStr('FORM').saveOffsetMark('formSize').jump(4).writeStr('DJVU');
        // записываем порцию информации
        bsw.writeStr('INFO')
            .writeInt32(10)
            .writeInt16(imageData.width)
            .writeInt16(imageData.height)
            .writeByte(24).writeByte(0)
            .writeByte(100 & 0xff)
            .writeByte(100 >> 8)
            .writeByte(22).writeByte(1);

        //начинаем запись порции цветной
        bsw.writeStr('BG44').saveOffsetMark('BG44Size').jump(4);
        //пишем заголовок
        bsw.writeByte(0)
            .writeByte(this.slicenumber)
            //majver
            .writeByte((this.grayscale << 7) | 1) // это 129 или 1 в зависимости от this.grayscale
            //minver
            .writeByte(2)
            .writeUint16(imageData.width)
            .writeUint16(imageData.height)
            .writeByte(this.delayInit);

        var ycodec = new IWEncoder(this.RGBtoY(imageData));
        var crcodec, cbcodec;
        if (!this.grayscale) {
            cbcodec = new IWEncoder(this.RGBtoCb(imageData));
            crcodec = new IWEncoder(this.RGBtoCr(imageData));
        }

        var zp = new ZPEncoder(bsw);
        for (var i = 0; i < this.slicenumber; i++) {
            ycodec.encodeSlice(zp);
            if (cbcodec && crcodec && i >= this.delayInit) {
                cbcodec.encodeSlice(zp);
                crcodec.encodeSlice(zp);
            }
        }
        zp.eflush();
        bsw.rewriteSize('formSize');
        bsw.rewriteSize('BG44Size');
    }

    createOnePageDocument(imageData) {
        var bsw = new ByteStreamWriter(10 * 1024);
        bsw.writeStr('AT&T');
        this.writeImagePage(bsw, imageData);
        // возвращаем новый одностраничный документ
        return new DjVuDocument(bsw.getBuffer());
    }


    /**
     * Перевод RGB в Y откопировано из djvulibre
     * @param {ImageData} imageData
     * @returns {Bytemap} двумерный байтовый массив
     */
    RGBtoY(imageData) {
        var rmul = new Int32Array(256);
        var gmul = new Int32Array(256);
        var bmul = new Int32Array(256);
        var data = imageData.data;
        var width = imageData.width;
        var height = imageData.height;
        var bytemap = new Bytemap(width, height);
        //преобразование необходимое при кодировании серых изображений, чтобы усилить цвет. 
        if (this.grayscale) {
            for (var i = 0; i < data.length; i++) {
                data[i] = 255 - data[i];
            }
        }
        for (var k = 0; k < 256; k++) {
            rmul[k] = (k * 0x10000 * this.rgb_to_ycc[0][0]);
            gmul[k] = (k * 0x10000 * this.rgb_to_ycc[0][1]);
            bmul[k] = (k * 0x10000 * this.rgb_to_ycc[0][2]);
        }
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                //сразу разворачиваем в прямые координаты
                var index = ((height - i - 1) * width + j) << 2;
                var y = rmul[data[index]] + gmul[data[index + 1]] + bmul[data[index + 2]] + 32768;
                bytemap[i][j] = ((y >> 16) - 128) << this.iw_shift;
            }
        }
        return bytemap;
    }

    /**
     * Перевод RGB в Cb откопировано из djvulibre
     * @param {ImageData} imageData
     * @returns {Bytemap} двумерный байтовый массив
     */
    RGBtoCb(imageData) {
        var rmul = new Int32Array(256);
        var gmul = new Int32Array(256);
        var bmul = new Int32Array(256);
        var data = imageData.data;
        var width = imageData.width;
        var height = imageData.height;
        var bytemap = new Bytemap(width, height);
        for (var k = 0; k < 256; k++) {
            rmul[k] = (k * 0x10000 * this.rgb_to_ycc[2][0]);
            gmul[k] = (k * 0x10000 * this.rgb_to_ycc[2][1]);
            bmul[k] = (k * 0x10000 * this.rgb_to_ycc[2][2]);
        }
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                //сразу разворачиваем в прямые координаты
                var index = ((height - i - 1) * width + j) << 2;
                var y = rmul[data[index]] + gmul[data[index + 1]] + bmul[data[index + 2]] + 32768;
                bytemap[i][j] = Math.max(-128, Math.min(127, y >> 16)) << this.iw_shift;
            }
        }
        return bytemap;
    }

    /**
     * Перевод RGB в Cr откопировано из djvulibre
     * @param {ImageData} imageData
     * @returns {Bytemap} двумерный байтовый массив
     */
    RGBtoCr(imageData) {
        var rmul = new Int32Array(256);
        var gmul = new Int32Array(256);
        var bmul = new Int32Array(256);
        var data = imageData.data;
        var width = imageData.width;
        var height = imageData.height;
        var bytemap = new Bytemap(width, height);
        for (var k = 0; k < 256; k++) {
            rmul[k] = (k * 0x10000 * this.rgb_to_ycc[1][0]);
            gmul[k] = (k * 0x10000 * this.rgb_to_ycc[1][1]);
            bmul[k] = (k * 0x10000 * this.rgb_to_ycc[1][2]);
        }
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                //сразу разворачиваем в прямые координаты
                var index = ((height - i - 1) * width + j) << 2;
                var y = rmul[data[index]] + gmul[data[index + 1]] + bmul[data[index + 2]] + 32768;
                bytemap[i][j] = Math.max(-128, Math.min(127, y >> 16)) << this.iw_shift;
            }
        }
        return bytemap;
    }
}

//сдвиг для кодирования изображений
IWImageWriter.prototype.iw_shift = 6;
IWImageWriter.prototype.rgb_to_ycc = [
    [0.304348, 0.608696, 0.086956],
    [0.463768, -0.405797, -0.057971],
    [-0.173913, -0.347826, 0.521739]];