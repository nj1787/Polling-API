import express from "express";

const server = express();

const port = 6300;

server.listen(port, (err) => {
  if (err) {
    console.log("Error While Starting Server");
    return;
  }
  console.log(`Server Running On Port ${port}`);
});
