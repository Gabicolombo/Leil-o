import mongoose from 'mongoose';

export default async () => {
    try {
      const url = "mongodb://localhost/leilao";
      await mongoose.connect(url);
      console.log('Connected to database.')
    } catch(error) {
      console.log(error)
    }
}