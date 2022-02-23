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
        if (text.trim() === "win") {
            gameover = true;
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

window.addEventListener("keydown", function(e) {
    if (gameover) {
        return;
    }
    if(e.code === "Enter") {
        if (word.length === 5) {
            if (words.indexOf(word) === -1) {
                $( ".alert" ).show();
                $( ".alert" ).delay(1000).fadeOut( "slow" );
            } else {
                enterCallback(word);
            }
        }
        // prevent scroll
        e.preventDefault();
    } else if ('abcdefghijklmnopqrstuvwxyz'.indexOf(e.key.toLowerCase()) > -1) {
        if (cursor < 5) {
            word += e.key.toLowerCase();
            console.log($('.r:nth-child(' + (row+1) + ') .c:nth-child('+(cursor+1)+')'))
            $('.r:nth-child(' + (row+1) + ') .c:nth-child('+(cursor+1)+')').text(e.key.toUpperCase());
            cursor += 1;
        }
    } else if (e.key === "Backspace") {
        if (cursor > 0) {
            cursor -= 1;
            $('.r:nth-child(' + (row+1) + ') .c:nth-child('+(cursor+1)+')').text("");
            word = word.slice(0, word.length-1)
        }
    }
    
}, false);

// parser, evaluater, editor, consl, canvas, controls, options
runtime.config(parser, evaluator, null, io, null, {}, {});

const randomWord = words[Math.floor(Math.random() * words.length)];

runtime.restart();
runtime.executeAll({in: words}, wordleSrc);

let keyboard = $(".keyboard");
let keys = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM"
];

for (let r = 0; r < keys.length; r++) {
    let row = keys[r];
    let keyRow = $('<div class="key-row"></div>');
    for (let i = 0; i < row.length; i++) {
        let letter = row[i];
        keyRow.append($('<div class="key key-'+letter.toLowerCase()+'">'+letter+'</div>'));
    }
    keyboard.append(keyRow);
}

let board = $(".console-view");
for (let i = 0; i < 6; i++) {
    let row = $('<div class="r"></div>');
    for (let j = 0; j < 5; j++) {
        row.append($('<div class="c"></div>'));
    }
    board.append(row);
}
