'use strict';

let dataSettings = '';
let dataDoings = [];

let addInDataSettings = (data) => {
    dataSettings = data;
    checkStorage();
}

$.ajax({
    type: 'GET',
    url: 'data.json',
    dataType: "json",
    success: addInDataSettings
}).done(function (msg) {
    console.log("data.json loaded successfully");
    console.log(msg);
}).fail(function () {
    console.log("Error data.json not loaded");
    console.log("Another data loaded successfully from help file");
    dataSettings = dataHelp;
    checkStorage();
    console.log(dataHelp);
}).always(function () {
    console.log("Complete");
});

let checkStorage = () => {
    if (localStorage.getItem('dataTODO') !== null) {
        getInformationByLocal();
    };
};

let addDoing = () => {
    $('.list-doings').html('');
    dataDoings.forEach(function (item, i) {
        const {
            name,
            progress,
            priority
        } = item;
        let check = $('<div/>', {
            id: `task-${i}`,
            text: name,
            "class": `todo text-${dataSettings.progress[progress]}`,
            click: () => {
                $('.modal-area-edit').toggleClass('hide');
                editTask(i);
            }
        }).appendTo('.list-doings');

        $('<div/>', {
            text: `Priority: ${dataSettings.status[priority]}`,
            "class": `priority-text`,
        }).appendTo(check);

        $('<div/>', {
            "class": `priority-vis ${priority}`,
        }).appendTo(check);

        $('<div/>', {
            "class": `check-window ${dataSettings.progress[progress]}`,
            click: (event) => {
                event.stopPropagation();
                $('.modal-area-progress').toggleClass('hide');
                editProgress(i);
            }
        }).appendTo(check);
    });
}

let getInformationByLocal = () => {
    const data = localStorage.getItem('dataTODO');
    dataDoings = JSON.parse(data)
    addDoing();
}

let createDoings = () => {
    let formCreate = document.getElementById('add-doings');
    let nameDoing = formCreate.nameThings.value;
    let priorityList = document.getElementsByName('status');
    let priorityDoing = '';
    priorityList.forEach(function (item, i) {
        if (priorityList[i].checked === true)
            priorityDoing = priorityList[i].value;
    });
    if (!nameDoing) {
        $('.wrong').html('Please enter text!');
    } else {
        $('.wrong').html('');
        let objDoings = new Doings();
        let newDoing = Object.create(objDoings);
        newDoing.name = nameDoing;
        newDoing.priority = priorityDoing;
        newDoing.progress = objDoings.progress;
        dataDoings.push(newDoing);
        addInLocalStorage();
        formCreate.nameThings.value = '';
        addDoing();
        $('.modal-area').toggleClass('hide');
    }
}

let addInLocalStorage = () => {
    let dataInStorage = JSON.stringify(dataDoings);
    localStorage.setItem('dataTODO', dataInStorage);
}

let editProgress = (i) => {
    let progressDoing = dataDoings[i].progress;
    let progressList = document.getElementsByName('progress');
    progressList.forEach(function (item, j) {
        if (progressList[j].value === progressDoing)
            progressList[j].checked = true;
    });
    $('#btn-save-progress').off('click').on('click', function () {
        progressList.forEach(function (item, j) {
            if (progressList[j].checked === true) {
                dataDoings[i].progress = progressList[j].value;
            }
            $('.modal-area-progress').toggleClass('hide');
            addDoing();
            addInLocalStorage();
        });
    });
}

let editTask = (i) => {
    $('.wrongEdit').html('');
    const {
        name,
        progress,
        priority
    } = dataDoings[i];
    let formEdit = document.getElementById('edit-doings');
    formEdit.todoTextEdit.value = name;
    let priorityList = document.getElementsByName('statusEdit');
    priorityList.forEach(function (item, j) {
        if (priorityList[j].value === priority)
            priorityList[j].checked = true;
    });
    $('#btn-save-edit').off('click').on('click', function () {
        if (!formEdit.todoTextEdit.value) {
            $('.wrongEdit').html('Please enter text!');
        } else {
            $('.wrongEdit').html('');
            dataDoings[i].name = formEdit.todoTextEdit.value;
            priorityList.forEach(function (item, n) {
                if (priorityList[n].checked === true)
                    dataDoings[i].priority = priorityList[n].value;
            });
            $('.modal-area-edit').toggleClass('hide');
            addDoing();
            addInLocalStorage();
        }
    });
    $('#btn-del-edit').off('click').on('click', () => {
        $('.modal-yn').toggleClass('hide');
        $('#btn-del-yes').off('click').on('click', function () {
            $('.modal-area-edit').toggleClass('hide');
            $('.modal-yn').toggleClass('hide');
            $(`#task-${i}`).toggleClass('del-left');
            // for show animation
            setTimeout(function () {
                dataDoings.splice(i, 1);

                addDoing();
                addInLocalStorage();
            }, 500);
        });
        $('#btn-del-no').off('click').on('click', function () {
            $('.modal-yn').toggleClass('hide');
        });
    });
}