import roles from "../../utilis/roles.js";

const orderRolesEndPoints = {
  createOrder: [roles.User],
  cancelOrder: [roles.User],
  deliverdOrder: [roles.Admin],
};
export default orderRolesEndPoints;
