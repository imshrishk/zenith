import { Request, Response, NextFunction } from 'express';

export const validatePaymentRequest = (req: Request, res: Response, next: NextFunction) => {
  const { amount, currency, receipt } = req.body;
  
  // Standardized amount validation
  if (!amount || amount < 100 || amount > 1000000) {
    return res.status(400).json({ error: 'Amount must be between 100 and 1000000' });
  }
  
  // Strict currency validation
  if (!currency || !['INR', 'USD'].includes(currency.toUpperCase())) {
    return res.status(400).json({ error: 'Currency must be INR or USD' });
  }
  
  // Enhanced receipt validation
  if (!receipt || !receipt.match(/^receipt_[0-9]{13,}$/)) {
    return res.status(400).json({ error: 'Invalid receipt format' });
  }

  next();
};