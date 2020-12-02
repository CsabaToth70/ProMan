import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        const newBoardButton = document.querySelector('.new-board');
        newBoardButton.addEventListener('click', dom.addNewBoardTitle);
        dom.showPrivateBoardButton()
    },
    loadBoards: function () {
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        for (let board of boards) {
            dom.createBoardElements(board);
        }
        dom.listenForBoardTitleClick();
        dom.listenForToggleClick();
    },
    loadStatuses: function (event) {
        let board = event.currentTarget.closest('.board');
        dataHandler.getStatuses(function (statuses) {
            dom.showColumns(statuses, board);
        });
    },
    loadCards: function (boardId) {
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards, boardId);
        })
    },
    showCards: function (cards, boardId) {
        for (let card of cards) {
            dom.createCardElements(card, boardId)
        }
    },

    //****** Cards' list overview *********

    createCardElements: function (card, boardId) {
        let boardHeaders = document.querySelectorAll(".board-header");
        for (let boardHeader of boardHeaders) {
            let targetBoardId = boardHeader.dataset.boardId;
            if (targetBoardId === boardId.toString()) {
                let statusTitles = boardHeader.parentElement.querySelectorAll(".board-column-title");
                for (let statusTitle of statusTitles) {
                    if (statusTitle.textContent === card['status_id']) {
                        let currentColumnContent = statusTitle.parentElement.querySelector(".board-column-content");
                        currentColumnContent.insertAdjacentHTML('afterbegin',
                            `<div class="card" data-card-id="${card.id}">
                                       <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                                       <div class="card-title">${card.title}</div>
                                </div>`)
                    }
                }
            }
        }
        dom.listenForCardTitleClick();
        dom.initDragAndDropStatus();
    },
    clearCards: function () {
        let boardColumns = document.querySelectorAll('.board-columns');
        for (let boardColumn of boardColumns) {
            let emptyContent = document.createElement('div');
            emptyContent.setAttribute('class', 'board-columns');
            boardColumn.parentNode.replaceChild(emptyContent, boardColumn);
        }
    },

    // ***** Boards' list overview *****

    createBoardElements: function (board) {
        let boardTitle = `<span class="board-title">${board.title}</span>`;
        let headerButtons = `
            <button class="board-add-card">Create new card</button>
             <div class="new-card-title">
                <input class="new-card-input" type="text" name="card" required>
                <button type="submit">Save</button>
             </div>
            <button class="board-add-column">Add new column</button>
            <div class="new-status-title">
                <input class="new-status-input" type="text" name="status" required>
                <button type="submit">Save</button>
            </div>
            <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>`;
        const boardHeader = `<div class="board-header" data-board-id=${board.id}>${boardTitle}${headerButtons}</div>`;
        const boardColumns = `<div class="board-columns"></div>`;
        const outerHtml = `<section class="board">${boardHeader}${boardColumns}</section>`;
        let boardContainer = document.querySelector('.board-container');
        boardContainer.insertAdjacentHTML("beforeend", outerHtml);
    },
    clearBoards: function () {
        let boardContainer = document.querySelector('.board-container');
        let emptyBoardContainer = document.createElement('div');
        emptyBoardContainer.setAttribute('class', 'board-container');
        boardContainer.parentNode.replaceChild(emptyBoardContainer, boardContainer);
    },

    // ***** Create public boards *****

    addNewBoardTitle: function () {
        let titleInput = document.querySelector('.new-board-title');
        titleInput.style.display = 'block';
        let submitButton = document.querySelector('.new-board-title button');
        submitButton.addEventListener('click', () => {
            titleInput.style.display = 'none';
        })
    },

    // ***** Rename board *****

    listenForBoardTitleClick: function () {
        let boardNames = document.querySelectorAll('.board-title');
        for (let boardName of boardNames) {
            boardName.addEventListener('click', dom.changeBoardName);
        }
    },
    changeBoardName: function (event) {
        let clickedTitle = event.currentTarget;
        let renameDiv = dom.getBoardTitleDiv(event);
        clickedTitle.classList.add('hidden');
        clickedTitle.parentElement.insertAdjacentElement('beforeend', renameDiv);
        let saveButton = document.querySelector('.board-header .rename-button');
        saveButton.addEventListener('click', dom.getChangedBoardTitle);
    },
    getBoardTitleDiv: function (event) {
        let clickedTitle = event.currentTarget;

        let newDiv = document.createElement('div');
        newDiv.classList.add('rename-div');
        newDiv.style.display = 'inline';

        let newInput = document.createElement('input');
        newInput.classList.add('rename-input');
        newInput.setAttribute('name', 'changed-title');
        newInput.setAttribute("value", `${clickedTitle.textContent}`);

        let newButton = document.createElement('button');
        newButton.classList.add('rename-button');
        newButton.innerHTML = 'Save';

        newDiv.appendChild(newInput);
        newDiv.appendChild(newButton);

        return newDiv;
    },
    getChangedBoardTitle: function () {
        let inputField = document.querySelector('.board-header .rename-input')
        let boardId = inputField.closest('.board-header').dataset.boardId;
        let changedBoard = {'id': boardId, 'title': inputField.value};
        dataHandler.renameBoard(changedBoard);

        const renameDiv = inputField.closest('.rename-div');
        const boardTitle = renameDiv
            .closest('.board-header')
            .querySelector('.board-title');

        boardTitle.textContent = changedBoard.title;
        boardTitle.classList.remove('hidden');
        renameDiv.remove();
    },

    // ***** Board view with 4 default columns *****

    createColumns: function (status, board) {
        let boardBody = board.querySelector('.board-columns');
        boardBody.insertAdjacentHTML('afterbegin', `
                <div class="board-column" data-status-id="${status.id}">
                    <div class="board-column-title">${status.title}</div>
                    <div class="board-column-content"></div>
                </div>`)
        dom.listenForColumnTitleClick();
    },
    listenForToggleClick: function () {
        let toggles = document.querySelectorAll(".board-toggle");
        for (let toggle of toggles) {
            toggle.addEventListener("click", dom.showSelectedBoard);
        }
    },
    showSelectedBoard: function (event) {
        let boardId = event.currentTarget.parentElement.dataset['boardId'];
        let currentBoardContainer = dom.getCurrentBoardContainer(event);
        let currentBoard = currentBoardContainer.querySelector('.board-columns');
        let currentBoardTitle = currentBoardContainer.querySelector('.board-title');
        let clickedToggle = currentBoardContainer.querySelector('.board-toggle');

        dom.loadStatuses(event);
        dom.setBoardVisibility(currentBoard, 'flex');
        dom.showNewColumnButton(event);
        dom.showNewCardButton(event);
        currentBoardTitle.removeEventListener("click", dom.changeBoardName);
        currentBoardTitle.addEventListener('click', dom.closeBoard);

        dom.loadCards(boardId);
        clickedToggle.removeEventListener("click", dom.showSelectedBoard);
    },
    getCurrentBoardContainer: function (event) {
        let currentHeader = event.currentTarget.parentElement;
        return currentHeader.parentElement;
    },
    setBoardVisibility(currentBoard, displayValue) {
        currentBoard.style.display = displayValue;
    },
    closeBoard: function (event) {
        let currentBoardContainer = dom.getCurrentBoardContainer(event);
        let toBeClosedBoard = currentBoardContainer.querySelector('.board-columns');
        dom.setBoardVisibility(toBeClosedBoard, 'none');
        dom.hideNewColumnButtons();
        dom.hideNewCardButtons();
        dom.listenForToggleClick();
        dom.listenForBoardTitleClick();
        dom.clearCards();
    },

    // ***** Board view with dynamic columns *****
    hideNewColumnButtons: function () {
        let newColumnButtons = document.querySelectorAll('.board-add-column');
        for (let newColumnButton of newColumnButtons) {
            newColumnButton.style.display = 'none';
        }
    },
    showNewColumnButton: function (event) {
        let currentBoardContainer = dom.getCurrentBoardContainer(event);
        let newColumnButton = currentBoardContainer.querySelector('.board-add-column');
        newColumnButton.style.display = 'inline-block';
        newColumnButton.addEventListener('click', dom.showStatusInput)
    },

    showStatusInput: function (event) {
        let currentBoardContainer = dom.getCurrentBoardContainer(event);
        let statusInput = currentBoardContainer.querySelector('.new-status-title');
        statusInput.style.display = 'inline-block';
        let saveButton = event.currentTarget.parentElement.querySelector('.new-status-title button');
        saveButton.addEventListener('click', dom.getNewStatus);
    },
    showColumns: function (statuses, board) {
        for (let status of statuses) {
            dom.createColumns(status, board)
        }
    },
    getNewStatus: function (event) {
        let button = event.currentTarget;
        let inputField = button.parentElement.querySelector('.new-status-input');
        let newStatus = inputField.value;
        dataHandler.addStatus(newStatus);
        dom.clearBoards();
        dom.loadBoards();
    },

    // ***** Rename columns *****

    listenForColumnTitleClick: function () {
        let columnNames = document.querySelectorAll('.board-column-title');
        for (let columnName of columnNames) {
            columnName.addEventListener('click', dom.changeColumnName);
        }
    },
    changeColumnName: function (event) {
        let clickedTitle = event.currentTarget;
        let inputField = dom.getColumnTitleForm(event)
        clickedTitle.parentNode.replaceChild(inputField, clickedTitle);
        inputField.addEventListener('keypress', dom.handleEnter);
        inputField.addEventListener('keydown', dom.handleEscape);
    },
    getColumnTitleForm: function (event) {
        let clickedTitle = event.currentTarget;

        let newForm = document.createElement('form');
        newForm.setAttribute('method', 'POST');
        newForm.style.display = 'inline';

        let newInput = document.createElement('input');
        newInput.setAttribute('name', 'changed-column-title');
        newInput.setAttribute("value", `${clickedTitle.textContent}`);

        newForm.appendChild(newInput);
        return newForm;
    },
    handleEnter: function (event) {
        if (event.key === 'Enter') {
            dom.getChangedColumnTitle(event);
        }
    },
    getChangedColumnTitle: function (event) {
        let changedColumn = {'original_title': event.target.defaultValue, 'new_title': event.target.value};
        dataHandler.renameColumn(changedColumn);
    },
    handleEscape: function (event) {
        if (event.key === 'Escape') {
            dom.closeColumnInput(event);
        }
    },
    closeColumnInput: function (event) {
        dom.getOriginalColumnTitle(event);
        dom.listenForColumnTitleClick();
    },
    getOriginalColumnTitle: function (event) {
        let inputForm = event.currentTarget;
        let originalTitle = event.target.defaultValue;
        let columnTitle = document.createElement('div');
        columnTitle.setAttribute('class', 'board-column-title');
        columnTitle.textContent = originalTitle;
        inputForm.parentNode.replaceChild(columnTitle, inputForm);
    },

    //*******Add new card***************
    showNewCardButton: function (event) {
        let currentBoardContainer = dom.getCurrentBoardContainer(event);
        let newCardButton = currentBoardContainer.querySelector('.board-add-card');
        newCardButton.style.display = 'inline-block';
        newCardButton.addEventListener('click', dom.showCardInput)
    },
    showCardInput: function (event) {
        let currentBoardContainer = dom.getCurrentBoardContainer(event);
        let cardInput = currentBoardContainer.querySelector('.new-card-title');
        cardInput.style.display = 'inline-block';
        let saveButton = event.currentTarget.parentElement.querySelector('.new-card-title button');
        saveButton.addEventListener('click', dom.getNewCard);
    },
    getNewCard: function (event) {
        let button = event.currentTarget;
        let inputField = button.parentElement.querySelector('.new-card-input');
        let newCard = inputField.value;
        let statusId = 0;
        let boardId = event.currentTarget.closest(".board-header").dataset.boardId;
        dataHandler.createNewCard(newCard, boardId, statusId);
        dom.clearBoards();
        dom.loadBoards();
    },
    hideNewCardButtons: function () {
        let newCardButtons = document.querySelectorAll('.board-add-card');
        for (let newCardButton of newCardButtons) {
            newCardButton.style.display = 'none';
        }
    },

    // ***** Rename cards *****

    listenForCardTitleClick: function () {
        let cardNames = document.querySelectorAll('.card-title');
        for (let cardName of cardNames) {
            cardName.addEventListener('click', dom.changeCardName);
        }
    },
    changeCardName: function (event) {
        let clickedTitle = event.currentTarget;
        let inputField = dom.getCardTitleDiv(event)
        clickedTitle.parentNode.replaceChild(inputField, clickedTitle);
        inputField.addEventListener('keypress', dom.handleCardEnter);
        inputField.addEventListener('keydown', dom.handleCardEscape);
    },
    getCardTitleDiv: function (event) {
        let clickedTitle = event.currentTarget;

        let newCardDiv = document.createElement('div');
        newCardDiv.classList.add('rename-card');
        newCardDiv.style.display = 'block';

        let newCardInput = document.createElement('input');
        newCardInput.classList.add('rename-card-input');
        newCardInput.setAttribute('name', 'changed-card-title');
        newCardInput.setAttribute("value", `${clickedTitle.textContent}`);

        newCardDiv.appendChild(newCardInput);
        return newCardDiv;
    },
    handleCardEnter: function (event) {
        if (event.key === 'Enter') {
            dom.getChangedCardTitle(event);
        }
    },
    getChangedCardTitle: function (event) {
        let cardId = event.currentTarget.closest('.card').dataset.cardId;
        console.log(cardId)
        let changedCard = {'card_id': cardId, 'new_title': event.target.value};
        dataHandler.renameCard(changedCard);
        dom.clearBoards();
        dom.loadBoards();
    },
    handleCardEscape: function (event) {
        if (event.key === 'Escape') {
            dom.closeCardInput(event);
        }
    },
    closeCardInput: function (event) {
        dom.getOriginalCardTitle(event);
        dom.listenForCardTitleClick();
    },
    getOriginalCardTitle: function (event) {
        let inputDiv = event.currentTarget;
        let originalTitle = event.target.defaultValue;
        let columnTitle = document.createElement('div');
        columnTitle.setAttribute('class', 'card-title');
        columnTitle.textContent = originalTitle;
        inputDiv.parentNode.replaceChild(columnTitle, inputDiv);
    },

    // ***** Change card status *****

    initDragAndDropStatus: function () {
        let cards = document.querySelectorAll('.card');
        let columns = document.querySelectorAll('.board-column-content');
        dom.initStatusDraggables(cards);
        dom.initStatusDropZones(columns);
    },
    initStatusDraggables: function (cards) {
        for (const card of cards) {
            dom.initStatusDraggable(card);
        }
    },
    initStatusDropZones: function (columns) {
        for (let column of columns) {
            dom.initStatusDropZone(column);
        }
    },
    initStatusDraggable: function (card) {
        card.addEventListener("dragstart", dom.dragStartStatus);
        card.addEventListener("dragend", dom.dragEndStatus);
        card.setAttribute("draggable", "true");
    },
    initStatusDropZone: function (column) {
        column.addEventListener("dragenter", dom.columnEnterStatus);
        column.addEventListener("dragover", dom.columnOverStatus);
        column.addEventListener("dragleave", dom.columnLeaveStatus);
        column.addEventListener("drop", dom.columnDropStatus);
    },
    dragStartStatus: function (event) {
        event.currentTarget.classList.add('dragged');
    },
    dragEndStatus: function () {
        this.classList.remove('dragged');
    },
    columnEnterStatus: function (event) {
        event.currentTarget.classList.add("over-zone");
        event.preventDefault();
    },
    columnOverStatus: function (event) {
        event.preventDefault();
    },
    columnLeaveStatus: function (event) {
        event.currentTarget.classList.remove('over-zone');
    },
    columnDropStatus: function (event) {
        event.preventDefault();
        let draggedCard = document.querySelector('.dragged');
        let statusId = event.currentTarget.closest('.board-column').dataset.statusId;
        let boardColumn = event.currentTarget.closest('.board-column');
        event.currentTarget.appendChild(draggedCard);
        let cards = boardColumn.querySelectorAll('.card');
        let columnDetails = [];
        for (let [i, card] of cards.entries()) {
            card.setAttribute('data-order', i.toString())
            columnDetails.push({'order': i, 'card_id': card.dataset.cardId, 'status_id': statusId});
        }
        dataHandler.changeDragAndDropStatus(columnDetails);
    },
    //********New private board************
    getLoggedInEmail: function () {
        let loginElement = document.querySelector(".logged-in")
        if (loginElement !== null) {
            return loginElement.textContent.split(" ")[3];
        }

        return loginElement
    },


    showPrivateBoardButton: function () {
        let email = dom.getLoggedInEmail();
        if (email !== null) {
            let button = document.querySelector(".new-private-board")
            button.style.display = 'inline-block';
            button.addEventListener("click", dom.addNewPrivateBoard)

        }
    },
    addNewPrivateBoard: function () {
        dom.showPrivateBoardInput()
        let saveButton = document.querySelector(".private-board-title button");
        saveButton.addEventListener("click", dom.saveNewPrivateBoard)
    },

    showPrivateBoardInput: function () {
        document.querySelector(".private-board-title").style.display = "inline-block"
    },
    saveNewPrivateBoard: async function(event){
        let newPrivateBoardTitle = event.currentTarget.closest(".private-board-title").querySelector("input").value
        let userEmail = dom.getLoggedInEmail();
        let newPrivateBoardDict = {'title': newPrivateBoardTitle, 'user_email':userEmail};
        document.querySelector(".private-board-title").style.display = "none"
        dataHandler.NewPrivateBoard(newPrivateBoardDict);
        dom.clearBoards();
        await dom.loadBoards();

    }

}

