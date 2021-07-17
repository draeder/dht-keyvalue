# dht-kv
Store key-value pairs on the mainline bittorrent DHT network, and retreive them by key lookup.

This is a work in progress. This version is a minimal viable iteration of this project.

It takes a little bit of time (seconds) to announce to DHT and retrieve the values.

It probably should not be used in production at this time. More work is required for handling updates to the DHT objects. Improvements to usability and security are also needed.

# Install

```js
npm i dht-keyvalue
```

# Usage
## Example

```js
const dhtKv = require('dht-kv')

let opts = {
 keep: true, // default = true. Keep the DHT object alive in the mainline bittorrent network
 keepalive: 3600000 // default = 3600000. Interval to refresh the DHT object (milliseconds)
}

const dkv = new dhtKv(opts)

let items = [{key: "first key", value: "first value"}, {key: "second key", value: "second value"}]

// log any errors
dkv.on('error', err => {
 console.log(err)
})

// Store the key/value pair(s) on DHT
dkv.put(items)

// Handle responses and do work
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
```
