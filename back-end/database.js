import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
const DbUrl = 'mongodb://127.0.0.1:27017/dbMEVN-proyect';

mongoose.connect(DbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(db => console.log('DB connected'))
    .catch(err => console.log(err))
