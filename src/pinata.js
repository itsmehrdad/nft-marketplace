const key=  "0c2943c82a80b324d62e";
const secret = "fe411a1bf242cf1406bcdfe5ff146e97af413f65a308af343b516932c0f0b0e1";
const axios = require('axios');
const FormData = require('form-data');
//const fs = require('fs');


export const uploadJSONToIPFS = async(JSONBody) => {
      const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
      //making axios POST request to Pinata ⬇️
      return axios 
          .post(url, JSONBody, {
              headers: {
                  pinata_api_key: key,
                  pinata_secret_api_key: secret,
              }
          })
          .then(function (response) {
             return {
                 success: true,
                 pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
             };
          })
          .catch(function (error) {
              console.log(error)
              return {
                  success: false,
                  message: error.message,
              }
  
      });
  };

export const uploadFileToIPFS = async(file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    //making axios POST request to Pinata 
    
    let data = new FormData();

    data.append('file', file);

    data.append('pinataMetadata', '{"name": "MyFile", "keyvalues": {"company": "Pinata"}}');

    //pinataOptions are optional
    data.append('pinataOptions', '{"cidVersion": 1}');

    return axios 
        .post(url, data, {
           
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key : key ,
                pinata_secret_api_key: secret ,
            }
        })
        .then(function (response) {
            console.log("image uploaded", response.data.IpfsHash)
            return {
               success: true,
               pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};