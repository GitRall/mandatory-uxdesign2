(function () {
  'use strict';

  var quizModel = {
    stats: {
      games: 0,
      correct: 0,
      incorrect: 0,
      percentage: 0,
    },
    getStats: function(){
      return this.stats;
    },
    updateStats: function(correct, incorrect){
      this.stats.games++;
      this.stats.correct += correct;
      this.stats.incorrect += incorrect;
      let total = this.stats.correct + this.stats.incorrect;
      this.calcPercentage(total);
    },
    calcPercentage: function(total){
      let percent = this.stats.correct / total;
      this.stats.percentage = Math.floor(percent * 100);
    },
    questionAmount: 5,
    getQuestionAmount: function(){
      return this.questionAmount;
    },
    difficulty: '',
    currentQuestions: null,
    getCurrentQuestions: function(){
      return this.currentQuestions;
    },
    getQuestions: function(){
      return axios.get('https://opentdb.com/api.php?amount=' + this.questionAmount + this.difficulty)
      .then((response) => {
        console.log(response);
        this.currentQuestions = response.data.results;
        return response.data.results;
      })
    },
    pushData: function(obj){
      let questionObj = {
        question: null,
        answers: []
      };
      for(let answer of obj.incorrect_answers){
        questionObj.answers.push(answer);
      }
      questionObj.answers.push(obj.correct_answer);
      questionObj.question = obj.question;
      questionObj.answers = this.shuffleArray(questionObj.answers);
      return questionObj;
    },
    shuffleArray: function(arr){
      let resultArray = [];
      let i = 0;
      while (i < arr.length){
        let index = Math.floor(Math.random() * arr.length);
        resultArray.push(arr[index]);
        arr.splice(index, 1);
      }
      return resultArray;
    },
    setDataChecked: function(element){
      element.dataset.checked = 'checked';
    },
    checkResult: function(arr){
      let correct = 0;
      let incorrect = 0;
      let currentQuestions = this.getCurrentQuestions();
      for(let i = 0; i < this.questionAmount; i++){
        let doc = new DOMParser().parseFromString(currentQuestions[i].correct_answer, "text/html");
        let correctParsed = doc.documentElement.textContent;
        if(arr[i] === correctParsed){
          correct++;
        }
        else{
          incorrect++;
        }
      }
      this.updateStats(correct, incorrect);
      return correct;
    },
    titleMessage: function(correct, amount){
      let percent = correct / amount;
      if(percent <= 0.3) return 'You can do better!';
      else if(percent > 0.3 && percent <= 0.6) return 'Average';
      else if(percent > 0.6 && percent < 1) return 'Well done!';
      else return 'Perfect!';
    },
    setTabMinus: function(...args){
      for(let element of args){
        if(element === null) continue;
        let nodeListCheck = NodeList.prototype.isPrototypeOf(element);
        if(nodeListCheck){
          let elementArray = Array.from(element);
          for(let item of elementArray){
            item.tabIndex = '-1';
          }      }
        else{
          element.tabIndex = '-1';
        }    }  },
    setTabZero: function(...args){
      for(let element of args){
        if(element === null) continue;
        let nodeListCheck = NodeList.prototype.isPrototypeOf(element);
        if(nodeListCheck){
          let elementArray = Array.from(element);
          for(let item of elementArray){
            item.tabIndex = '0';
          }      }
        else{
          element.tabIndex = '0';
        }    }  },
  };

  var quizView = {
    init: function(overlay, navModal, statsModal, aboutModal, settingsModal, section){
      this.overlay = overlay;
      this.navModal = navModal;
      this.statsModal = statsModal;
      this.aboutModal = aboutModal;
      this.settingsModal = settingsModal;
      this.section = section;
      this.statsElements = document.querySelectorAll('.stats-modal__stats');
      this.dialogModalTitle = document.querySelector('.modal-dialog__title');
      this.dialogModalText = document.querySelector('.modal-dialog__text');
      this.overlayModal = document.querySelector('.overlay-modal');
      this.statsContainer = document.querySelector('.stats-modal__stats-container');
      this.aboutContainer = document.querySelector('.about-modal__text-container');
      this.settingsContainer = document.querySelector('.settings-modal__content-container');
    },
    hideModals: function(){
      this.overlay.classList.add('overlay--hidden');
      this.navModal.classList.remove('nav--visible');
      this.statsModal.classList.remove('stats-modal--visible');
      this.statsContainer.setAttribute('aria-live', 'off');
      this.aboutModal.classList.remove('about-modal--visible');
      this.aboutContainer.setAttribute('aria-live', 'off');
      this.settingsModal.classList.remove('settings-modal--visible');
      this.settingsContainer.setAttribute('aria-live', 'off');
    },
    showNavModal: function(){
      this.overlay.classList.remove('overlay--hidden');
      this.navModal.classList.add('nav--visible');
    },
    hideNavModal: function(){
      this.navModal.classList.remove('nav--visible');
    },
    showStatsModal: function(){
      this.statsModal.classList.add('stats-modal--visible');
      this.statsContainer.setAttribute('aria-live', 'polite');
    },
    showAboutModal: function(){
      this.aboutModal.classList.add('about-modal--visible');
      this.aboutContainer.setAttribute('aria-live', 'polite');
    },
    showSettingsModal: function(){
      this.settingsModal.classList.add('settings-modal--visible');
      this.settingsContainer.setAttribute('aria-live', 'polite');
    },
    hideStartButton: function(startButton){
      startButton.classList.add('section__start-quiz-btn--hidden');
      startButton.tabIndex = '-1';
    },
    showStartButton: function(startButton){
      startButton.classList.remove('section__start-quiz-btn--hidden');
      startButton.tabIndex = '0';
    },
    renderStats: function(stats){
      for(let element of this.statsElements){
        if(element.classList[1] === 'stats-modal__games-played'){
          element.textContent = stats.games;
        }
        else if(element.classList[1] === 'stats-modal__correct-answers'){
          element.textContent = stats.correct;
        }
        else if(element.classList[1] === 'stats-modal__incorrect-answers'){
          element.textContent = stats.incorrect;
        }
        else if(element.classList[1] === 'stats-modal__correct-percentage'){
          element.textContent = stats.percentage + '%';
        }
      }
    },
    renderQuestions: function(obj, questionCount){
      let questionWrapper = document.createElement('div');
      let questionContainer = document.createElement('div');
      let questionText = document.createElement('h4');

      questionWrapper.classList.add('section__question-wrapper');
      questionContainer.classList.add('section__question-container');
      questionText.classList.add('section__question');

      questionText.innerHTML = obj.question;

      this.section.appendChild(questionWrapper);
      questionWrapper.appendChild(questionContainer);
      questionContainer.appendChild(questionText);

      let answerContainer = document.createElement('div');
      questionWrapper.appendChild(answerContainer);

      for(let answer of obj.answers){
        let answerLabel = document.createElement('label');
        let answerInput = document.createElement('input');
        let checkmark = document.createElement('span');
        let checkmarkInner = document.createElement('span');

        answerContainer.classList.add('section__answer-container');
        answerLabel.classList.add('section__answer-label');
        answerInput.classList.add('section__answer-input');
        checkmark.classList.add('section__checkmark');
        checkmarkInner.classList.add('section__checkmark-inner');

        answerInput.type = 'radio';
        answerInput.name = 'Q' + questionCount;
        answerLabel.innerHTML = answer;

        answerContainer.appendChild(answerLabel);
        answerLabel.appendChild(answerInput);
        answerLabel.appendChild(checkmark);
        checkmark.appendChild(checkmarkInner);
      }
    },
    renderResultButton: function(){
      let resultButton = document.createElement('button');
      resultButton.innerHTML = 'DONE';
      resultButton.classList.add('section__result-btn');
      this.section.appendChild(resultButton);
      return resultButton;
    },
    showModalDialog: function(correct, amount, title){
      this.dialogModalTitle.textContent = title;
      this.dialogModalText.textContent = 'You Answered ' + correct + '/' + amount + ' questions correct!';
      this.dialogModalText.setAttribute('aria-live', 'polite');
      this.overlayModal.style.display = 'block';
    },
    hideModalDialog: function(){
      this.dialogModalText.setAttribute('aria-live', 'off');
      this.overlayModal.style.display = 'none';
    }
  };

  function quizFunc(){
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
    }
    init();

    function hideModals(e){
      let questions = document.querySelectorAll('.section__question');
      let quizInputs = document.querySelectorAll('.section__answer-input');
      let resultButton = document.querySelector('.section__result-btn');
      quizModel.setTabZero(menuIcon, startQuizButton, resultButton, quizInputs, questions);
      quizModel.setTabMinus(gameScreenButton, statsButton, aboutButton, settingsButton, statsBackArrow, aboutBackArrow, settingsBackArrow, settingsQuestions, settingsDifficulty);
      quizView.hideModals();
    }
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
      });
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
      });
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
      });
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
        }
        resultButton.addEventListener('click', function(e){
          e.target.blur();
          let check = true;
          for(let element of answerContainers){
            if(!element.dataset.checked){
              element.scrollIntoView({behavior: 'smooth', block: 'center'});
              return check = false;
            }        }        if(!check) return;
          let resultArr = [];
          for(let input of answerInputs){
            if(input.checked){
              resultArr.push(input.parentNode.textContent);
            }        }        let correctAnswers = quizModel.checkResult(resultArr);
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
      });
    }
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
        }    });
    }
    for(let backBtn of modalBackArrows){
      backBtn.addEventListener('click', function(e){
        quizModel.setTabMinus(statsBackArrow, aboutBackArrow, settingsBackArrow, settingsQuestions, settingsDifficulty);
        quizModel.setTabZero(gameScreenButton, statsButton, aboutButton, settingsButton);
        quizView.hideModals();
        quizView.showNavModal();
      });
      backBtn.addEventListener('keydown', function(e){
        e.stopPropagation();
        if(e.keyCode === 13){
          quizModel.setTabMinus(statsBackArrow, aboutBackArrow, settingsBackArrow, settingsQuestions, settingsDifficulty);
          quizModel.setTabZero(gameScreenButton, statsButton, aboutButton, settingsButton);
          quizView.hideModals();
          quizView.showNavModal();
        }    });
    }  settingsQuestions.addEventListener('change', function(e){
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
    });
  }

  quizFunc();

}());
