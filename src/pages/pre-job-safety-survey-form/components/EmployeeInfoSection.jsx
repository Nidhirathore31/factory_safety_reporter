import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { cn } from 'utils/cn';

const EmployeeInfoSection = ({ formData, onChange, errors }) => {
  const [empInput, setEmpInput] = useState('');
  const shiftOptions = [
    { value: 'day', label: 'Day Shift (6:00 AM - 2:00 PM)' },
    { value: 'afternoon', label: 'Afternoon Shift (2:00 PM - 10:00 PM)' },
    { value: 'night', label: 'Night Shift (10:00 PM - 6:00 AM)' }
  ];

  const departmentOptions = [
    { value: 'log_yard', label: 'Log Yard' },
    { value: 'veneer', label: 'Veneer' },
    { value: 'plywood', label: 'Plywood' },
    { value: 'lvl', label: 'LVL (Laminated Veneer Lumber)' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  const handleAddEmployee = (e) => {
    if (e.key === 'Enter' && empInput.trim()) {
      e.preventDefault();
      const updatedList = [...(formData?.employeeNames || []), empInput.trim()];
      handleInputChange('employeeNames', updatedList);
      setEmpInput('');
    }
  };

  const handleRemoveEmployee = (name) => {
    const updatedList = (formData?.employeeNames || []).filter(
      (emp) => emp !== name
    );
    handleInputChange('employeeNames', updatedList);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <span className="text-blue-600 font-bold text-sm">1</span>
        </div>
        Employee Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* <Input
          label="Employee(s)"
          type="text"
          placeholder="Enter full name"
          value={formData?.employeeName || ''}
          onChange={(e) => handleInputChange('employeeName', e?.target?.value)}
          error={errors?.employeeName}
          required
          className="col-span-1"
        /> */}

        {/* Employee Names with Chips */}
        <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3 w-full">
          <label
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              errors?.employeeNames ? "text-destructive" : "text-foreground"
            )}
          >
            Employee(s)
            <span className="text-destructive ml-1">*</span>
          </label>

          <div
            className={cn(
              "flex flex-wrap gap-2 min-h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              errors?.employeeNames && "border-destructive focus-within:ring-destructive"
            )}
          >
            {(formData?.employeeNames || []).map((name, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {name}
                <button
                  type="button"
                  className="text-blue-500 hover:text-red-500"
                  onClick={() => handleRemoveEmployee(name)}
                >
                  ✕
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder={formData?.employeeNames?.length === 0 ? "Enter full name & press Enter" : ""}
              className="flex-1 border-none outline-none bg-transparent text-sm placeholder:text-muted-foreground"
              value={empInput}
              onChange={(e) => setEmpInput(e.target.value)}
              onKeyDown={handleAddEmployee}
            />
          </div>

          {errors?.employeeNames && (
            <p className="text-sm text-destructive">
              {errors.employeeNames}
            </p>
          )}
        </div>

        

        {/* <Input
          label="Employee ID"
          type="text"
          placeholder="Enter employee ID"
          value={formData?.employeeId || ''}
          onChange={(e) => handleInputChange('employeeId', e?.target?.value)}
          error={errors?.employeeId}
          required
          className="col-span-1"
        /> */}

        <Input
          label="Date"
          type="date"
          value={formData?.date || new Date()?.toISOString()?.split('T')?.[0]}
          onChange={(e) => handleInputChange('date', e?.target?.value)}
          error={errors?.date}
          required
          className="col-span-1"
        />

        <Input
          label="Time"
          type="time"
          value={formData?.time || new Date()?.toTimeString()?.slice(0, 5)}
          onChange={(e) => handleInputChange('time', e?.target?.value)}
          error={errors?.time}
          required
          className="col-span-1"
        />

        <Select
          label="Shift"
          options={shiftOptions}
          value={formData?.shift || ''}
          onChange={(value) => handleInputChange('shift', value)}
          error={errors?.shift}
          required
          placeholder="Select shift"
          className="col-span-1"
        />

        <Select
          label="Department"
          options={departmentOptions}
          value={formData?.department || ''}
          onChange={(value) => handleInputChange('department', value)}
          error={errors?.department}
          required
          placeholder="Select department"
          className="col-span-1"
        />

        <Input
          label="Job/Task Performed"
          type="text"
          placeholder="Describe the job or task"
          value={formData?.jobTask || ''}
          onChange={(e) => handleInputChange('jobTask', e?.target?.value)}
          error={errors?.jobTask}
          required
          className="col-span-1 md:col-span-2"
        />

        <Input
          label="Job/Task Location"
          type="text"
          placeholder="Work location/area"
          value={formData?.location || ''}
          onChange={(e) => handleInputChange('location', e?.target?.value)}
          error={errors?.location}
          required
          className="col-span-1"
        />
      </div>
    </div>
  );
};

export default EmployeeInfoSection;