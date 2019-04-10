const express           = require('express')
const app               = express()
const MemcacheClient    = require("memcache-client");
const expect            = require("chai").expect;

/*
A bailout should occur within 5s (configurable)
Bailouts should ensure the connection is not reused/verified until at least 5m (configurable) after.
Validated in both stg0 and stg1
*/

const port              = 3000
const multiServerOptions = {
    server: {
      servers: [
        {
          server: "localhost:5000",
          maxConnections: 3
        },
        {
          server: "localhost:5001",
          maxConnections: 3
        },
        {
          server: "localhost:5002",
          maxConnections: 3
        }
      ],
      config: {
        retryFailedServerInterval: 1000, // milliseconds - how often to check failed servers
        failedServerOutTime: 30000, // (ms) how long a failed server should be out before retrying it
        keepLastServer: false
      }
    }
  }

const singleServerOptions = {
    server: { 
      server: 'localhost:5000', 
      maxConnections: 5,
      dangleSocketWaitTimeout: 5 * 60 * 1000, // time to wait for events on dangle socket
    }
    //ignoreNotStored: true, // ignore NOT_STORED response
    //lifetime: 100, // TTL 100 seconds
    //cmdTimeout: 3000, // command timeout in milliseconds
    //connectTimeout: 8000, // connect to server timeout in ms
    //compressor: require("custom-compressor"),
    //logger: require("./custom-logger")
  };

app.get('/', (req, res) => {
    res.send('Memcached Benchmark');
});

app.get('/stats', (reg, res) => {
    const client = new MemcacheClient(multiServerOptions);

    client.cmd("stats").then((r) => { 
        let html = 
            '<ul>' + 
            r.STAT.map( x => `<li>${x[0]}<ul><li>${x[1]}</li></ul></li>` ) +
            '</ul>';
        
        res.send( html );
    });
})

app.get('/store-and-fetch', (req, res) => {
    const client = new MemcacheClient(multiServerOptions);
    const cacheData = `data : ${Date.now()}`;
    
    client.set("key", cacheData).then( (r) => {
      expect(r).to.deep.equal(["STORED"]);

      client.get("key").then( (data) => {
        expect(data.value).to.equal(cacheData);
        res.send(data.value);
      });
    });
});

app.listen(port, () => console.log(`port ${port}`))


// create a normal client


