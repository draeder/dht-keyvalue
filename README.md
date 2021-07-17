# dht-keyvalue
Store key-value pairs on the mainline bittorrent DHT network, and retreive them by key lookup.

This is a work in progress. This version is a minimal viable iteration of this project.

It takes a little bit of time (seconds) to announce to DHT and retrieve the values.

It probably should not be used in production at this time. More work is required for handling updates to the DHT objects. Improvements to usability and security are also needed.

# Install

```js
npm i dht-keyvalue
```

# Usage
```js
const dhtKv = require('dht-keyvalue')

let opts = {
 keep: true, // default = true. Keep the DHT object alive in the mainline bittorrent network
 keepalive: 3600000 // default = 3600000. Interval to refresh the DHT object (milliseconds)
}

const dkv = new dhtKv(opts)
```

## Examples
### Put, get, update one record on DHT
```js
let item = [
 { key: 'my cool key', value: 'my cool key initial value' }
]

dkv.put(item, (hash, key) => {
 console.log('Successfully announced:', key, 'DHT address:', hash)

 // Now that it is announced, retrieve it from DHT
 dkv.get(item[0].key, value => {
  console.log(value)
 })

 // Update the key's value in DHT
 let newValue = 'Updated value for my cool key'
 dkv.update(item[0].key, newValue, updated => {
  console.log('Updated in DHT', updated)

  // Retrieve the updated value
  dkv.get(item[0].key, value => {
   console.log(value)
  })
 })
})
```
### Put, get, update multiple records on DHT
```js
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
```
