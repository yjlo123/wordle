let runtime = runtimeExecuter();
let evaluator = runtimeEvaluator();
let parser = runtimeParser();

let enterCallback = null;
let cursor = 0;
let row = 0;
let word = "";
let gameover = false;

let keyboard = $(".keyboard");
let keys = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM"
];

let io = {
    Write: (text, style) => {
        
        if (text.indexOf(":") > -1) {
            let tokens = text.trim().split(":");
            if (tokens[0] === "win") {
                gameover = true;
            } else if (tokens[0] === "fail") {
                gameover = true;
                let resultWord = $(".result-word");
                resultWord.text(tokens[1].toUpperCase());
                resultWord.fadeIn();
            }
            return;
        }
        
        try {
            let data = JSON.parse(text);
            for (let i = 0; i < 5; i++) {
                let classColor = "gray";
                if (data[i] === 1) {
                    classColor = "green";
                } else if (data[i] === 2) {
                    classColor = "yellow";
                }
                $('.r:nth-child(' + (row+1) + ') .c:nth-child('+(i+1)+')').addClass(classColor);
                $('.key-'+word[i]).addClass(classColor);
            }
            if (row < 5) {
                // reset
                row += 1;
                word = "";
                cursor = 0;
            }
           
        } catch (ex) {
            console.log(text);
        }
    },
    Input: (callback)=>{
        enterCallback = callback;
    },
    AbortInput: ()=>{}
}

function onPressLetter(letter) {
    if (!gameover && cursor < 5) {
        word += letter.toLowerCase();
        $('.r:nth-child(' + (row+1) + ') .c:nth-child('+(cursor+1)+')').text(letter.toUpperCase());
        cursor += 1;
    }
}

function onPressEnter() {
    if (!gameover && word.length === 5) {
        if (words.indexOf(word) === -1) {
            $( ".not-in-list" ).show();
            $( ".not-in-list" ).delay(1000).fadeOut( "slow" );
        } else {
            enterCallback(word);
        }
    }
}

function onPressBackspace() {
    if (!gameover && cursor > 0) {
        cursor -= 1;
        $('.r:nth-child(' + (row+1) + ') .c:nth-child('+(cursor+1)+')').text("");
        word = word.slice(0, word.length-1)
    }
}

function initKeyboard() {
    keyboard.empty();
    for (let r = 0; r < keys.length; r++) {
        let row = keys[r];
        let keyRow = $('<div class="key-row"></div>');
        if (r === 2) {
            let enterKey = $('<div class="key key-enter">&nbsp;Enter&nbsp;</div>');
            enterKey.on("click", function() {
                onPressEnter();
            });
            keyRow.append(enterKey);
        }
        for (let i = 0; i < row.length; i++) {
            let letter = row[i];
            let key = $('<div class="key key-letter key-'+letter.toLowerCase()+'">'+letter+'</div>');
            key.on("click", function() {
                onPressLetter(letter);
            });
            keyRow.append(key);
        }
        if (r === 2) {
            let delKey = $('<div class="key key-del"><svg width="26" height="18" viewBox="0 2 26 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.7427 8.46448L19.1569 9.87869L17.0356 12L19.157 14.1214L17.7428 15.5356L15.6214 13.4142L13.5 15.5355L12.0858 14.1213L14.2072 12L12.0859 9.87878L13.5002 8.46457L15.6214 10.5858L17.7427 8.46448Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.58579 19L2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L8.58579 5H22.5857V19H8.58579ZM9.41421 7L4.41421 12L9.41421 17H20.5857V7H9.41421Z" fill="currentColor"/></svg></div>');
            delKey.on("click", function() {
                onPressBackspace();
            });
            keyRow.append(delKey);
        }
        keyboard.append(keyRow);
    }
}

function initBoard() {
    let board = $(".console-view");
    board.empty();
    for (let i = 0; i < 6; i++) {
        let row = $('<div class="r"></div>');
        for (let j = 0; j < 5; j++) {
            row.append($('<div class="c"></div>'));
        }
        board.append(row);
    }
}

function initGame() {
    enterCallback = null;
    cursor = 0;
    row = 0;
    word = "";
    gameover = false;

    initBoard();
    initKeyboard();
}

function startGame() {
    initGame();
    runtime.restart();
    runtime.executeAll({in: words}, wordleSrc);
}

window.addEventListener("keydown", function(e) {
    if(e.code === "Enter") {
        onPressEnter();
        // prevent scroll
        e.preventDefault();
    } else if ('abcdefghijklmnopqrstuvwxyz'.indexOf(e.key.toLowerCase()) > -1) {
        onPressLetter(e.key);
    } else if (e.key === "Backspace") {
        onPressBackspace();
    }
}, false);

$(".new-game").on("click", function(){
    $(".result-word").hide();
    startGame();
});

$(".close-btn").on("click", function() {
    $(".popup").hide();
});

// parser, evaluater, editor, consl, canvas, controls, options
runtime.config(parser, evaluator, null, io, null, {}, {});
startGame();
