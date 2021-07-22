const dhtKv = require('./server')

let opts = {
 keep: true, // default = true. Keep the DHT object alive in the mainline bittorrent network
 keepalive: 3600000 // default = 3600000. Time to refresh the DHT object
}

const dkv = new dhtKv(opts)

let items = [
 { key: "first key", value: "first key value" }, 
 { key: "second key", value: "second key value" },
 //...
]

// Put items in DHT
dkv.put(items, (err, hash, key) => {
 if(err) console.log(err)
 console.log(`Successfully announced: ${key}, DHT address: ${hash}`)

 // Now that it is announced, retrieve it from DHT
 dkv.get(key, (err, value) => {
  console.log(`Get successful for key, ${key}: ${value}`)
 })

 // Update the key's value in DHT
 let newValue = Math.random() // some updated value

 dkv.update(key, newValue, updated => {
  console.log(`Upddate successful (${updated}) for key, ${key}. New value: ${newValue}`)

  // Retrieve the updated value
  dkv.get(key, (err, value) => {
   console.log(`Updated ${key}: ${value}`)
  })

 })
 
})