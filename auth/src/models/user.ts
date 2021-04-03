const mongoose = require('mongoose');
import {Password} from '../services/password';

interface UserAttrs {
    email: string;
    password: string;

}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc,ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

// why not use arrow function is because we want to use this of the mongoose but
// arrow functions this will be the context of this file ie user.ts
userSchema.pre('save', async function (done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

const User  = mongoose.model('User',userSchema);

const buildUser = (attrs: UserAttrs) => {
    return new User(attrs);
};

export { User, buildUser };