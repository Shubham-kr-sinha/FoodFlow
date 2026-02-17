const http = require('http');

console.log('Benchmarking http://localhost:5000/api/restaurants ...');

const start = performance.now();

const req = http.get('http://localhost:5000/api/restaurants', (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        const end = performance.now();
        console.log(`Response Time: ${(end - start).toFixed(2)} ms`);
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Data Length: ${data.length} chars`);
    });
});

req.on('error', (err) => {
    console.error('Error:', err.message);
});

req.end();
