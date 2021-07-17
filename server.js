module.exports = DhtKv

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
   let text = JSON.stringify(items[item])
   let name = items[item].key

   const keypair = ed.keygen()
   value = Buffer.from(text)
   if(value.length > 1000){
    let err = `Error: value too long for key '${items[item].key}'`
    that.emit('error', err)
   }
   const opts = {
    k: keypair.pk,
    seq: 0,
    v: value,
    sign: function (buf) {
     return ed.sign(buf, keypair.sk)
    }
   }

   dht.put(opts, function (err, hash) {
    if(err) console.error('Error:', err)
    let key = hash.toString('hex')
    
    text = JSON.parse(text)
    keyTable.push({key: name, hash: key, keypair, seq: opts.seq})

    cb(key, name)
    //that.emit(name, key)
    
    if(keep === true){
     setInterval(()=>{
      that.refresh(key)
     }, keepalive)
    }
   })
  }
 }

 /*
 this.get = key => {
  const dht = new DHT({ verify: ed.verify })

  dht.get(key, function (err, res) {
   if(err) console.log('Error:', err)
   that.emit(key, JSON.parse(res.v.toString()))
  })

 }
 */

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
     cb(res.v.toString())
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
      //that.emit(key, JSON.parse(text))
      cb(true)
     })

    })
   }
  }
 }
}