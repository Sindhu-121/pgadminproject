import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Addexam = () => {
  const [formData, setFormData] = useState({
    examName: '',
    startDate: '',
    endDate: '',
    selectedDepartments: [],
    newDepartment: '',
  });
  const [departments, setDepartments] = useState([]);
  const [showAddDepartmentForm, setShowAddDepartmentForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const handleToggleForm = () => {
    setFormVisible(!formVisible);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNewDepartmentChange = (e) => {
    setFormData({
      ...formData,
      newDepartment: e.target.value,
    });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterDepartments(query);
  };

  const filterDepartments = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = departments.filter((department) =>
      department.departmentName.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredDepartments(filtered);
  };

  const handleAddDepartment = () => {
    // Send a request to the server to save the new department
    axios
      .post('http://localhost:3083/Pgaddexam/addnewdepartments', {
        departmentName: formData.newDepartment,
      })
      .then((response) => {
        // Refresh the list of departments after adding a new one
        setDepartments(response.data);
        // Clear the new department input
        setFormData({
          ...formData,
          newDepartment: '',
        });
      })
      .catch((error) => {
        console.error('Error adding new department:', error);
      });
  };

  useEffect(() => {
    // Fetch departments from the database or an API endpoint
    axios
      .get('http://localhost:3083/Pgaddexam/pg_departments')
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
      });
  }, []);

  const handleCheckboxChange = (departmentId) => {
    const isSelected = formData.selectedDepartments.includes(departmentId);

    if (isSelected) {
      setFormData({
        ...formData,
        selectedDepartments: formData.selectedDepartments.filter((id) => id !== departmentId),
      });
    } else {
      setFormData({
        ...formData,
        selectedDepartments: [...formData.selectedDepartments, departmentId],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
  
    if (endDate <= startDate) {
      alert('Please select a valid end date that is later than the start date.');
      return; 
    }
    const examData = {
      pg_examName: formData.examName,
      pg_startDate: formData.startDate,
      pg_endDate: formData.endDate,
      selectedDepartments: formData.selectedDepartments,
    };
    axios
    .post('http://localhost:3083/Pgaddexam/addexam', examData)
    .then((response) => {
      console.log('Exam data saved successfully:', response.data);
     
    })
    .catch((error) => {
      console.error('Error saving exam data:', error);
    });
    setFormData({
      examName: '',
      startDate: '',
      endDate: '',
      selectedDepartments: [],
      newDepartment: '',
    });
    console.log('Form data submitted:', formData);
  };


  const [examData, setExamData] = useState([]);

  useEffect(() => {
    // Fetch exam data from the API
    axios.get('http://localhost:3083/Pgaddexam/getExamData')
      .then((response) => {
        setExamData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching exam data:', error);
      });
  }, []);


  return (
    <div>

    <button type="button" onClick={handleToggleForm}>
    {formVisible ? 'Close Form' : 'Open Form'}
  </button>

  {formVisible && (
    <form onSubmit={handleSubmit}>
      <label>
        Exam Name:
        <input
          type="text"
          name="examName"
          value={formData.examName}
          onChange={handleChange}
          required
        />
      </label>
      <br />
  
      <label>
        Start Date:
        <input
          type="date"
          name="startDate"
          placeholder="YYYY-MM-DD"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
      </label>
      <br />
  
      <label>
        End Date:
        <input
          type="date"
          name="endDate"
          placeholder="YYYY-MM-DD"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Departments:
        <input
          type="text"
          placeholder="Search departments..."
          value={searchQuery}
          onChange={handleSearchChange}
       
        />
        <div className="department-list-container" style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {searchQuery === '' ? (
            // Display all departments when search query is empty
            departments.map((department) => (
              <div key={department.departmentId}>
                <input
                  type="checkbox"
                  id={department.departmentId}
                  name={department.departmentName}
                  checked={formData.selectedDepartments.includes(department.departmentId)}
                  onChange={() => handleCheckboxChange(department.departmentId)}
                 
                />
                <label htmlFor={department.departmentId}>{department.departmentName}</label>
              </div>
            ))
          ) : (
            // Display filtered departments when search query is not empty
            filteredDepartments.map((department) => (
              <div key={department.departmentId}>
                <input
                  type="checkbox"
                  id={department.departmentId}
                  name={department.departmentName}
                  checked={formData.selectedDepartments.includes(department.departmentId)}
                  onChange={() => handleCheckboxChange(department.departmentId)}
                  
                />
                <label htmlFor={department.departmentId}>{department.departmentName}</label>
              </div>
            ))
          )}
        </div>
      </label>
      {showAddDepartmentForm && (
        <div>
          <label>
            New Department:
            <input
              type="text"
              value={formData.newDepartment}
              onChange={handleNewDepartmentChange}
            />
          </label>
          <button type="button" onClick={handleAddDepartment}>
            Add Department
          </button>
        </div>
      )}
  
      {/* Toggle Add Department Form Button */}
      <button type="button" onClick={() => setShowAddDepartmentForm(!showAddDepartmentForm)}>
        {showAddDepartmentForm ? 'Cancel' : 'Add Department'}
      </button>
      <br />
      <button type="submit">Submit</button>
    </form>
    )}
      <h2>Exam List</h2>
          <table>
            <thead>
              <tr>
              <th>Serial no</th>
                <th>Exam Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Department</th>
                <th>Action</th>
              

              </tr>
            </thead>
            <tbody>
            {examData.map((exam, index) => (
  <tr key={exam.pg_examId}>
    <td>{index + 1}</td>
    <td>{exam.pg_examName}</td>
    <td>{exam.pg_startDate}</td>
    <td>{exam.pg_endDate}</td>
    <td>{exam.pg_departments}</td>
    <button><i class="fa-solid fa-pen-to-square"></i></button>
    <button><i class="fa-solid fa-trash-can"></i></button>
  </tr>
))}
            </tbody>
          </table>
        </div>

  );
};
export default Addexam;	


