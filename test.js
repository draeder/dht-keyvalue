const dhtKv = require('./server')

let opts = {
 keep: true, // default = true. Keep the DHT object alive in the mainline bittorrent network
 keepalive: 3600000 // default = 3600000. Time to refresh the DHT object
}

const dkv = new dhtKv(opts)

let items = [
 {key: "first key", value: "first value"}, 
 {key: "second key", value: "second value"}
]

// log any errors
dkv.on('error', err => {
 console.log(err)
})

// Store the key/value pair(s) on DHT
dkv.put(items)

for(item in items){
 let key = items[item].key

 dkv.on(key, hash => {

  // Lookup the key
  dkv.lookup(key)
 
  // Found the key 
  dkv.on(hash, value => {
   console.log(value)
 
   // Update the key value
   let updated = Math.random()
   dkv.update(key, updated)
  })
 
 })
}