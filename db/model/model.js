// const db = require("../data/development-data/index.js");

// exports.fetchTopics =

//  ------------

// exports.fetchTreasures = (sortby = "age", order = "asc", query) => {

//   let query = `SELECT treasures.treasure_id, treasures.treasure_name, treasures.colour, treasures.age, treasures.cost_at_auction, shops.shop_name FROM treasures JOIN shops ON treasures.shop_id = shops.shop_id WHERE colour = $1 ORDER BY ${columnNames[sortby]} ${columnNames[order]};`;

//   return db.query(queryMain, [Object.values(query)[0]]).then(({ rows }) => {
//     //console.log(rows);
//     return rows;
//   });
// };
