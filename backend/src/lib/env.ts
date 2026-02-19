import "dotenv/config"

export const ENV = {
 
  PORT:process.env.PORT,
  JWT_SECRET:process.env.JWT_SECRET,
  NODE_ENV:process.env.NODE_ENV


}