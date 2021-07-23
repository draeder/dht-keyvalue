module.exports = DhtKv

const _ = require('lodash')
const DHT = require('bittorrent-dht')
const ed = require('bittorrent-dht-sodium')
const dht = new DHT

function DhtKv(options){
 let that = this

 let keep = options.keep || true
 let keepalive = options.keepalive || 3600000

 let keyTable = []

 this.put = (items, cb) => {

  for(item in items){

   let found = keyTable.find(function(el){ return el.key === items[item].key })

   if(found === undefined){
    keyTable.push({key: items[item].key, keypair: ed.keygen()})
   } else {
    let err = `Error: A key with that name already exists. Not adding again: ${items[item].key}`
    return cb(err)
   }

   let value = Buffer.from(JSON.stringify(items[item]))

   if(value.length > 1000){
    let err = `Error: value too long for key '${items[item].key}'`
    return console.error(err)
   }

   for(key in keyTable){
    if(keyTable[key].key === items[item].key)
    put(key, value)
   }

   function put(item, value){
    let pk = keyTable[item].keypair.pk
    let sk = keyTable[item].keypair.sk

    const opts = {
     k: pk,
     seq: 0,
     v: value,
     sign: function (buf) {
      return ed.sign(buf, sk)
     }
    }
 
    dht.put(opts, function (err, hash) {
     if(err) console.error('Error:', err)
     hash = hash.toString('hex')
     
     keyTable[item].hash = hash
     keyTable[item].seq = opts.seq
 
     let key = JSON.parse(opts.v.toString()).key

     cb(err, hash, key)
 
     if(keep === true){
      setInterval(()=>{
       that.refresh(hash)
      }, keepalive)
     }
    })

    hash = undefined
   }

  }
  items.length = 0
 }

 this.refresh = key => {
  const dht = new DHT({ verify: ed.verify })
  dht.put(key, function (err, hash) {
   // refreshed
  })
 }

 this.get = (key, cb) => {

  for(item in keyTable){
   if(keyTable[item].key === key){
    const dht = new DHT({ verify: ed.verify })

    dht.get(keyTable[item].hash, function (err, res) {
     if(err) console.log('Error:', err)
     if(res == null) return that.get(key, cb)
     cb(null, res.v.toString())
    })

   }
  }
 }

 this.update = (name, data, cb) => {

  for(item in keyTable){
   if(keyTable[item].key === name){

    let seq = keyTable[item].seq
    seq = ++seq

    keyTable[item].seq = seq

    let text = JSON.stringify({key: name, value: data})

    let value = Buffer.from(text)

    let keypair = keyTable[item].keypair

    const opts = {
     k: keypair.pk,
     seq: seq,
     v: value,
     sign: function (buf) {
      return ed.sign(buf, keypair.sk)
     }
    }

    let key = keyTable[item].hash
    dht.get(key, function (err, res) {
     if(err) console.error('Error:', err)

     dht.put(opts, function (err, hash) {
      if(err) console.error('Error:', err)
      let key = hash.toString('hex')
      cb(true)
     })

    })
   }
  }
 }
}