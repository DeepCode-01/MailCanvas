import app from "./app.js"; 
import { config } from 'dotenv';

config({ path: './config/config.env' });

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server is running on http://localhost:${process.env.PORT}`)
);
