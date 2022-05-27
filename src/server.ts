import express, { Request, Response } from "express";

const app = express();

app.get("/", (request: Request, response: Response) => {
  return response.json({
    hello: "world",
  });
});

app.listen(3333, () => console.log("Server is running on PORT 3333"));
