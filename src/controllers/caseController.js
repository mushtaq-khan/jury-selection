const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new case
const createCase = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['caseNumber', 'caseType'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate caseType enum
    if (!['CIVIL', 'CRIMINAL'].includes(req.body.caseType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid caseType. Must be either CIVIL or CRIMINAL'
      });
    }

    // Check if caseNumber already exists
    const existingCase = await prisma.case.findUnique({
      where: { caseNumber: req.body.caseNumber }
    });

    if (existingCase) {
      return res.status(409).json({
        success: false,
        error: 'Case number already exists'
      });
    }

    // Add userId from authenticated user
    req.body.userId = req.user.userId;

    const newCase = await prisma.case.create({
      data: req.body
    });

    res.status(201).json({
      success: true,
      data: newCase,
    });
  } catch (error) {
    console.error('Error creating case:', error);

    // Handle Prisma specific errors
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'A case with this number already exists'
      });
    }

    if (error.code === 'P2003') {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      error: 'Failed to create case',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// List all cases for the authenticated user
const listCases = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cases = await prisma.case.findMany({
      where: {
        userId: userId
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (cases.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No cases found for this user'
      });
    }

    res.status(200).json({
      success: true,
      data: cases,
    });
  } catch (error) {
    console.error('Error listing cases:', error);
    
    // Handle Prisma specific errors
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'No cases found'
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      error: 'Failed to list cases',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createCase,
  listCases,
}; 