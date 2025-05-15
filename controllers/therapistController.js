import { Op } from 'sequelize';
import Therapist from '../models/therapist.js';

// Add a new therapist
export const addTherapist = async (req, res) => {
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
export const getTherapists = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { status, availability, searchTerm } = req.query;

    // Build the where clause for filtering
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

    // Fetch therapists with filters
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
        // Add any other fields needed for the frontend
      ],
      order: [['createdAt', 'DESC']],
    });

    // Format the data to match the UI requirements
    const formattedTherapists = therapists.map((therapist) => ({
      id: therapist.id,
      name: therapist.name,
      clinicName: therapist.clinicName || "CP's Reflex Marma", // Default value based on the image
      contact: {
        email: therapist.email,
        phone: therapist.phone,
      },
      availability: therapist.availability,
      rating: therapist.rating || 'Not rated',
      status: therapist.status,
      joinedDate: therapist.createdAt,
      // Add any other fields needed for the frontend
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
export const getTherapistById = async (req, res) => {
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
export const updateTherapist = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If there's a file upload, add it to the updates
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
export const deleteTherapist = async (req, res) => {
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
export const updateTherapistStatus = async (req, res) => {
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

export const getTherapistStats = async (req, res) => {
  try {
    // Get total count of therapists
    const totalTherapists = await Therapist.count();

    // Get count of pending therapists
    const pendingTherapists = await Therapist.count({
      where: {
        status: 'Pending',
      },
    });

    // Get count of online therapists
    const onlineTherapists = await Therapist.count({
      where: {
        availability: 'Online',
        status: 'Approved', // Only count approved therapists who are online
      },
    });

    // Get count of approved therapists
    const approvedTherapists = await Therapist.count({
      where: {
        status: 'Approved',
      },
    });

    // Get count of offline therapists (who are approved)
    const offlineTherapists = await Therapist.count({
      where: {
        availability: 'Offline',
        status: 'Approved',
      },
    });

    // Get recently joined therapists (last 7 days)
    const recentlyJoined = await Therapist.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
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
