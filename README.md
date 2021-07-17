# dht-keyvalue
Store key-value pairs on the mainline bittorrent DHT network, and retreive them by key lookup.

## Status
This is a work in progress, but is minimally viable for use as of this revision.

## Notes
- A local hash table of key name and DHT hash address is maintained to allow for key name lookups
- Any value datatype is accepted
- dht-keyvalue will reject objects larger than 1000 Bytes
- Initial puts on DHT may take some time (seconds)
- Updates to existing records on DHT happen faster
- Data contained in the record is plain text. Anyone with the hash address for the record can retrieve and view the data 
- Consider encorporating your own encryption solution on top of dht-kevalue to protect the data

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
