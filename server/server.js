// Backend React budget API
const cors = require('cors');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const compression = require('compression');
const { expressjwt: exjwt } = require('express-jwt');
const { pbUserModel, pbBudgetModel } = require('./models/pb_schema');
const { guestModel } = require('./models/guest_schema');
const app = express();
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
// MyPassword = 'MyPassword';
// YourPassword = 'YourPassword';
// HisPassword = 'HisPassword';

let pb_test1UserData = pbUserModel({
  username: 'Him',
  password: HisPassword
})
let pb_testUserData = [
  pbUserModel({
    username: 'Me',
    password: MyPassword
  }),
  pbUserModel({
    username: 'You',
    password: YourPassword
  }),
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
      pbUserModel.findOneAndUpdate(d, d, { upsert: true })
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

  console.log(`Connecting to \`${req.body.database}\` database...\nOpening "budgets" collection...`);

  // let model = (req.body.database == 'personal-budget' && req.body.username != '') ? pbBudgetModel : guestModel;
  // let filter = (req.body.username != '') ? {username: req.body.username} : {};

  guestModel.find({}, 'category amount color -_id')
  .then((data) => {
    if (data.length > 0) {
      console.log('Find successful');
      console.log(data);


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
        labels: []
      };
      
      
      chartjs_donut_dataset.datasets[0].data = amount_arr;
      chartjs_donut_dataset.datasets[0].backgroundColor = color_arr;
      chartjs_donut_dataset.labels = category_arr;


      let chartjs_bar_dataset = {
        datasets: [{
          barThickness: 30,
          label: `Example budget expenses per category`,
          data: [],
          backgroundColor: []
        }],
        labels: []
      };


      chartjs_bar_dataset.datasets[0].data = amount_arr;
      chartjs_bar_dataset.datasets[0].backgroundColor = color_arr;
      chartjs_bar_dataset.labels = category_arr;


      let chartjs_line_dataset = {
        datasets: [{
          label: `Category's predicted monthly expenses`,
          data: [],
          backgroundColor: []
        }],
        labels: [],
      };


      // chartjs_line_dataset.datasets[0].data = amount_arr;
      // chartjs_line_dataset.datasets[0].backgroundColor = color_arr;
      // chartjs_line_dataset.labels = category_arr;


      all_data.push(chartjs_donut_dataset);
      all_data.push(chartjs_bar_dataset);
      all_data.push(chartjs_line_dataset);
      // all_data.push(category_arr);
      // all_data.push(color_arr);
      // all_data.push(amount_arr);
      // all_data.push(username_arr);


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

  // console.log(req.headers);
  // console.log(req);

  console.log(`Connecting to \`${req.headers.database}\` database...\nOpening "budgets" collection...`);

  // let model = (req.headers.database == 'personal-budget' && req.headers.username != '') ? pbBudgetModel : guestModel;
  let filter = (req.headers.username != '') ? {username: req.headers.username} : {};

  pbBudgetModel.find(filter, 'username category amount color -_id')
  .then((data) => {
    if (data.length > 0) {
      console.log('Find successful');
      console.log(data);


      let username_arr = [];
      let category_arr = [];
      let amount_arr = [];
      let color_arr = [];


      for (let i = 0; i < data.length; ++i) {
        username_arr.push(data[i].username);
        category_arr.push(data[i].category);
        amount_arr.push(data[i].amount);
        color_arr.push(data[i].color);
      }


      let chartjs_donut_dataset = {
        datasets: [{
          data: [],
          backgroundColor: []
        }],
        labels: []
      };
      
      
      chartjs_donut_dataset.datasets[0].data = amount_arr;
      chartjs_donut_dataset.datasets[0].backgroundColor = color_arr;
      chartjs_donut_dataset.labels = category_arr;


      let chartjs_bar_dataset = {
        datasets: [{
          barThickness: 30,
          label: `${username_arr[0]}'s budget expenses per category`,
          data: [],
          legend: {
            display: false
          },
          backgroundColor: []
        }],
        labels: []
      };


      chartjs_bar_dataset.datasets[0].data = amount_arr;
      chartjs_bar_dataset.datasets[0].backgroundColor = color_arr;
      chartjs_bar_dataset.labels = category_arr;


      let chartjs_line_dataset = {
        datasets: [{
          label: `Category's predicted monthly expenses`,
          data: [],
          backgroundColor: []
        }],
        labels: []
      };


      // chartjs_line_dataset.datasets[0].data = amount_arr;
      // chartjs_line_dataset.datasets[0].backgroundColor = color_arr;
      // chartjs_line_dataset.labels = category_arr;


      all_data.push(chartjs_donut_dataset);
      all_data.push(chartjs_bar_dataset);
      all_data.push(chartjs_line_dataset);
      // all_data.push(category_arr);
      // all_data.push(color_arr);
      // all_data.push(amount_arr);
      all_data.push(username_arr);


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


// Add to budget data
/**/
app.post('/add', (req, res) => {
  console.log(req.body);

  const newBudgetData = {
    amount: req.body.amount,
    category: req.body.category,
    color: req.body.color,
    username: req.body.username
  };

  let filter = (req.body.username != '') ? {username: req.body.username, category: req.body.category} : {};
  
  console.log(`Connecting to \`${req.body.database}\` database...\nOpening "budgets" collection...`);
  
  pbBudgetModel.updateMany(filter, newBudgetData, { upsert: true, new: true })
  .then((data) => {
    console.log('Add successful');
    (data) ? res.json(true) : res.json(false);
    // res.end();
  })
  .catch((err) => {
    switch(err.code) {
      case 11000:
        console.log('This data already exists');
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


app.listen(port, () => {
  console.log(`Server API is listening on http://localhost:${port}`);
});