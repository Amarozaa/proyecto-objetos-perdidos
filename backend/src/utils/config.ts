import dotenv from "dotenv";
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

const PORT = process.env.PORT;
const HOST = process.env.HOST || "localhost";

const MONGODB_URI =
process.env.NODE_ENV === "test"
? process.env.TEST_MONGODB_URI
: process.env.MONGODB_URI;

const JWT_SECRET = process.env.JWT_SECRET || "my_secret"
const MONGODB_DBNAME = process.env.NODE_ENV === "test" ? process.env.TEST_MONGODB_DBNAME : process.env.MONGODB_DBNAME || "notesdb"

export default { JWT_SECRET, PORT, MONGODB_URI, HOST, MONGODB_DBNAME };
