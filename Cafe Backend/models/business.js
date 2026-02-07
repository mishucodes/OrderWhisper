const {createHmac, randomBytes} = require("crypto");
const {Schema, model} = require("mongoose");

const businessSchema = new Schema(
    {
        ownerName: {type: String, required: true},
        businessName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        salt: {type: String},
        password: {type: String, required: true},
        businessIconURL: {type: String, default: "/images/defaultProfilePic.jpg"},
        verificationToken: {type: String, required: true, unique: true, index: true},
        verified: {type: Boolean, default: false},
        expiresAt: {type: Date, default: Date.now, index: {expires: 600}},
    }, {timestamps: true});


businessSchema.pre("save", function()
    {
        if(!this.isModified("password")) return;
        let salt = randomBytes(16).toString("hex");
        let hashedPassword = createHmac("sha256", salt).update(this.password).digest("hex");
        this.salt = salt;
        this.password = hashedPassword;
        return;
    });


const Business = model("business", businessSchema);
module.exports = Business;