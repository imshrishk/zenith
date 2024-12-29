import { Request, Response, NextFunction } from 'express';

export const validatePaymentRequest = (req: Request, res: Response, next: NextFunction) => {
  const { amount, currency, receipt } = req.body;
  
  if (!amount || amount < 100) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  
  if (!currency || !['INR', 'USD'].includes(currency)) {
    return res.status(400).json({ error: 'Invalid currency' });
  }
  
  if (!receipt) {
    return res.status(400).json({ error: 'Receipt is required' });
  }
  
  next();
};