//

import { Hono } from "hono";

//

export default new Hono().get(
  "/localhost:3000/*",
  function GET({ req, redirect }) {
    const uri = new URL(
      req.url.replace("/proxy/localhost:3000", ""),
      "http://localhost:3000/",
    );
    uri.hostname = "localhost";
    uri.port = "3000";
    return redirect(uri.toString());
  },
);
