import { Router } from 'express';
import { UsersController } from '../controller/UsersController';
import { authMiddleware } from '../../../middleware/authMiddleware';

const userRouter = Router();
const usersController = new UsersController();

userRouter.post('/', authMiddleware, async (req, res, next) =>
  usersController.create(req, res, next).then(() => next()),
);

userRouter.get('/:id', authMiddleware, async (req, res, next) =>
  usersController.getUserById(req, res, next).then(() => next()),
);

userRouter.post('/session', async (req, res, next) =>
  usersController.createSession(req, res, next).then(() => next()),
);

userRouter.post('/testando-danger', authMiddleware, async (req, res, next) =>
  usersController.testandoDanger(req, res, next).then(() => next()),
);

export default userRouter;
