const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const listingSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip_code: {
    type: String,
    required: true,
  },
  state_code: {
    type: String,
    required: true,
  },
  neighborhood_name: {
    type: String,
  },
  county_name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: String,
    required: true,
  },
  propery_id_api: {
    type: String,
    required: true,
  },
  sqft: {
    type: Number,
    required: true,
  },
  lot_sqft: {
    type: Number,
  },
  property_type: {
    type: String,
    required: true,
  },
  mls: {
    type: String,
  },
  listing_id_api: {
    type: String,
    required: true,
  },
  new_construction: {
    type: Boolean,
    required: true,
  },
  image_link: {
    type: String,
  },
  virtual_tour_link: {
    type: String,
  },
});

const Listing = model("Listing", listingSchema);

module.exports = Listing;