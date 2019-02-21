import quizModel from './quizModel.js';
import quizView from './quizView.js';

export function quizFunc(){
  const menuIcon = document.querySelector('.header__menu-icon');
  const gameScreenButton = document.querySelector('.nav__menu-game-btn');
  const statsButton = document.querySelector('.nav__menu-stats-btn');
  const aboutButton = document.querySelector('.nav__menu-about-btn');
  const settingsButton = document.querySelector('.nav__menu-settings-btn');
  const overlay = document.querySelector('.overlay-drawer');
  const nav = document.querySelector('nav');
  const statsModal = document.querySelector('.stats-modal');
  const aboutModal = document.querySelector('.about-modal');
  const settingsModal = document.querySelector('.settings-modal');
  const startQuizButton = document.querySelector('.section__start-quiz-btn');
  const section = document.querySelector('section');
  const dialogModalButtons = document.querySelectorAll('.modal-dialog__btn');
  const modalBackArrows = document.querySelectorAll('.icon-back');
  const statsBackArrow = document.querySelector('.stats-modal__icon-back');
  const aboutBackArrow = document.querySelector('.about-modal__icon-back');
  const settingsBackArrow = document.querySelector('.settings-modal__icon-back');
  const settingsQuestions = document.querySelector('.settings-modal__questions-input');
  const settingsDifficulty = document.querySelector('.settings-modal__difficulty-selector');
  function init(){
    quizView.init(overlay, nav, statsModal, aboutModal, settingsModal, section);
    quizView.renderStats(quizModel.getStats());
  };

  init();

  function hideModals(e){
    let questions = document.querySelectorAll('.section__question');
    let quizInputs = document.querySelectorAll('.section__answer-input');
    let resultButton = document.querySelector('.section__result-btn');
    quizModel.setTabZero(menuIcon, startQuizButton, resultButton, quizInputs, questions);
    quizModel.setTabMinus(gameScreenButton, statsButton, aboutButton, settingsButton, statsBackArrow, aboutBackArrow, settingsBackArrow, settingsQuestions, settingsDifficulty);
    quizView.hideModals();
  };

  menuIcon.addEventListener('click', function(e){
    let questions = document.querySelectorAll('.section__question');
    let quizInputs = document.querySelectorAll('.section__answer-input');
    let resultButton = document.querySelector('.section__result-btn');
    quizModel.setTabZero(gameScreenButton, statsButton, aboutButton, settingsButton);
    quizModel.setTabMinus(menuIcon, startQuizButton, resultButton, quizInputs, questions);
    quizView.showNavModal();
  });

  menuIcon.addEventListener('keydown', function(e){
    if(e.keyCode === 13){
      let questions = document.querySelectorAll('.section__question');
      let quizInputs = document.querySelectorAll('.section__answer-input');
      let resultButton = document.querySelector('.section__result-btn');
      quizModel.setTabZero(gameScreenButton, statsButton, aboutButton, settingsButton);
      quizModel.setTabMinus(menuIcon, startQuizButton, resultButton, quizInputs, questions);
      quizView.showNavModal();
    }
  });

  overlay.addEventListener('click', hideModals);

  nav.addEventListener('click', function(e){
    e.stopPropagation();
  });

  gameScreenButton.addEventListener('click', function(e){
    let questions = document.querySelectorAll('.section__question');
    let quizInputs = document.querySelectorAll('.section__answer-input');
    let resultButton = document.querySelector('.section__result-btn');
    quizModel.setTabZero(menuIcon, startQuizButton, resultButton, quizInputs, questions);
    quizModel.setTabMinus(gameScreenButton, statsButton, aboutButton, settingsButton);
    quizView.hideModals();
  });

  statsButton.addEventListener('click', function(e){
    quizModel.setTabMinus(gameScreenButton, statsButton, aboutButton, settingsButton);
    new Promise ((resolve, reject) => {
      quizView.hideNavModal();
      quizView.showStatsModal();
      setTimeout(() => {
        resolve();
      }, 300);
    })
    .then(() => {
      quizModel.setTabZero(statsBackArrow);
    })
  });
  statsButton.addEventListener('keydown', function(e){
    e.stopPropagation();
  });
  statsModal.addEventListener('click', function(e){
    e.stopPropagation();
  });
  statsModal.addEventListener('keydown', function(e){
    e.stopPropagation();
  });

  aboutButton.addEventListener('click', function(e){
    quizModel.setTabMinus(gameScreenButton, statsButton, aboutButton, settingsButton);
    new Promise ((resolve, reject) => {
      quizView.hideNavModal();
      quizView.showAboutModal();
      setTimeout(() => {
        resolve();
      }, 300);
    })
    .then(() => {
      quizModel.setTabZero(aboutBackArrow);
    })
  });
  aboutButton.addEventListener('keydown', function(e){
    e.stopPropagation();
  });
  aboutModal.addEventListener('click', function(e){
    e.stopPropagation();
  });

  settingsButton.addEventListener('click', function(e){
    quizModel.setTabMinus(gameScreenButton, statsButton, aboutButton, settingsButton);
    new Promise ((resolve, reject) => {
      quizView.hideNavModal();
      quizView.showSettingsModal();
      setTimeout(() => {
        resolve();
      }, 300);
    })
    .then(() => {
      quizModel.setTabZero(settingsBackArrow, settingsQuestions, settingsDifficulty);
    })
  })

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
      let questions = document.querySelectorAll('.section__question');
      quizModel.setTabZero(questions);
    })
    .then(function(){
      let resultButton = quizView.renderResultButton();
      let answerContainers = document.querySelectorAll('.section__answer-container');
      let answerInputs = document.querySelectorAll('.section__answer-input');

      for(let input of answerInputs){
        input.addEventListener('click', function(e){
          quizModel.setDataChecked(e.target.parentNode.parentNode);
        });
      };

      resultButton.addEventListener('click', function(e){
        e.target.blur();
        let check = true;
        for(let element of answerContainers){
          if(!element.dataset.checked){
            element.scrollIntoView({behavior: 'smooth', block: 'center'});
            return check = false;
          };
        };
        if(!check) return;
        let resultArr = [];
        for(let input of answerInputs){
          if(input.checked){
            resultArr.push(input.parentNode.textContent);
          };
        };
        let correctAnswers = quizModel.checkResult(resultArr);
        quizView.renderStats(quizModel.getStats());
        let questionAmount = quizModel.getQuestionAmount();
        let titleMessage = quizModel.titleMessage(correctAnswers, questionAmount);
        quizView.showModalDialog(correctAnswers, questionAmount, titleMessage);
        let questions = document.querySelectorAll('.section__question');
        let quizInputs = document.querySelectorAll('.section__answer-input');
        let resultButton = document.querySelector('.section__result-btn');
        quizModel.setTabMinus(menuIcon, questions, quizInputs, resultButton);
        quizModel.setTabZero(dialogModalButtons);
      });
    })
  };

  for(let btn of dialogModalButtons){
    btn.addEventListener('click', function(e){
      section.innerHTML = '';
      quizView.hideModalDialog();
      if(e.target.classList[1] === 'modal-dialog__restart-btn'){
        startQuiz();
        window.scrollTo(0, 0);
        menuIcon.focus();
        quizModel.setTabZero(menuIcon);
      }
      else{
        quizView.showStartButton(startQuizButton);
        quizModel.setTabZero(menuIcon);
        window.scrollTo(0, 0);
        menuIcon.focus();
      };
    });
  };

  for(let backBtn of modalBackArrows){
    backBtn.addEventListener('click', function(e){
      quizModel.setTabMinus(statsBackArrow, aboutBackArrow, settingsBackArrow, settingsQuestions, settingsDifficulty);
      quizModel.setTabZero(gameScreenButton, statsButton, aboutButton, settingsButton);
      quizView.hideModals();
      quizView.showNavModal();
    })
    backBtn.addEventListener('keydown', function(e){
      e.stopPropagation();
      if(e.keyCode === 13){
        quizModel.setTabMinus(statsBackArrow, aboutBackArrow, settingsBackArrow, settingsQuestions, settingsDifficulty);
        quizModel.setTabZero(gameScreenButton, statsButton, aboutButton, settingsButton);
        quizView.hideModals();
        quizView.showNavModal();
      };
    });
  };
  settingsQuestions.addEventListener('change', function(e){
    if(e.target.value > 50){
      e.target.value = 50;
    }
    else if(e.target.value < 5){
      e.target.value = 5;
    }
    quizModel.questionAmount = e.target.value;
  });
  settingsDifficulty.addEventListener('change', function(e){
    quizModel.difficulty = e.target.value;
  })
};
