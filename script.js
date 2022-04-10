/*************************************  GLOBAL VARIABLES ************************************/
const answers = document.querySelectorAll('.choice-grid div');

let answerToFirstQuestion;
let answerToSecondQuestion;
let answerToThirdQuestion;

/****************************************** FUNCTIONS ***************************************/
function storeTheAnswer (answer) {
    if (answer.dataset.questionId === 'one') answerToFirstQuestion = answer;
    else if (answer.dataset.questionId === 'two') answerToSecondQuestion = answer;
    else  answerToThirdQuestion = answer;
}

function isQuizFinished () {
    return answerToFirstQuestion !== undefined &&
            answerToSecondQuestion !== undefined &&
            answerToThirdQuestion !== undefined;
}

function findElementWithHighestOccurrences(List) {
    //accertiamoci prima che non sia vuota
    if(List.length === 0)
        return null;

    let Map = {};
    let maxEl = List[0]; // di default è la prima
    let maxCount = 1;

    for(let i = 0; i < List.length; i++) {
        if (Map[List[i]] == null)
            Map[List[i]] = 1;
        else
            Map[List[i]]++;

        if(Map[List[i]] > maxCount)
        {
            maxEl = List[i];
            maxCount = Map[List[i]];
        }
    }
    return maxEl;
}

function showResultOfTheQuiz () {
    const result = document.querySelector('#result');
    result.classList.remove('hidden');

    let idChoicedAnswers = [answerToFirstQuestion.dataset.choiceId,
                            answerToSecondQuestion.dataset.choiceId,
                            answerToThirdQuestion.dataset.choiceId];

    let dominantAnswerId = findElementWithHighestOccurrences(idChoicedAnswers);

    result.querySelector('h1').textContent = RESULTS_MAP[dominantAnswerId].title;
    result.querySelector('p').textContent = RESULTS_MAP[dominantAnswerId].contents;

    // aggiungiamo un EventListener al bottone 'Ricomincia Quiz'
    const button = result.querySelector('button');
    button.addEventListener('click', resetAll);

    // scrolliamo fino in fondo
    document.body.scrollTop = (document.documentElement.scrollTop = document.documentElement.scrollHeight);
}

function addEventListenerToAllAnswers () {
    for (const answer of answers) {
        answer.addEventListener('click', selectAnswer);
    }
}

function removeEventListenerToAllAnswers () {
    for (const answer of answers) {
        answer.removeEventListener('click', selectAnswer);
    }
}

function checkTheBoxOf (answer) {
    const img = answer.querySelector('img.checkbox')
    img.src = 'images/checked.png'
}

function uncheckTheBoxOf (answer) {
    const img = answer.querySelector('img.checkbox')
    img.src = 'images/unchecked.png'
}

function lightenTheOthersAnswersWithSameID (answer) {
    for (const item of answers) {
        if (item.dataset.questionId === answer.dataset.questionId && item !== answer)
            item.classList.add('unselected');
    }
}

function restoreAllAnswersWithSameID (questionId) {
    for (const item of answers) {
        if (item.dataset.questionId === (questionId)) {
            item.classList.remove('unselected');
            item.classList.remove('selected');
            uncheckTheBoxOf(item);
        }
    }
}

function restoreAllAnswers() {
    for (const item of answers) {
        item.classList.remove('unselected');
        item.classList.remove('selected');
        uncheckTheBoxOf(item);
    }
}

function hideResultOfTheQuiz () {
    const result = document.querySelector('#result');
    result.classList.add('hidden');
}

/********************************************* HANDLERS *********************************************/
function selectAnswer(event) {
    const answer = event.currentTarget; // answer = elemento a cui è associato l'eventListner

    restoreAllAnswersWithSameID(answer.dataset.questionId);
    answer.classList.add('selected');
    checkTheBoxOf(answer);

    storeTheAnswer(answer);

    lightenTheOthersAnswersWithSameID(answer);
        
    if (isQuizFinished()) {
        removeEventListenerToAllAnswers();
        showResultOfTheQuiz();
    }
}

function resetAll() {
    // Le risposte scelte devono tornare al loro aspetto originario.
    restoreAllAnswers();
    // Il risultato sulla personalità deve scomparire.
    hideResultOfTheQuiz();
    // Le risposte devono poter essere nuovamente selezionabili.
    addEventListenerToAllAnswers();
    // La pagina deve sembrare e comportarsi come se aveste ricaricato la pagina => torniamo in alto
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    //INIZIALIZZIAMO TUTTE LE VARIABILI GLOBALI
    answerToFirstQuestion = undefined;
    answerToSecondQuestion = undefined;
    answerToThirdQuestion = undefined;
}


/***************************************** """MAIN""" *******************************************/
addEventListenerToAllAnswers();
