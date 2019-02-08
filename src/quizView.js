export default {
  overlay: null,
  navModal: null,
  statsModal: null,
  aboutModal: null,
  section: null,
  statsElements: null,

  init: function(overlay, navModal, statsModal, aboutModal, section){
    this.overlay = overlay;
    this.navModal = navModal;
    this.statsModal = statsModal;
    this.aboutModal = aboutModal;
    this.section = section;
    this.statsElements = document.querySelectorAll('.stats-modal__stats');
  },
  hideModals: function(){
    this.overlay.classList.add('overlay--hidden');
    this.navModal.classList.remove('nav--visible');
    this.statsModal.classList.remove('stats-modal--visible');
    this.aboutModal.classList.remove('about-modal--visible');
    document.body.style.overflow = '';
  },
  showNavModal: function(){
    this.overlay.classList.remove('overlay--hidden');
    this.navModal.classList.add('nav--visible');
    document.body.style.overflow = 'hidden';
  },
  hideNavModal: function(){
    this.navModal.classList.remove('nav--visible');
  },
  showStatsModal: function(){
    this.statsModal.classList.add('stats-modal--visible');
  },
  showAboutModal: function(){
    this.aboutModal.classList.add('about-modal--visible');
  },
  hideStartButton: function(startButton){
    startButton.classList.add('section__start-quiz-btn--hidden');
    startButton.tabIndex = '-1';
  },
  renderStats: function(stats){
    for(let element of this.statsElements){
      if(element.classList[1] === 'stats-modal__games-played'){
        element.textContent = stats.games
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
    console.log(obj)
    for(let answer of obj.answers){
      let answerLabel = document.createElement('label');
      let answerInput = document.createElement('input');
      let checkmark = document.createElement('span');
      let checkmarkInner = document.createElement('span');

      answerContainer.classList.add('section__answer-container');
      answerLabel.classList.add('section__answer-label');
      answerInput.classList.add('section__answer-input');
      checkmark.classList.add('section__checkmark');
      checkmarkInner.classList.add('section__checkmark-inner')

      answerInput.type = 'radio';
      answerInput.name = 'Q' + questionCount;
      answerLabel.innerHTML = answer;

      answerContainer.appendChild(answerLabel);
      answerLabel.appendChild(answerInput);
      answerLabel.appendChild(checkmark);
      checkmark.appendChild(checkmarkInner);

    }
  },
}
