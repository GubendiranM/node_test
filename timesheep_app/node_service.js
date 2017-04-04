/**
 * Created with JetBrains WebStorm.
 * User: EMDnew
 * Date: 28/03/17
 * Time: 10:36
 * To change this template use File | Settings | File Templates.
 */
// including modules
var express =  require('express');
const pgdb = require('pg');
var fs = require('fs');
var queryString = require('querystring');
var url = require('url');
var bodyParser = require('body-parser');
var path = require('path');
var jsonSize = require('json-size')


/*  Service Integration with port 8000 */
var service = express();
service.use(express.static(path.join(__dirname,'/public_dir')));
// parse application/x-www-form-urlencoded
service.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
service.use(bodyParser.json());

/*  Service listening port */
service.listen(1000, function () {
    //var port = service.address().port;
    console.log('Service listening on port 1000 ..!');
});

/*
 Data Base Integration
 */
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:@localhost/timesheet';
const client = new pgdb.Client(connectionString);
client.connect(function(){console.log('connection created successfully...!')});

/*
 ========================================================================================================================
 Template Reading
 ========================================================================================================================
 */

/*  Get Index file */
//service.get('/', function (req, res) {
//    res.sendFile(path.join(__dirname,'/template/index.html'));
//    //readingFile(res,"templates/index.html");
//});

/*  Get phase file */
service.get('/phase', function (req, res) {
    res.sendFile(path.join(__dirname,'/template/phase_page.html'));
    //readingFile(res,"templates/index.html");
});


/*  Add Phase */
service.get('/phase/add', function (req, res) {
    var theUrl = url.parse( req.url );
    var queryObj = queryString.parse( theUrl.query );
    var phase = queryObj;
    var queryStr = "INSERT INTO phase(id, name, Description) VALUES(nextval('phase_seq'),'"+phase.name+"','"+phase.description+"');";
    console.log('Query : '+queryStr);
    updateQuery(queryStr,res);
});

/*  Update Phase */
service.get('/phase/update', function (req, res) {
    var theUrl = url.parse( req.url );
    var queryObj = queryString.parse( theUrl.query );
    var phase = queryObj;
    var queryStr = "update phase set name ='"+phase.name+"', description = '"+phase.description+"' where id = "+phase.id;
    console.log('Update Query : '+queryStr);
    executeQuery(queryStr,res);
});

/*  Delete Phase */
service.get('/phase/delete', function (req, res) {
    var theUrl = url.parse( req.url );
    var queryObj = queryString.parse( theUrl.query );
    var phase = queryObj;
    var queryStr = "delete from phase where id = "+phase.id;
    console.log('Update Query : '+queryStr);
    executeQuery(queryStr,res);
});

/*  Add Phase */
service.get('/phase/view/all', function (req, res) {

    var queryStr = "select id, name, description from phase order by name;";
    console.log('Query : '+queryStr);
    executeQuery(queryStr,res);
   /* client.query(queryStr, function(err, result) {
        //console.log(result);
        var phaseList = new Array();
        for (phase in result.rows){
            phaseList.push(result.rows[phase])
            //console.log('phase : '+result.rows[phase].id + result.rows[phase].name)
        }
        var json = {data: phaseList};
        console.log('json data : '+JSON.stringify(json));
        res.writeHead(200, {'content-type':'application/json', 'content-length':jsonSize(json)});
        //res.send(JSON.stringify(json));
        res.end(JSON.stringify(json));
    });*/
});





/*
 ========================================================================================================================
 Data Base Querying Block
 ========================================================================================================================
 */


/*  add user */
service.get('/user/add', function (req, res) {
    var theUrl = url.parse( req.url );
    var queryObj = queryString.parse( theUrl.query );
    var user = JSON.parse( queryObj.jsonData );
    var queryStr = "INSERT INTO users(name, gender,dob,doj,dept) VALUES('"+user.name+"','"+user.gender+"','"+user.dob+"','"+user.doj+"','"+user.dept+"');";
    console.log('Query : '+queryStr);
    updateQuery(queryStr,res);
});

service.get('/user/update', function (req, res) {
    var theUrl = url.parse( req.url );
    var queryObj = queryString.parse( theUrl.query );
    var user = JSON.parse( queryObj.jsonData );

    var queryStr = "UPDATE users SET name = '"+user.name+"', gender = '"+user.gender+"', dob = '"+user.dob+"', doj = '"+user.doj+"', dept = '"+user.dept+"' where id = "+user.id;
    console.log('Query : '+queryStr);
    updateQuery(queryStr,res);
});

service.get('/user/search', function (req, res) {
    var theUrl = url.parse( req.url );
    var queryObj = queryString.parse( theUrl.query );
    var user = JSON.parse( queryObj.jsonData );

    var queryStr = "SELECT id, name, gender, dob, doj, dept FROM users WHERE  id = "+user.id;
    console.log('Query : '+queryStr);
    executeQuery(queryStr,res);
});

service.get('/user/delete', function (req, res) {
    var theUrl = url.parse( req.url );
    var queryObj = queryString.parse( theUrl.query );
    var user = JSON.parse( queryObj.jsonData );
    var queryStr = "DELETE from users where id = "+user.id;
    console.log('Query : '+queryStr);
    updateQuery(queryStr,res);
});




/*
 ========================================================================================================================
 Data Base Query
 ========================================================================================================================
 */

function updateQuery(queryStr,res){
    const query = client.query(queryStr, function(err, result) {
        var response;
        if(err){
            response = {error: true, msg: err.getMessage(), data: err };
            sendJsonResult(res, response);
        }
        response = {error: false, msg: 'Executed Successfully ..!', data: result.rows };
        sendJsonResult(res, response);

    });
}

function sendJsonResult(res, response){
    console.log('Query Result : ' +JSON.stringify(response));
    res.writeHead(200, {'content-type':'application/json', 'content-length':jsonSize(response)});
    res.end(JSON.stringify(response));
}

function executeQuery(queryStr,res){
    client.query(queryStr, function(err, result) {
        var response;
        if(err){
            response = {error: true, msg: err.getMessage(), data: err };
            sendJsonResult(res, response);
        }
        response = {error: false, msg: 'Executed Successfully ..!', data: result.rows };
        sendJsonResult(res, response);
        /*console.log(result);
        //NOTE: error handling not present
        var json = JSON.stringify(result.rows);
        console.log(json);
        res.writeHead(200, {'content-type':'application/json', 'content-length':Buffer.byteLength(json)});
        //res.send(json)
        res.end(json);*/
    });
}

/*
 ========================================================================================================================
 Function Definitions Block
 ========================================================================================================================
 */

/* Reading any file with utf8 format */
function readingFile(res,fileName){
    fs.readFile(fileName,"utf8", function(err, content) {
        console.log('Reading file...');
        if (err) {
            return console.log('Reading file : '+__filename+' failed ..!\n'+err);
        }
        console.log('Reading file : '+__filename+' Succ ..!');
        res.send(content);
        res.end();
    });
}


/*
 ========================================================================================================================
 Model data Block
 ========================================================================================================================
 */

/* Phase Model data  */
function Phase(id, name, description){
    this.id = id;
    this.name = name;
    this.description = description;
}


/*
 ========================================================================================================================
 Error Handling
 ========================================================================================================================
 */

/* Error Class  */

class MyError {
    constructor(code, name, message){
        this.getCode = function(){
            return code;
        };
        this.getName = function(){
            return name;
        };
        this.getMessage = function(){
            return message;
        };
        this.toString = function(){
            return '{ code: '+this.getCode()+', name: "'+this.getName()+'", message: "'+this.getMessage()+'" }';
        };
    }
};


/* Error Type Declarations  */

/* REQUEST Error Declarations code starts at 1001   */
var INVALID_REQUEST = new MyError(1001, 'Invalid Request', 'Request Doesn\'t Contain Request input data');


/* DataBase Error Declarations code starts at 1101   */
var INVALID_QUERY = new MyError(1101, 'Invalid Query ', 'Invalid Query Description');




