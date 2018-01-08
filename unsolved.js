'use strict';
var inquirer = require('inquirer');

var questions = [

    {
    type: 'input',
    name: 'name',
    message: 'Who are you!?'
    },
    
    {
    type: 'list',
    name: 'doingWhat',
    message: 'What are you doing in my house??',
    choices: [

        "I made you cookies!",
        "No lie dude. Here to rob you",
        "Uh...this is my house"
    ]
    },
    {
    type: 'checkbox',
    name: "carryingWhat",
    message: "What are you holding?",
    choices: [
        "Your TV",
        "A Slice of Toast",
        "A butter knife"
    ]
    },
    {
    type: 'confirm',
    name: 'canLeave',
    message: 'Can you leave now?'
    },
    {
    type: 'password',
    name: 'myPassword',
    message: "Well then, what is the password?",
    mask: 'x',
    },

];

inquirer.prompt(questions).then(function (answers) {

    console.log(JSON.stringify(answers, null, '     '));

    console.log(answers.myPassword);

    if (answers.myPassword == "gayFrogs"){
        console.log("Fine, I suppose you can say...for now")
    }

    else{
        console.log("Appreciated but can you please put those things down and leave? or die.")
    }
});