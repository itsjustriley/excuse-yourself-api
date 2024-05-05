const User = require('../models/User');
const Excuse = require('../models/excuse');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuth');

module.exports = (app) => {
  // POST Create an excuse
  app.post('/excuse/new', checkAuth, async (req, res) => {
    try {
      const excuse = new Excuse({
        excuse: req.body.excuse,
        tags: req.body.tags
      });
      if (!excuse.excuse) {
        return res.status(400).json({ error: 'Please enter an excuse' });
      }
      await excuse.save();
      res.json({ excuse });
    } catch (error) {
      console.error('Create excuse error:', error);
      res.status(500).json({ error: error.toString() });
    }
  });

  // GET one random excuse
  app.get('/excuse', checkAuth, async (req, res) => {
    const excuse = await Excuse.aggregate([{ $sample: { size: 1 } }]);
    res.json({ excuse });
  });

  // GET a specific excuse by id
  app.get('/excuse/:id', checkAuth, async (req, res) => {
    try {
      const excuse = await Excuse.findById(req.params.id);
      if (!excuse) {
        return res.status(404).json({ error: 'Excuse not found' });
      }
      res.json({ excuse });
    } catch (error) {
      console.error('Get excuse by id error:', error);
      res.status(500).json({ error: error.toString() });
    }
  });

  // PUT save an excuse to user's list via jwt and excuse id
  app.put('/excuse/:id/save', checkAuth, async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const excuse = await Excuse.findById(req.params.id);
      if (!excuse) {
        return res.status(404).json({ error: 'Excuse not found' });
      }
      user.excuses.push(excuse);
      await user.save();
      res.json({ user });
    } catch (error) {
      console.error('Save excuse error:', error);
      res.status(500).json({ error: error.toString() });
    }
  });

  // GET all saved excuses
  app.get('/saved', checkAuth, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate('excuses');
      const excuses = user.excuses;
      if (!excuses) {
        return res.status(404).json({ error: 'No saved excuses found' });
      }
      res.json({ excuses });
    } catch (error) {
      console.error('Get saved excuses error:', error);
      res.status(500).json({ error: error.toString() });
    }
  });

  // DELETE an excuse from user's list
    app.delete('/excuse/:id/delete', checkAuth, async (req, res) => {
      try {
        const user = await User.findById(req.user._id);
        if (user.excuses.length === 0) {
          return res.status(404).json({ error: 'Your excuse list is empty' });
        }
        if (!user.excuses.includes(req.params.id)) {
          return res.status(404).json({ error: 'Excuse not found on list' });
        }
        user.excuses.pull(req.params.id);
        await user.save();
        if (user.excuses.length === 0) {
          return res.json({ message: 'No excuses remaining on list' });
        }
        res.json({ user });
      } catch (error) {
        console.error('Delete excuse error:', error);
        res.status(500).json({ error: error.toString() });
      }
    });

    // DELETE all saved excuses
    app.delete('/excuse/delete/all', checkAuth, async (req, res) => {
      try {
        const user
        = await User.findById(req.user._id);
        if (user.excuses.length === 0) {
          return res.status(404).json({ error: 'Your excuse list is empty' });
        }
        user.excuses = [];
        await user.save();
        res.json({ user });
      } catch (error) {
        console.error('Delete all excuses error:', error);
        res.status(500).json({ error: error.toString() });
      }
    });    
};