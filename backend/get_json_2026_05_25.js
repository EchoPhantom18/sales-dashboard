import http from 'http';

http.get('http://localhost:3001/api/dashboard?date=2026-05-25', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Raw output:', data);
    }
  });
}).on('error', err => {
  console.error('HTTP Error:', err.message);
});
