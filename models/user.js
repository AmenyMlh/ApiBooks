var mongoose = require('mongoose');
const opts = { toObject: { virtuals: true },toJSON: { virtuals: true } };
const uniqueValidator = require('mongoose-unique-validator')

var userSchema = mongoose.Schema({
    firstName : {type : String,required : true},
    lastName : {type : String,required : true},
    role: {
        type: String,
        enum: ['admin', 'user'], // Liste enum des rôles valides
        default: 'user' // Valeur par défaut si le champ role n'est pas spécifié
    },
    email : {type: String, required: true, unique : true},
    password: {type : String, required: true},
    
}, opts)

userSchema.virtual('name').get(function () {
    return this.firstName + ' ' + this.lastName;
});

userSchema.methods.toPublic = function () {
    const userObject = this.toObject();
    // const userObject = this
    delete userObject.password; 
    // userObject.publicName = userObject.name; 
    console.log(userObject.name)
    return userObject;
}

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema);