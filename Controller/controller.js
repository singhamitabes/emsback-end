const EmployeeList = require('../Model/employee')
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");


// const createEmpData = async (req, res) => {
//   const { name, email, password, address, salary, role } = req.body;
//   const imagePath = req.file.path;
//   try {
//     const existingEmp = await EmployeeList.findOne({ email: email });
//     if (existingEmp) {
//       return res.status(400).json({ error: "Employee Record is Already Present" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // create a new employee record
//     const empRec = await EmployeeList.create({
//       name: name,
//       email: email,
//       password: hashedPassword,
//       address: address,
//       salary: salary,
//       role: role,
//       image: imagePath
//     });
//     res.status(201).json(empRec);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const createEmpData = async (req, res) => {
  const { name, email, password, address, salary, role } = req.body;
  const imagePath = req.file.path;

  try {
    const existingEmp = await EmployeeList.findOne({ email: email });
    if (existingEmp) {
      return res.status(400).json({ error: "Employee Record is Already Present" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const empRec = await EmployeeList.create({
      name: name,
      email: email,
      password: hashedPassword,
      address: address,
      salary: salary,
      role: role,
      image: imagePath
    });

    res.status(201).json(empRec);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getEmployee = async (req, res) => {
  try {
    const employees = await EmployeeList.find();
    res.status(200).json({ Status: "Success", Result: employees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Get employee error in MongoDB" });
  }
};

const adminCount = async (req, res) => {
  try {
    const adminCount = await EmployeeList.find({ role: 'Admin' }).countDocuments();
    res.json({ admin: adminCount });
  } catch (error) {
    console.error('Error in running query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const employeeCount = async (req, res) => {
  try {
    const totalCount = await EmployeeList.countDocuments();
    res.json({ totalDocuments: totalCount });
  } catch (error) {
    console.error('Error counting documents:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const salary = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalSalary: { $sum: '$salary' },
        },
      },
    ];
    const result = await EmployeeList.aggregate(pipeline);
    if (result.length === 0) {
      return res.json({ totalSalary: 0 });
    }
    res.json({ totalSalary: result[0].totalSalary });
  } catch (error) {
    console.error('Error calculating total salary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body
  try {
    const employee = await EmployeeList.findOne({ email });

    if (!employee) {
      return res.status(401).json({ Status: 'Error', Error: 'Wrong Email or Password' });
    }
    const passwordMatch = await bcrypt.compare(
      password.toString(),
      employee.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ Status: 'Error', Error: 'Wrong Email or Password' });
    }
    // Check if the employee is an admin
    if (employee.role === "Employee") {
      return res.status(401).json({ Status: 'Error', Error: 'Not an admin' });
    }
    const id = employee._id.toString();
    const token = jwt.sign({ email: employee.email, id: employee._id }, 'JSONWEBTOKEN', {
      expiresIn: '1d',
    });
    return res.json({ Status: 'Success', id, token, role: employee.role })

  } catch (err) {
    return res.status(500).json({ Status: 'Error', Error: 'Error in running query' });
  }
};

const dashboard = (req, res) => {
  const id = req.id
  try {
    return res.status(200).json({ Status: "Success", role: "Admin", id });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ Status: 'Error', Error: 'Error in running query' });
  }
}

const verifyUser = (req, res, next) => {
  const token = req.headers.authorization
  try {
    if (!token) {
      return res.status(401).json({ Error: "You are not authenticated" });
    } else {
      jwt.verify(token, "JSONWEBTOKEN", (err, decoded) => {
        if (err) return res.status(401).json({ Error: "Token is invalid" });
        req.role = decoded.role;
        req.id = decoded.id;
        next();
      });
    }
  } catch (error) {
    return res.status(500).json({ Status: 'Error', Error: 'Error in running query' });
  }
};

const employeeLogin = async (req, res) => {
  const { email, password } = req.body
  try {
    const employee = await EmployeeList.findOne({ email });
    if (!employee) {
      return res.status(401).json({ Status: 'Error', Error: 'Wrong Email or Password' });
    }
    const passwordMatch = await bcrypt.compare(
      password.toString(),
      employee.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ Status: 'Error', Error: 'Wrong Email or Password' });
    }
    if (passwordMatch) {
      const id = employee._id.toString();
      const token = jwt.sign({ email: employee.email, address: employee.address }, 'JSONWEBTOKEN', {
        expiresIn: '1d',
      });
      return res.json({ Status: 'Success', id, token });
    } else {
      return res.status(401).json({ Status: 'Error', Error: 'Wrong Email or Password' });
    }
  } catch (err) {
    return res.status(500).json({ Status: 'Error', Error: 'Error in running query' });
  }
}

// to Find data of particular ID of employee
const getEmpDetailsId = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await EmployeeList.findById(id);
    if (!result) {
      return res.status(404).json({ Error: 'Employee not found' });
    }
    return res.json({ Status: 'Success', Result: result });
  } catch (err) {
    return res.status(500).json({ Error: 'Get employee error in MongoDB' });
  }
}

const getAdminDetails = async (req, res) => {
  try {
    const result = await EmployeeList.find({ role: 'Admin' });
    if (!result || result.length === 0) {
      return res.status(404).json({ Error: 'Admin not found' });
    }
    return res.json({ Status: 'Success', Result: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ Error: 'Error in MongoDB' });
  }
};

const deleteEmployee = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await EmployeeList.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ Error: 'Employee not found' });
    }
    return res.json({ Status: 'Success' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    return res.status(500).json({ Error: 'Error deleting employee in MongoDB' })
  }
}

const updateEmpDetailsId = async (req, res) => {
  const { id } = req.params;
  const { name, email, address, salary } = req.body;
  try {
    const updatedEmployee = await EmployeeList.findByIdAndUpdate(
      id,
      { name, email, address, salary },
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ Status: 'Error', error: 'Employee not found' });
    }
    res.json({ Status: 'Success', message: 'Employee updated successfully', user: updatedEmployee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ Status: 'Error', error: 'Internal Server Error' });
  }
}

module.exports = { getAdminDetails, updateEmpDetailsId, deleteEmployee, createEmpData, getEmployee, adminCount, employeeCount, salary, employeeLogin, adminLogin, dashboard, verifyUser, getEmpDetailsId }