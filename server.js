// Load the AWS SDK for JS
var AWS = require("aws-sdk");
var express = require('express');
var {v4} = require('uuid');


AWS.config.update({region: 'us-east-1'});
const tableName = "basicSongsTable"

const dynamodb = new AWS.DynamoDB.DocumentClient();

var server = express();
server.use(express.json())


server.get('/', (req, res) => {
    res.send('Hello World');
});

//create song

server.post('/api/song', async (req, res) => {    
    const item = {
        "artist":  req.body.artist,
        "song": req.body.song,
        "id": v4(),
        "priceUsdCents": req.body.priceUsdCents,
        "publisher": req.body.publisher
      }

      try{
        await dynamodb.put({
          TableName: tableName,
          Item: item,
        }).promise();
      } catch(error){
        console.error(error);
        res.status(500).send({ error: "error" });
      }

      res.status(201).send(item);
});

server.get('/api/song/artist/:artist/song/:song', async (req, res) => {
    var artist = req.params.artist;
    var song = req.params.song;

    let item;
    let error;
    try{
        const result = await dynamodb.get({
            TableName:tableName,
            Key: {
              "artist": artist, 
              "song": song
             }, 
        }).promise();

        item = result.Item;

    } catch (err){       
        console.error(err);
        res.status(500).send({ error: err});
    }

    //If item not found, return 404
    if(!song){
        res.status(404).send({ error: error});
    }

    res.status(200).send(item);

});

server.get('/api/song/artist/:artist', async (req, res) => {
    var artist = req.params.artist;

    let item;
    let error;
    try{
        const result = await dynamodb.get({
            TableName:tableName,
            Key: {
              "artist": artist
             }, 
        }).promise();

        item = result.Item;

    } catch (err){       
        console.error(err);
        res.status(500).send({ error: err});
    }

    //If item not found, return 404
    if(!song){
        res.status(404).send({ error: error});
    }

    res.status(200).send(item);

});


server.patch('/api/song/artist/:artist/song/:song', async (req, res) => {
    var artist = req.params.artist;
    var song = req.params.song;

    let songReturned;
    let error;
    try{
        const result = await dynamodb.get({
            TableName:tableName,
            Key: {
              "artist": artist, 
              "song": song
             }, 
        }).promise();

        songReturned = result.Item;

    } catch (err){       
        console.error(err);
        res.status(500).send({ error: err});
    }

    //If item not found, return 404
    if(!songReturned){
        res.status(404).send({ error: error});
    }
    
    try{
        const result = await dynamodb.update({
            TableName:tableName,
            Key: {
              "artist": artist, 
              "song": song
             }, 
             UpdateExpression:'SET priceUsdCents = :priceUsdCents, publisher = :publisher',
             ExpressionAttributeValues:{
                ':priceUsdCents': req.body.priceUsdCents,
                ':publisher': req.body.publisher
             },
             ReturnValues:'UPDATED_NEW'
        }).promise();

        item = result.Attributes;

    } catch (err){       
        console.error(err);
        res.status(500).send({ error: err});
    }

    res.status(200).send(item);

});



var PORT = process.env.PORT || 5000;

server.listen(PORT, () => {console.log(`Server listening on port ${PORT}`)});
















//Common DynamoDB operations


// Get a single item with the getItem operation
// async function logSingleItem(){
//     try {
//         var params = {
//             Key: {
//              "artist": {"S": "Arturus Ardvarkian"}, 
//              "song": {"S": "Carrot Eton"}
//             }, 
//             TableName: tableName
//         };
//         var result = await dynamodb.getItem(params).promise()
//         console.log(JSON.stringify(result))
//     } catch (error) {
//         console.error(error);
//     }
// }
// logSingleItem()

// Use the query operation to get all song by artist Arturus Ardvarkian-Query on primary key
// async function logSongsByArtist(){
//     try {
//         var params = {
//             KeyConditionExpression: 'artist = :artist',
//             ExpressionAttributeValues: {
//                 ':artist': {'S': 'Arturus Ardvarkian'}
//             },
//             TableName: tableName
//         };
//         var result = await dynamodb.query(params).promise()
//         console.log(JSON.stringify(result))
//     } catch (error) {
//         console.error(error);
//     }
// }
// logSongsByArtist()


// async function logSongsByArtist(){
//     try {
//         var params = {
//             KeyConditionExpression: 'artist = :artist',
//             ExpressionAttributeValues: {
//                 ':artist': {'S': 'Arturus Ardvarkian'}
//             },
//             TableName: tableName
//         };
//         var result = await dynamodb.query(params).promise()
//         console.log(JSON.stringify(result))
//     } catch (error) {
//         console.error(error);
//     }
// }
// logSongsByArtist()

// Query songs by artist "Arturus Ardvarkian" that start with "C"
// async function logArtistSongsStartingWithC(){
//     try {
//         var params = {
//             KeyConditionExpression: 'artist = :artist AND begins_with ( song , :song )',
//             ExpressionAttributeValues: {
//                 ':artist': {'S': 'Arturus Ardvarkian'},
//                 ':song': {'S': 'C'}
//             },
//             TableName: tableName
//         };
//         var result = await dynamodb.query(params).promise()
//         console.log(JSON.stringify(result))
//     } catch (error) {
//         console.error(error);
//     }
// }
// logArtistSongsStartingWithC()


//Scan all songs in the table
// Use the DynamoDB client scan operation to retrieve all items of the table
// async function scanForResults(){
//     try {
//         var params = {
//             TableName: tableName
//         };
//         var result = await dynamodb.scan(params).promise()
//         console.log(JSON.stringify(result))
//     } catch (error) {
//         console.error(error);
//     }
// }
// scanForResults()





// // Get a single item with the getItem operation and Document Client
// async function logSingleItemDdbDc(){
//     try {
//         var params = {
//             Key: {
//              "artist": "Arturus Ardvarkian", 
//              "song": "Carrot Eton"
//             }, 
//             TableName: tableName
//         };
//         var result = await ddbDocumentClient.get(params).promise()
//         console.log(JSON.stringify(result))
//     } catch (error) {
//         console.error(error);
//     }
// }
// logSingleItemDdbDc()


// Query all songs by artist Arturus Ardvarkian with the Document Client
// async function logSongsByArtistDdbDc(){
//     try {
//         var params = {
//             KeyConditionExpression: 'artist = :artist',
//             ExpressionAttributeValues: {
//                 ':artist': 'Arturus Ardvarkian'
//             },
//             TableName: tableName
//         };
//         var result = await ddbDocumentClient.query(params).promise()
//         console.log(JSON.stringify(result))
//     } catch (error) {
//         console.error(error);
//     }
// }
// logSongsByArtistDdbDc()

// Query all songs by artist Arturus Ardvarkian that start with "C" using the Document Client
// async function logArtistSongsStartingWithCDdbDc(){
//     try {
//         var params = {
//             KeyConditionExpression: 'artist = :artist AND begins_with ( song , :song )',
//             ExpressionAttributeValues: {
//                 ':artist': 'Arturus Ardvarkian',
//                 ':song': 'C'
//             },
//             TableName: tableName
//         };
//         var result = await ddbDocumentClient.query(params).promise()
//         console.log(JSON.stringify(result))
//     } catch (error) {
//         console.error(error);
//     }
// }
// logArtistSongsStartingWithCDdbDc()


// Query all songs by artist Arturus Ardvarkian that start with "C" using the Document Client
// async function logArtistSongsStartingWithCDdbDc(){
//     try {
//         var params = {
//             KeyConditionExpression: 'artist = :artist AND begins_with ( song , :song )',
//             ExpressionAttributeValues: {
//                 ':artist': 'Arturus Ardvarkian',
//                 ':song': 'C'
//             },
//             TableName: tableName
//         };
//         var result = await ddbDocumentClient.query(params).promise()
//         console.log(JSON.stringify(result))
//     } catch (error) {
//         console.error(error);
//     }
// }
// logArtistSongsStartingWithCDdbDc()

// Scan table for all items using the Document Client
// async function scanForResultsDdbDc(){
//     try {
//         var params = {
//             TableName: tableName
//         };
//         var result = await ddbDocumentClient.scan(params).promise()
//         console.log(JSON.stringify(result))
//     } catch (error) {
//         console.error(error);
//     }
// }
// scanForResultsDdbDc()

// { 
//    "Item":{ 
//       "priceUsdCents":161,
//       "artist":"Arturus Ardvarkian",
//       "song":"Carrot Eton",
//       "publisher":"MUSICMAN INC",
//       "id":"dbea9bd8-fe1f-478a-a98a-5b46d481cf57"
//    }
// }













