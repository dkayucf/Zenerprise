import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import Promise from 'bluebird'

const connectToDB = () => {
  Promise.promisifyAll(mongoose)

  const clientP = mongoose
    .connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      keepAlive: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(m => m.connection.getClient())
    .catch(e => {
      console.error('Connection error', e.message)
    })

  mongoose.connection.once('open', () => console.log('MONGO DB CONNECTED'))
  mongoose.connection.on(
    'error',
    console.error.bind(console, 'MongoDB connection error:')
  )

  return MongoStore.create({
    clientPromise: clientP,
    collectionName: 'userSessions'
  })
}

export default connectToDB
