const express = require('express');
const router = express.Router();

module.exports = (supabase) => {
  // Get all collections (for stats)
  router.get('/all', async (req, res) => {
    try {
      const { data, error } = await supabase.from('daily_collections').select('amount');
      if (error) throw error;
      res.json(data);
    } catch (e) { res.status(500).json(e); }
  });

  // Get collections for a shop in a date range
  router.get('/:shopId', async (req, res) => {
    const { shopId } = req.params;
    const { start, end } = req.query; // YYYY-MM-DD
    
    try {
      const { data, error } = await supabase
        .from('daily_collections')
        .select('*')
        .eq('shop_id', shopId)
        .gte('collection_date', start)
        .lte('collection_date', end);
        
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching daily collections:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Toggle/Save collection for a date
  router.post('/', async (req, res) => {
    const { shop_id, collection_date, amount } = req.body;
    try {
      console.log('Incoming Daily Collection POST:', req.body);
      
      const numAmount = Number(amount);
      if (isNaN(numAmount)) {
        return res.status(400).json({ error: 'Invalid amount', details: 'Amount must be a number' });
      }

      const { data, error } = await supabase
        .from('daily_collections')
        .upsert(
          { shop_id, collection_date, amount: numAmount, is_paid: true }, 
          { onConflict: 'shop_id,collection_date' }
        )
        .select();
        
      if (error) {
        console.error('Supabase Error:', error);
        throw error;
      }
      res.json({ message: 'Saved successfully', data: data?.[0] });
    } catch (error) {
      console.error('Error saving daily collection:', error);
      res.status(500).json({ 
        error: error.message,
        details: error.details || error.hint || 'No more details'
      });
    }
  });

  // Delete a collection record (if unticking)
  router.delete('/:shopId/:date', async (req, res) => {
    const { shopId, date } = req.params;
    try {
      const { data, error } = await supabase
        .from('daily_collections')
        .delete()
        .eq('shop_id', shopId)
        .eq('collection_date', date);
        
      if (error) throw error;
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
