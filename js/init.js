var app = new Vue({
    el: '#app',
    data: {
        name: '',
        questions: discData,
        currentQuestion: 0,
        view: 'form-view',
        stats: {
            least: {
                "D": 0,
                "I": 0,
                "S": 0,
                "C": 0
            },
            most: {
                "D": 0,
                "I": 0,
                "S": 0,
                "C": 0
            }
        }
    },
    methods: {
        pressedMost(answerIndex) {
            var selected = this.questions[this.currentQuestion]

            .answers[answerIndex].selected;
            if (selected === 'most') {
                this.questions[this.currentQuestion]
                .answers[answerIndex].selected = '';
            } else if (selected === '' || selected === 'least') {
                this.questions[this.currentQuestion]
                .answers = this.questions[this.currentQuestion]
                .answers.map(function(answer){
                    if (answer.selected === 'most') {
                        answer.selected = '';
                    }

                    return answer;
                });

                this.questions[this.currentQuestion]
                .answers[answerIndex].selected = 'most';
            }
        },
        pressedLeast(answerIndex) {
            var selected = this.questions[this.currentQuestion]
            .answers[answerIndex].selected;

            if (selected === 'least') {
                this.questions[this.currentQuestion]
                .answers[answerIndex].selected = '';
            } else if (selected === '' || selected === 'most') {
                this.questions[this.currentQuestion]
                .answers = this.questions[this.currentQuestion]
                .answers.map(function(answer){
                    if (answer.selected === 'least') {
                        answer.selected = '';
                    }

                    return answer;
                });

                this.questions[this.currentQuestion]
                .answers[answerIndex].selected = 'least';
            }
        },
        pressedBack() {
            this.currentQuestion--;
        },
        pressedNext() {
            this.currentQuestion++;
        },
        pressedSubmit() {
            this.stats = this.questions.reduce(getResults, this.stats);
            this.view  = 'chart-view';
            drawCharts(this.stats)
        }
    }
});

function getResults(questionStats, question) {
    var answerStat = question.answers.reduce(getChoices, {most: '', least: ''});

    if (answerStat.most === '' || answerStat.least === '') {
        alert('Please check the questions.');
    }

    questionStats.most[answerStat.most]++;
    questionStats.least[answerStat.least]++;

    return questionStats;
}

function getChoices(answerStats, answer) {
    if (answer.selected !== '') {
        answerStats[answer.selected] = answer.value;
    }

    return answerStats;
}

function drawCharts(stats) {
    var mostCtx   = document.getElementById('most-chart');
    var leastCtx  = document.getElementById('least-chart');
    var mostData  = getChartData();
    var leastData = getChartData();

    mostData.datasets[0].data = [
        stats.most['D'], stats.most['I'],
        stats.most['S'], stats.most['C']
    ];

    var mostTotal = mostData.datasets[0].data.reduce(getTotal, 0);

    var mostChart = new Chart(mostCtx, {
        type: "pie",
        data: mostData,
        options: getChartOptions('Most Chart', mostTotal)
    });

    leastData.datasets[0].data = [
        stats.least['D'], stats.least['I'],
        stats.least['S'], stats.least['C']
    ];

    var leastTotal = leastData.datasets[0].data.reduce(getTotal, 0);

    var leastChart = new Chart(leastCtx, {
        type: "pie",
        data: leastData,
        options: getChartOptions('Least Chart', leastTotal)
    });
}

function getChartData() {
    return {
        labels: ["D", "I", "S", "C"],
        datasets: [{
            data: [],
            backgroundColor: [
                '#c0392b', '#f1c40f',
                '#27ae60', '#2980b9'
            ],
            hoverBackgroundColor: [
                '#e74c3c', '#f6c914',
                '#2ecc71', '#3498db'
            ]
        }]
    };
}

function getChartOptions(titleText, chartTotal) {
    return {
        title: {
            display: true,
            text: titleText,
            fontSize: 48,
            fontFamily: "Oswald"
        },
        tooltips: {
            bodyFontSize: 16,
            bodyFontFamily: 'Open Sans',
            xPadding: 10,
            yPadding: 10,
            callbacks: {
                label: function(item, data) {
                    return toPercent(data.datasets[0].data[item.index], chartTotal);
                }
            }
        },
        showAllTooltips: true
    }
}

function getTotal(previous, current) {
    return previous + current;
}

function toPercent(numerator, denominator) {
    return Math.round(numerator / denominator * 10000) / 100 + '%';
}
