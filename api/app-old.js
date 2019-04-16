const express           = require('express')
const app               = express()
const MemcacheClient    = require("memcache-client");

const newServerOptions = {
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
    ]
  }
}

const port              = 3001
const client            = new MemcacheClient(newServerOptions);

app.get('/', async (req, res) => {
    res.send('Memcached Benchmark');
});

app.get('/stats', async (reg, res) => {
    try { 
      const r = await client.cmd("stats");
      const html = 
        '<ul>' + 
        r.STAT.map( x => `<li>${x[0]}<ul><li>${x[1]}</li></ul></li>` ) +
        '</ul>';
        
      res.send( html );
    } catch ( ex ) {
      console.error( ex );
    }
})

app.get('/store-and-fetch', async (req, res) => {
  try {
    const cacheData = `data : ${Date.now()}`;
    const key = `${Date.now()}`;

    const setResult = await client.set(key, cacheData);
    const getResult = await client.get(key);

    res.send( 
      {
        setResult: setResult, 
        getResult: getResult
      } );

  } catch( ex ) {
    console.error( ex );
  }
});

app.listen(port, () => console.log(`port ${port}`))


// create a normal client


