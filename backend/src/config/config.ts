import { ENV } from "../lib/env.js";

const secret = ENV.JWT_SECRET || "mysecret" ;

export default secret