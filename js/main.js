let runtime = runtimeExecuter();
let evaluator = runtimeEvaluator();
let parser = runtimeParser();

let enterCallback = null;
let cursor = 0;
let row = 0;
let word = "";
let gameover = false;

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
            $(".new-game").show();
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

// parser, evaluater, editor, consl, canvas, controls, options
runtime.config(parser, evaluator, null, io, null, {}, {});

let keyboard = $(".keyboard");
let keys = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM"
];

function initKeyboard() {
    keyboard.empty();
    for (let r = 0; r < keys.length; r++) {
        let row = keys[r];
        let keyRow = $('<div class="key-row"></div>');
        if (r === 2) {
            let enterKey = $('<div class="key key-enter">Enter</div>');
            enterKey.on("click", function() {
                onPressEnter();
            });
            keyRow.append(enterKey);
        }
        for (let i = 0; i < row.length; i++) {
            let letter = row[i];
            let key = $('<div class="key key-'+letter.toLowerCase()+'">'+letter+'</div>');
            key.on("click", function() {
                onPressLetter(letter);
            });
            keyRow.append(key);
        }
        if (r === 2) {
            let delKey = $('<div class="key key-del">Del</div>');
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

function startGame() {
    enterCallback = null;
    cursor = 0;
    row = 0;
    word = "";
    gameover = false;

    initBoard();
    initKeyboard();

    runtime.restart();
    runtime.executeAll({in: words}, wordleSrc);
}

$(".new-game").on("click", function(){
    $(".result-word").hide();
    $(".new-game").hide();
    startGame();
});

startGame();
