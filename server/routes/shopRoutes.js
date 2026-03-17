const express = require('express');
const router = express.Router();

module.exports = (supabase) => {
  // Get all shops
  router.get('/', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .order('shopnumber', { ascending: true });
        
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new shop
  router.post('/', async (req, res) => {
    try {
      const { shopNumber, tenantName, phone, rent, rentType, dailyRate } = req.body;
      
      const { data, error } = await supabase
        .from('shops')
        .insert([{ 
          shopnumber: shopNumber, 
          tenantname: tenantName, 
          phone, 
          rent,
          rent_type: rentType || 'monthly',
          daily_rate: dailyRate || 0
        }])
        .select();
        
      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update a shop
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { shopNumber, tenantName, phone, rent, rentType, dailyRate } = req.body;
      
      const { data, error } = await supabase
        .from('shops')
        .update({ 
          shopnumber: shopNumber, 
          tenantname: tenantName, 
          phone, 
          rent,
          rent_type: rentType,
          daily_rate: dailyRate
        })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      res.json(data[0]);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete a shop
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      res.json({ message: 'Shop deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};