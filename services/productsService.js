import { executeQuery } from "../database/database.js";

const create = async (name) => {
  await executeQuery(
    "INSERT INTO orders (product_name) \
    VALUES ($name);",
    { name: name }
  );
};

const deleteById = async (id) => {
  await executeQuery("DELETE FROM orders \
    WHERE order_id = $id;", 
    { id: id, }
  );
};

const findAll = async () => {
  let result = await executeQuery("SELECT * FROM orders;");
  return result.rows;
};

const findByNameOrIdLike = async (nameOrId) => {
  const likePart = `%${nameOrId}%`;

  let result = await executeQuery(
    "SELECT * FROM orders WHERE product_name \
    ILIKE $nameLike OR order_id ILIKE $idLike;",
    { nameLike: likePart, idLike: likePart }
  );

  return result.rows;
};

export { create, deleteById, findAll, findByNameOrIdLike };