const { createApp, onMounted, ref, reactive} = Vue;

createApp({
  data() {
    return {
      dailyIncome: 106,
      dailyFixedCosts: 60,
      dailySavings: 7,
      spendToday: 0, // Dynamically calculated or inputted
      savingsAccount: 1000, // Example static value or dynamically updated
      AverageSpendDaily: 0,
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
    async submitTransaction() {
      const url = 'php/addSingleTransaction.php';

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.transaction.name,
            date: this.transaction.date,
            amount: this.transaction.amount
          })
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        // Handle response data
        const result = await response.json();
        console.log(result); // Process the success response
    
        // Optionally, reset the form or update the UI
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async submitRepeatingTransaction() {
      const url = '/path/to/addRepeatingTransaction.php';
      var interval;

      if(this.transaction.interval === "Every Month") {interval = 12;}
      if(this.transaction.interval === "Once a Year") {interval = 1;}
      if(this.transaction.interval === "Twice a Year") {interval = 2;}

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.transaction.name,
            validFrom: this.transaction.validFrom,
            validUntil: this.transaction.validUntil,
            interval: interval, // Make sure this matches your backend's expected format
            amount: this.transaction.amount
          })
        });
      
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      
        // Handle response data
        const result = await response.json();
        console.log(result); // Process the success response
      
        // Optionally, reset the form or update the UI
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async submitRepeatingIncome() {
      const url = '/path/to/addRepeatingTransaction.php';

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.transaction.name,
            validFrom: this.transaction.validFrom,
            validUntil: this.transaction.validUntil,
            interval: 12, // Make sure this matches your backend's expected format
            amount: this.transaction.amount
          })
        });
      
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      
        // Handle response data
        const result = await response.json();
        console.log(result); // Process the success response
      
        // Optionally, reset the form or update the UI
      } catch (error) {
        console.error('Error:', error);
      }
    }
  },
  setup() {
    const lists = reactive([
      { name: 'Purchases/Earnings', items: [] },
      { name: 'Fixed Costs', items: [] },
      { name: 'Repeating Incomes', items: [] }
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

    onMounted(async () => {
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

        try {
          const purchasesResponse = await fetch('php/getPurchases.php');
          const purchases = await purchasesResponse.json();
          lists[0].items = purchases;

          const processedPurchases = purchases.map(item => {
            return {
              ...item, // Spread the existing properties
              type: item.Amount > 0 ? 'income' : 'expense', // Example logic to determine type
              // Add any other transformations or enrichments here
            };
          });

          lists.find(list => list.name === 'Purchases/Earnings').items = processedPurchases;



          console.log(purchases);
          console.log(lists[0].items)
  
          // Repeat for Fixed Costs and Repeating Incomes
          const fixCostsResponse = await fetch('php/getFixCosts.php');
          const fixCosts = await fixCostsResponse.json();
          lists[1].items = fixCosts;

          const processedFixCosts = fixCosts.map(item => {
            return {
              ...item, // Spread the existing properties
              type: item.Amount > 0 ? 'income' : 'expense', // Example logic to determine type
              // Add any other transformations or enrichments here
            };
          });

          lists.find(list => list.name === 'Fixed Costs').items = processedFixCosts;


          //console.log(fixCosts);
  
          const repeatingIncomesResponse = await fetch('php/getRepeatingIncomes.php');
          const repeatingIncomes = await repeatingIncomesResponse.json();

          const processedRepeatingIncomes = repeatingIncomes.map(item => {
            return {
              ...item, // Spread the existing properties
              type: item.Amount > 0 ? 'income' : 'expense', // Example logic to determine type
              // Add any other transformations or enrichments here
            };
          });

          lists.find(list => list.name === 'Repeating Incomes').items = processedRepeatingIncomes;
          
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      });

    return { chart, income, incomeType, submitIncome, lists, editItem, deleteItem };
  }
}).mount('#app');
