<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>DjVu.js</title>
<script type="text/javascript" src="../../resources/djvujs/DjVuGlobals.js"></script>
<script type="text/javascript" src="../../resources/djvujs/ByteStream.js"></script>
<script type="text/javascript" src="../../resources/djvujs/ZPCodec.js"></script>
<script type="text/javascript" src="../../resources/djvujs/IFFChunks.js"></script>
<script type="text/javascript" src="../../resources/djvujs/BZZDecoder.js"></script>
<script type="text/javascript" src="../../resources/djvujs/BZZEncoder.js"></script>
<script type="text/javascript" src="../../resources/djvujs/IWCodecBaseClass.js"></script>
<script type="text/javascript" src="../../resources/djvujs/IWDecoder.js"></script>
<script type="text/javascript" src="../../resources/djvujs/IWEncoder.js"></script>
<script type="text/javascript" src="../../resources/djvujs/IWImage.js"></script>
<script type="text/javascript" src="../../resources/djvujs/JB2Codec.js"></script>
<script type="text/javascript" src="../../resources/djvujs/JB2Dict.js"></script>
<script type="text/javascript" src="../../resources/djvujs/JB2Image.js"></script>
<script type="text/javascript" src="../../resources/djvujs/DjViChunk.js"></script>
<script type="text/javascript" src="../../resources/djvujs/DjVuPage.js"></script>
<script type="text/javascript" src="../../resources/djvujs/DjVuDocument.js"></script>
<script type="text/javascript" src="../../resources/js/handler.js" defer></script>
<script type="text/javascript" src="../../resources/djvujs/ByteStreamWriter.js"></script>
<script type="text/javascript" src="../../resources/djvujs/IWImageWriter.js"></script>
<script type="text/javascript" src="../../resources/djvujs/DjVuWriter.js"></script>
<script type="text/javascript" src="../../resources/djvujs/DjVuGlobals.js" defer></script>
<script type="text/javascript" src="../../resources/djvujs/debug.js"></script>
<script type="text/javascript" src="../../resources/js/initScript.js" defer></script>
<script type="text/javascript" src="../../resources/djvujs/DjVuWorker.js"></script>
<link rel="stylesheet" href="../../resources/css/style.css">
</head>
<body>
    <canvas width="192" height="256" id="canvas"></canvas>
    <img id="img" src=""/><br>
    <a id="dochref" href="#" download="file.djvu">Скачать</a>
    <canvas width="200" height="260" id="canvas2"></canvas>
    <div id="output2"></div>
    <input type="file" multiple onchange="main(this.files)" />
    <div id="output"></div>
    
</body>
</html>
