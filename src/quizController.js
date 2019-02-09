import quizModel from './quizModel.js';
import quizView from './quizView.js';

export function quizFunc(){
  const menuIcon = document.querySelector('.header__menu-icon');
  const gameScreenButton = document.querySelector('.nav__menu-game-btn');
  const statsButton = document.querySelector('.nav__menu-stats-btn');
  const aboutButton = document.querySelector('.nav__menu-about-btn');
  const overlay = document.querySelector('.overlay-drawer');
  const nav = document.querySelector('nav');
  const statsModal = document.querySelector('.stats-modal');
  const aboutModal = document.querySelector('.about-modal');
  const startQuizButton = document.querySelector('.section__start-quiz-btn');
  const section = document.querySelector('section');
  const dialogModalButtons = document.querySelectorAll('.modal-dialog__btn');

  function init(){
    quizView.init(overlay, nav, statsModal, aboutModal, section);
    quizView.renderStats(quizModel.getStats());
  }
  init();
  menuIcon.addEventListener('click', function(e){
    quizView.showNavModal();
  });
  overlay.addEventListener('click', function(e){
    quizView.hideModals();

  });
  nav.addEventListener('click', function(e){
    e.stopPropagation();
  });
  gameScreenButton.addEventListener('click', function(e){
    quizView.hideModals();
  });
  statsButton.addEventListener('click', function(e){
    quizView.hideNavModal();
    quizView.showStatsModal();
  });
  statsModal.addEventListener('click', function(e){
    e.stopPropagation();
  });
  aboutButton.addEventListener('click', function(e){
    quizView.hideNavModal();
    quizView.showAboutModal();
  });
  aboutModal.addEventListener('click', function(e){
    e.stopPropagation();
  });

  startQuizButton.addEventListener('click', startQuiz);

  function startQuiz(e){
    quizView.hideStartButton(startQuizButton);
    quizModel.getQuestions()
    .then(function(data){
      let questionCount = 1;
      let dataCopy = JSON.parse(JSON.stringify(data));
      for(let obj of dataCopy){
        let questionObj = quizModel.pushData(obj);
        quizView.renderQuestions(questionObj, questionCount);
        questionCount++;
      }
    })
    .then(function(){
      let resultButton = quizView.renderResultButton();
      let answerContainers = document.querySelectorAll('.section__answer-container');
      let answerInputs = document.querySelectorAll('.section__answer-input');

      for(let input of answerInputs){
        input.addEventListener('click', function(e){
          quizModel.setDataSet(e.target.parentNode.parentNode);
        })
      }

      resultButton.addEventListener('click', function(e){
        let check = true;
        for(let element of answerContainers){
          if(!element.dataset.checked){
            return check = false;
          }
        }
        if(!check) return;
        let resultArr = [];
        for(let input of answerInputs){
          if(input.checked){
            resultArr.push(input.parentNode.textContent)
          }
        }
        let correctAnswers = quizModel.checkResult(resultArr);
        quizView.renderStats(quizModel.getStats());
        let questionAmount = quizModel.getQuestionAmount();
        quizView.showModalDialog(correctAnswers, questionAmount);
      })
    })
  }
  for(let btn of dialogModalButtons){
    btn.addEventListener('click', function(e){
      section.innerHTML = '';
      quizView.hideModalDialog();
      if(e.target.classList[1] === 'modal-dialog__restart-btn'){
        startQuiz();
      }
      else{
        quizView.showStartButton(startQuizButton);
      }
    })
  }
}
