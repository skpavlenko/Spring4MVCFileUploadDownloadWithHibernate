<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="shortcut icon" href="<c:url value='/static/img/catfav.png' />" type="image/x-icon"></link>
    <title>DjVu.js | Работа с DjVu файлами онлайн</title>
    <script src="<c:url value='/static/js/jquery-3.0.0.min.js' />"></script>
    <script src="<c:url value='/static/djvujs/DjVu.js' />"></script>
    <script src="<c:url value='/static/djvujs/DjVuWorker.js' />"></script>
    <script src="<c:url value='/static/djvujs/DjVuViewer.js' />"></script>
    <script src="<c:url value='/static/js/app.js' />"></script>
    <link href="<c:url value='/static/css/app.css' />" rel="stylesheet"></link>
</head>

<body>
    <div id="djvu_app" class="djvu_app">
        <div class="additionalBlock">
            <input id="backbutton" type="button" class="activebut" value="Назад к выбору функций">
        </div>
        <div class="func_menu_block" id="funcmenublock">
            <div id="slicefunc" class="funcelem" title="Разделить DjVu документ онлайн">
                Разделить DjVu
            </div>
            <div id="picturefunc" class="funcelem" title="Создать DjVu из картинок онлайн">
                Картинки в DjVu
            </div>
            <div id="cancatfunc" class="disabledfunc">
                Объединить DjVu
            </div>
            <div id="addpicfunc" class="disabledfunc">
                Добавить картинки к DjVu
            </div>
            <div id="viewfunc" class="funcelem">
                Просмотреть DjVu
            </div>
            <div id="metadatafunc" class="funcelem">
                Метаданные DjVu
            </div>
        </div>
        <div id="funcblock" class="wrapper funcblock">
            <input name="finput" type="file" class="activebut" id="finput">
            <br>
            <p id="warnmess"></p>

            <div class="funcblock" id="sliceblock">
                <p class="describing">
                    Выберите djvu документ. Введите номер первой и последней страницы, которые Вы хотите поместить в новый документ.
                </p>
                <p class="info"></p>
                <p class="message"></p>
                <span class="inputext">Номер первой страницы</span>
                <input type="number" id="firstnum"><br>
                <span class="inputext">Номер последней страницы</span>
                <input type="number" id="secondnum"><br>
                <input type="button" class="activebut" value="Разделить файл" id="slicebut" disabled>
            </div>

            <div class="funcblock" id="pictureblock">
                <p class="describing">
                    Выберите одну или несколько картинок для создания djvu документа. Можно настраивать качество изображение (влияет на размер
                    файла).
                </p>
                <p class="info"></p>
                <p>Выбетите качество кодирования. При хорошем качестве изображение в djvu весит примерно вдвое меньше, чем в
                    формате jpeg. Другие варианты, еще более экономичны.</p>
                <form>
                    <input name="imagequality" type="radio" value="100">Хорошее
                    <input name="imagequality" type="radio" value="90" checked>Среднее
                    <input name="imagequality" type="radio" value="80">Плохое
                </form><br><br>
                <input type="checkbox" id="grayscale" value="1">Серое изображение (отбросить цвета при кодировании)
                <br><br>
                <input type="button" class="activebut" value="Создать документ" id="picturebut" disabled>
            </div>

            <div class="funcblock" id="metaDataBlock">
                <p class="describing">
                    Выберите djvu документ. Метаданные представляют структуру djvu файла. Каждая единица (порция) данных или Data Chunk расположены
                    в том порядке, в котором они встречаются в файле. Некоторые порции описаны подробно в соответствии с
                    их назначение и устройством, другие же характеризуются лишь заголовком и длиной, так как библиотека способна
                    читать не все порции данных, или же не представляется возможным вывести информацию в текстовом виде кратко.
                    Перед каждой страницей или словарем выводится id машинного оглавления.
                </p>
                <p class="info"></p>
                <p id="metadata"></p>
            </div>
            <br>
            <p id="procmess"></p>
            <a href="" id="filehref" download="djvujs_file.djvu"> Сохранить файл </a>
        </div>

        <div class="funcblock" id="djvuViewerBlock">
            <p class="describing">
                Выберите djvu документ, который Вы хотите просмотреть.
            </p>
            <div id="viewer" class="djvu_viewer">
                <div class="image_wrapper">
                    <img class="image" />
                </div>
                <div class="controls">
                    <input type="button" class="navbut prev" value="&#9668;">
                    <input class="page_number" type="number">
                    <input type="button" class="navbut next" value="&#9658;">
                    <input class="scale" type="range" min="0" max="200" step="1" value="100"><span class="scale_label">100</span>%
                </div>
            </div>
        </div>
    </div>

</body>

</html>