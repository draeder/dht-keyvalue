# dht-keyvalue
Store key-value pairs on the mainline bittorrent DHT network, and retreive/update them by key name.

##
Most available DHT libraries focus on connecting peers together. What if you don't want to connect peers together with DHT, or you already have peers connected and just want to store/retrieve arbitrary data instead? That's where dht-keyvalue comes in. 

dht-keyvalue allows you to put, get and update key-value pairs by key name on the mainline bittorrent DHT network. A simple browser implementation using an express server backend is also available [here](https://github.com/draeder/dht-keyvalue-browser).

### Install
```js
npm i dht-keyvalue
```

Any datatype can be stored (objects, numbers, functions). The maximum record size is 1000 Bytes; larger will be rejected (this is a limitation of the mainline bittorrent DHT).

Puts, gets and updates on DHT take some time (seconds). If speed is a factor for your application, DHT is probably not right for you.

An internal hash table of the key names and DHT hash addresses is maintained to allow for key name lookups and updates. That hash table includes the keypair and sequence number needed to make mutable updates to extant records on the DHT. A future version will separate the keypair and sequence data. 

That way, a clean hash table can be exposed, so if it is shared with peers, peers can also perform DHT lookups by key without leaking the sensitive data about the records. Another consideration for a future version is to provide built in JWT tokens to allow approved peers to make mutable updates to extant DHT objects.

Data put to the DHT is stored in plain text. Anyone with the hash address for the record can potentially retrieve and view the data. Consider encorporating your own encryption solution on top of dht-kevalue to protect the data, if required.

A future version will allow for expiring (deleting) individual records.

### Usage
```js
const dhtKv = require('dht-keyvalue')

let opts = {
 keep: true, // default = true. Keep the DHT object alive in the mainline bittorrent network
 keepalive: 3600000 // default = 3600000. Interval to refresh the DHT object (milliseconds)
}

const dkv = new dhtKv(opts)
```

#### One record
```js
let items = [
 { key: 'my cool key', value: 'my cool key\'s value' }
]
```
#### Multiple records
```js
let items = [
 { key: "first key", value: "first initial value" }, 
 { key: "second key", value: "second initial value" },
 //...
]
```
### Example
```js
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
  console.log(`Update successful (${updated}) for key, ${key}. New value: ${newValue}`)

  // Retrieve the updated value
  dkv.get(key, (err, value) => {
   console.log(`Get successful for updated ${key}: ${value}`)
  })
 })
 
 // Retrieve the value by hash instead of by key
 dkv.getHash(hash, (err, value) => {
  if(err) console.log(err)
  console.log(value)
 })
})
```

## API
### `dkv.put([items], [callback: (err, hash, key)])`
Put a record or multiple records on DHT. `items` is an array of items with the following structure:

```js
[ { key: 'keyname', value: 'value' }, { ... }, { ... } ]
```

`callback` returns the DHT `hash` of the announced item and its `key` name. You could use this to share a publicly facing hash table for peers or other purposes. `err` will fire if a key with the same name has already been announced.

#### Example
```js
dkv.put(items, (err, hash, key) => {
 if(err) return console.log(err)
 console.log(`Successfully announced: ${key}, DHT address: ${hash}`)
})
```

Once it has been successfully announced, you can look it up with `dkv.get()`, or update it with `dkv.update()`.

### `dkv.get(key, [callback: (err, value)])`
Get an item stored on DHT by `key`. `callback` returns the item's `key` name and the DHT object's `value`.

#### Example
```js
dkv.get(key, (err, value) => {
 if(err) return console.log(err)
 console.log(`Get successful for key, ${key}: ${value}`)
})
```

A future version will allow for retreiving multiple keys at once.

### `dkv.update(key, newValue, [callback: (updated)])`
Update an item in DHT by key name. `callback` returns `true` when the update on DHT was successful.

#### Example
```js
dkv.update(key, newValue, updated => {
 console.log(`Upddate successful (${updated}) for key, ${key}. New value: ${newValue}`)
})
```

A future version will allow for updating the `key` itself, along with updating multiple keys at once.

### `dkv.getHash(hash, [callback: (err, value)])`
Get an item stored on DHT by the `hash` address of the DHT record. `callback` returns the item's `key` name and the DHT object's `value`.

#### Example
```js
dkv.getHash(hash, (err, value) => {
 if(err) console.log(err)
 console.log(value)
})
```

