export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.write('User-agent: *\n');
  res.write('Disallow:\n');
  res.end();
}
