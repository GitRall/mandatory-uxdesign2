export default {
  stats: {
    games: 0,
    correct: 0,
    incorrect: 0,
    percentage: 0,
  },
  currentQuestions: null,
  getCurrentQuestions: function(){
    return this.currentQuestions;
  },
  getStats: function(){
    return this.stats;
  },
  getQuestions: function(){
    return axios.get('https://opentdb.com/api.php?amount=10')
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
}
