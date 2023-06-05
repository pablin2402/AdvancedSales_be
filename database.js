const mongoose = require("mongoose");
const URI =
  "mongodb+srv://pablo:PpR2402174064@cluster0.q40rfxx.mongodb.net/API?retryWrites=true&w=majority";
mongoose.set("strictQuery", false);

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log("Base de datos conectada"))
  .catch((err) => console.log(err));

module.exports = mongoose;
