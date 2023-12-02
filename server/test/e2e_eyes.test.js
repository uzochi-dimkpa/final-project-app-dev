// Backend React budget API
const cors = require('cors');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const compression = require('compression');
const { expressjwt: exjwt } = require('express-jwt');
const { guestModel } = require('../models/guest_schema');
const { pbUserModel, pbBudgetModel } = require('../models/pb_schema');
const app = express();
const date = new Date();
const month = date.getMonth();
const server_port = 3010;
const saltRounds = 8;
const secretKey = 'The secret key';
const jwtMW = exjwt({
  secret: secretKey,
  algorithms: ['HS256'],
  onExpired: async (req, res) => {}
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

      pbUserModel.insertMany(
        pbUserModel({
          username: username,
          password: hash
        }),
        { upsert: false, new: true }
      )
      .then((data) => {
        let result = true;
        const token = jwt.sign({ username: username, password: hash }, secretKey, { expiresIn: expiresIn });
        (data) ? res.json({result, token, expiresIn}) : (result = false, res.json(result));
        res.end();
      })
      .catch((err) => {
        switch (err.code) {
          case 11000:
            res.json('USER_ALREADY_EXISTS');
            res.end();
            break;
          default:
            res.sendStatus(500);
            res.end();
            break;
        }
      });
    })
  } catch(err) {
    res.sendStatus(500);
    res.end();
  }
});
/**/


// Logging in user
/**/
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  pbUserModel.find({username: username}, 'username password -_id')
  .then((data) => {
    (data[0]) ?
      bcrypt.compare(password, data[0].password, (err, result) => {
        const token = jwt.sign({ username: username, password: data[0].password }, secretKey, { expiresIn: expiresIn });
        res.json({result, token, expiresIn});
        res.end();
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

  guestModel.find({}, 'category amount color -_id')
  .then((data) => {
    if (data.length > 0) {
      // console.log('Find successful');
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
      res.end();
    }
  })
  .catch((err) => {
    // console.log(err);
    res.sendStatus(500);
    res.end();
  })
});
/**/


// Display user budget data
/**/
app.get('/display-user', jwtMW, (req, res) => {
  let all_data = [];

  const filter = (req.headers.username != '') ? {username: req.headers.username} : {};

  pbBudgetModel.find(filter, 'username category amount color -_id')
  .then((data) => {
    if (data.length > 0) {
      // console.log(data);


      pbUserModel.find(filter, 'username monthly_expense monthly_income -_id')
      .then((data2) => {
        if (data2.length > 0) {
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
          res.end();
        }
      })
      .catch((err) => {
        res.sendStatus(500);
        res.end();
      });
    } else {
      res.end();
    }
  })
  .catch((err) => {
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
  
  pbBudgetModel.updateMany(filter, newBudgetData, { upsert: true, new: true })
  .then((data) => {
    // console.log(data);
    (data) ? res.json(true) : res.json(false);
    // res.end();
  })
  .catch((err) => {
    switch(err.code) {
      case 11000:
        res.json('BUDGET_DATA_ALREADY_EXISTS');
        res.end();
        break;
      default:
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
        res.json('ACCOUNT_DATA_ALREADY_EXISTS');
        res.end();
        break;
      default:
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
  })
  .catch((err) => {
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

  pbBudgetModel.find({username: username}, 'username category -_id')
  .then((data) => {
    res.json(data);
    res.end();
  })
  .catch((err) => {
    res.sendStatus(500);
    res.end();
  });
})
/**/


// List user's account data
/**/
app.post('/show-account', jwtMW, (req, res) => {
  const { username, database } = req.body;

  const filter = (req.body.username != '') ? {username: req.body.username} : {}

  pbUserModel.find(filter, 'username monthly_expense monthly_income -_id')
  .then((data) => {
    if (data.length > 0 && (data[0].monthly_income || data[0].monthly_expense)) {
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
      res.end();
    }
  })
  .catch((err) => {
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

  pbBudgetModel.deleteOne(filter)
  .then((data) => {
    data.deletedCount == 1 ? res.json(true) : res.json(false);
    res.end();
  })
  .catch((err) => {
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

  // Deleting account's budget data
  pbBudgetModel.deleteMany(filter)
  .then((data) => {
    data.deletedCount != 0 ? res.json(true) : res.json(false);
    res.end();
  })
  .catch((err) => {
    // res.sendStatus(500);
    res.end();
  });

  // Deleting account
  pbUserModel.deleteOne(filter)
  .then((data) => {
    data.deletedCount == 1 ? res.json(true) : res.json(false);
    res.end();
  })
  .catch((err) => {
    // res.sendStatus(500);
    res.end();
  });
});
/**/


app.listen(server_port, () => {
  // console.log(`Test server API is listening on http://localhost:${server_port}`);
});




/*
 =================================
 ============ imports ============
 =================================
*/

const {
  VisualGridRunner,
  ClassicRunner,
  RunnerOptions,
  Eyes,
  Target,
  Configuration,
  RectangleSize,
  BatchInfo,
  BrowserType,
  DeviceName,
  ScreenOrientation
} = require('@applitools/eyes-puppeteer');


require('dotenv').config({ api_key: `.env.${process.env.APPLITOOLS_API_KEY}`, headless: `.env.${process.env.HEADLESS}`, frontend_url: `.end.${process.env.FRONTEND_URL}` });
const puppeteer = require('puppeteer');


/*
 =================================
 =========== e2e tests ===========
 =================================
*/

function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}


describe('LoginPage e2e test', () => {
  // beforeEach(async () => {
  //   const browser = await puppeteer.launch({
  //     headless: false,
  //     slowMo: 80,
  //     args: ['--window-size=1920,1080']
  //   });
  // })

  it('should click around', async () => {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 80,
      args: ['--window-size=1920,1080']
    });

    const page = await browser.newPage();
    
    await page.goto(`${process.env.FRONTEND_URL}`);

    await page.click('li#view_budget_breadcrumbs');

    await page.click('li#about_page_breadcrumbs');

    await page.click('li#signup_breadcrumbs');

    await page.click('li#learn_more_breadcrumbs');

    delay(2000);

    await page.close();
    await browser.close();
  });
  

  it('should login and examine data', async () => {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 80,
      args: ['--window-size=1920,1080']
    }); 

    const page = await browser.newPage();

    await page.goto(`${process.env.FRONTEND_URL}`);

    await page.click('li#login_menu');

    await page.click('input#input_login_un');
    await page.type('input#input_login_un', '1');

    await page.click('input#input_login_pw');
    await page.type('input#input_login_pw', '2');

    await page.click('button#login_button_submit');

    await page.waitForSelector('#view_budget_breadcrumbs');

    await page.click('li#view_budget_breadcrumbs');

    await page.click('li#enter_data_breadcrumbs');

    delay(2000);

    await page.close();
    await browser.close();
  });


  // TODO
  // it.todo('should attempt to signup and delete account');


  it('should attempt to signup and delete account', async () => {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 80,
      args: ['--window-size=1920,1080']
    }); 

    const page = await browser.newPage();

    await page.goto(`${process.env.FRONTEND_URL}`);

    await page.click('li#signup_menu');

    await page.click('input#input_signup_un');
    await page.type('input#input_signup_un', 'test');

    await page.click('input#input_signup_pw');
    await page.type('input#input_signup_pw', 'testPassword');

    await page.click('button#signup_button_submit');

    await page.waitForSelector('#settings_page_breadcrumbs');

    await page.click('li#settings_page_breadcrumbs');

    await page.waitForSelector('#delete_account_button');

    await page.click('button#delete_account_button');

    await page.click('button#popup_delete_account_yes');

    delay(2000);
    
    await page.close();
    await browser.close();
  });
});




/*
 ==================================
 ============= visual =============
 =========== regression ===========
 ============= tests ==============
 ==================================
*/

describe('Personal Budget App visual regression test', () => {
  // Settings to control how tests are run.
  // These could be set by environment variables or other input mechanisms.
  // They are hard-coded here to keep the example project simple.
  const USE_ULTRAFAST_GRID = true;

  // Test control inputs to read once and share for all tests
  var applitoolsApiKey;
  var headless;

  // Applitools objects to share for all tests
  let batch;
  let config;
  let runner;

  // Test-specific objects
  let browser;
  let page;
  let eyes;

  beforeAll(async function () {
    // This method sets up the configuration for running visual tests.
    // The configuration is shared by all tests in a test suite, so it belongs in a `before` method.
    // If you have more than one test class, then you should abstract this configuration to avoid duplication. 

    // Read the Applitools API key from an environment variable.
    // To find your Applitools API key:
    // https://applitools.com/tutorials/getting-started/setting-up-your-environment.html
    applitoolsApiKey = process.env.APPLITOOLS_API_KEY;

    // Read headless mode from an environment variable.
    // Run tests headlessly in CI.
    headless = (process.env.HEADLESS !== undefined ) && (process.env.HEADLESS.toLowerCase() === 'true');

    if (USE_ULTRAFAST_GRID) {
      // Create the runner for the Ultrafast Grid.
      // Concurrency refers to the number of visual checkpoints Applitools will perform in parallel.
      // Warning: If you have a free account, then concurrency will be limited to 1.
      runner = new VisualGridRunner(new RunnerOptions().testConcurrency(5));
    } else {
      // Create the classic runner.
      runner = new ClassicRunner();
    }

    // Create a new batch for tests.
    // A batch is the collection of visual checkpoints for a test suite.
    // Batches are displayed in the Eyes Test Manager, so use meaningful names.
    const runnerName = (USE_ULTRAFAST_GRID) ? 'Ultrafast Grid' : 'Classic runner';
    batch = new BatchInfo(`Example: Puppeteer JavaScript with the ${runnerName}`);

    // Create a configuration for Applitools Eyes.
    config = new Configuration();
    
    // Set the Applitools API key so test results are uploaded to your account.
    // If you don't explicitly set the API key with this call,
    // then the SDK will automatically read the `APPLITOOLS_API_KEY` environment variable to fetch it.
    config.setApiKey(applitoolsApiKey);

    // Set the batch for the config.
    config.setBatch(batch);

    // If running tests on the Ultrafast Grid, configure browsers.
    if (USE_ULTRAFAST_GRID) {

    // Add 3 desktop browsers with different viewports for cross-browser testing in the Ultrafast Grid.
    // Other browsers are also available, like Edge and IE.
    config.addBrowser(800, 600, BrowserType.CHROME);
    config.addBrowser(1600, 1200, BrowserType.FIREFOX);
    config.addBrowser(1024, 768, BrowserType.SAFARI);

    // Add 2 mobile emulation devices with different orientations for cross-browser testing in the Ultrafast Grid.
    // Other mobile devices are available, including iOS.
    config.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);
    config.addDeviceEmulation(DeviceName.Nexus_10, ScreenOrientation.LANDSCAPE);
    }
  });


  beforeEach(async function () {
    // This method sets up each test with its own browser and Applitools Eyes objects.

    // Initialize the Puppeteer browser.
    browser = await puppeteer.launch({
      headless: headless,
      slowMo: 80,
      args: ['--window-size=1920,1080']
    });
    page = await browser.newPage();
    
    // Create the Applitools Eyes object connected to the runner and set its configuration.
    eyes = new Eyes(runner);
    eyes.setConfiguration(config);

    // Open Eyes to start visual testing.
    // It is a recommended practice to set all four inputs:
    await eyes.open(
        
      // The page to "watch."
      page,
      
      // The name of the application under test.
      // All tests for the same app should share the same app name.
      // Set this name wisely: Applitools features rely on a shared app name across tests.
      'Personal Budget',
      
      // The name of the test case for the given application.
      // Additional unique characteristics of the test may also be specified as part of the test name,
      // such as localization information ("Home Page - EN") or different user permissions ("Login by admin").
      // this.currentTest.fullTitle(),
      
      // The viewport size for the local browser.
      // Eyes will resize the web browser to match the requested viewport size.
      // This parameter is optional but encouraged in order to produce consistent results.
      new RectangleSize(1200, 600)
    );
  });


  it('should log into a personal budget account', async function () {

    // This test covers login for the Applitools demo site, which is a dummy banking app.
    // The interactions use typical Puppeteer calls,
    // but the verifications use one-line snapshot calls with Applitools Eyes.
    // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
    // Traditional assertions that scrape the page for text values are not needed here.

    // Load the login page.
    // await page.goto('https://demo.applitools.com');
    await page.goto(`${process.env.FRONTEND_URL}`);

    await page.waitForSelector('#login_menu')

    await page.click('li#login_menu');

    // Verify the full login page loaded correctly.
    // await eyes.check('Login Window', Target.window().fully());
    await eyes.check('Login Window', Target.window().fully());

    // Perform login.
    await page.type('input#input_login_un', 'Me');
    await page.type('input#input_login_pw', 'MyPassword');
    await page.click('button#login_button_submit');

    // Verify the full main page loaded correctly.
    // This snapshot uses LAYOUT match level to avoid differences in closing time text.
    await eyes.check('App Window', Target.window().fully().layout());

    // End test, close page & browser
    await page.waitForSelector('#logout_menu');
    await page.click('li#logout_menu');
    await page.close();
    await browser.close();
  });
});