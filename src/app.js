const dotenv = require("dotenv").config();
const config = require( "./config" );
const mongoose = require( "mongoose" );
const MONGO_CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

mongoose.Promise = global.Promise;
// Connect to the DB an initialize the app if successful
mongoose.connect( config.dbUrl, MONGO_CONFIG )
  .then( () => {
    // logger.info( "Database connection successful" );
    console.log("Database Connect")
    // Create express instance to setup API
    const ExpressLoader = require( "./loaders/Express" );
    new ExpressLoader();
  } )
  .catch( err => {
    //eslint-disable-next-line
    console.error( err );
    // logger.error( err );
  } );