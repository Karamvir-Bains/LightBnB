/// Users
const db = require("./db");
/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  let queryParams = [email];
  let queryString = `SELECT * FROM users WHERE email = $1`;
  return db.query(queryString, queryParams)
    .then((result) => result.rows ? result.rows[0] : null)
    .catch((err) => console.log(err.message));
};
exports.getUserWithEmail = getUserWithEmail;


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  let queryParams = [id];
  let queryString = `SELECT * FROM users WHERE id = $1`;
  return db.query(queryString, queryParams)
    .then((result) => result.rows ? result.rows[0] : null)
    .catch((err) => console.log(err.message));
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  let queryParams = [user.name, user.email, user.password];
  let queryString = `
  INSERT INTO users(name, email, password)
  VALUES($1, $2, $3)
  RETURNING *;`;
  return db.query(queryString, queryParams)
    .then((result) => result.rows[0])
    .catch((err) => console.log(err.message));
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  let queryParams = [guest_id, limit];
  let queryString = `
  SELECT reservations.*, properties.*
  FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  WHERE guest_id = $1
  LIMIT $2;`;
  return db.query(queryString, queryParams)
    .then((result) => result.rows)
    .catch((err) => console.log(err.message));
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function (options, limit = 10) {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  const clause = () => queryParams.length < 1 ? 'WHERE' : 'AND';

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `${clause()} city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `${clause()} owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    const minPrice = options.minimum_price_per_night * 100;
    queryParams.push(`${minPrice}`);
    queryString += `${clause()} cost_per_night >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    const maxPrice = options.maximum_price_per_night * 100;
    queryParams.push(`${maxPrice}`);
    queryString += `${clause()} cost_per_night <= $${queryParams.length} `;
  }

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `${clause()} property_reviews.rating >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return db.query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => console.log(err.message));
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  let queryParams = [];
  let properties = [];
  let values = [];

  // Matching property keys with values
  for (const key in property) {
    const value = property[key];
    if (value) {
      properties.push(key);
      queryParams.push(value);
    }
  }
  for (const i in queryParams) {
    const count = Number(i) + 1;
    values.push(`$${count}`);
  }

  properties = properties.join(", ");
  values = values.join(", ");

  let queryString = `
  INSERT INTO properties(${properties})
  VALUES(${values})
  RETURNING *;`;

  return db.query(queryString, queryParams)
    .then((res) => res.rows[0])
    .catch((err) => console.log(err.message));
};
exports.addProperty = addProperty;