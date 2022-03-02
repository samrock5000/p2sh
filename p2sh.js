const BCHJS = require('@psf/bch-js')
const BCHN_MAINNET = 'https://bchn.fullstack.cash/v5/'
const bchjs = new BCHJS({ restURL: BCHN_MAINNET });


// var mainnet = bitcoin.networks.mainnet


var keyPairs = [
    'addWif......',
    'addWif',
    'addWif',
    'addWif',
    'addWif'
].map(function (wif) { return bchjs.ECPair.fromWIF(wif) })
var pubKeys = keyPairs.map(function (x) { return x.getPublicKeyBuffer() })

const redeemScript = bchjs.Script.multisig.output.encode(3, pubKeys)
//Check OP codes
const p2msToAsm = bchjs.Script.toASM(redeemScript);
// Hash P2MS Data to Buffer
const p2sh_to_160 = bchjs.Crypto.hash160(p2msToAsm);
//P2SH Buffer
const p2shPubKey = bchjs.Script.scriptHash.output.encode(p2sh_to_160)

const p2shAddress = bchjs.Address.fromOutputScript(p2shPubKey);
console.log(p2shAddress)




const getRaw = async () => {
    // let getRawTransaction = await bchjs.RawTransactions.getTxData(txId);
    // let decodeRawTransaction = await bchjs.RawTransactions.decodeRawTransaction(unsig)
    // console.log(getRawTransaction.vin[0].scriptSig)
    console.log(utxos)
    // return[getRawTransaction.vout]
}
// getRaw()

const p2shtxID = '03cbf67f8af7a1f14ea7e41da8f41fe403d5cdb34fdb70537dd5530089ce8625'
const p2shaddr = 'bitcoincash:pzd8c030jmgxpjtctvwes8v40t0n8mnmec0w60ff6d'
const recAddr = "bitcoincash:qzsp6xhrg26lfn4lx3p9vszuhjyatj0j0yq65r5axe"

const newTx1 = new bchjs.TransactionBuilder()
// const pk1 = Buffer.from(bchjs.Crypto.sha256('a9149a7c3e2f96d060c9785b1d981d957adf33ee7bce87'))
// const scriptHashBuff = Buffer.from(bchjs.Crypto.sha256(p2shtxID))

const makeTx = async () => {
    try {
        // const utxos = await bchjs.Electrumx.utxo(p2shaddr)
        // const utxo = await utxos.utxos[0]
        const redeem = await redeemScript
        //newTx1.addInput(utxo.tx_hash, utxo.tx_pos)
        newTx1.addInput(p2shtxID, 0)
        newTx1.addOutput(recAddr, 29000) //30784

        newTx1.sign(0, keyPairs[0], redeem, newTx1.hashTypes.SIGHASH_ALL, 0, newTx1.signatureAlgorithms.SCHNORR)
        newTx1.sign(0, keyPairs[1], redeem, newTx1.hashTypes.SIGHASH_ALL, 0, newTx1.signatureAlgorithms.SCHNORR)
        newTx1.sign(0, keyPairs[2], redeem, newTx1.hashTypes.SIGHASH_ALL, 0, newTx1.signatureAlgorithms.SCHNORR)
        // console.log(newTx1.transaction)
    } catch (err) {
        console.error('Error in utxos():', err)
    }
 

    // console.log(utxo)
    // newTx1.addInput(scriptHashBuff,1, sequence = this.DEFAULT_SEQUENCE, redeem ) 
    // newTx1.addInputScript(0,sigScript)


    //  newTx1.addInputScript(newTx1)

    const finTx = newTx1.build()
    const tx = finTx.toHex()

    // const txBuffer = Buffer.from(tx, 'hex')
    // const completeTx = new bchjs.TransactionBuilder()
    // completeTx.addInputScript(0, p2shPubKey)
    // console.log(tx)

    try {
        let sendRawTransaction = await bchjs.RawTransactions.sendRawTransaction(tx);

    } catch (err) {
        console.error('Error in sendRawTransaction():', err)
        throw err
    }
    //  console.log(sendRawTransaction)

    // let seedBuffer = await bchjs.Mnemonic.toSeed(mnemonic);
    // const hdNodeSeed = bchjs.HDNode.fromSeed(seedBuffer);
    // const verify = bchjs.HDNode.verify(hdNodeSeed, pk1, sig1);
    // console.log(newTx1.transaction.tx.ins);
    // console.log(newTx1.transaction.inputs);



    // newTx1.transaction.inputs.signatures = sig1
    // console.log(newTx1.transaction.inputs.signatures);
    // console.log(newTx1.transaction.tx.ins);
    // console.log(newTx1.transaction.tx.outs);
    // console.log(newTx1);
}
makeTx()