import { adminHandler } from "../../src/server/calendarAuth.js";
export default (req: any, res: any) => adminHandler(req, res, "logout");
