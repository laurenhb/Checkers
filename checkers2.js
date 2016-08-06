var _boardArray = [];
var _pieceClicked = {};
var _availableSquares = [];
var newDiagonal = false;
var _potentiallyJumpedArray = [];
var _capturedBlackArray = [];
var _capturedRedArray = [];
var _currentTrack = '';
var turnCount = 0;
var _evenTurnColor = '';
var _toggleHighlightedCells = true;

setupBlackPiecePrison();
setupRedPiecePrison();
setupBoard();
chooseFirstTeam();

function chooseFirstTeam(){
    swal({
        title: "Let's Play!",
        text: "Who goes first?",
        showCancelButton: true,
        confirmButtonColor: "#FF0000",
        confirmButtonText: "Red",
        cancelButtonText: "Black",
        closeOnConfirm: false,
        closeOnCancel: false
        },
        function(isConfirm){
            if (isConfirm) {
                swal("Nice, red goes first.", "Let the games begin!", "success");
                _evenTurnColor = 'red';
            } else {
                swal("Nice, black goes first.", "Let the games begin!", "success");
                _evenTurnColor = 'black';
            }
        });
    }

function setupBlackPiecePrison () {
   var blackPiecePrison = document.getElementById('black-piece-prison');
   for (var k = 0; k < 4; k++) { //for rows
       var row = document.createElement("div");
       row.setAttribute('id', 'row' + k);
       row.setAttribute('class', 'prisonRow');
       var rowArray = [];
       for (var l = 0; l < 3; l++) { //for cell
           var capturedBlackCellObject = {
               id: k + '' + l,
               status: 'none'
           };
           var cell = document.createElement('div');
           cell.setAttribute('id', 'b' + k + '' + l);
           cell.setAttribute('class', 'prisonCell');
           row.appendChild(cell);
           rowArray.push(capturedBlackCellObject);
       }
       blackPiecePrison.appendChild(row);
       _capturedBlackArray.push(rowArray);
   }
}

function setupRedPiecePrison () {
   var redPiecePrison = document.getElementById('red-piece-prison');
   for (var k = 0; k < 4; k++) { //for rows
       var row = document.createElement("div");
       row.setAttribute('id', 'row' + k);
       row.setAttribute('class', 'prisonRow');
       var rowArray = [];
       for (var l = 0; l < 3; l++) { //for cell
           var capturedRedCellObject = {
               id: k + '' + l,
               status: 'none'
           };
           var cell = document.createElement('div');
           cell.setAttribute('id', 'r' + k + '' + l);
           cell.setAttribute('class', 'prisonCell');
           row.appendChild(cell);
           rowArray.push(capturedRedCellObject);
       }
       redPiecePrison.appendChild(row);
       _capturedRedArray.push(rowArray);
   }
}



function setupBoard(){
    var gameBoardDiv = document.getElementById('motherBoard');
    for (var i = 0; i < 8; i++){
        var row = document.createElement('div');
        row.setAttribute('id', 'row' + i);
        row.setAttribute('class', 'row');
        var rowArray = [];
        for (var j = 0; j < 8; j++){
            var cellObject = {
                id: i + '' + j,
                status: 'none'
            };
            var cell = document.createElement('div');
            cell.setAttribute('id', i + '' + j);
            if (isEven(i) && isEven(j)){
                cell.setAttribute('class', 'black-cell');
                cellObject.color = 'black';
            }else if (isEven(i) && !isEven(j)){
                cellObject.color = 'white';
                cell.addEventListener("click", function (event){
                    console.log(event);
                    movePiece(event.target.id);
                    cellObject.clicked = 'true';
                });
                if (i < 3){
                    cell.setAttribute('class', 'white-cell red-piece');
                    cellObject.piece = 'red';
                    cellObject.status = 'piece';
                }else if (i > 4){
                    cell.setAttribute('class', 'white-cell black-piece');
                    cellObject.piece = 'black';
                    cellObject.status = 'piece';
                }else{
                    cell.setAttribute('class', 'white-cell');
                }
            }else if (!isEven(i) && isEven(j)){
                cellObject.color = 'white';
                cell.addEventListener("click", function (event){
                    console.log(event);
                    movePiece(event.target.id);
                    cellObject.clicked = 'true';
                });
                if (i < 3){
                    cell.setAttribute('class', 'white-cell red-piece');
                    cellObject.piece = 'red';
                    cellObject.status = 'piece';
                }else if (i > 4){
                    cell.setAttribute('class', 'white-cell black-piece');
                    cellObject.piece = 'black';
                    cellObject.status = 'piece';
                }else{
                    cell.setAttribute('class', 'white-cell');
                }
            }else{
                cell.setAttribute('class', 'black-cell');
                cellObject.color = 'black';
            }
            row.appendChild(cell);
            rowArray.push(cellObject);
        }
        gameBoardDiv.appendChild(row);
        _boardArray.push(rowArray);
    }
}

function isEven(number){
    return number % 2 === 0;
}

function toggleHighlightedCells(element){
    _toggleHighlightedCells = element.checked;
}

function checkAvailalbe (row, cell, direction, pieceColor){
    var fails = 0;
    var cellsHighlighted = 0;
    var justPainted = false;
    var jumpedPieces = 0;
    while (fails < 2){
        switch (direction) {
            case 'upLeft':
                row--;
                cell--;
                break;
            case 'upRight':
                row--;
                cell++;
                break;
            case 'downLeft':
                row++;
                cell--;
                break;
            case 'downRight':
                row++;
                cell++;
                break;
        }
        if (row < 0 || cell < 0 || row > 7 || cell > 7){
            break;
        }
        _boardArray[row][cell].currentTrack = _currentTrack;
        var pieceColorArray = pieceColor.split('-');
        if (_boardArray[row][cell].status === 'none'){
            if (newDiagonal && fails === 0){
                break;
            }
            if (justPainted){
                break;
            }
            var upLeftCell = (row) + '' + (cell);
            _availableSquares.push(upLeftCell);
            if (fails > 0){
                jumpedPieces++;
                checkPotentiallyJumped (row, cell, direction);
                newDiagonal = true;
                checkOtherDiagonal (row, cell, direction, pieceColor);
                newDiagonal = false;
                _boardArray[row][cell].potentiallyJumpedTo = true;
            }
            fails = 0;
            cellsHighlighted++;
            justPainted = true;
        }else if (_boardArray[row][cell].status === 'piece' && _boardArray[row][cell].piece === pieceColorArray[0]+'-king') {
            break;
        }else if (_boardArray[row][cell].status === 'piece' && _boardArray[row][cell].piece === pieceColorArray[0]){
            break;
        }else if (_boardArray[row][cell].status === 'piece' && _boardArray[row][cell].piece !== pieceColorArray[0]){
            fails++;
            if (justPainted && fails === 0){
                break;
            }
            if (fails > 0 && jumpedPieces > 0){
                justPainted = false;
            }
        }
    }
}

function checkPotentiallyJumped (row, cell, direction){
    switch (direction) {
        case 'upLeft':
            row++;
            cell++;
            break;
        case 'upRight':
            row++;
            cell--;
            break;
        case 'downLeft':
            row--;
            cell++;
            break;
        case 'downRight':
            row--;
            cell--;
            break;
    }
    _potentiallyJumpedArray.push(_boardArray[row][cell]);
}

function checkOtherDiagonal (row, cell, direction, pieceColor){
    switch (direction){
        case 'upLeft':
            checkAvailalbe(row, cell, 'upRight', pieceColor);
            break;
        case 'upRight':
            checkAvailalbe(row, cell, 'upLeft', pieceColor);
            break;
        case 'downLeft':
            checkAvailalbe(row, cell, 'downRight', pieceColor);
            break;
        case 'downRight':
            checkAvailalbe(row, cell, 'downLeft', pieceColor);
            break;
    }
}


function movePiece(id) {
    var row = parseInt(id[0]);
    var cell = parseInt(id[1]);
    var cellObject = _boardArray[row][cell];

    if (cellObject.status === 'piece'){
        var pieceColorArray = cellObject.piece.split('-');
        if (isEven(turnCount) && pieceColorArray[0] === _evenTurnColor){
                // do nothing
        }else if (!isEven(turnCount) && pieceColorArray[0] !== _evenTurnColor){
                // do nothing
        }else{
            swal("Oops!", "Not your turn!", "error");
            return;
        }
    }

    if (cellObject.piece) {
        if (cellObject.status === 'clicked') {
            for (var i = 0; i < _availableSquares.length; i++){
                var availableRow = parseInt(_availableSquares[i][0]);
                var availableCell = parseInt(_availableSquares[i][1]);
                _boardArray[availableRow][availableCell].status = 'none';
            }
            _availableSquares = [];
            cellObject.status = 'piece';
            updateBoard('piece clicked');
            return;
        }
        cellObject.status = 'clicked';
        if (cellObject.piece === 'black'){
            _currentTrack = 'upLeft';
            checkAvailalbe(row, cell, 'upLeft', cellObject.piece);
            _currentTrack = 'upRight';
            checkAvailalbe(row, cell, 'upRight', cellObject.piece);
            _pieceClicked.class = 'black-piece';
            _pieceClicked.piece = 'black';
        }else if (cellObject.piece === 'red'){
            _currentTrack = 'downLeft';
            checkAvailalbe(row, cell, 'downLeft', cellObject.piece);
            _currentTrack = 'downRight';
            checkAvailalbe(row, cell, 'downRight', cellObject.piece);
            _pieceClicked.class = 'red-piece';
            _pieceClicked.piece = 'red';
        }else if (cellObject.piece === 'black-king'){
            _currentTrack = 'upLeft';
            checkAvailalbe(row, cell, 'upLeft', cellObject.piece);
            _currentTrack = 'upRight';
            checkAvailalbe(row, cell, 'upRight', cellObject.piece);
            _currentTrack = 'downLeft';
            checkAvailalbe(row, cell, 'downLeft', cellObject.piece);
            _currentTrack = 'downRight';
            checkAvailalbe(row, cell, 'downRight', cellObject.piece);
            _pieceClicked.class = 'black-king-piece';
            _pieceClicked.piece = 'black-king';
        }else if (cellObject.piece === 'red-king'){
            _currentTrack = 'upLeft';
            checkAvailalbe(row, cell, 'upLeft', cellObject.piece);
            _currentTrack = 'upRight';
            checkAvailalbe(row, cell, 'upRight', cellObject.piece);
            _currentTrack = 'downLeft';
            checkAvailalbe(row, cell, 'downLeft', cellObject.piece);
            _currentTrack = 'downRight';
            checkAvailalbe(row, cell, 'downRight', cellObject.piece);
            _pieceClicked.class = 'red-king-piece';
            _pieceClicked.piece = 'red-king';
        }
        for (var i = 0; i < _availableSquares.length; i++){
            var availableRow = parseInt(_availableSquares[i][0]);
            var availableCell = parseInt(_availableSquares[i][1]);
            _boardArray[availableRow][availableCell].status = 'available';
        }

        for (var i = 0; i < _potentiallyJumpedArray.length; i++){
            var jumpedRow = parseInt(_potentiallyJumpedArray[i].id[0]);
            var jumpedCell = parseInt(_potentiallyJumpedArray[i].id[1]);
            _boardArray[jumpedRow][jumpedCell].potentiallyJumpedOver = true;
        }
        updateBoard('piece clicked');
    }else if (cellObject.status === 'available'){
        cellObject.status = 'moved';
        cellObject.piece = _pieceClicked.piece;
        _currentTrack = cellObject.currentTrack;
        updateBoard('piece moved', cellObject.potentiallyJumpedTo);
    }
}

function updateBoard (typeOfEvent){
    for (var i=0; i<_boardArray.length; i++){
        for (var j=0; j<_boardArray[i].length; j++){
            var cellClassArray = document.getElementById(_boardArray[i][j].id).className.split(' ');
            if (typeOfEvent === 'piece moved'){
                if(_boardArray[i][j].potentiallyJumpedOver === true && _boardArray[i][j].currentTrack === _currentTrack){
                    if(_boardArray[i][j].piece === 'black'){
                        if(cellClassArray.indexOf('black-piece') !== -1){
                            cellClassArray.splice(cellClassArray.indexOf('black-piece'), 1);
                            for (var k = 0; k < _capturedBlackArray.length; k++){
                                var paintedCell = 0;
                                for (var l = 0; l < _capturedBlackArray[k].length; l++){
                                    if(_capturedBlackArray[k][l].status === 'none'){
                                        _capturedBlackArray[k][l].status = 'piece';
                                        document.getElementById('b' + k + '' + l).setAttribute('class', 'prisonCell black-piece');
                                        if(_capturedBlackArray[3][2].status === 'piece'){
                                            swal({
                                                title: "CONGRATULATIONS!",
                                                text: "Red is the WINNER!",
                                                type: "success",
                                                confirmButtonColor: "#DD6B55",
                                                confirmButtonText: "Start a New Game!",
                                                closeOnConfirm: false,
                                                },
                                                    function(isConfirm){
                                                        if (isConfirm) {
                                                            resetGame();
                                                        }
                                                    });
                                        }
                                        break;
                                    }else if (_capturedBlackArray[k][l].status === 'piece'){
                                        paintedCell++;
                                    }
                                }
                                if (paintedCell < 3){
                                    break;
                                }
                            }
                        }
                    }else if(_boardArray[i][j].piece === 'red'){
                        if(cellClassArray.indexOf('red-piece') !== -1){
                            cellClassArray.splice(cellClassArray.indexOf('red-piece'), 1);
                            for (var k = 0; k < _capturedRedArray.length; k++){
                                var paintedCell = 0;
                                for (var l = 0; l < _capturedRedArray[k].length; l++){
                                    if(_capturedRedArray[k][l].status === 'none'){
                                        _capturedRedArray[k][l].status = 'piece';
                                        document.getElementById('r' + k + '' + l).setAttribute('class', 'prisonCell red-piece');
                                        if(_capturedRedArray[3][2].status === 'piece'){
                                            swal({
                                                title: "CONGRATULATIONS!",
                                                text: "Black is the WINNER!",
                                                type: "success",
                                                confirmButtonColor: "#DD6B55",
                                                confirmButtonText: "Start a New Game!",
                                                closeOnConfirm: false,
                                                },
                                                    function(isConfirm){
                                                        if (isConfirm) {
                                                            resetGame();
                                                        }
                                                    });
                                        }
                                        break;
                                    }else if (_capturedRedArray[k][l].status === 'piece'){
                                        paintedCell++;
                                    }
                                }
                                if (paintedCell < 3){
                                    break;
                                }
                            }
                        }
                    } else if (_boardArray[i][j].piece === 'black-king'){
                        if(cellClassArray.indexOf('black-king-piece') !== -1){
                            cellClassArray.splice(cellClassArray.indexOf('black-king-piece'), 1);
                            for (var k = 0; k < _capturedBlackArray.length; k++){
                                var paintedCell = 0;
                                for (var l = 0; l < _capturedBlackArray[k].length; l++){
                                    if(_capturedBlackArray[k][l].status === 'none'){
                                        _capturedBlackArray[k][l].status = 'piece';
                                        document.getElementById('b' + k + '' + l).setAttribute('class', 'prisonCell black-king-piece');
                                        if(_capturedBlackArray[3][2].status === 'piece'){
                                            swal({
                                                title: "CONGRATULATIONS!",
                                                text: "Red is the WINNER!",
                                                type: "success",
                                                confirmButtonColor: "#DD6B55",
                                                confirmButtonText: "Start a New Game!",
                                                closeOnConfirm: false,
                                                },
                                                    function(isConfirm){
                                                        if (isConfirm) {
                                                            resetGame();
                                                        }
                                                    });
                                        }
                                        break;
                                    }else if (_capturedBlackArray[k][l].status === 'piece'){
                                        paintedCell++
                                    }
                                }
                                if (paintedCell < 3){
                                    break;
                                }
                            }
                        }
                    } else if (_boardArray[i][j].piece === 'red-king'){
                        if(cellClassArray.indexOf('red-king-piece') !== -1){
                            cellClassArray.splice(cellClassArray.indexOf('red-king-piece'), 1);
                            for (var k = 0; k < _capturedRedArray.length; k++){
                                var paintedCell = 0;
                                for (var l = 0; l < _capturedRedArray[k].length; l++){
                                    if(_capturedRedArray[k][l].status === 'none'){
                                        _capturedRedArray[k][l].status = 'piece';
                                        document.getElementById('r' + k + '' + l).setAttribute('class', 'prisonCell red-king-piece');
                                        if(_capturedRedArray[3][2].status === 'piece'){
                                            swal({
                                                title: "CONGRATULATIONS!",
                                                text: "Black is the WINNER!",
                                                type: "success",
                                                confirmButtonColor: "#DD6B55",
                                                confirmButtonText: "Start a New Game!",
                                                closeOnConfirm: false,
                                                },
                                                    function(isConfirm){
                                                        if (isConfirm) {
                                                            resetGame();
                                                        }
                                                    });
                                        }
                                        break;
                                    }else if (_capturedRedArray[k][l].status === 'piece'){
                                        paintedCell++;
                                    }
                                }
                                if (paintedCell < 3){
                                    break;
                                }
                            }
                        }
                    }
                    _boardArray[i][j].status = 'none';
                    _boardArray[i][j].potentiallyJumpedOver = false;
                    delete _boardArray[i][j].currentTrack;
                    delete _boardArray[i][j].piece;
                } else if (_boardArray[i][j].potentiallyJumpedOver === true && _boardArray[i][j].currentTrack !== _currentTrack) {
                    _boardArray[i][j].currentTrack = '';
                    _boardArray[i][j].potentiallyJumpedOver = false;
                }
                if (_boardArray[i][j].status === 'clicked') {
                    if (cellClassArray.indexOf(_pieceClicked.class) !== -1){
                        cellClassArray.splice(cellClassArray.indexOf(_pieceClicked.class), 1);
                    }
                    if (cellClassArray.indexOf('clicked-cell') !== -1){
                        cellClassArray.splice(cellClassArray.indexOf('clicked-cell'), 1);
                    }
                    delete _boardArray[i][j].piece;
                    _boardArray[i][j].status = 'none';
                }
                if (_boardArray[i][j].status === 'moved'){
                    turnCount++;
                    if (cellClassArray.indexOf('available-cell') !== -1){
                        cellClassArray.splice(cellClassArray.indexOf('available-cell'), 1, _pieceClicked.class);
                        if (i === 0){
                            if (_boardArray[i][j].piece === 'black'){
                                cellClassArray.splice(cellClassArray.indexOf('black-piece'), 1, 'black-king-piece');
                                _boardArray[i][j].piece = 'black-king';
                            }
                        } else if (i === 7){
                            if (_boardArray[i][j].piece === 'red'){
                                cellClassArray.splice(cellClassArray.indexOf('red-piece'), 1, 'red-king-piece');
                                _boardArray[i][j].piece = 'red-king';
                            }
                        }
                    }else{
                        cellClassArray.push(_pieceClicked.class);
                    }
                    _boardArray[i][j].status = 'piece';
                }
                if (_boardArray[i][j].status === 'available'){
                    if (cellClassArray.indexOf('available-cell') !== -1){
                        cellClassArray.splice(cellClassArray.indexOf('available-cell'), 1);
                    }
                    _boardArray[i][j].status = 'none';
                }
                _availableSquares = [];
            } else{ //if piece doesn't move
                if (_boardArray[i][j].status === 'available' && _toggleHighlightedCells){
                    cellClassArray.push('available-cell');
                }else if (_boardArray[i][j].status === 'none'){
                    if (cellClassArray.indexOf('available-cell') !== -1){
                        cellClassArray.splice(cellClassArray.indexOf('available-cell'), 1);
                    }
                    if (cellClassArray.indexOf('clicked-cell') !== -1){
                        cellClassArray.splice(cellClassArray.indexOf('clicked-cell'), 1);
                    }
                }else if (_boardArray[i][j].status === 'clicked'){
                    cellClassArray.push('clicked-cell');
                }else if (_boardArray[i][j].status === 'piece' && cellClassArray.indexOf('clicked-cell') !== -1) {
                    cellClassArray.splice(cellClassArray.indexOf('clicked-cell'), 1);
                    _availableSquares = [];
                    _boardArray[i][j].potentiallyJumpedOver = false;
                }
            }
                document.getElementById(_boardArray[i][j].id).className = cellClassArray.join(' ');
                _potentiallyJumpedArray = [];
            }
        }

        console.log(_boardArray);
    }

function resetGame(){
    document.getElementById('motherBoard').innerHTML = "";
    document.getElementById('red-piece-prison').innerHTML = "";
    document.getElementById('black-piece-prison').innerHTML = "";
    _boardArray = [];
    setupBoard();
    _capturedRedArray = [];
    _capturedBlackArray = [];
    setupRedPiecePrison();
    setupBlackPiecePrison();
    _availableSquares = [];
    _potentiallyJumpedArray = [];
    turnCount = 0;
    _evenTurnColor = '';
    _currentTrack = '';
    newDiagonal = false;
    _pieceClicked = {};
    chooseFirstTeam();

}
