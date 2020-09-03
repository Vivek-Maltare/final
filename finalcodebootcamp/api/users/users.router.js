const {addBooks,selectbooks,displaybooksbytimes,updatebooks,getbookicon,getbookfile,uploadbookicon,uploadbookFile,selectbooksbycategory}=require('../users/users.controller');
const upload = require("../middleware/upload");
const uploadFileMiddleware = require("../middleware/uploadFile");
const express1=require('express');
var path = require('path');
var https=require('https');
const qs=require('querystring');
const parseUrl = express1.urlencoded({ extended: false })
const parseJson = express1.json({ extended: false })
const router=require('express').Router();
const checksum_lib = require('./paytm/checksum/checksum');
const config = require('./paytm/checksum/config');
var { response } = require('express');
router.get("/",selectbooks);
router.post('/',addBooks);
router.get("/time",displaybooksbytimes);
router.patch('/',updatebooks);
router.get('/category/:cat',selectbooksbycategory);
//TO fetch book and icon from DATABASE
router.get("/bookicon", getbookicon);

router.get("/bookfile", getbookfile);


//TO store book and icon from DATABASE
/*router.get("/uploadbookicon",(req, res) => {
   
    //return res.sendFile(`/home/nishi/finalproject/finalprojectN/views/index.html`);
  });*/
router.post("/uploadimg/:name",upload.single("image"), uploadbookicon);
//router.post("/uploadimg",upload, uploadbookicon);

/*router.get("/uploadbookFile",(req, res) => {
   
    return res.sendFile(`/home/nishi/finalprojectC/views/bookfile.html`);
  });*/
router.post("/uploadfile/:name",uploadFileMiddleware.single("file"), uploadbookFile);

router.get('/paytm', (req, res) => {
  res.sendFile(path.join(__dirname + '/index2.html'));
})
router.post('/paynow',[parseUrl, parseJson], (req, res) => {
  var paymentDetails = {
            amount: req.body.amount,
            customerId: req.body.name,
            customerEmail: req.body.email,
            customerPhone: req.body.phone
        }
        if(!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
            res.status(400).send('Payment failed')
        } else {
            var params = {};
            params['MID'] = config.PaytmConfig.mid;
            params['WEBSITE'] = config.PaytmConfig.website;
            params['CHANNEL_ID'] = 'WEB';
            params['INDUSTRY_TYPE_ID'] = 'Retail';
            params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
            params['CUST_ID'] = paymentDetails.customerId;
            params['TXN_AMOUNT'] = paymentDetails.amount;
            params['CALLBACK_URL'] = 'http://localhost:3000/api/users/callback';
            params['EMAIL'] = paymentDetails.customerEmail;
            params['MOBILE_NO'] = paymentDetails.customerPhone;


            checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
                var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
                // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

                var form_fields = "";
                for (var x in params) {
                    form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
                }
                form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
                res.end();
            });
        }
})
router.post('/callback', (req, res) => {
  var body = '';

  req.on('data', function (data) {
     body += data;
  });

   req.on('end', function () {
     var html = "";
     var post_data = qs.parse(body);

     // received params in callback
     console.log('Callback Response: ', post_data, "\n");


     // verify the checksum
     var checksumhash = post_data.CHECKSUMHASH;
     // delete post_data.CHECKSUMHASH;
     var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
     console.log("Checksum Result => ", result, "\n");


     var PaytmChecksum=require('./PaytmChecksum');
     var paytmParams = {};
paytmParams["MID"]     = post_data.MID;
paytmParams["ORDERID"] = post_data.ORDERID;

/*
* Generate checksum by parameters we have
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
PaytmChecksum.generateSignature(paytmParams, config.PaytmConfig.key).then(function(checksum){

    paytmParams["CHECKSUMHASH"] = checksum;

    var post_data = JSON.stringify(paytmParams);

    var options = {

        /* for Staging */
        hostname: 'securegw-stage.paytm.in',

        /* for Production */
        // hostname: 'securegw.paytm.in',

        port: 443,
        path: '/order/status',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    response = "";
    var post_req = https.request(options, function(post_res) {
        post_res.on('data', function (chunk) {
           response += chunk;
            
        });

        post_res.on('end', function(){
            console.log('Response: ', response);
            if(response.status='TXN_SUCCESS')
    {
        res.write('<h1 align="center">payment successful</h1><br>')
        res.write(response);
    }    
    else{
        res.send("not successful");

    }
        });
    });
    
    post_req.write(post_data);
    post_req.end();
 });        
    })
    
})
  module.exports=router;
  