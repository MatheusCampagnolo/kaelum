function start(server, port, callback) {
  server.listen(port, () => {
    if (callback) callback();
    else console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = start;