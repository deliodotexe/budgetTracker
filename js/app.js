const { createApp, onMounted, ref, reactive} = Vue;

createApp({
    data() {
        return {
            visualDailyIncome: 0,
            visualDailyOutcome: 0,
            visualDailySavings: 0,
            visualSpendToday: 0,
            visualSavingsOnAccount: 0,
            singleTransactions: [],
            recurringTransactions: [],
            formSingleTransaction: {
                type: 'singleOutcome'
            },  
            formRepeatingTransaction: {
                type: 'repeatingOutcome'
            }
        };
    },
    computed: {
        visualSpendableMoneyToday () {
            return this.visualDailyIncome - this.visualDailyOutcome - this.visualDailySavings - this.visualSpendToday;
        },
        visualSpendableMoneyTotal () {
            return this.visualSpendableMoneyToday + this.visualSavingsOnAccount;
        },
        visualAverageSpendingsDaily () {
            return 0;
        },
        recurringIncomes() {
            return this.recurringTransactions.filter(t => t.Amount > 0);
        },
        recurringOutcomes() {
            return this.recurringTransactions.filter(t => t.Amount < 0);
        }
    },
    methods: {
        fetchTransactions(){
            //TODO
        },
        editItem(item){
            //TODO
        },
        deleteItem(item){
            //TODO
        }
    },
    mounted (){
        this.fetchTransactions();
    }
}).mount('#app');