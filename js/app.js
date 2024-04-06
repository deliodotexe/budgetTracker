const { createApp, onMounted } = Vue;

createApp({
    data() {
        return {
            singleTransactions: [],
            recurringTransactions: [],
            formSingleTransaction: {
                type: 'singleOutcome',
                name: '',
                date: '',
                amount: 0
            },  
            formRepeatingTransaction: {
                type: 'repeatingOutcome',
                name: '',
                validFrom: '',
                validUntil: '',
                amount: 0,
                interval: 0
            },
            transactionNameSuggestions: [],
        };
    },
    computed: {
        visualSpendableMoneyToday () {
            return (this.visualSpendableMoneyDaily - Number(this.visualSpendToday)).toFixed(2);
        },
        visualSpendableMoneyTotal () {
            return (Number(this.visualSpendableMoneyToday) + Number(this.visualSavingsOnAccount)).toFixed(2);
        },
        visualSpendableMoneyDaily(){
            return (Number(this.visualDailyIncome) + Number(this.visualDailyOutcome)).toFixed(2);
        },
        visualAverageSpendingsDaily () {
            if (!this.singleTransactions || this.singleTransactions.length === 0) {
                return 0; // Return 0 if there are no transactions
            }
    
            // Sum up all spending amounts
            const totalSpendings = this.singleTransactions.reduce((sum, {amount}) => sum + Number(amount), 0);
    
            // Find the unique dates to count the number of days with transactions
            const uniqueDates = new Set(this.singleTransactions.map(({date}) => date));
            const numberOfDays = uniqueDates.size;
    
            // Calculate the average spendings per day
            const averageSpendings = totalSpendings / numberOfDays;
    
            return averageSpendings.toFixed(2); // Rounds to two decimal places for display
        },
        recurringIncomes() {
            return this.recurringTransactions.filter(t => t.amount > 0);
        },
        recurringOutcomes() {
            return this.recurringTransactions.filter(t => t.amount < 0);
        },
        visualDailyIncome(){
            const today = new Date();
            today.setHours(0,0,0,0)

            const validRecurringIncomes = this.recurringIncomes.filter(income => {
                const validFrom = new Date(income.validFrom);
                const validUntil = new Date(income.validUntil);
                return validFrom <= today && today <= validUntil;
            });


            const totalYearlyIncome = validRecurringIncomes.reduce((total, income) => {
                const yearlyAmount = (income.amount * income.transactionInterval);
                return total + yearlyAmount;
            }, 0);

            const dailyIncome = totalYearlyIncome / 365;
            return dailyIncome.toFixed(2);
        },
        visualDailyOutcome (){
            const today = new Date();
            today.setHours(0,0,0,0)

            const validRecurringOutcomes = this.recurringOutcomes.filter(outcome => {
                const validFrom = new Date(outcome.validFrom);
                const validUntil = new Date(outcome.validUntil);
                return validFrom <= today && today <= validUntil;
            });
            const totalYearlyOutcome = validRecurringOutcomes.reduce((total, outcome) => {
                const yearlyAmount = (outcome.amount * outcome.transactionInterval);
                return total + yearlyAmount;
            }, 0);

            const dailyOutcome = totalYearlyOutcome / 365;
            return dailyOutcome.toFixed(2);
        },
        visualSpendToday(){
            const today = new Date().toISOString().split('T')[0];
            const sum = this.singleTransactions.reduce((accumulator, transaction) => {
                const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
                if(transactionDate == today) {
                    return accumulator + Number(transaction.amount);
                }
                return accumulator
            },0);
            return sum.toFixed(2);
        },
        visualSavingsOnAccount(){
            return this.calculateSavingUntil(new Date());
        }
    },
    methods: {
        async fetchTransactions(){
            try {
                const singleTransactionsResponse = await fetch('php/getSingleTransactions.php');
                const singleTransactionsData = await singleTransactionsResponse.json();
                this.singleTransactions = singleTransactionsData;

                const recurringTransactionsResponse = await fetch('php/getRepeatingTransaction.php');
                const recurringTransactionsData = await recurringTransactionsResponse.json();
                this.recurringTransactions = recurringTransactionsData;
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        },
        editItem(item){
            //TODO
        },
        deleteItem(item){
            //TODO
        },
        async submitSingleOutcome(){
            const url = 'php/addSingleTransaction.php';
            var amount = this.formSingleTransaction.amount * -1;

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: this.formSingleTransaction.name,
                        date: this.formSingleTransaction.date,
                        amount: amount
                    })
                });

                if (!response.ok){
                    throw new Error('Network response was not ok');
                }

                this.formSingleTransaction.name = '';
                this.formSingleTransaction.date = '';
                this.formSingleTransaction.amount = 0;
            } catch (error) {
                console.error('Error:',error);
            }
        },
        async submitSingleIncome(){
            const url = 'php/addSingleTransaction.php';

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: this.formSingleTransaction.name,
                        date: this.formSingleTransaction.date,
                        amount: this.formSingleTransaction.amount
                    })
                });

                if (!response.ok){
                    throw new Error('Network response was not ok');
                }

                this.formSingleTransaction.name = '';
                this.formSingleTransaction.date = '';
                this.formSingleTransaction.amount = 0;
            } catch (error) {
                console.error('Error:',error);
            }
        },
        async submitRepeatingIncome (){
            const url = 'php/addRepeatingTransaction.php';
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: this.formRepeatingTransaction.name,
                        amount: this.formRepeatingTransaction.amount,
                        validFrom: this.formRepeatingTransaction.validFrom,
                        validUntil:  this.formRepeatingTransaction.validUntil,
                        transactionInterval: this.formRepeatingTransaction.interval
                    })
                });

                if (!response.ok){
                    throw new Error('Network response was not ok');
                }

                this.formRepeatingTransaction.name = '';
                this.formRepeatingTransaction.validFrom = '';
                this.formRepeatingTransaction.validUntil = '';
                this.formRepeatingTransaction.amount = 0;
                this.formRepeatingTransaction.interval = 0;
            } catch (error) {
                console.error('Error:',error);
            }
        },
        async submitRepeatingOutcome(){
            const url = 'php/addRepeatingTransaction.php';
            var amount = this.formRepeatingTransaction.amount *-1;

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: this.formRepeatingTransaction.name,
                        amount: amount,
                        validFrom: this.formRepeatingTransaction.validFrom,
                        validUntil:  this.formRepeatingTransaction.validUntil,
                        transactionInterval: this.formRepeatingTransaction.interval

                    })
                });

                if (!response.ok){
                    throw new Error('Network response was not ok');
                }

                this.formRepeatingTransaction.name = '';
                this.formRepeatingTransaction.validFrom = '';
                this.formRepeatingTransaction.validUntil = '';
                this.formRepeatingTransaction.amount = 0;
                this.formRepeatingTransaction.interval = 0;
            } catch (error) {
                console.error('Error:',error);
            }
        }, 
        sumOfSpendingsOn(day){
            let dailySpendings = 0;
            this.singleTransactions.forEach(transaction => {
                const transactionDate = new Date(transaction.date);
                if (day.toISOString().split('T')[0] === transactionDate.toISOString().split('T')[0]) {
                    dailySpendings += Number(transaction.amount); // Assumes spendings are negative, reducing the savings
                }
            });
            return dailySpendings;
        },
        calculateSavingUntil(day){
            const startDate = new Date('2024-02-25');
            const endDate = new Date(day);
            let totalSaving = 0;

            for (let date = startDate; date <= endDate; date.setDate(date.getDate() +1)){
                let dailyIncome = 0;
                let dailySpendings = this.sumOfSpendingsOn(date);

                this.recurringTransactions.forEach(transaction => {
                    const validFrom = new Date(transaction.validFrom);
                    const validUntil = new Date(transaction.validUntil);
                    if(date >= validFrom && date <=validUntil){
                        dailyIncome += (Number(transaction.amount) * transaction.transactionInterval / 365);
                    }
                });

                totalSaving += Number(dailyIncome) + Number(dailySpendings);
            }
            return Number(totalSaving).toFixed(2);
        },
        selectSuggestion(suggestion) {
            this.formSingleTransaction.name = suggestion;
            this.transactionNameSuggestions = [];
        }
    },
    watch: {
        'formSingleTransaction.name'(newName) {
            if(!newName){
                this.transactionNameSuggestions = [];
                return;
            }

            this.transactionNameSuggestions = this.singleTransactions
                .map(transaction => transaction.name)
                .filter((name, index, self) => name.toLowerCase().includes(newName.toLowerCase()) && self.indexOf(name) === index); // Filter unique names containing 'newName'    
        }
    },
    mounted (){
        this.fetchTransactions();
        this.generateChartData();
    }
}).mount('#app');