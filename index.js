var express = require("express");
var app = express();
var Web3 = require('web3');
var nodemailer = require('nodemailer');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
var mysql = require("mysql");
const {wrap} = require('co');
const {join} = require('path');
const moment = require('moment');
const pdf = require('html-pdf');
const thunkify = require('thunkify');
var cors = require('cors');
const read = thunkify(require('fs').readFile);
const handlebars = require('handlebars');
const randomstring = require('randomstring');
var md5 = require('md5');
var lodash = require('lodash');
var fs = require('fs');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var txHash;
var time;
var certificatehash;
var hashpdf = "faesdAWE324";
var hashpdfs;
var path = "./certificateddocs/";
var mysql      = require('mysql');
var Cryptr = require('cryptr'),
    cryptr = new Cryptr('myTotalySecretKey');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'hari',
  database : 'certificates'
});

var Cryptr = require('cryptr'),
cryptr = new Cryptr('myTotalySecretKey');
var name_file;
//multer onfiguration
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './verifydocs/')
    },
    filename: function (req, file, cb) {
        
      time = Date.now();
      cb(null, file.fieldname + '-' + time)
      name_file = file.fieldname + '-' + time;
    }
  })

const upload = multer({ storage: storage });
 
connection.connect();
app.use(cors());
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});


const contractAbi = [ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": false, "inputs": [ { "name": "has", "type": "string" } ], "name": "generate_certificate", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "get_hash", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]
var contract_addr = "0x43b72d9cfec8408233fb34cafe49a39c109e7539";
                   
var contract_instance = web3.eth.contract(contractAbi).at(contract_addr);
function hee()
{
 console.log("dfsdasa");
}
function getbalance(){
   var d = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[0]),"ether");
   
   console.log(d);
}

const random = randomstring.generate({
    length: 7,
    charset:'alphabetic'
});


// PDF Options
const pdf_options = {format: 'A4', quality: 150, orientation: "landscape",  zoomFactor: "0.5"};


app.post('/register',function(req,res){

//PDF
console.log("*******************************");
const generatePDF = wrap(function * (c,b) {

	const data = {	
		student: {
			name: req.body.names,
			course: req.body.course,
			date: '22nd March',
			year: '2018'
		},
		employee: {
			name: 'Hari Prasad',
			designation: 'Block Chain Digital Lync'
		}
    };
    
    console.log("__________________________");

	
	const source = yield read(join(`${__dirname}/template1.html`), 'utf-8');
	const template = handlebars.compile(source);
	const html = template(data);
	const p = pdf.create(html, pdf_options);
    p.toFile = thunkify(p.toFile);
    var file = yield p.toFile(`${join(__dirname+'/certificateddocs/',req.body.contact+'_certificate.pdf')}`);
    console.log("__________________________");
    const filename = __dirname + '/certificateddocs/'+req.body.contact+'_certificate.pdf';
    const crypto = require('crypto');
    const fs = require('fs');
    const hash = crypto.createHash('sha256');
    const input = fs.createReadStream(filename);

//Transaction in Blockchain    

web3.personal.unlockAccount(web3.eth.accounts[0],'hari');
fs.readFile(__dirname + '/certificateddocs/'+req.body.contact+'_certificate.pdf', function(err, buf) {
   //console.log("in");
     if(err){
         console.log(err)
     }        
     else{
        // console.log(buf);
var val = contract_instance.generate_certificate(cryptr.encrypt(buf),{from:web3.eth.accounts[0],gas:200000},function(error,result){
 if(error){
     console.log(error);
 }
 else{

      txHash = result;
     console.log("hell "+txHash);

//saving data into database

     var user = {
        names:req.body.names,
        email:req.body.email,
        contact:req.body.contact,
        course:req.body.course,
        transaction_id:txHash,
        hash:cryptr.encrypt(buf),
        certificate_path:__dirname

    }


connection.query('insert into certificates set?',user,function(err,result){
if(err){
    console.log("Error has occured",err);
}else{

//sending Email

    var transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'dummytest471@gmail.com',
            pass:'dummytest3296'
        }
    })


    var mailoptions = {
        from:'dummytest471@gmail.com',
        to:req.body.email,
        subject:'Blochain certificate',
        text:'Hi please check your ccertificate Thank you.....!!!!!!! :)   AND your TRANSACTION ID IS'+txHash,
        attachments: [
            {   
               
                'path': "./certificateddocs/"+req.body.contact+"_certificate.pdf" // stream this file
            },
        ]

    }


    transporter.sendMail(mailoptions,function(err,info){
        if(err){
            console.log(err);
                res.send({"status" : "0","message":"failed while creating certificate.....!"});
        }
        else{

                  res.send({"status" : "1","message":"Certificate Created Successfully"});

        }
      })
    
    }
    })    
  }
 })
}
});

});
generatePDF();

})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

app.post('/validate',upload.single('file-to-upload'),function(req,res){ 

    id = req.body.transaction_id;

    //console.log(req);
    fs.readFile(__dirname + '/verifydocs/'+name_file, function(err, buf) {
        if(err){
            console.log(err)
        }        
        else{
         
          console.log(cryptr.encrypt(buf));
          console.log("____");
          console.log(req.body.transaction_id);
         
            
            
         
           var d = web3.eth.getTransaction(id);
           var i = web3.toAscii(d.input);
           var compares = i.substr(6);
         
           console.log(compares.replace(/ /g,''));
        
           var b = cryptr.encrypt(buf);
           console.log(typeof(b));
           
        
         

            var c = compares.replace(/ /g,'');
            console.log(typeof(c));
            
                      

            console.log(")____________{");
            console.log(b);

            console.log(c);

            console.log(b==c);
           if(lodash.isEqual(b,c)){

            res.send({"status" : "1","data":"A valid Document"});
           }else{
                  res.send({"status" : "0","data":"Invalid Document or Transaction ID.....!"});
           }
    }
    })
})

// function createcertificate(){

//     console.log("********++++))))");
//    web3.personal.unlockAccount(web3.eth.accounts[0],'hari');
//   var val = contract_instance.generate_certificate("DHFJ78R3#^R&GD&@(",{from:web3.eth.accounts[0],gas:200000},function(error,result){
//    if(error){
//        console.log(error);
//    }
//    else{
//         txHash = result;
//        console.log("hell "+txHash);
//        //console.log(result);
//    }
// })
// }

// function getnames(){
//    var valu = contract_instance.getName().toString();
//    console.log(valu);
// }


// function de(){
//    console.log("*******GET TRANSACTION*********");
//    var hash = "0x7364fdf2f8bded3a274265c960a65ef091cb518508359b33e45f6974bf0ba8d5";
//    var d = web3.eth.getTransaction(hash);
//    var i = web3.toAscii(d.input);
//    console.log(d);
//    console.log(d.input);
//    console.log(i);
//    }
   
// function signa(){
//    var msg = "it is doned by Hariprasad";
//    let addr = web3.eth.accounts[0]
//    var signature = web3.eth.sign(addr, '0x' + msg.toString(16))
//    console.log(signature);
// }




app.listen(8080);
console.log("Server is running at port 8080");
