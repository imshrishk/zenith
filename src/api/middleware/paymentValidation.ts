import { Request, Response, NextFunction } from 'express';

export const validatePaymentRequest = (req: Request, res: Response, next: NextFunction) => {
  const { amount, currency, receipt } = req.body;

  if (!amount || amount < 100 || amount > 1000000) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  if (!currency || !['INR', 'USD'].includes(currency)) {
    return res.status(400).json({ error: 'Invalid currency' });
  }

  if (!receipt || !receipt.match(/^receipt_[0-9]+$/)) {
    return res.status(400).json({ error: 'Invalid receipt format' });
  }

  next();
};