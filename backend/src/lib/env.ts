import "dotenv/config"

export const ENV = {
 
  PORT:process.env.PORT,
  JWT_SECRET:process.env.JWT_SECRET,
  NODE_ENV:process.env.NODE_ENV,
  HOST:process.env.HOST,
  ARCJET_KEY:process.env.ARCJET_KEY,
  ARCJET_MODE:process.env.ARCJET_MODE


}