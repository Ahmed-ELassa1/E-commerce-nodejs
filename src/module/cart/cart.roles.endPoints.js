import roles from "../../utilis/roles.js";

const cartRolesEndPoints = {
  addToCart: [roles.User],
  removeProductFromCart: [roles.Admin],
  removeCart: [roles.User],
};
export default cartRolesEndPoints;
