const { Op } = require('sequelize');
const { Therapist } = require('../models/index.js');

// Add a new therapist
exports.addTherapist = async (req, res) => {
  try {
    const { name, clinicName, email, phone, specialization, experience, availability } = req.body;
    const file = req.file ? req.file.filename : null;

    const therapist = await Therapist.create({
      name,
      clinicName,
      email,
      phone,
      specialization,
      experience,
      availability,
      file,
    });

    res.status(201).json({ success: true, data: therapist });
  } catch (error) {
    console.error('Error creating therapist:', error);
    res.status(500).json({ success: false, message: 'Failed to add therapist.' });
  }
};

// Get all therapists (with optional filters)
exports.getTherapists = async (req, res) => {
  try {
    const { status, availability, searchTerm } = req.query;

    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (availability) {
      whereClause.availability = availability;
    }

    if (searchTerm) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { email: { [Op.like]: `%${searchTerm}%` } },
        { phone: { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    const therapists = await Therapist.findAll({
      where: whereClause,
      attributes: [
        'id',
        'name',
        'clinicName',
        'email',
        'phone',
        'availability',
        'rating',
        'status',
        'createdAt',
      ],
      order: [['createdAt', 'DESC']],
    });

    const formattedTherapists = therapists.map((therapist) => ({
      id: therapist.id,
      name: therapist.name,
      clinicName: therapist.clinicName,
      contact: {
        email: therapist.email,
        phone: therapist.phone,
      },
      availability: therapist.availability,
      rating: therapist.rating || 'Not rated',
      status: therapist.status,
      joinedDate: therapist.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedTherapists,
      total: formattedTherapists.length,
    });
  } catch (error) {
    console.error('Error fetching therapists:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch therapists.' });
  }
};

// Get a single therapist by ID
exports.getTherapistById = async (req, res) => {
  try {
    const { id } = req.params;

    const therapist = await Therapist.findByPk(id);

    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    res.status(200).json({ success: true, data: therapist });
  } catch (error) {
    console.error('Error fetching therapist:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch therapist details.' });
  }
};

// Update a therapist
exports.updateTherapist = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.file = req.file.filename;
    }

    const therapist = await Therapist.findByPk(id);

    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    await therapist.update(updates);

    res.status(200).json({ success: true, data: therapist });
  } catch (error) {
    console.error('Error updating therapist:', error);
    res.status(500).json({ success: false, message: 'Failed to update therapist.' });
  }
};

// Delete a therapist
exports.deleteTherapist = async (req, res) => {
  try {
    const { id } = req.params;

    const therapist = await Therapist.findByPk(id);

    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    await therapist.destroy();

    res.status(200).json({ success: true, message: 'Therapist deleted successfully' });
  } catch (error) {
    console.error('Error deleting therapist:', error);
    res.status(500).json({ success: false, message: 'Failed to delete therapist.' });
  }
};

// Update therapist status (approve, reject, etc.)
exports.updateTherapistStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const therapist = await Therapist.findByPk(id);

    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    await therapist.update({ status });

    res.status(200).json({ success: true, data: therapist });
  } catch (error) {
    console.error('Error updating therapist status:', error);
    res.status(500).json({ success: false, message: 'Failed to update therapist status.' });
  }
};

// Get therapist statistics
exports.getTherapistStats = async (req, res) => {
  try {
    const totalTherapists = await Therapist.count();

    const pendingTherapists = await Therapist.count({
      where: {
        status: 'Pending',
      },
    });

    const onlineTherapists = await Therapist.count({
      where: {
        availability: 'Online',
        status: 'Approved',
      },
    });

    const approvedTherapists = await Therapist.count({
      where: {
        status: 'Approved',
      },
    });

    const offlineTherapists = await Therapist.count({
      where: {
        availability: 'Offline',
        status: 'Approved',
      },
    });

    const recentlyJoined = await Therapist.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalTherapists,
        pending: pendingTherapists,
        online: onlineTherapists,
        offline: offlineTherapists,
        approved: approvedTherapists,
        recentlyJoined: recentlyJoined,
      },
    });
  } catch (error) {
    console.error('Error fetching therapist statistics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch therapist statistics.' });
  }
};
