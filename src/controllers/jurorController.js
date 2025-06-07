const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create multiple jurors
const createJuror = async (req, res) => {
  try {
    const jurors = Array.isArray(req.body) ? req.body : [req.body];
    const userId = req.user.userId;
    const createdJurors = [];
    const errors = [];

    for (const jurorData of jurors) {
      try {
        const {
          jurorNumber,
          firstName,
          lastName,
          gender,
          race,
          dateOfBirth,
          homeAddress,
          mailingAddress,
          tdlNumber,
          homePhone,
          countyOfResidence,
          criminalCaseExp,
          accidentalInjury,
          education,
          civilJuryService,
          criminalJuryService,
          usCitizen,
          occupation,
          workPhone,
          maritalStatus,
          spouse,
          employer,
          lengthOfEmployment,
          numberOfChildren,
          panelPosition,
          caseId,
          status
        } = jurorData;

        // Validate required fields
        if (!jurorNumber) {
          errors.push({
            jurorNumber,
            error: 'Juror number is required'
          });
          continue;
        }

        // Check if TDL number is unique if provided
        if (tdlNumber) {
          const existingTDL = await prisma.juror.findFirst({
            where: { 
              tdlNumber,
              deletedAt: null // Only check non-deleted records
            }
          });

          if (existingTDL) {
            errors.push({
              jurorNumber,
              error: 'A juror with this TDL number already exists'
            });
            continue;
          }
        }

        // Validate caseId if provided
        if (caseId) {
          const existingCase = await prisma.case.findUnique({
            where: { 
              id: caseId,
              userId: userId
            },
            include: {
              jurors: {
                where: {
                  deletedAt: null // Only include non-deleted jurors
                }
              }
            }
          });

          if (!existingCase) {
            errors.push({
              jurorNumber,
              error: 'Case not found or you do not have access to it'
            });
            continue;
          }

          // Check if juror is already assigned to any case
          const existingJuror = await prisma.juror.findFirst({
            where: {
              jurorNumber,
              caseId: {
                not: null
              },
              deletedAt: null // Only check non-deleted records
            }
          });

          if (existingJuror) {
            errors.push({
              jurorNumber,
              error: 'This juror is already assigned to a case'
            });
            continue;
          }
        }

        // Validate date format if provided
        let parsedDateOfBirth;
        if (dateOfBirth) {
          parsedDateOfBirth = new Date(dateOfBirth);
          if (isNaN(parsedDateOfBirth.getTime())) {
            errors.push({
              jurorNumber,
              error: 'Invalid date of birth format'
            });
            continue;
          }
        }

        // Validate number of children if provided
        if (numberOfChildren !== undefined && (isNaN(numberOfChildren) || numberOfChildren < 0)) {
          errors.push({
            jurorNumber,
            error: 'Number of children must be a non-negative number'
          });
          continue;
        }

        // Validate panel position if provided
        if (panelPosition !== undefined && (isNaN(panelPosition) || panelPosition < 0)) {
          errors.push({
            jurorNumber,
            error: 'Panel position must be a non-negative number'
          });
          continue;
        }

        const newJuror = await prisma.juror.create({
          data: {
            jurorNumber,
            firstName,
            lastName,
            gender,
            race,
            dateOfBirth: parsedDateOfBirth,
            homeAddress,
            mailingAddress,
            tdlNumber,
            homePhone,
            countyOfResidence,
            criminalCaseExp: criminalCaseExp ?? false,
            accidentalInjury: accidentalInjury ?? false,
            education,
            civilJuryService: civilJuryService ?? false,
            criminalJuryService: criminalJuryService ?? false,
            usCitizen: usCitizen ?? false,
            occupation,
            workPhone,
            maritalStatus,
            spouse,
            employer,
            lengthOfEmployment,
            numberOfChildren: numberOfChildren ?? 0,
            panelPosition,
            caseId,
            userId,
            status: status || 'ACTIVE'
          },
          include: {
            case: true,
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });

        createdJurors.push(newJuror);
      } catch (error) {
        console.error('Error creating juror:', error);
        errors.push({
          jurorNumber: jurorData.jurorNumber,
          error: error.message
        });
      }
    }

    // If no jurors were created successfully
    if (createdJurors.length === 0 && errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    // If some jurors were created and some failed
    if (errors.length > 0) {
      return res.status(207).json({
        success: true,
        data: createdJurors,
        errors
      });
    }

    // If all jurors were created successfully
    res.status(201).json({
      success: true,
      data: createdJurors
    });
  } catch (error) {
    console.error('Error in bulk juror creation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create jurors',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// List all jurors for the authenticated user
const listJurors = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;

    const where = {
      userId,
      status: status || 'ACTIVE'
    };

    const jurors = await prisma.juror.findMany({
      where,
      include: {
        case: {
          select: {
            id: true,
            caseNumber: true,
            caseName: true,
            caseType: true
          }
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: jurors,
    });
  } catch (error) {
    console.error('Error listing jurors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list jurors',
    });
  }
};

// Soft delete a juror
const deleteJuror = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const juror = await prisma.juror.findFirst({
      where: {
        id: parseInt(id),
        userId,
        deletedAt: null
      }
    });

    if (!juror) {
      return res.status(404).json({
        success: false,
        error: 'Juror not found or you do not have permission to delete it'
      });
    }

    const updatedJuror = await prisma.juror.update({
      where: {
        id: parseInt(id)
      },
      data: {
        deletedAt: new Date(),
        status: 'DELETED'
      }
    });

    res.status(200).json({
      success: true,
      data: updatedJuror
    });
  } catch (error) {
    console.error('Error deleting juror:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete juror'
    });
  }
};

module.exports = {
  createJuror,
  listJurors,
  deleteJuror,
}; 