const express = require('express');
const router = express.Router();

module.exports = (supabase) => {
  // Get all bills
  router.get('/', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('bills')
        .select(`
          *,
          shops (
            id,
            shopnumber,
            tenantname,
            phone,
            rent
          )
        `);
        
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get bills by shop
  router.get('/shop/:shopId', async (req, res) => {
    try {
      const { shopId } = req.params;
      
      const { data, error } = await supabase
        .from('bills')
        .select(`
          *,
          shops (
            id,
            shopnumber,
            tenantname,
            phone,
            rent
          )
        `)
        .eq('shopid', shopId);
        
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get bill by month
  router.get('/month/:month', async (req, res) => {
    try {
      const { month } = req.params;
      
      const { data, error } = await supabase
        .from('bills')
        .select(`
          *,
          shops (
            id,
            shopnumber,
            tenantname,
            phone,
            rent
          )
        `)
        .eq('month', month);
        
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new bill
  router.post('/', async (req, res) => {
    try {
      const { shopId, month, electricity, water, otherCharges = 0, prevUnit, currUnit } = req.body;

      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('rent')
        .eq('id', shopId)
        .single();
        
      if (shopError) throw shopError;

      // Calculate Previous Due
      const { data: previousBills, error: prevError } = await supabase
        .from('bills')
        .select(`
          id,
          total,
          payments (
            paidamount
          )
        `)
        .eq('shopid', shopId)
        .lt('month', month);

      if (prevError) throw prevError;

      let previousDue = 0;
      if (previousBills) {
        previousBills.forEach(b => {
          const totalBill = Number(b.total);
          const totalPaid = b.payments ? b.payments.reduce((sum, p) => sum + Number(p.paidamount), 0) : 0;
          previousDue += (totalBill - totalPaid);
        });
      }

      const elec = Number(electricity);
      const wat = Number(water) || 0;
      const other = Number(otherCharges) || 0;
      const total = Number(shopData.rent) + elec + wat + other + previousDue;

      const { data, error } = await supabase
        .from('bills')
        .insert([{
          shopid: shopId,
          month,
          rent: shopData.rent,
          electricity: elec,
          water: wat,
          othercharges: other,
          previous_due: previousDue,
          prevunit: prevUnit ? Number(prevUnit) : null,
          currunit: currUnit ? Number(currUnit) : null,
          total
        }])

        .select(`
          *,
          shops (
            id,
            shopnumber,
            tenantname,
            phone,
            rent
          )
        `);
        
      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update a bill
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { electricity, water, otherCharges, prevUnit, currUnit } = req.body;

      const { data: billData, error: billError } = await supabase
        .from('bills')
        .select('rent')
        .eq('id', id)
        .single();
        
      if (billError) throw billError;

      const elec = Number(electricity);
      const wat = Number(water) || 0;
      const other = Number(otherCharges) || 0;
      const total = Number(billData.rent) + elec + wat + other;

      const { data, error } = await supabase
        .from('bills')
        .update({ 
          electricity: elec, 
          water: wat, 
          othercharges: other, 
          prevunit: prevUnit ? Number(prevUnit) : null,
          currunit: currUnit ? Number(currUnit) : null,
          total 
        })
        .eq('id', id)
        .select(`
          *,
          shops (
            id,
            shopnumber,
            tenantname,
            phone,
            rent
          )
        `);
        
      if (error) throw error;
      res.json(data[0]);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete a bill
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      res.json({ message: 'Bill deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};