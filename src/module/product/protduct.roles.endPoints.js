import roles from "../../utilis/roles.js";

const productRolesEndPoints = {
  create: [roles.Admin],
  update: [roles.Admin],
};
export default productRolesEndPoints;
