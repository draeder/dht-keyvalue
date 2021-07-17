# dht-keyvalue
Store key-value pairs on the mainline bittorrent DHT network, and retreive/update them by key name.

## Status
This is a work in progress, but is minimally viable for use as of this revision.

## Notes
- All datatypes are accepted as keys and values (arrays, objects, integers, functions)
- Objects larger than 1000 Bytes will be rejected
- An internal hash table of key names and DHT hash addresses is maintained to allow for key name lookups
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

### `dkv.put([items], [callback])`
`items` is an array of items with the following structure:
```js
[ { key: 'keyname', value: 'value' }, { ... }, { ... } ]
```
`callback` returns the DHT `hash` of the announced item and its `key` name.

### `dkv.get(key, [callback])`
Lookup an item stored on DHT. `callback` returns the item's `key` name and `value`.

### `dkv.update(key, newValue, [callback])`
Update an item in DHT by key name. `callback` returns `true` when the update on DHT was successful.

A future release will allow for updating the `key` as well.

## Examples
### One record: put, get, update on DHT
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
### Multiple records: put, get, update on DHT
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
