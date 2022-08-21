// Load the AWS SDK for JS
var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});

// -----------------------------------------
// Create the Service interface for dynamoDB
var dynamodb = new AWS.DynamoDB({apiVersion: "2012-08-10"});

var params = {
  AttributeDefinitions: [
    {
      AttributeName: "artist",
      AttributeType: "S"
    },
    {
      AttributeName: "song",
      AttributeType: "S"
    }
  ],
  KeySchema: [
    {
      AttributeName: "artist",
      KeyType: "HASH"
    },
    {
      AttributeName: "song",
      KeyType: "RANGE"
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: "basicSongsTable"
};

// Create the table.
dynamodb.createTable(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Table Created", data);
  }
});