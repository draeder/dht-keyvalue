const dhtKv = require('./server')

let opts = {
 keep: true, // default = true. Keep the DHT object alive in the mainline bittorrent network
 keepalive: 3600000 // default = 3600000. Time to refresh the DHT object
}

const dkv = new dhtKv(opts)

// Put one item in DHT
let item = [
 { key: 'my cool key', value: 'my cool key initial value' }
]

dkv.put(item, (hash, key) => {
 console.log('Successfully announced:', key, 'DHT address:', hash)

 // Now that it is announced, retrieve it from DHT
 dkv.get(key, value => {
  console.log(value)
 })

 // Update the key's value in DHT
 let newValue = 'Updated value for my cool key'
 dkv.update(key, newValue, updated => {
  console.log('Updated in DHT', updated)

  // Retrieve the updated value
  dkv.get(key, value => {
   console.log(value)
  })
 })
})

// Put multiple items in DHT
let items = [
 { key: "first key", value: "first value" }, 
 { key: "second key", value: "second value" },
 //...
]

dkv.put(items, (hash, key) => {
 console.log('Successfully announced:', key, 'DHT address:', hash)

 // Now that it is announced, retrieve it from DHT
 dkv.get(key, value => {
  console.log(value)
 })

 // Update the key's value in DHT
 let newValue = Math.random() // some updated value
 dkv.update(key, newValue, updated => {
  console.log('Updated in DHT', updated)

  // Retrieve the updated value
  dkv.get(key, value => {
   console.log(value)
  })
 })
})