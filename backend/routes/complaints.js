const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// GET all complaints with filters
router.get('/', async (req, res) => {
  try {
    const { status, category, priority, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.issueCategory = category;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        { studentEmail: { $regex: search, $options: 'i' } },
        { issueSummary: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: complaints,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single complaint by ticket ID
router.get('/:ticketId', async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ ticketId: req.params.ticketId });
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create new complaint
router.post('/', async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    await complaint.save();
    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update complaint
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.status === 'Resolved' && !updateData.resolvedAt) {
      updateData.resolvedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, message: 'Complaint updated', data: complaint });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE complaint
router.delete('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;