const BCHN_MAINNET = "https://bchn.fullstack.cash/v5/";
const BCHJS = require("@psf/bch-js");

const fs = require('fs')
let bchjs;
bchjs = new BCHJS({ restURL: BCHN_MAINNET });

const lang = "english"; // Set the language of the wallet.

//this array is how many wallets you want to print
let numOfPubKeys = ["1","2","3","4","5"];

const getPubkeyBuffArray = async () => {
  const results = await
    Promise.all(numOfPubKeys.map(e => e = createPubKeys(e)))
  return results
}
getPubkeyBuffArray()

 async function createPubKeys(nameOfWallets) {
  try {
    
 let words = bchjs.Mnemonic.generate(128, bchjs.Mnemonic.wordLists()[lang]);

    arr = [words].join();
    // create root seed
    let toSeed = await bchjs.Mnemonic.toSeed(arr);
   
    // master HDNode
    let masterHdnode = bchjs.HDNode.fromSeed(toSeed);
    // Use 245 derivation path, which is the BIP44 standard for SLP tokens.
    let listChildNodes = masterHdnode.derivePath("m/44'/245'/0'/0/0");

    const wallet = {

      mnemonic: words,
      cashAddress: bchjs.HDNode.toCashAddress(listChildNodes),
      slpAddress: bchjs.SLP.HDNode.toSLPAddress(listChildNodes),
      legacyAddress: bchjs.HDNode.toLegacyAddress(listChildNodes),
      WIF: bchjs.HDNode.toWIF(listChildNodes)
     
    };
    //console.log(wallet);
      fs.writeFileSync(wallet${wallet,nameOfWallets}.json, JSON.stringify(wallet, null, 2))
    //console.log(wallet${wallet,nameOfWallets}.json, JSON.stringify(wallet, null, 2))  
    
  } catch (err) {
    console.error("Error in createWallets(): ", err);
  }
}
