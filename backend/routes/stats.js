const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalComplaints,
      openComplaints,
      inProgressComplaints,
      resolvedComplaints,
      closedComplaints,
      categoryBreakdown,
      priorityBreakdown,
      departmentBreakdown,
      avgResolutionTime
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Open' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.countDocuments({ status: 'Closed' }),

      Complaint.aggregate([
        { $group: { _id: '$issueCategory', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      Complaint.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),

      Complaint.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      Complaint.aggregate([
        {
          $match: {
            status: 'Resolved',
            resolvedAt: { $ne: null }
          }
        },
        {
          $project: {
            resolutionTime: {
              $divide: [
                { $subtract: ['$resolvedAt', '$createdAt'] },
                1000 * 60 * 60
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgHours: { $avg: '$resolutionTime' }
          }
        }
      ])
    ]);

    const top5Issues = categoryBreakdown.slice(0, 5);

    res.json({
      success: true,
      data: {
        summary: {
          total: totalComplaints,
          open: openComplaints,
          inProgress: inProgressComplaints,
          resolved: resolvedComplaints,
          closed: closedComplaints,
          resolutionRate: totalComplaints > 0
            ? Math.round(((resolvedComplaints + closedComplaints) / totalComplaints) * 100)
            : 0,
          avgResolutionHours: avgResolutionTime[0]?.avgHours
            ? Math.round(avgResolutionTime[0].avgHours * 10) / 10
            : null
        },
        top5Issues,
        categoryBreakdown,
        priorityBreakdown,
        departmentBreakdown
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;