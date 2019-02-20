export default {
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
  questionAmount: 10,
  getQuestionAmount: function(){
    return this.questionAmount;
  },
  currentQuestions: null,
  getCurrentQuestions: function(){
    return this.currentQuestions;
  },
  getQuestions: function(){
    return axios.get('https://opentdb.com/api.php?amount=' + this.questionAmount)
    .then((response) => {
      this.currentQuestions = response.data.results;
      return response.data.results;
    })
  },
  pushData: function(obj){
    let questionObj = {
      question: null,
      answers: []
    }
    for(let answer of obj.incorrect_answers){
      questionObj.answers.push(answer);
    }
    questionObj.answers.push(obj.correct_answer);
    questionObj.question = obj.question
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
    else if(percent > 0.6 && percent < 1) return 'Well done!'
    else return 'Perfect!';
  },
  setTabMinus: function(...args){
    console.log(args);
    for(let element of args){
      if(element === null) continue;
      if(element.length > 0){
        let elementArray = Array.from(element);
        for(let item of elementArray){
          item.tabIndex = '-1';
        }
      }
      else{
        element.tabIndex = '-1';
      }
    }
  },
  setTabZero: function(...args){
    console.log(args);
    for(let element of args){
      if(element === null) continue;
      if(element.length > 0){
        let elementArray = Array.from(element);
        for(let item of elementArray){
          item.tabIndex = '0';
        }
      }
      else{
        element.tabIndex = '0';
      }
    }
  },
}
