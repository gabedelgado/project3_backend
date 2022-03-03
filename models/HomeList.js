const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const homeListSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    savedHomes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Home_List = model("Home_List", homeListSchema);

module.exports = Home_List;
