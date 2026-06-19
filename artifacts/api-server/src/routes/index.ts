import { Router, type IRouter } from "express";
import authRouter from "./auth";
import appointmentsRouter from "./appointments";
import healthRouter from "./health";
import providerApplicationsRouter from "./provider-applications";
import usersRouter from "./users";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(providerApplicationsRouter);
router.use(appointmentsRouter);

export default router;
