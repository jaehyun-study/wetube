import app from "./app.js";

const port = 4000;

const handleListening = () =>
  console.log(`Listening on: http://localhost:${port}`);

app.listen(port, handleListening);
