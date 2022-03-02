const axios = require("axios");
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjFmYTVjZDFhNGRhNjk0ZmE1MDA3N2EiLCJ1c2VybmFtZSI6InRodW5kZXJjaHVua3kyMiIsImlhdCI6MTY0NjI0MTIyOSwiZXhwIjoxNjQ2MjYyODI5fQ.XvPkECwFuBW9M5lSYK6vLj5sv4oDTWtf-Jxxc-LGMtE";
axios
  .get("http://localhost:5005/api/auth/loggedin", {
    headers: { authorization: `Bearer ${token}` },
  })
  .then((results) => {
    console.log(results);
  });
