const BCHJS = require('@psf/bch-js')
const BCHN_MAINNET = 'https://api.fullstack.cash/v5/'
 
const bchjs = new BCHJS({ restURL: BCHN_MAINNET });
 
var keyPairs = [
    'wif1',
    'wif2',
    'wif3',
    'wif4',
    'wif5'
     
    ].map(function (wif) { return bchjs.ECPair.fromWIF(wif) })
    var pubKeys = keyPairs.map(function (x) { return x.getPublicKeyBuffer() })
 
    // var pubKeys = [
 
    // ].map(hex => Buffer.from(hex, 'hex'));
 
    var redeemScript =  bchjs.Script.multisig.output.encode(3, pubKeys)
 
    var scriptPubKey =  bchjs.Script.scriptHash.output.encode(bchjs.Crypto.hash160(redeemScript))
    //Check OP codes
    const p2msToAsm = bchjs.Script.toASM(redeemScript);
    // console.log(p2msToAsm)
    var address = bchjs.Address.fromOutputScript(scriptPubKey)
    // var multisig = bchjs.Script.multisig.output.decode(redeemScript)
 
    //Spending from this txid
    const p2shtxID2 = '193303377ce4958ddc89d6a55fed33d5abd950fb7a6fda4f58555995f2385a0b'
    //To this address
    const recAddr = "bitcoincash:qp9dg9ddlv4e503ma70awdqgj406et4r8vt9j0svlr"
   
    let originalAmount = 13497
    // let originalAmount = 49925
    let witnessScript
    let byteCount = bchjs.BitcoinCash.getByteCount({'MULTISIG-P2SH:3-5': 1},{P2PKH: 1})
    let sendAmount = originalAmount - byteCount;
 
 
        var txb = new bchjs.TransactionBuilder()
     
 
       txb.addInput(p2shtxID2,0)
       txb.addOutput(recAddr, sendAmount)
 
       txb.sign(0, keyPairs[0], redeemScript, txb.hashTypes.SIGHASH_ALL, sendAmount, txb.signatureAlgorithms.ECDSA)
       txb.sign(0, keyPairs[1], redeemScript, txb.hashTypes.SIGHASH_ALL, sendAmount, txb.signatureAlgorithms.ECDSA)
       txb.sign(0, keyPairs[2], redeemScript, txb.hashTypes.SIGHASH_ALL, sendAmount, txb.signatureAlgorithms.ECDSA)
    //    txb.sign(0, keyPairs[1], redeemScript, txb.hashTypes.SIGHASH_ALL, sendAmount, txb.signatureAlgorithms.ECDSA)
    //    console.log(txb)
       var finTx = txb.build()
       const tx = finTx.toHex()
 
     
            const sendToNetwork = async() => {
                try {
                    //  let sendRawTransaction = await bchjs.RawTransactions.sendRawTransaction(tx);
                 } catch (err) {
                    console.error('Error in sendRawTransaction():', err)
                throw err
              }
            }
            // sendToNetwork()
