import roles from "../../utilis/roles.js";

const couponRolesEndPoints = {
  create: [roles.Admin],
  update: [roles.Admin],
};
export default couponRolesEndPoints;
