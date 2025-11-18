import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const InspectionChecklist = ({ formData, onChange, errors }) => {
  const inspectionCategories = [
    {
      id: 'help',
      name: 'Help',
      icon: 'Users',
      questions: [
        { id: 'help_available', text: 'Do I need help?' },
        { id: 'help_trained', text: 'Am I trained?' },
        { id: 'help_communication', text: 'Who is going to help me?' }
      ]
    },
    {
      id: 'surroundings',
      name: 'Surroundings',
      icon: 'Eye',
      questions: [
        { id: 'area_clear', text: `What is my 10' circle of danger?` },
        { id: 'lighting_adequate', text: 'Falls, trips, falling material, energy sources.' },
        // { id: 'ventilation_proper', text: 'Is ventilation proper?' },
        // { id: 'emergency_exits', text: 'Are emergency exits accessible?' }
      ]
    },
    {
      id: 'standing',
      name: 'Standing',
      icon: 'User',
      questions: [
        { id: 'surface_stable', text: 'What am I standing on?' },
        { id: 'anti_slip', text: 'Is it stable, free of debris, slippery, too small?' },
        // { id: 'proper_footwear', text: 'Is proper footwear being worn?' }
      ]
    },
    {
      id: 'tools',
      name: 'Tools',
      icon: 'Wrench',
      questions: [
        { id: 'tools_inspected', text: 'Am I using the proper tool for the job?' },
        { id: 'tools_proper', text: 'Am I using it correctly?' },
        { id: 'tools_maintained', text: 'Is it in good condition?' },
        // { id: 'tools_stored', text: 'Are tools properly stored when not in use?' }
      ]
    },
    {
      id: 'people',
      name: 'People',
      icon: 'Users2',
      questions: [
        { id: 'people_trained', text: 'Anyone else in the area?' },
        { id: 'people_authorized', text: 'Did I communicate my work activity to them?' },
        // { id: 'people_aware', text: 'Are all personnel aware of hazards?' }
      ]
    },
    {
      id: 'breaks_free',
      name: 'Breaks Free',
      icon: 'Coffee',
      questions: [
        { id: 'break_schedule', text: 'Is there a pinch point, or bite zone of the equipment?' },
        { id: 'break_area_safe', text: 'What tool can slip and hit me?' },
        { id: 'fatigue_management', text: 'Are there boards under tension?' },
        { id: 'breaks_free', text: 'If it breaks free, where will it hit me?' }
      ]
    },
    {
      id: 'weight',
      name: 'Weight',
      icon: 'Package',
      questions: [
        { id: 'weight_limits', text: 'How much weight am I dealing with?' },
        { id: 'lifting_technique', text: 'What is the best way to lift it?' },
        { id: 'mechanical_aids', text: 'Do I need help or a lifting device?' }
      ]
    },
    {
      id: 'position',
      name: 'Position',
      icon: 'Move',
      questions: [
        { id: 'ergonomic_position', text: 'What position is my body in?' },
        { id: 'position_changes', text: 'Is it awkward?' },
        { id: 'support_available', text: 'awkward? In the line of fire?' },
        { id: 'repetitive_strain', text: 'Is there potential for repetitive strain?' },
      ]
    },
    {
      id: 'ppe',
      name: 'PPE',
      icon: 'Shield',
      questions: [
        { id: 'ppe_available', text: 'Do I have the right PPE for the task?' },
        { id: 'ppe_condition', text: 'Is it in good condition?' },
        // { id: 'ppe_proper_fit', text: 'Does PPE fit properly?' },
        // { id: 'ppe_training', text: 'Has PPE training been completed?' }
      ]
    },
    {
      id: 'lockout',
      name: 'Lockout',
      icon: 'Lock',
      questions: [
        { id: 'lockout_required', text: 'Have I considered all the energy sources?' },
        { id: 'lockout_procedures', text: 'Have I secured locks to all the required locations?' },
        { id: 'lockout_verified', text: 'Are all lockout tests completed?' },
        // { id: 'lockout_authorized', text: 'Is personnel authorized for lockout?' }
      ]
    }
  ];

  const handleQuestionChange = (categoryId, questionId, checked) => {
    const currentData = formData?.inspectionChecklist || {};
    const categoryData = currentData?.[categoryId] || {};
    
    const updatedData = {
      ...currentData,
      [categoryId]: {
        ...categoryData,
        [questionId]: checked
      }
    };
    
    onChange('inspectionChecklist', updatedData);
  };

  const getCategoryCompletion = (category) => {
    const categoryData = formData?.inspectionChecklist?.[category?.id] || {};
    const answered = Object.values(categoryData)?.filter(Boolean)?.length;
    return { answered, total: category?.questions?.length };
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <span className="text-blue-600 font-bold text-sm">4</span>
        </div>
        Inspection Checklist
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {inspectionCategories?.map((category) => {
          const completion = getCategoryCompletion(category);
          const isComplete = completion?.answered === completion?.total;
          
          return (
            <div key={category?.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isComplete ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Icon 
                      name={category?.icon} 
                      size={16} 
                      className={isComplete ? 'text-green-600' : 'text-gray-500'}
                    />
                  </div>
                  <h3 className="font-medium text-gray-900">{category?.name}</h3>
                </div>
                <div className="text-sm text-gray-500">
                  {completion?.answered}/{completion?.total}
                </div>
              </div>
              <div className="space-y-3">
                {category?.questions?.map((question) => (
                  <div key={question?.id} className="flex items-start space-x-3">
                    <Checkbox
                      checked={formData?.inspectionChecklist?.[category?.id]?.[question?.id] || false}
                      onChange={(e) => handleQuestionChange(category?.id, question?.id, e?.target?.checked)}
                      className="mt-0.5"
                    />
                    <label className="text-sm text-gray-700 leading-5">
                      {question?.text}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {errors?.inspectionChecklist && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors?.inspectionChecklist}</p>
        </div>
      )}
    </div>
  );
};

export default InspectionChecklist;