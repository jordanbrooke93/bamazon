var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected a id " + connection.threadId);
    promptPurchase()
});

function promptPurchase() {
    var query = connection.query("Select * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        promptPurchase()
    })

    function promptPurchase() {
        inquirer.prompt([
            {
                type: "input",
                name: "item_id",
                message: "Please enter the item id that you would like to purchase."
            },
            {
                type: "input",
                name: "quantity",
                message: "How many would you like to buy?"
            }
        ]).then(function (answer) {
            connection.query("SELECT * FROM products", function (err, res) {
                // for (var i = 0; i < res.length; i++) {
                // console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
                var item = answer.item_id
                var quantity = answer.quantity
                var price = quantity * res[0].price// 
                if (quantity <= res[0].stock_quantity) {
                    var quantityUpdate = "UPDATE products SET stock_quantity = " + res[0].stock_quantity - quantity + " WHERE item_id = " + item
                    connection.query(quantityUpdate, function (err, res) {
                        console.log("Thank you for your order! Youre total is $" + price + "!")
                    })
                } else {
                    console.log("I'm sorry, that item is not in stock")
                }
                connection.end()
                // }
            })
        })
    }
}