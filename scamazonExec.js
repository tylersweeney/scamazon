var prompt = require('prompt');

var mysql = require('mysql');

var padText = require('./padTable.js')

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root", 
    database: "scamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);

  prompt.start();

  console.log('\nBamazon Peak Leadership Menu');
  console.log('------------------------------')
  console.log('Select a (numeric) option.')
  console.log('1. View Product Sales by Department');
  console.log('2. Create New Department');

  prompt.get(['menuSelection'], function (err, result) {
    
    var menuSelection = parseInt(result.menuSelection);

    switch(menuSelection) {
      case 1:
        console.log('\nView Product Sales by Department...');
        viewSalesByDept();
        break;

      case 2:
        console.log('\nCreate New Department...');
        addNewDept();
        break;

      default:
        console.log('Not a vaild entry. Aborting.');
        connection.end(); // end the script/connection
    }
  });

}); // end database connection
    


// =================== Functions to be used inside the switch case ===================


// View Product Sales by Department
function viewSalesByDept(){

  // Query for all of the Department Table
  connection.query('SELECT * FROM Departments', function(err, res){
  
    // Error Handler
    if(err) throw err;

    // Show User message
    // Set up table header
    console.log('\n' + '  ID  |  Department Name  |  OverHead Costs |  Product Sales  |  Total Profit');
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
    
    // Loop through database and show all items
    for(var i = 0; i < res.length; i++){

      // ---------- Add in padding for table ----------
      var departmentID = res[i].DepartmentID + ''; // convert to string
      departmentID = padText("  ID  ", departmentID);

      var departmentName = res[i].DepartmentName + ''; // convert to string
      departmentName = padText("  Department Name  ", departmentName);

      // On the fly calculation for profit
      var overHeadCost = res[i].OverHeadCosts.toFixed(2);
      var totalSales = res[i].TotalSales.toFixed(2);
      var totalProfit = (parseFloat(totalSales) - parseFloat(overHeadCost)).toFixed(2);


      // Add $ signs to values
      overHeadCost = '$' + overHeadCost;
      totalSales = '$' + totalSales;
      totalProfit = '$' + totalProfit;

      // Padding for table
      overHeadCost = padText("  OverHead Costs ", overHeadCost);
      totalSales = padText("  Product Sales  ", totalSales);
      
      // ----------------------------------------------

      // Log table entry
      console.log(departmentID + '|' + departmentName + '|' + overHeadCost + '|' + totalSales + '|  ' + totalProfit);
    }

    connection.end(); // end the script/connection

  });

}



// ---------------------------------------------------------------------------------


// Add New Department
function addNewDept(){

  // Prompt user for new item details
  prompt.start();
  console.log('\nComplete the new department details:');
  prompt.get(['DepartmentName', 'OverHeadCosts', 'TotalSales'], function (err, result) {

    // Collect/parse variables
    var departmentName = result.DepartmentName;
    var overHeadCost = result.OverHeadCosts;
    var totalSales = result.TotalSales;

    // Update Database
    connection.query('INSERT INTO Departments SET ?', {
      DepartmentName: departmentName,
      OverHeadCosts: overHeadCost,
      TotalSales: totalSales
    }, function(err, res){

      // Slighly more refined Error Handler
      if(err){
        console.log('\nSorry. The SQL database could not be updated.\n' +
          'Please ensure you entered the overhead and sales as numbers!');
        connection.end(); // end the script/connection
      }
      else{
        console.log('\nNew Department updated successfully! Very customer centric!'); // last inside joke, i swear :)
        connection.end(); // end the script/connection
      }

    }); // end connection

  }); // end prompt
 
}