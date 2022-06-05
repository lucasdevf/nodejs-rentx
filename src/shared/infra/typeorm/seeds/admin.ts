import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import createConnection from "../index";

async function create() {
  const connection = await createConnection("localhost");

  const id = uuidv4();
  const password = await hash("@admin", 8);

  (await connection).query(`
    INSERT INTO users (id, name, email, driver_license, password, is_admin, created_at)
    VALUES ('${id}', 'admin', 'admin@gmail.com', 'xxxxx', '${password}', true, 'now()')
  `);
}

create().then(() => console.log("User admin created!"));
