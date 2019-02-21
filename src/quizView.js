export default {
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
}
