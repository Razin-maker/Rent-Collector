const express = require('express');
const router = express.Router();

module.exports = (supabase) => {
  // Get all payments
  router.get('/', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          bills (
            id,
            month,
            total,
            shopid,
            shops (
              id,
              shopnumber,
              tenantname,
              phone,
              rent
            )
          )
        `);
        
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get payments by bill
  router.get('/bill/:billId', async (req, res) => {
    try {
      const { billId } = req.params;
      
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          bills (
            id,
            month,
            total,
            shops (
              id,
              shopnumber,
              tenantname,
              phone,
              rent
            )
          )
        `)
        .eq('billid', billId);
        
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get payments by shop
  router.get('/shop/:shopId', async (req, res) => {
    try {
      const { shopId } = req.params;
      
      const { data: billsData, error: billsError } = await supabase
        .from('bills')
        .select('id')
        .eq('shopid', shopId);
        
      if (billsError) throw billsError;

      const billIds = billsData.map(bill => bill.id);
      
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          bills (
            id,
            month,
            total,
            shops (
              id,
              shopnumber,
              tenantname,
              phone,
              rent
            )
          )
        `)
        .in('billid', billIds);
        
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new payment
  router.post('/', async (req, res) => {
    try {
      const { billId, paidAmount, paymentDate } = req.body;

      const { data: billData, error: billError } = await supabase
        .from('bills')
        .select('total')
        .eq('id', billId)
        .single();
        
      if (billError) throw billError;

      const dueAmount = Number(billData.total) - Number(paidAmount);

      const { data, error } = await supabase
        .from('payments')
        .insert([{
          billid: billId,
          paidamount: Number(paidAmount),
          dueamount: dueAmount,
          paymentdate: paymentDate
        }])
        .select(`
          *,
          bills (
            id,
            month,
            total,
            shops (
              id,
              shopnumber,
              tenantname,
              phone,
              rent
            )
          )
        `);
        
      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update a payment
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { paidAmount, paymentDate } = req.body;

      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('billid')
        .eq('id', id)
        .single();
        
      if (paymentError) throw paymentError;

      const { data: billData, error: billError } = await supabase
        .from('bills')
        .select('total')
        .eq('id', paymentData.billid)
        .single();
        
      if (billError) throw billError;

      const dueAmount = Number(billData.total) - Number(paidAmount);

      const { data, error } = await supabase
        .from('payments')
        .update({ paidamount: Number(paidAmount), dueamount: dueAmount, paymentdate: paymentDate })
        .eq('id', id)
        .select(`
          *,
          bills (
            id,
            month,
            total,
            shops (
              id,
              shopnumber,
              tenantname,
              phone,
              rent
            )
          )
        `);
        
      if (error) throw error;
      res.json(data[0]);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete a payment
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};