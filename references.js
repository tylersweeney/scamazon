/**
 * List prompt example
 */

'use strict';
var inquirer = require('..');

inquirer
  .prompt([
    {
      type: 'list',
      name: 'theme',
      message: 'What do you want to do?',
      choices: [
        'Order a pizza',
        'Make a reservation',
        new inquirer.Separator(),
        'Ask for opening hours',
        {
          name: 'Contact support',
          disabled: 'Unavailable at this time'
        },
        'Talk to the receptionist'
      ]
    },
    {
      type: 'list',
      name: 'size',
      message: 'What size do you need?',
      choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
      filter: function(val) {
        return val.toLowerCase();
      }
    }
  ])
  .then(answers => {
    console.log(JSON.stringify(answers, null, '  '));
  });

  /**
 * Checkbox list examples
 */

'use strict';
var inquirer = require('..');

inquirer
  .prompt([
    {
      type: 'checkbox',
      message: 'Select toppings',
      name: 'toppings',
      choices: [
        new inquirer.Separator(' = The Meats = '),
        {
          name: 'Pepperoni'
        },
        {
          name: 'Ham'
        },
        {
          name: 'Ground Meat'
        },
        {
          name: 'Bacon'
        },
        new inquirer.Separator(' = The Cheeses = '),
        {
          name: 'Mozzarella',
          checked: true
        },
        {
          name: 'Cheddar'
        },
        {
          name: 'Parmesan'
        },
        new inquirer.Separator(' = The usual ='),
        {
          name: 'Mushroom'
        },
        {
          name: 'Tomato'
        },
        new inquirer.Separator(' = The extras = '),
        {
          name: 'Pineapple'
        },
        {
          name: 'Olives',
          disabled: 'out of stock'
        },
        {
          name: 'Extra cheese'
        }
      ],
      validate: function(answer) {
        if (answer.length < 1) {
          return 'You must choose at least one topping.';
        }
        return true;
      }
    }
  ])
  .then(answers => {
    console.log(JSON.stringify(answers, null, '  '));
  });

  /**
 * Password prompt example
 */

'use strict';
const inquirer = require('..');

const requireLetterAndNumber = value => {
  if (/\w/.test(value) && /\d/.test(value)) {
    return true;
  }
  return 'Password need to have at least a letter and a number';
};

inquirer
  .prompt([
    {
      type: 'password',
      message: 'Enter a password',
      name: 'password1',
      validate: requireLetterAndNumber
    },
    {
      type: 'password',
      message: 'Enter a masked password',
      name: 'password2',
      mask: '*',
      validate: requireLetterAndNumber
    }
  ])
  .then(answers => console.log(JSON.stringify(answers, null, '  ')));