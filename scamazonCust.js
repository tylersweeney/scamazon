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
});




connection.query('SELECT * FROM Products', function(err, res){
  
  if(err) throw err;


  console.log('Check out our selection...\n');

  console.log('  ID  |      Product Name      |  Department Name  |   Price  | In Stock');
  console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ')
  
  for(var i = 0; i < res.length; i++){

    
    var itemID = res[i].item_id + ''; 
    itemID = padText("  ID  ", itemID);

    var productName = res[i].product_id + '';
    productName = padText("      Product Name      ", productName);

    var departmentName = res[i].department_name + ''; 
    departmentName = padText("  Department Name  ", departmentName);

    var price = '$' + res[i].price + ''; 
    price = padText("   Price  ", price);

    var quantity = res[i].stock_quantity + ''; 

    console.log(itemID + '|' + productName + '|' + departmentName + '|' + price + '|    ' + quantity);
  };
  // connection.end();

  // =================================================================================================

  // After the table is shown, ask the user to buy something
  prompt.start();

  // Ask for Item ID
  console.log('\nWhich item do you want to buy?');
  prompt.get(['buyItemID'], function (err, result) {
    
    // Show Item ID selected
    var buyItemID = result.item_id;
    console.log('You selected Item # ' + buyItemID + '.');

    // Then ask for Quanity (once user completed first entry)
    console.log('\nHow many do you wish to buy?')
    prompt.get(['buyItemQuantity'], function (err, result) {

      // Show quantity selected
      var buyItemQuantity = result.buyItemQuantity;
      console.log('You selected to buy ' + buyItemQuantity + ' of these.');

      // Once the customer has placed the order, check if store has enough of the product to meet the request
      connection.query('SELECT StockQuantity FROM Products WHERE ?', [{ItemID: buyItemID}], function(err, res){
        if(err) throw err; // Error Handler
        // Check if the item Id was valid (i.e. something was returned from mySQL)
        if(res[0] == undefined){
          console.log('Sorry... We found no items with Item ID "' +  buyItemID + '"');
          connection.end(); // end the script/connection
        }
        // Valid Item ID, so compare Bamazon Inventory with user quantity 
        else{
          var bamazonQuantity = res[0].stock_quantity;
          // Sufficient inventory
          if(bamazonQuantity >= buyItemQuantity){

            // Update mySQL database with reduced inventory
            var newInventory = parseInt(bamazonQuantity) - parseInt(buyItemQuantity); // ensure we have integers for subtraction & database
            connection.query('UPDATE Products SET ? WHERE ?', [{stock_quantity: newInventory}, {ItemID: buyItemID}], function(err, res){
              if(err) throw err; // Error Handler
            }); // end inventory update query


            // Show customer their purchase total (need to query the price info from database)
            var customerTotal;
            connection.query('SELECT Price FROM Products WHERE ?', [{ItemID: buyItemID}], function(err, res){
              
              var buyItemPrice = res[0].Price;
              customerTotal = buyItemQuantity*buyItemPrice;

              console.log('\nYour total is $' + customerTotal + '.');

              // ------------------------- Re factor for Executive Challenge ------------------------
              // Find the department for the purchase item
              connection.query('SELECT DepartmentName FROM Products WHERE ?', [{ItemID: buyItemID}], function(err, res){
                var itemDepartment = res[0].DepartmentName;
                
                // Find the current Revenue for that department
                connection.query('SELECT TotalSales FROM Departments WHERE ?', [{DepartmentName: itemDepartment}], function(err, res){
                  var totalSales = res[0].TotalSales;

                  // Calculate new sale revenue
                  var totalSales = parseFloat(totalSales) + parseFloat(customerTotal);

                  // Add the revenue from each transaction to the TotalSales column for the related department.
                  connection.query('UPDATE Departments SET ? WHERE ?', [{TotalSales: totalSales}, {DepartmentName: itemDepartment}], function(err, res){
                    if(err) throw err; // Error Handler
                    console.log('Transaction Completed. Thank you!')
                    connection.end(); // end the script/connection

                  }); // end new revenue update query
      
                }); // end current revenue query

              }); // end department name query 
              // -------------------------------------------------------------------------------------
            }); // end customer purchase update query 
          }
          // Insufficient inventory
          else{
            console.log('Sorry... We only have ' +  bamazonQuantity + ' of those items. Order cancelled.');
            connection.end(); // end the script/connection
          }
        }

      }); // end item quantity query

    }); // end of prompt 2

  }); // end of prompt 1

}); 