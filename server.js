const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const xml2js = require('xml2js');
const https = require('https');
const parser = new xml2js.Parser();

const port = 443;
const app = express();
const axios = require('axios');


const options = {
    key: fs.readFileSync('keys/private.key'),         // Path to your private key file
    cert: fs.readFileSync('keys/certificate.crt'),        // Path to your certificate file
  };


app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'application/xml' }));


let data = [];
let getMethods = ['securities', 'zberigs', 'deponenttypes',
    'birgi', 'depoopers', 'depostats', 'depostate'];

let postMethods = ['depoagrees', 'brokers', 'brokagrees', 
    'fdaccnts', 'depodocs'];

    
// Necessary functions:
function extractDataFromXML(fileName) {
  const xmlData = fs.readFileSync(fileName, 'utf8');
  // fileName += ".xml";
  console.log(xmlData);
  return xmlData;
  // const parser = new xml2js.Parser();
  // console.log("/n/n/nTESTESTEST/n/n");
  // console.log(xmlData != null);
  // let x = parser.parseString(xmlData, (err, result) => {
  //   if (err) {
  //     console.error('Error parsing XML:', err);
  //     // Handle the error accordingly
  //     return Error;
  //   } else {
  //     // Extract the desired data from the parsed XML
  //     const extractedData = result.result;

  //     console.log('Extracted data:', extractedData);
  //     return extractedData;
  //   }
  // });
  // return x;
}
/*TEST*/

/*async function makePostRequest(url, data, contentType) {
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': contentType,
      },
    });

    console.log('Response:', response.data);
  } catch (error) {
    console.error('POST Error:', error.message);
  }
}*/


async function makePostRequest(url, data, contentType) {
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': contentType,
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false, // Ignore self-signed certificate errors
        }),
      });
  
      console.log('Response:', response.data);
    } catch (error) {
      console.error('POST Error:', error.message);
    }
  }
  
  const url = 'https://localhost:443/data/json';
  
    /*TEST*/
  
                                                            // GET endpoint
  
  app.get('/data', (req, res) => {
    console.log(data);
    res.send(data);
    // console
  });
  
  app.get('/XMLEntrySSL/do/depoapi/:parameter', (req, res) => {
    // Process the GET request and send the response
    // res.send('GET request received');
    const parameter = req.params.parameter;
    console.log(parameter + "\n\n");
    if (getMethods.includes(parameter))
      console.log("\n\nGET METHOD DETECTED\n\n");
    else if (postMethods.includes(parameter))
      console.log("\n\nPOST METHOD DETECTED\n\n");
    else
      console.log("\n\nSOMETHING WENT WRONG\n\n");
    //const path = "./Depositorium/" + parameter;
    console.log("");
    const fs = require("fs")
    try {
      //const arrayOfFiles = fs.readdirSync("./Depositorium")
      const name = "Depositorium/" + parameter + ".xml";
      res.send(extractDataFromXML(name));
      //console.log(arrayOfFiles)
      console.log(extractDataFromXML(name));
    } catch(e) {
      console.log(e)
    }
    console.log("/n/n");
    
    console.log(data);
  });
  
  // DELETE endpoint
  app.delete('/data', (req, res) => {
    // Process the DELETE request and send the response
    res.send('DELETE request received');
  });
  
  // PUT endpoint
  app.put('/data', (req, res) => {
    // Process the PUT request and send the response
    res.send('PUT request received');
  });
  
  

  // POST endpoint for JSON data
  app.post('/data/json', (req, res) => {
    const jsonData = req.body;
    console.log('Received JSON data:', jsonData);
    data.push(jsonData);
    makePostRequest(url, jsonData, 'application/json');
    res.send('JSON data stored');
  });


                                                        // POST


  // POST endpoint for XML data
  app.post('/data/xml', (req, res) => {
    const xmlData = req.body;
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        console.error('Error parsing XML data:', err);
        res.status(400).send('Error parsing XML data');
      } else {
        console.log('Received XML data:', result);
        data.push(result);
        res.send('XML data stored');
      }
    });
  });

const path = require('path');
const { Builder } = require('xml2js');

const folderPath = 'Depositorium';

function extractXML(targetValue) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      return;
    }

    // Iterate through each file
    files.forEach((file) => {
      const filePath = `${folderPath}/${file}`;
      const fileName = path.basename(filePath);
      const depo = fileName.substring(0, 9);

      if (depo === 'depoagree') {
        fs.readFile(filePath, 'utf8', (err, xmlData) => {
          if (err) {
            console.error('Error reading file:', err);
            return;
          }

          xml2js.parseString(xmlData, (err, result) => {
            if (err) {
              console.error('Error parsing XML:', err);
              return;
            }

            const deponentId = result.depoagrees.depoagree[0].deponent_id[0];
            if (deponentId === targetValue) {
              console.log('Matching file:', filePath);
              console.log('XML content:', result);
              
              // Convert the JavaScript object back to XML
              const builder = new Builder({ xmldec: { version: '1.0', encoding: 'UTF-8' } });
              const xml = builder.buildObject(result);
              console.log('Generated XML:', xml);
              return xml;
            }
          });
        });
      } else {
        console.log('other');
      }
    });
  });
}
  app.post('/data/XMLEntrySSL/do/depoapi/get/depoagrees/:parameter', (req, res) => {
    const parameter = req.params.parameter;
    console.log(extractXML(parameter));
    res.send('ok');
    //const path = "./Depositorium/" + parameter;
    // console.log("");
    // const fs = require("fs")
    // try {
    //   //const arrayOfFiles = fs.readdirSync("./Depositorium")
    //   const name = "Depositorium/" + parameter + ".xml";
    //   res.send(extractDataFromXML(name));
    //   //console.log(arrayOfFiles)
    //   console.log(extractDataFromXML(name));
    // } catch(e) {
    //   console.log(e)
    // }
    // console.log("/n/n");
    
    // console.log(data);
  });
  
  // Create an HTTP server
  /*app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });*/
  // Create HTTPS server
  https.createServer(options, app).listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
  });