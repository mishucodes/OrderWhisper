const {createHmac, randomBytes} = require("crypto");
const {Schema, model} = require("mongoose");

const businessScehema = new Schema(
    {
        ownerName: {type: String, required: true},
        businessName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        salt: {type: String},
        password: {type: String, required: true},
        businessIconURL: {type: String, default: "/images/defaultProfilePic.jpg"},
    }, {timestamps: true});


businessScehema.pre("save", function()
    {
        if(!this.isModified("password")) return;
        let salt = randomBytes(16).toString();
        let hashedPassword = createHmac("sha256", salt).update(this.password).digest("hex");
        this.salt = salt;
        this.password = hashedPassword;
        return;
    });


const Business = model("business", businessScehema);
module.exports = Business;