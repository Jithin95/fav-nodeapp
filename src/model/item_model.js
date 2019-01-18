const mongoose = require("mongoose");
const chalk = require("chalk");
require('dotenv').config();

mongoose.connect('mongodb://127.0.0.1:27017/project_fav', (err)=> {
    if (err) {
        console.log(chalk.red(`Error in connecting Database  ${err}`));
    } else {
        console.log(chalk.green(`Successfully connected`));
    }
});


const Schema = mongoose.Schema;
var dataSchema = new Schema({
    itemname : String,
    isfav : {
        type: Boolean,
        default: false
    },
});

var dataSchema = mongoose.model("item_data", dataSchema);
module.exports = dataSchema;
