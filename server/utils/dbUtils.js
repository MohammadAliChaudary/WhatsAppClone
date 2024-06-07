const db = require("../config/dbConfig");

const checkForDuplicateUser = (columnName, value) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM user WHERE ${columnName} = ?`;
    db.query(query, value, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result.length > 0);
      }
    });
  });
};

const getUser = (columnName, value) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM user WHERE ${columnName} = ?`;
    db.query(query, [value], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
};

const updateRefreshToken = (token, id) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE user SET token = ? WHERE id = ?";
    db.query(query, [token, id], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve("success");
      }
    });
  });
};

const checkForDuplicateCartProduct = (user_id, product_id) => {
  return new Promise((resolve, reject) => {
    const status = "Due";
    const query =
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND status = ?";
    db.query(query, [user_id, product_id, status], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.length > 0);
      }
    });
  });
};

const getTotalQuantity = (product_id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT quantity FROM product WHERE product_id = ?";
    db.query(query, product_id, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
};

const getQuantityInCart = (product_id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT quantity FROM cart WHERE product_id = ?";
    db.query(query, product_id, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
};

const getProductId = (user_id) => {
  return new Promise((resolve, reject) => {
    const getYourProductIdQuery =
      "SELECT product_id FROM product WHERE user_id = ?";
    db.query(getYourProductIdQuery, [user_id], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
};

const getCartData = (product_id) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT product_name ,quantity,status,user_id FROM cart WHERE product_id = ?";
    db.query(query, [product_id], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
};

const getCustomerInfo = (user_id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT user_name,email FROM user WHERE user_id = ?";
    db.query(query, [user_id], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
};

const checkCartTable = (id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM cart WHERE product_id = ?";
    db.query(query, [id], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
};

const getSingleUserProducts = (id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM product WHERE user_id = ?";
    db.query(query, [id], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
};

const getMessage = (columnName, value) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM messages WHERE ${columnName} = ?`;
    db.query(query, value, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
};

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM user";
    db.query(query, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
};

const createConversation = (values) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO conversation (`user_id`,`receiver_id`) values(?,?)";
    db.query(query, values, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve({ result: result, message: "success" });
      }
    });
  });
};

const storingMessagesInDB = (values) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO messages (`conversation_id`,`sender_id`,`message`,date) values(?,?,?,?)";
    db.query(query, values, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
};

const getConversation = (value) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM conversation WHERE user_id = ? OR receiver_id = ?";
    db.query(query, [value, value], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
};

const getfilteredUsers = (value) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM user WHERE id != ?";
    db.query(query, [value], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
};

const //
  checkForConversation = (values) => {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM conversation WHERE (user_id = ? AND receiver_id = ?) OR (user_id = ? AND receiver_id = ?)";
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });
  };

const updateMessage = (message, id, time) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE messages SET message = ? , date = ? WHERE _id = ?";
    db.query(query, [message, time, id], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve("success");
      }
    });
  });
};

const deleteMessage = (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM messages WHERE _id = ?";
    db.query(query, [id], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve("success");
      }
    });
  });
};

module.exports = {
  deleteMessage,
  updateMessage,
  checkForConversation,
  getfilteredUsers,
  getConversation,
  storingMessagesInDB,
  createConversation,
  getAllUsers,
  getMessage,
  checkForDuplicateUser,
  getUser,
  updateRefreshToken,
  checkForDuplicateCartProduct,
  getTotalQuantity,
  getQuantityInCart,
  getProductId,
  getCartData,
  getCustomerInfo,
  checkCartTable,
  getSingleUserProducts,
};
