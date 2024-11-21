'use strict';
$(function() {
    const words = ["Cat", "Bicycle", "Dog", "Galaxy", "Mystery", "Adventure", "Courage", "Harmony", "Pyramid", "Whisper"];

    const images = [
        "https://imgur.com/kdOUako.png",
        "https://imgur.com/cQwbZo9.png",
        "https://imgur.com/iDjTM4X.png",
        "https://imgur.com/Y7SaQbb.png",
        "https://imgur.com/S0UlH91.png",
        "https://imgur.com/bAdJg1V.png",
        "https://imgur.com/wQGHALC.png",
        "https://imgur.com/zU0g3IA.png",
        "https://imgur.com/oUT5TYa.png",
        "https://imgur.com/ZlJpkb3.png",
        "https://imgur.com/l8uGH9i.png",
        "https://imgur.com/wh23lQC.png"
    ];

    let word;
    let guessedLetters;
    let mistakes;
    let gameOver;

    function initializeGame() {
        word = words[Math.floor(Math.random() * words.length)].toUpperCase();
        guessedLetters = new Set();
        mistakes = 0;
        gameOver = false;
        $('.message').hide();
    }

    function updateWordDisplay() {
        let display = '';
        for (let letter of word) {
            display += (guessedLetters.has(letter) || gameOver) ? letter : '_';
            display += ' ';
        }
        $('.word').text(display);
    }

    function checkWin() {
        return word.split('').every(letter => guessedLetters.has(letter));
    }

    function updateImage() {
        $('.hangman-image').attr('src', images[mistakes]);
    }

    function resetGame() {
        $('.guess-input').off('keypress');
        $('.guess-button').off('click');

        initializeGame();
        $('.guess-input').prop('disabled', false);
        $('.guess-button').prop('disabled', false);
        $('.guess-input').val('').focus();
        updateWordDisplay();
        updateImage();
        updateUsedLetters();

        $('.guess-button').on('click', handleGuess);
        $('.guess-input').on('keypress', function(e) {
            if (e.which === 13) handleGuess();
        });
    }

    function handleGuess() {
        if (gameOver) return;

        let guess = $('.guess-input').val().toUpperCase();
        $('.guess-input').val('');

        if (guess.length !== 1 || !/[A-Za-z]/.test(guess)) {
            return;
        }

        if (guessedLetters.has(guess)) {
            showMessage('You already tried this letter!', 'warning');
            setTimeout(() => {
                $('.message').fadeOut(200);
            }, 1000);
            return;
        }

        guessedLetters.add(guess);
        updateUsedLetters();

        if (!word.includes(guess)) {
            mistakes++;
            if (mistakes >= images.length - 1) {
                mistakes = images.length - 1;
                gameOver = true;
                $('.guess-input').prop('disabled', true);
                $('.guess-button').prop('disabled', true);
                showMessage(`Game Over! The word was: ${word}`, 'error');
                updateWordDisplay();
                updateImage();
                return;
            }
            updateImage();
        }

        updateWordDisplay();

        if (checkWin()) {
            gameOver = true;
            $('.guess-input').prop('disabled', true);
            $('.guess-button').prop('disabled', true);
            showMessage('Congratulations! You won! 🎉', 'success');
        }
    }

    function showMessage(text, type) {
        const colors = {
            error: '#ff4444',
            warning: '#ffbb33',
            success: '#00C851'
        };

        $('.message')
            .css({
                'position': 'static',
                'margin-top': '10px',
                'text-align': 'center',
                'color': colors[type]
            })
            .text(text)
            .hide()
            .fadeIn(200);
    }

    function updateUsedLetters() {
        $('.used-letters').text('Used letters: ' +
            Array.from(guessedLetters)
                .sort()
                .join(', '));
    }

    $('.guess-button').on('click', handleGuess);

    $('.guess-input').on('keypress', function(e) {
        if (e.which === 13) handleGuess();
    });

    $('.new-game-button').click(resetGame);

    initializeGame();
    $('.guess-input').focus();
    updateWordDisplay();
    updateImage();
});
