import csrf from 'csurf';
import { Express } from 'express';

export const setupCSRF = (app: Express) => {
  app.use(csrf({ cookie: true }));
  app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  });
};