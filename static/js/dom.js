// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        const newBoardButton = document.querySelector('.new-board');
        newBoardButton.addEventListener('click', dom.addNewBoardTitle);

    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });

    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        for (let board of boards) {
            let boardTitle = `<div class="board-title">${board.title}</div>`;
            let headerButtons = `
                <button class="board-add">Add Card</button>
                <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>`;
            const boardHeader = `<div class="board-header">${boardTitle}${headerButtons}</div>`;
            const boardColumns = `<div class="board-columns">BoardColumns</div>`;
            const outerHtml = `<div class="board">${boardHeader}${boardColumns}</div>`;
            let boardContainer = document.querySelector('.board-container');
            boardContainer.insertAdjacentHTML("beforeend", outerHtml);
        }
        dom.listenForBoardTitleClick();
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
    addNewBoardTitle: function () {
        let titleInput = document.querySelector('.new-board-title');
        titleInput.style.display = 'block';
        let submitButton = document.querySelector('.new-board-title button');
        submitButton.addEventListener('click', () => {
            titleInput.style.display = 'none';
        })
    },
    changeBoardName: function (event) {
        let clickedTitle = event.currentTarget;
        let oldBoardName = clickedTitle.textContent;
        console.log('oldbrardName', oldBoardName);
        let newForm = document.createElement('form');
        newForm.setAttribute('method', 'POST');
        let newElement = document.createElement('input');
        newForm.style.display = 'inline';
        newElement.setAttribute('name', 'changed-title');
        newElement.setAttribute("value", `${clickedTitle.textContent}`);

        let commitButton = document.createElement('button');
        commitButton.innerHTML = 'Save';

        commitButton.setAttribute('type', 'submit');
        newForm.appendChild(newElement);
        newForm.appendChild(commitButton);
        clickedTitle.parentNode.replaceChild(newForm, clickedTitle);
        let saveButton = document.querySelector('.board-header form button');
        console.log('savebutton', saveButton);
        saveButton.addEventListener('click', dom.listenForInput);
    },
    listenForBoardTitleClick: function () {
        let boardNames = document.querySelectorAll('.board-title');
        for (let boardName of boardNames) {
            boardName.addEventListener('click', dom.changeBoardName);
        }
    },
    listenForInput: function (event) {
        let newElement = event.currentTarget.nextSibling;
        console.log('nextsibling', newElement);
            newElement.addEventListener('input', function (event) {
            let newBoardName = newElement.value;
            console.log(newBoardName)
        })
    }
};

