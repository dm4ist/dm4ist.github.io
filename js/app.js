'use strict';

$('#add').on("click", function () {
    $('.modal-area').toggleClass('hide');
});

$('#btn-save-things').off('click').on('click', function () {
    createDoings();
});

$('#close-modal-addForm').on('click', function () {
    $('.modal-area').toggleClass('hide');
    $('.wrong').html('');
});

$('#close-modal-progress').on('click', function () {
    $('.modal-area-progress').toggleClass('hide');
});

$('#close-modal-editForm').on('click', function () {
    $('.modal-area-edit').toggleClass('hide');
});

// Отправка файла на сервер
$('#share').on('click', function () {
    let dataInStorage = JSON.stringify(dataDoings);
    $.ajax({
        type: "POST",
        url: "http://httpbin.org/post",
        data: dataInStorage
    }).done(function (msg) {
        alert("Data Saved: Return Object in console");
        console.log(msg.form);
    }).fail(function (msg) {
        alert("Error");
        console.log(msg.form);
    }).always(function () {
        console.log("Complete");
    });
});