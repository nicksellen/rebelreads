import axios from "axios";

import { table } from "table";

async function run(query = "") {
  const res = await axios(
    "https://inventaire.io/api/items?action=by-users&users=0a4870b4f7e1df9380cfa27e2af106e3&limit=1000"
  );
  const entries = res.data.items
    .map((item) => {
      return [
        item.snapshot["entity:title"] || "",
        item.snapshot["entity:authors"] || "",
        item.busy ? "out" : "available",
      ];
    })
    .filter((entry) => {
      if (!query) return true;
      return Object.values(entry)
        .filter((value) => value)
        .some((value) => value.toLowerCase().includes(query.toLowerCase()));
    });
  if (entries.length === 0) {
    console.log("no matching entries");
    return;
  }
  const config = {
    columns: {
      0: { width: 40 },
      1: { width: 40 },
    },
  };
  console.log(table(entries, config));
}

const args = process.argv.slice(2);

run(args[0]);
