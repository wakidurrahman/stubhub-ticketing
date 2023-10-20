import mongoose from 'mongoose';
import app from './app';
const port = process.env.PORT;

const start = async () => {
  try {
    {
      /* ↓↓↓ Mongoose Connect For Local Kubernetes*/
    }
    // await mongoose.connect('mongodb://auth-mongo-clusterip-service:27017/auth');
    
    {
      /* ↓↓↓ Mongoose Connect For Local Environment*/
    }
    if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.MONGO_URI_LOCAL) {
      throw new Error('MONGO_URI must be defined');
    }
    await mongoose.connect(process.env.MONGO_URI_LOCAL);
    console.log('Connected to MongoDb successful');
  } catch (error) {
    console.error(error);
  }

  {
    /* ↓↓↓ Server start */
  }
  app.listen(port, () => {
    console.log(`Auth app listening on port ${port}`);
  });
};

start();
