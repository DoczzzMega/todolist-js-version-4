/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-trailing-spaces */
/* eslint-disable spaced-comment */
"use strict";
// this function is strict...

const form = document.querySelector('#form');
const input = document.querySelector('#taskInput');
const ul = document.querySelector('#tasksList');
const btnAllremove = document.querySelector('#removeDoneTasks');

let titlesArray = [];

form.addEventListener('submit', e => {
    e.preventDefault();
    addTask(input.value);

    const lastAddedTask = titlesArray[titlesArray.length - 1];
    renderTask(lastAddedTask)
    input.value = '';
});

ul.addEventListener('click', e => {
    const currentEl = e.target;
    const currentTaskItem = currentEl.closest('.task-item');
    const valueOfDataAttr = currentEl.getAttribute('data-action');


    if (valueOfDataAttr == 'done') {
        toggleBtnCompletedTask(currentEl);
        toggleCompletedTask(currentTaskItem);
    }
    if (valueOfDataAttr == 'delete') {

        deleteTask(currentTaskItem);
    }
});

btnAllremove.addEventListener('click', deleteAllCompletedTasks);


function addTask(task) {
    titlesArray.push({ id: `${Date.now()}`, title: task, isCompleted: false });
    console.log(titlesArray);
    sendTaskToStorage();
}

function deleteTask(task) {
    // let currentObj = titlesArray.find(item => item.id === currentEl.dataset.id);
    titlesArray = titlesArray.filter(item => item.id !== task.dataset.id);
    // titlesArray.forEach((item, index) => {
    //     if (item.id === task.dataset.id) {
    //         titlesArray.splice(index, 1);
    //     }
    // });
    task.remove();
    console.log(titlesArray);
    sendTaskToStorage();
}

function renderTask(task) {
    const {id, title, isCompleted} = task;
    const classTask = isCompleted ? 'task-title--done' : '';
    const classBtn = isCompleted ? 'btn-done-complete' : '';

    const li = document.createElement('li');
    li.dataset.id = id;
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'task-item', `${classTask}`);
    li.innerHTML = `
                <span class="task-title">${title}</span>
                <div class="task-item__buttons">
                    <button type="button" data-action="done" class="btn-action ${classBtn}">
                        <img src="./img/tick.svg" alt="Done" width="18" height="18">
                    </button>
                    <button type="button" data-action="delete" class="btn-action">
                        <img src="./img/cross.svg" alt="Done" width="18" height="18">
                    </button>
                </div>
    `;
    ul.append(li);
}


function toggleCompletedTask(task) {
    task.classList.toggle('task-title--done');

    titlesArray.forEach(item => {
        if (item.id === task.dataset.id) {
            item.isCompleted = !item.isCompleted;
        }
    });
    console.log(titlesArray);
    sendTaskToStorage();
}

function toggleBtnCompletedTask(buttonNode) {
    buttonNode.classList.toggle('btn-done-complete');
}

function deleteAllCompletedTasks() {
    titlesArray = titlesArray.filter(item => item.isCompleted === false);

    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(el => {
        if (el.classList.contains('task-title--done')) {
            el.remove();
        }
    });
    console.log(titlesArray);
    sendTaskToStorage();
}

function sendTaskToStorage() {
    localStorage.setItem('titles', JSON.stringify(titlesArray));
    checkEmptyStorage();
}

function checkEmptyStorage() {
    let emptyList = document.querySelector('.empty-list__title');   
    if (localStorage.getItem('titles') == '[]') {
        emptyList.innerText = 'Вы сделали все дела! Идите спать';
    } else {
        emptyList.innerText = 'Список дел';
    }
}

function renderTasksFromStorage() {
    titlesArray = JSON.parse(localStorage.getItem('titles'));
    if (Array.isArray(titlesArray) && titlesArray.length > 0) {
        titlesArray.forEach(item => {

            if (item.isCompleted) {
                renderTask(item.title, item.id, 'task-title--done', 'btn-done-complete');
                console.log('Completed');
            } else {
                renderTask(item.title, item.id);
                console.log('NotCompleted');
            }
        });
    } else {
        titlesArray = [];
    }
    console.log(titlesArray);
}

// renderTasksFromStorage();