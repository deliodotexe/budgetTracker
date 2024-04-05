const { createApp, onMounted, ref, reactive} = Vue;

createApp({
  data() {
    return {
      dailyIncome: 106,
      dailyFixedCosts: 60,
      dailySavings: 7,
      spendToday: 0, // Dynamically calculated or inputted
      savingsAccount: 1000, // Example static value or dynamically updated
      transaction: {
        type: 'single', // 'single' or 'repeating'
        name: '',
        date: '', // For single transaction
        validFrom: '', // For repeating transaction
        validUntil: '', // For repeating transaction
        interval: 'monthly', // 'monthly', 'yearly', 'biyearly'
        amount: null,
      }
    };
  },
  computed: {
    // Computed properties work as cached properties that automatically update
    freeSpendableMoneyPerDay() {
      // Correct the property names used here
      return this.dailyIncome - this.dailyFixedCosts - this.dailySavings - this.spendToday;
    },
    totalSpendableMoney() {
      // Directly reference computed property as this is also reactive
      return this.freeSpendableMoneyPerDay + this.savingsAccount;
    }
  },
  methods: {
    // A method to refresh or recalculate anything if necessary
    reloadStatistics() {
      // Force a re-fetch or recalculation of your data. In this example, it's not doing much,
      // but you can expand it to actually reload data from an API or similar.
      console.log("Statistics reloaded."); // Placeholder action
    },
    submitTransaction() {
        // Placeholder for form submission logic
        console.log(this.transaction);
        // Reset the form here or navigate to another page
    }
  },
  setup() {
    const lists = reactive([
        {
          name: 'Repeating Incomes',
          items: [
            // Mock data...
          ]
        },
        {
          name: 'Fixed Costs',
          items: [
            // Mock data...
          ]
        },
        {
          name: 'Purchases',
          items: [
            // Mock data...
          ]
        }
      ]);

    function editItem(item, listName) {
        // Logic to handle edit - show modal with form
    }
  
    function deleteItem(item, listName) {
      const list = lists.find(l => l.name === listName);
      list.items = list.items.filter(i => i !== item);
    }
    const income = reactive({
        name: '',
        validFrom: null,
        validUntil: null,
        amount: 0
    });
    const incomeType = ref('single');

    function submitIncome(){
        if(incomeType.value === 'single')
        {
            //TODO: what to do with single stuff
        } else {
            //TODO: what to do with repeating stuff
        }
    }
    const chart = ref(null);
    const chartData = {
      labels: [],
      datasets: [
        {
          label: 'Budget',
          data: [],
          fill: false,
          borderColor: 'blue',
          tension: 0.1
        },
        {
          label: 'Expenses',
          data: [],
          fill: false,
          borderColor: 'red',
          tension: 0.1
        }
      ]
    };

    // Utility function to generate dates
    function generateDateLabels() {
      const today = new Date();
      const dates = [];
      // Start from 20 days in the past
      for (let i = -20; i <= 10; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        dates.push(date.toISOString().split('T')[0]); // Format as 'YYYY-MM-DD'
      }
      return dates;
    }

    // Populate the labels array
    chartData.labels = generateDateLabels();
    
    // Populate your data arrays here
    // For example purposes, we'll generate some random data
    chartData.datasets[0].data = chartData.labels.map(() => Math.random() * 100);
    chartData.datasets[1].data = chartData.labels.map(() => Math.random() * 100);

    onMounted(() => {
        const ctx = document.getElementById('budgetChart').getContext('2d');
        chart.value = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            },
            // Include annotation configuration here
            plugins: {
              annotation: {
                annotations: {
                  todayLine: { // Give your annotation a unique ID
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x', // Assuming your x-axis has an ID of 'x'
                    value: new Date().toISOString().split('T')[0], // Current date in 'YYYY-MM-DD'
                    borderColor: 'black',
                    borderWidth: 2,
                    label: {
                      enabled: true,
                      position: 'center',
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      font: {
                        weight: 'bold'
                      }
                    }
                  }
                }
              }
            }
          }
        });
      });

    return { chart, income, incomeType, submitIncome, lists, editItem, deleteItem };
  }
}).mount('#app');
