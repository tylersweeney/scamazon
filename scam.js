//Author:Tyler Sweeney

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

    var price = '$' + res[i].price.toFixed(2) + ''; 
    price = padText("   Price  ", price);

    var quantity = res[i].stock_quantity + ''; 

    console.log(itemID + '|' + productName + '|' + departmentName + '|' + price + '|    ' + quantity);
  }


  prompt.start();

  console.log('\nWhich item do you want to buy?');
  prompt.get(['buyItemID'], function (err, result) {
    
    var buyItemID = result.buyItemID;
    console.log('You selected Item # ' + buyItemID + '.');

    console.log('\nHow many do you wish to buy?')
    prompt.get(['buyItemQuantity'], function (err, result) {

      var buyItemQuantity = result.buyItemQuantity;
      console.log('You selected to buy ' + buyItemQuantity + ' of these.');

      connection.query('SELECT stock_quantity FROM products WHERE ?', [{item_id: buyItemID}], function(err, res){
        if(err) throw err;

        if(res[0] == undefined){
          console.log('Sorry... We found no items with Item ID "' +  buyItemID + '"');
          connection.end();
        }
        else{
          var scamazonQuantity = res[0].stock_quantity;
          if(scamazonQuantity >= buyItemQuantity){

            var newInventory = parseInt(scamazonQuantity) - parseInt(buyItemQuantity); 
            connection.query('UPDATE Products SET ? WHERE ?', [{stock_quantity: newInventory}, {item_id: buyItemID}], function(err, res){
              if(err) throw err; 
            }); 

            var customerTotal;
            connection.query('SELECT Price FROM Products WHERE ?', [{item_id: buyItemID}], function(err, res){
              
              var buyItemPrice = res[0].Price;
              customerTotal = buyItemQuantity*buyItemPrice.toFixed(2);

              console.log('\nYour total is $' + customerTotal + '.');

            });
          }

          else{
            console.log('Sorry... We only have ' +  scamazonQuantity + ' of those items. Order cancelled.');
            connection.end();
          }
        }

      });

    });

  });

});