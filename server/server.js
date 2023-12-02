// Backend React budget API
const cors = require('cors');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const compression = require('compression');
const { expressjwt: exjwt } = require('express-jwt');
const { guestModel } = require('./models/guest_schema');
const { pbUserModel, pbBudgetModel } = require('./models/pb_schema');
const app = express();
const date = new Date();
const month = date.getMonth();
const port = 3010;
const saltRounds = 8;
const secretKey = 'The secret key';
const jwtMW = exjwt({
  secret: secretKey,
  algorithms: ['HS256'],
  onExpired: async (req, res) => {
    console.log('Token is expired!');
  }
});
const expiresIn = 1000 * 60 * 1; // 1 minute
// const expiresIn = 1000 * 2; // 2 seconds
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]


// Encrypt password (sync)
function encryptPasswordSync(pw) {return bcrypt.hashSync(pw, bcrypt.genSaltSync(saltRounds));}


// Serving static content
app.use('/', express.static('../client/build'));

// Enable CORS on app
app.use(cors());

// Use JSON on app
app.use(express.json());

// Enable compression on app
app.use(compression());


// Working with test data
/* ---
let MyPassword = encryptPasswordSync('MyPassword');
let YourPassword = encryptPasswordSync('YourPassword');
let HisPassword = encryptPasswordSync('HisPassword');
let APassword = encryptPasswordSync('B');
let OnePassword = encryptPasswordSync('2');
// MyPassword = 'MyPassword';
// YourPassword = 'YourPassword';
// HisPassword = 'HisPassword';
// APassword = 'B';
// OnePassword = '2';

let pb_test1UserData = pbUserModel({
  username: 'Him',
  password: HisPassword,
  monthly_income: 2000,
  monthly_expense: 1575
})
let pb_testUserData = [
  pbUserModel({
    username: 'Me',
    password: MyPassword,
    monthly_income: 250,
    monthly_expense: 150
  }),
  pbUserModel({
    username: 'You',
    password: YourPassword,
    monthly_income: 600,
    monthly_expense: 400
  }),
  pbUserModel({
    username: 'A',
    password: APassword,
    monthly_income: 300,
    monthly_expense: 500
  }),
  pbUserModel({
    username: '1',
    password: OnePassword,
    monthly_income: 1000,
    monthly_expense: 425
  })
];
let pb_test1BudgetData = pbBudgetModel(
  {
    username: 'Him',
    category: 'Salmon',
    amount: 170,
    color: '#E5989B'
  }
);
let pb_testBudgetData = [
  pbBudgetModel({
    username: 'Me',
    category: 'Tomatoes',
    amount: 500,
    color: '#FE6847'
  }),
  pbBudgetModel({
    username: 'Me',
    category: 'Apricots',
    amount: 330,
    color: '#FFCDB2'
  }),
  pbBudgetModel({
    username: 'You',
    category: 'Grapes',
    amount: 250,
    color: '#2C0E37'
  }),
  pbBudgetModel({
    username: 'You',
    category: 'Tangerines',
    amount: 125,
    color: '#F7A278'
  })
];

app.get('/insert', (req, res) => {
  // Inserting users
  try {
    console.log('Connecting to "users" collection in `personal-budget` database');

    pb_testUserData.forEach((d) => {
      pbUserModel.findOneAndUpdate(d, d, { upsert: true, $set: d })
      .then((data) => {
        console.log('Insert successful');
        console.log(data || d);
      })
      .catch((modelError) => {
        console.log('Unable to perform insert');
        console.log(modelError);
      })
    })
  } catch (err) {
    console.log("An error has occurred: ", err);
    res.sendStatus(500);
    res.end();
  }


  // Inserting users' budgets
  try {
    console.log('Connecting to "budgets" collection in `personal-budget` database')
      pb_testBudgetData.forEach((d) => {
        pbBudgetModel.findOneAndUpdate(d, d, { upsert: true })
        .then((data) => {
          console.log('Insert successful');
          console.log(data || d);
        })
        .catch((modelError) => {
          console.log('Unable to perform insert');
          console.log(modelError);
        })
      })
  } catch (err) {
    console.log("An error has occurred: ", err);
    res.sendStatus(500);
    res.end();
  }

  // Ending get request
  res.sendStatus(200);
  res.end();
});

app.get('/find-users', (req, res) => {
  // Inserting users
  try {
    console.log('Connecting to "users" collection in `personal-budget` database');

    pbUserModel.find({}, 'username monthly_income monthly_expense -_id') 
    .then((data) => {
      console.log('Insert successful');
      console.log(data);
    })
    .catch((modelError) => {
      console.log('Unable to perform insert');
      console.log(modelError);
    })
  } catch (err) {
    console.log("An error has occurred: ", err);
    res.sendStatus(500);
    res.end();
  }

  // Ending get request
  res.sendStatus(200);
  res.end();
});
/* --- */


// Verifying live server
/**/
app.get('/', (req, res) => {
  console.log('Server is running...');
  res.json('Server is good to go!');
  res.status(200);
  res.end();
});
/**/


// Signing up user
/**/
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  
  try {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      console.log('Connecting to `personal-budget` database...\nOpening "users" collection...');

      pbUserModel.insertMany(
        pbUserModel({
          username: username,
          password: hash
        }),
        { upsert: false, new: true }
      )
      .then((data) => {
        console.log('Signing up user...');
        let result = true;
        const token = jwt.sign({ username: username, password: hash }, secretKey, { expiresIn: expiresIn });
        (data) ? res.json({result, token, expiresIn}) : (result = false, res.json(result));
        res.end();
      })
      .catch((err) => {
        switch (err.code) {
          case 11000:
            console.log('This user already exists!');
            res.json('USER_ALREADY_EXISTS');
            res.end();
            break;
          default:
            console.log("An error has occurred: ", err);
            res.sendStatus(500);
            res.end();
            break;
        }
      });
    })
  } catch(err) {
    console.log("An error has occurred: ", err);
    res.sendStatus(500);
    res.end();
  }
});
/**/


// Logging in user
/**/
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Connecting to `personal-budget` database...\nOpening "users" collection...');

  pbUserModel.find({username: username}, 'username password -_id')
  .then((data) => {
    (data[0]) ?
      bcrypt.compare(password, data[0].password, (err, result) => {
        const token = jwt.sign({ username: username, password: data[0].password }, secretKey, { expiresIn: expiresIn });
        res.json({result, token, expiresIn});
        res.end();

        (result == true) ? console.log('Logging in user...') : console.log('Incorrect password\n');
      })
    : (res.json('BAD_USERNAME'), console.log('Incorrect username'));
  })
  .catch((err) => {
    console.log('An error has occurred: ', err);
    res.sendStatus(500);
    res.end();
  })
});
/**/


// Display guest budget data
/**/
app.post('/display-guest', (req, res) => {
  let all_data = [];
  const monthly_income = 750;
  const monthly_expense = 500;

  console.log(`Connecting to \`${req.body.database}\` database...\nOpening "budgets" collection...`);

  guestModel.find({}, 'category amount color -_id')
  .then((data) => {
    if (data.length > 0) {
      console.log('Find successful');
      // console.log(data);


      // let username_arr = [];
      let category_arr = [];
      let amount_arr = [];
      let color_arr = [];


      for (let i = 0; i < data.length; ++i) {
        // username_arr.push(data[i].username);
        category_arr.push(data[i].category);
        amount_arr.push(data[i].amount);
        color_arr.push(data[i].color);
      }


      let chartjs_donut_dataset = {
        datasets: [{
          data: [],
          backgroundColor: []
        }],
        labels: [],
        title: `Example budget expense per category`
      };
      
      
      chartjs_donut_dataset.datasets[0].data = amount_arr;
      chartjs_donut_dataset.datasets[0].backgroundColor = color_arr;
      chartjs_donut_dataset.labels = category_arr;


      let chartjs_bar_dataset = {
        datasets: [{
          barThickness: 125,
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 2
        }],
        labels: [],
        title: `Example Monthly Account`
      };


      chartjs_bar_dataset.datasets[0].data = [monthly_income, monthly_expense];
      chartjs_bar_dataset.datasets[0].backgroundColor = ['rgba(75, 225, 75, 0.2)', 'rgba(255, 99, 132, 0.2)'];
      chartjs_bar_dataset.datasets[0].borderColor = ['rgb(75, 225, 75)', 'rgb(255, 99, 132)']
      chartjs_bar_dataset.labels = [`Income`, `Expenses`];


      let chartjs_line_dataset = {
        datasets: [],
        labels: [],
        title: `Example budget expenses projection in 1 year`
      };

      let lineMonths = [];
      for (let i = 0; i < 12; i++) {
        lineMonths.push(months[(i + month) % 12]);
      }

      for (let i = 0; i < category_arr.length; i++) {
        let lineAmount = [];
        for (let j = 0; j < lineMonths.length; j++) {
          lineAmount.push(amount_arr[i] - (j * (monthly_expense / category_arr.length)) + (j * (monthly_income / category_arr.length)));
        }
        
        chartjs_line_dataset.datasets.push({
          label: `${category_arr[i]}`,
          data: lineAmount,
          backgroundColor: `${color_arr[i]}`,
          borderColor: `${color_arr[i]}`
        })
      }

      chartjs_line_dataset.labels = lineMonths;


      all_data.push(chartjs_donut_dataset);
      all_data.push(chartjs_bar_dataset);
      all_data.push(chartjs_line_dataset);


      res.json(all_data);
      res.end();
    } else {
      console.log('Find unsuccessful\nEmpty...');
      res.end();
    }
  })
  .catch((err) => {
    console.log('Unable to perform find');
    console.log(err);
    res.sendStatus(500);
    res.end();
  })
});
/**/


// Display user budget data
/**/
app.get('/display-user', jwtMW, (req, res) => {
  let all_data = [];

  console.log(`Connecting to \`${req.headers.database}\` database...\nOpening "budgets" collection...`);

  const filter = (req.headers.username != '') ? {username: req.headers.username} : {};

  pbBudgetModel.find(filter, 'username category amount color -_id')
  .then((data) => {
    if (data.length > 0) {
      console.log('Find successful');
      // console.log(data);


      pbUserModel.find(filter, 'username monthly_expense monthly_income -_id')
      .then((data2) => {
        if (data2.length > 0) {
          console.log('Find successful');
          // console.log(data2);
          

          const username = data[0].username
          let category_arr = [];
          let amount_arr = [];
          let color_arr = [];
          let monthly_income = data2[0].monthly_income;
          let monthly_expense = data2[0].monthly_expense;

          /* ... */
          for (let i = 0; i < data.length; ++i) {
            // username_arr.push(data[i].username);
            category_arr.push(data[i].category);
            amount_arr.push(data[i].amount);
            color_arr.push(data[i].color);
          }
    
    
          let chartjs_donut_dataset = {
            datasets: [{
              data: [],
              backgroundColor: []
            }],
            labels: [],
            title: `${username}'s budget expense per category`
          };
          
          
          chartjs_donut_dataset.datasets[0].data = amount_arr;
          chartjs_donut_dataset.datasets[0].backgroundColor = color_arr;
          chartjs_donut_dataset.labels = category_arr;
    
    
          let chartjs_bar_dataset = {
            datasets: [{
              barThickness: 125,
              data: [],
              backgroundColor: [],
              borderColor: [],
              borderWidth: 2
            }],
            labels: [],
            title: `${username}'s Monthly Account`
          };
    
    
          chartjs_bar_dataset.datasets[0].data = [monthly_income, monthly_expense];
          chartjs_bar_dataset.datasets[0].backgroundColor = ['rgba(75, 225, 75, 0.2)', 'rgba(255, 99, 132, 0.2)'];
          chartjs_bar_dataset.datasets[0].borderColor = ['rgb(75, 225, 75)', 'rgb(255, 99, 132)']
          chartjs_bar_dataset.labels = [`Income`, `Expenses`];
    
    
          let chartjs_line_dataset = {
            datasets: [],
            labels: [],
            title: `${username}'s budget expenses projection in 1 year`
          };
    
          let lineMonths = [];
          for (let i = 0; i < 12; i++) {
            lineMonths.push(months[(i + month) % 12]);
          }
    
          for (let i = 0; i < category_arr.length; i++) {
            let lineAmount = [];
            for (let j = 0; j < lineMonths.length; j++) {
              lineAmount.push(amount_arr[i] - (j * ((monthly_expense || 0) / category_arr.length)) + (j * ((monthly_income || 0) / category_arr.length)));
            }
            
            chartjs_line_dataset.datasets.push({
              label: `${category_arr[i]}`,
              data: lineAmount,
              backgroundColor: `${color_arr[i]}`,
              borderColor: `${color_arr[i]}`
            })
          }
    
          chartjs_line_dataset.labels = lineMonths;
    
    
          all_data.push(chartjs_donut_dataset);
          all_data.push(chartjs_bar_dataset);
          all_data.push(chartjs_line_dataset);
          all_data.push(username);
          all_data.push(monthly_income);
          all_data.push(monthly_expense);
    
    
          res.json(all_data);
          res.end();
          /* ... */
        } else {
          console.log('Find monthly income/expense unsuccessful\nEmpty...');
          res.end();
        }
      })
      .catch((err) => {
        console.log('Unable to perform find monthly income/expense');
        console.log(err);
        res.sendStatus(500);
        res.end();
      });
    } else {
      console.log('Find budget data unsuccessful\nEmpty...');
      res.end();
    }
  })
  .catch((err) => {
    console.log('Unable to perform find budget data');
    console.log(err);
    res.sendStatus(500);
    res.end();
  })
});
/**/


// Add to account budget data
/**/
app.post('/add-budget', jwtMW, (req, res) => {  
  const newBudgetData = {
    amount: req.body.amount,
    category: req.body.category,
    color: req.body.color,
    username: req.body.username
  };

  // console.log("~~~\n", newBudgetData);

  let filter = (req.body.username != '') ? {username: req.body.username, category: req.body.category} : {};
  
  console.log(`Connecting to \`${req.body.database}\` database...\nOpening "budgets" collection...`);
  
  pbBudgetModel.updateMany(filter, newBudgetData, { upsert: true, new: true })
  .then((data) => {
    console.log('Add successful');
    // console.log(data);
    (data) ? res.json(true) : res.json(false);
    // res.end();
  })
  .catch((err) => {
    switch(err.code) {
      case 11000:
        console.log('This data already exists\n', err);
        res.json('BUDGET_DATA_ALREADY_EXISTS');
        res.end();
        break;
      default:
        console.log('An error has occurred: ', err);
        res.sendStatus(500);
        res.end();
        break;
    }
  })
});
/**/


// Add to account expense data
/**/
app.post('/add-account', jwtMW, (req, res) => {  
  const newUserAccountData = {
    username: req.body.username,
    monthly_income: req.body.monthly_income,
    monthly_expense: req.body.monthly_expense
  };

  const filter = (req.body.username != '') ? {username: req.body.username} : {};
  
  console.log(`Connecting to \`${req.body.database}\` database...\nOpening "users" collection...`);
  
  pbUserModel.updateMany(filter, newUserAccountData, { upsert: true, new: true, $set: req.body })
  .then((data) => {
    console.log('Add successful');
    console.log(data);
    (data) ? res.json(true) : res.json(false);
    // res.end();
  })
  .catch((err) => {
    switch(err.code) {
      case 11000:
        console.log('This data already exists');
        res.json('ACCOUNT_DATA_ALREADY_EXISTS');
        res.end();
        break;
      default:
        console.log('An error has occurred: ', err);
        res.sendStatus(500);
        res.end();
        break;
    }
  })
});
/**/


// Add in token refresh function call
/**/
app.post('/refresh-token', jwtMW, (req, res) => {
  const { username } = req.body;
  
  pbUserModel.find({username: username}, 'username password -_id')
  .then((data) => {
    const token = jwt.sign({ username: username, password: data[0].password }, secretKey, { expiresIn: expiresIn });
    res.json({token, expiresIn});
    res.end();

    console.log('Refreshing token...');
  })
  .catch((err) => {
    console.log('An error has occurred: ', err);
    res.sendStatus(500);
    res.end();
  });
});
/**/


/// UNUSED
// List user's budget categories
/**/
app.post('/list-data', jwtMW, (req, res) => {
  const { username, database } = req.body;
  console.log(`Grabbing all of ${username}'s budget categories...`);

  pbBudgetModel.find({username: username}, 'username category -_id')
  .then((data) => {
    console.log('Budget data find successful');
    res.json(data);
    res.end();
  })
  .catch((err) => {
    console.log('An error has occurred: ', err);
    res.sendStatus(500);
    res.end();
  });
})
/**/


// List user's account data
/**/
app.post('/show-account', jwtMW, (req, res) => {
  const { username, database } = req.body;
  console.log(`Opening ${database} database...`);
  console.log(`Grabbing all of ${username}'s budget categories...`);

  const filter = (req.body.username != '') ? {username: req.body.username} : {}

  pbUserModel.find(filter, 'username monthly_expense monthly_income -_id')
  .then((data) => {
    if (data.length > 0 && (data[0].monthly_income || data[0].monthly_expense)) {
      console.log('Find successful');
      // console.log(data);

      const username = data[0].username
      let monthly_income = data[0].monthly_income;
      let monthly_expense = data[0].monthly_expense;
      
      
      let chartjs_bar_dataset = {
        datasets: [{
          barThickness: 125,
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 2
        }],
        labels: [],
        title: `${username}'s Monthly Account`
      };


      chartjs_bar_dataset.datasets[0].data = [monthly_income, monthly_expense];
      chartjs_bar_dataset.datasets[0].backgroundColor = ['rgba(75, 225, 75, 0.2)', 'rgba(255, 99, 132, 0.2)'];
      chartjs_bar_dataset.datasets[0].borderColor = ['rgb(75, 225, 75)', 'rgb(255, 99, 132)']
      chartjs_bar_dataset.labels = [`Income`, `Expenses`];


      res.json(chartjs_bar_dataset);
      res.end();
    } else {
      console.log('Find monthly income/expense unsuccessful\nEmpty...');
      res.end();
    }
  })
  .catch((err) => {
    console.log('Unable to perform find monthly income/expense');
    console.log(err);
    res.sendStatus(500);
    res.end();
  });
})
/**/


// Delete budget data from account
/**/
app.post('/delete-budget', jwtMW, (req, res) => {
  const { username, database, category } = req.body;
  const filter = {username: username, category: category};

  console.log(`Connecting to \`${database}\` database...\nOpening "budgets" collection...`);

  pbBudgetModel.deleteOne(filter)
  .then((data) => {
    console.log(data)
    data.deletedCount == 1 ? console.log('Delete successful') : console.log('Delete failed');
    data.deletedCount == 1 ? res.json(true) : res.json(false);
    res.end();
  })
  .catch((err) => {
    console.log('An error has occurred: ', err);
    res.sendStatus(500);
    res.end();
  });
});
/**/


// Delete account
/**/
app.post('/delete-account', jwtMW, (req, res) => {
  const { username, database } = req.body;
  const filter = {username: username};

  console.log(`Connecting to \`${database}\` database...\nOpening "budgets" collection...`);

  // Deleting account's budget data
  pbBudgetModel.deleteMany(filter)
  .then((data) => {
    console.log(data);
    data.deletedCount != 0 ? console.log('Data deletion successful') : console.log('Data deletion failed');
    data.deletedCount != 0 ? res.json(true) : res.json(false);
    res.end();
  })
  .catch((err) => {
    console.log('An error has occurred: ', err);
    // res.sendStatus(500);
    res.end();
  });

  // Deleting account
  pbUserModel.deleteOne(filter)
  .then((data) => {
    console.log(data);
    data.deletedCount == 1 ? console.log('Account deletion successful') : console.log('Account deletion failed');
    data.deletedCount == 1 ? res.json(true) : res.json(false);
    res.end();
  })
  .catch((err) => {
    console.log('An error has occurred: ', err);
    // res.sendStatus(500);
    res.end();
  });
});
/**/


app.listen(port, () => {
  console.log(`Server API is listening on http://localhost:${port}`);
});