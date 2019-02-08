import quizModel from './quizModel.js';
import quizView from './quizView.js';

export function quizFunc(){
  const menuIcon = document.querySelector('.header__menu-icon');
  const gameScreenButton = document.querySelector('.nav__menu-game-btn');
  const statsButton = document.querySelector('.nav__menu-stats-btn');
  const aboutButton = document.querySelector('.nav__menu-about-btn');
  const overlay = document.querySelector('.overlay');
  const nav = document.querySelector('nav');
  const statsModal = document.querySelector('.stats-modal');
  const aboutModal = document.querySelector('.about-modal');
  const startQuizButton = document.querySelector('.section__start-quiz-btn');
  const section = document.querySelector('section');

  function init(){
    let stats = quizModel.getStats();
    quizView.init(overlay, nav, statsModal, aboutModal, section);
    quizView.renderStats(stats);
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
  startQuizButton.addEventListener('click', function(e){
    quizView.hideStartButton(e.target);
    quizModel.getQuestions()
    .then(function(data){
      let questionCount = 1;
      let dataCopy = JSON.parse(JSON.stringify(data));
      for(let obj of dataCopy){
        let questionObj = quizModel.pushData(obj);
        quizView.renderQuestions(questionObj, questionCount);
        questionCount++;
      }
      // quizView.renderQuestions(dataCopy);
    })
  })
}
