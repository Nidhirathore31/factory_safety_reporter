import React, { useState, useRef } from 'react';

import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SPVSection = ({ formData, onChange, errors }) => {
  const [isSignaturePadOpen, setIsSignaturePadOpen] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleInputChange = (field, value) => {
    const spvData = { ...formData?.spv, [field]: value };
    onChange('spv', spvData);
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef?.current;
    const rect = canvas?.getBoundingClientRect();
    const x = e?.clientX - rect?.left;
    const y = e?.clientY - rect?.top;
    
    const ctx = canvas?.getContext('2d');
    ctx?.beginPath();
    ctx?.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef?.current;
    const rect = canvas?.getBoundingClientRect();
    const x = e?.clientX - rect?.left;
    const y = e?.clientY - rect?.top;
    
    const ctx = canvas?.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx?.lineTo(x, y);
    ctx?.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    // Save signature as base64
    const canvas = canvasRef?.current;
    const signatureData = canvas?.toDataURL();
    handleInputChange('signature', signatureData);
    handleInputChange('signatureTimestamp', new Date()?.toISOString());
  };

  const clearSignature = () => {
    const canvas = canvasRef?.current;
    const ctx = canvas?.getContext('2d');
    ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
    handleInputChange('signature', '');
    handleInputChange('signatureTimestamp', '');
  };

  // const criticalQuestions = [
  //   {
  //     id: 'hazards_identified',
  //     text: 'Have all potential hazards been identified and assessed?',
  //     required: true
  //   },
  //   {
  //     id: 'controls_implemented',
  //     text: 'Are all necessary control measures implemented?',
  //     required: true
  //   },
  //   {
  //     id: 'ppe_verified',
  //     text: 'Has required PPE been verified and is in good condition?',
  //     required: true
  //   },
  //   {
  //     id: 'emergency_procedures',
  //     text: 'Are emergency procedures understood by all personnel?',
  //     required: true
  //   },
  //   {
  //     id: 'work_authorization',
  //     text: 'Is work authorization obtained and valid?',
  //     required: true
  //   }
  // ];

  const criticalQuestions = [
    {
      id: 'hazards_identified',
      text: 'All known hazards are identified & controlled',
      required: true
    },
    {
      id: 'workers_knowledgeable',
      text: 'Worker(s) are knowledgeable about the work',
      required: true
    },
    {
      id: 'lockout_boundaries',
      text: 'Worker(s) identify the boundaries of the lockout area',
      required: true
    },
    {
      id: 'lockout_tests',
      text: 'Worker(s) physically completes all lockout tests',
      required: true
    }
  ];
  
  const handleCriticalQuestionChange = (questionId, value) => {
    const currentAnswers = formData?.spv?.criticalQuestions || {};
    const updatedAnswers = { ...currentAnswers, [questionId]: value };
    handleInputChange('criticalQuestions', updatedAnswers);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <span className="text-blue-600 font-bold text-sm">5</span>
        </div>
        Safety Plan Verifier (SPV) Section
      </h2>
      {/* Critical Safety Questions */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Critical Safety Questions</h3>
        <div className="space-y-4">
          {criticalQuestions?.map((question) => (
            <div key={question?.id} className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 mb-3">
                {question?.text}
                {question?.required && <span className="text-red-500 ml-1">*</span>}
              </p>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={question?.id}
                    value="yes"
                    checked={formData?.spv?.criticalQuestions?.[question?.id] === 'yes'}
                    onChange={(e) => handleCriticalQuestionChange(question?.id, e?.target?.value)}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={question?.id}
                    value="no"
                    checked={formData?.spv?.criticalQuestions?.[question?.id] === 'no'}
                    onChange={(e) => handleCriticalQuestionChange(question?.id, e?.target?.value)}
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={question?.id}
                    value="na"
                    checked={formData?.spv?.criticalQuestions?.[question?.id] === 'na'}
                    onChange={(e) => handleCriticalQuestionChange(question?.id, e?.target?.value)}
                    className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">N/A</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* SPV Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Input
          label="SPV Name"
          type="text"
          placeholder="Safety Plan Verifier name"
          value={formData?.spv?.spvName || ''}
          onChange={(e) => handleInputChange('spvName', e?.target?.value)}
          error={errors?.spvName}
          required
        />

        <Input
          label="SPV Employee ID"
          type="text"
          placeholder="SPV employee ID"
          value={formData?.spv?.spvEmployeeId || ''}
          onChange={(e) => handleInputChange('spvEmployeeId', e?.target?.value)}
          error={errors?.spvEmployeeId}
          required
        />

        <Input
          label="Verification Date"
          type="date"
          value={formData?.spv?.verificationDate || new Date()?.toISOString()?.split('T')?.[0]}
          onChange={(e) => handleInputChange('verificationDate', e?.target?.value)}
          error={errors?.verificationDate}
          required
        />

        <Input
          label="Verification Time"
          type="time"
          value={formData?.spv?.verificationTime || new Date()?.toTimeString()?.slice(0, 5)}
          onChange={(e) => handleInputChange('verificationTime', e?.target?.value)}
          error={errors?.verificationTime}
          required
        />
      </div>
      {/* Digital Signature */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Digital Signature</h3>
        
        {!isSignaturePadOpen && !formData?.spv?.signature && (
          <Button
            variant="outline"
            onClick={() => setIsSignaturePadOpen(true)}
            iconName="Edit"
            iconPosition="left"
          >
            Add Digital Signature
          </Button>
        )}

        {isSignaturePadOpen && (
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Please sign in the box below to verify the safety assessment:
              </p>
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="border border-gray-300 rounded cursor-crosshair bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={clearSignature}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Clear
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsSignaturePadOpen(false)}
                iconName="Check"
                iconPosition="left"
              >
                Save Signature
              </Button>
            </div>
          </div>
        )}

        {formData?.spv?.signature && !isSignaturePadOpen && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Signature Captured</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSignaturePadOpen(true)}
                iconName="Edit"
                iconPosition="left"
              >
                Edit
              </Button>
            </div>
            <img 
              src={formData?.spv?.signature} 
              alt="Digital signature" 
              className="border border-gray-200 rounded max-w-xs"
            />
            {formData?.spv?.signatureTimestamp && (
              <p className="text-xs text-gray-500 mt-2">
                Signed on: {new Date(formData.spv.signatureTimestamp)?.toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
      {/* Additional Comments */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Additional Comments or Recommendations
        </label>
        <textarea
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter any additional safety comments or recommendations..."
          value={formData?.spv?.comments || ''}
          onChange={(e) => handleInputChange('comments', e?.target?.value)}
        />
      </div>
      {errors?.spv && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors?.spv}</p>
        </div>
      )}
    </div>
  );
};

export default SPVSection;