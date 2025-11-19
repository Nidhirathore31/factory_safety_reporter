import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import FormHeader from './components/FormHeader';
import EmployeeInfoSection from './components/EmployeeInfoSection';
import HazardCategory from './components/HazardCategory';
import InspectionChecklist from './components/InspectionChecklist';
import SPVSection from './components/SPVSection';
import CompletionSidebar from './components/CompletionSidebar';

const PreJobSafetySurveyForm = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [name,setName] = useState("")
  const role = localStorage.getItem("userRole")
  const [formType, setFormType] = useState('operational');
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employeeNames: '',
    employeeId: '',
    date: new Date()?.toISOString()?.split('T')?.[0],
    time: new Date()?.toTimeString()?.slice(0, 5),
    shift: '',
    department: '',
    jobTask: '',
    location: '',
    inspectionChecklist: {},
    spv: {
      criticalQuestions: {},
      spvName: '',
      spvEmployeeId: '',
      verificationDate: new Date()?.toISOString()?.split('T')?.[0],
      verificationTime: new Date()?.toTimeString()?.slice(0, 5),
      signature: '',
      signatureTimestamp: '',
      comments: ''
    }
  });
  const [errors, setErrors] = useState({});

  // Inspection categories data
  const inspectionCategories = [
    {
      id: 'ppe',
      name: 'PPE',
      icon: 'Shield',
      description: 'Personal protective equipment inspection',
      hazards: [
        { id: 'required_basic_ppe', name: 'Required Basic PPE' },
        { id: 'specialty_ppe', name: 'Specialty PPE' },
        { id: 'good_condition', name: 'Good Condition' },
        { id: 'clean', name: 'Clean' }
      ]
    },
    {
      id: 'work_area',
      name: 'Work Area',
      icon: 'Briefcase',
      description: 'Work area lighting, cleanliness, and changes',
      hazards: [
        { id: 'adequate_lighting', name: 'Adequate Lighting?' },
        { id: 'area_clean', name: 'Area Clean (dust/debris)?' },
        { id: 'other_workers', name: 'Other workers in the area?' },
        { id: 'anything_changed', name: 'Anything Changed?' }
      ]
    },
    {
      id: 'standing_surface',
      name: 'Standing Surface',
      icon: 'Square',
      description: 'Type and condition of standing/walking surface',
      hazards: [
        { id: 'flat', name: 'Flat' },
        { id: 'sloped', name: 'Sloped' },
        { id: 'uneven_obstacles', name: 'Uneven/Obstacles' },
        { id: 'slippery', name: 'Slippery' },
        { id: 'ladders_stairs', name: 'Ladders/Stairs' }
      ]
    },
    {
      id: 'tools',
      name: 'Tools',
      icon: 'Tool',
      description: 'Tool condition and inspection',
      hazards: [
        { id: 'hand_tools', name: 'Hand Tools' },
        { id: 'power_tools', name: 'Power Tools' },
        { id: 'lifting_device', name: 'Lifting Device' },
        { id: 'rigging', name: 'Rigging' },
        { id: 'ladder', name: 'Ladder' },
        { id: 'electrical_cords', name: 'Electrical Cords' },
        { id: 'gfi', name: 'Ground Fault Interrupters (GFI)' },
        { id: 'other_tools', name: 'Other' },
        { id: 'good_condition_tools', name: 'Good Condition' }
      ]
    },
    {
      id: 'equipment',
      name: 'Equipment',
      icon: 'Truck',
      description: 'Equipment readiness and inspection logs',
      hazards: [
        { id: 'forklift', name: 'Forklift' },
        { id: 'skid_steer', name: 'Skid Steer' },
        { id: 'awp', name: 'AWP (Boom/Scissor)' },
        { id: 'crane', name: 'Crane' },
        { id: 'inspection_log', name: 'Inspection Log' }
      ]
    },
    {
      id: 'permits',
      name: 'Permits',
      icon: 'FileText',
      description: 'Work permits required for the job',
      hazards: [
        { id: 'hot_work', name: 'Hot Work' },
        { id: 'work_at_heights', name: 'Work at Heights' },
        { id: 'awp_permit', name: 'AWP' },
        { id: 'confined_space', name: 'Confined Space' },
        { id: 'crane_rigging_permit', name: 'Crane/Rigging' },
        { id: 'energized_work', name: 'Energized Work' }
      ]
    }
  ];


  // Hazard categories data
  const hazardCategories = [
    {
      id: 'slip',
      name: 'Slip/Trip/Fall',
      icon: 'AlertTriangle',
      description: 'Surface conditions and walking hazards',
      hazards: [
        {
          id: 'wet_surfaces',
          name: 'Wet or Slippery Surfaces',
          description: 'Oil spills, water, ice, or other slippery conditions',
          severity: 'medium',
          controlMeasures: [
            { id: 'high', name: 'High' },
            { id: 'medium', name: 'Medium' },
            { id: 'low', name: 'Low' }
          ]
        },
        {
          id: 'uneven_surfaces',
          name: 'Uneven Walking Surfaces',
          description: 'Holes, cracks, raised surfaces, or debris',
          severity: 'medium',
          controlMeasures: [
            { id: 'repair', name: 'Surfaces repaired or marked' },
            { id: 'lighting', name: 'Adequate lighting provided' }
          ]
        }
      ]
    },
    {
      id: 'fall',
      name: 'Fall From Height',
      icon: 'ArrowDown',
      description: 'Working at elevated positions',
      hazards: [
        {
          id: 'elevated_work',
          name: 'Elevated Work Positions',
          description: 'Ladders, platforms, scaffolding, rooftops',
          severity: 'high',
          controlMeasures: [
            { id: 'fall_protection', name: 'Fall protection harness used' },
            { id: 'guardrails', name: 'Guardrails installed' },
            { id: 'ladder_inspection', name: 'Ladders inspected before use' }
          ]
        }
      ]
    },
    {
      id: 'overhead',
      name: 'Overhead/Suspended',
      icon: 'ArrowUp',
      description: 'Objects or equipment above work area',
      hazards: [
        {
          id: 'overhead_loads',
          name: 'Overhead Loads',
          description: 'Cranes, hoists, suspended materials',
          severity: 'high',
          controlMeasures: [
            { id: 'hard_hat', name: 'Hard hat worn' },
            { id: 'load_inspection', name: 'Load securing inspected' },
            { id: 'exclusion_zone', name: 'Exclusion zones established' }
          ]
        }
      ]
    },
    {
      id: 'sharp',
      name: 'Cut by Sharp Edges',
      icon: 'Scissors',
      description: 'Sharp tools, metal edges, and cutting hazards',
      hazards: [
        {
          id: 'sharp_tools',
          name: 'Sharp Tools and Equipment',
          description: 'Knives, saws, cutting blades, metal edges',
          severity: 'high',
          controlMeasures: [
            { id: 'cut_protection', name: 'Cut-resistant gloves worn' },
            { id: 'tool_inspection', name: 'Tools inspected before use' },
            { id: 'proper_handling', name: 'Proper handling techniques used' }
          ]
        }
      ]
    },
    {
      id: 'repetitive',
      name: 'Repetitive Strains',
      icon: 'RotateCw',
      description: 'Repetitive motions and ergonomic hazards',
      hazards: [
        {
          id: 'repetitive_motion',
          name: 'Repetitive Motion',
          description: 'Repetitive lifting, bending, twisting motions',
          severity: 'medium',
          controlMeasures: [
            { id: 'job_rotation', name: 'Job rotation implemented' },
            { id: 'ergonomic_tools', name: 'Ergonomic tools provided' },
            { id: 'stretch_breaks', name: 'Regular stretch breaks taken' }
          ]
        }
      ]
    },
    {
      id: 'body_position',
      name: 'Body Position',
      icon: 'UserCheck',
      description: 'Comfortable or awkward working positions',
      hazards: [
        {
          id: 'awkward_posture',
          name: 'Awkward Posture',
          description: 'Twisting, bending, or reaching for extended periods',
          severity: 'medium',
          controlMeasures: [
            { id: 'ergonomic_setup', name: 'Ergonomic setup used' },
            { id: 'position_change', name: 'Regular position changes' }
          ]
        }
      ]
    },
    {
      id: 'weight_lifting',
      name: 'Weight / Lifting (Heavy/Awkward)',
      icon: 'Package',
      description: 'Manual handling of heavy or awkward loads',
      hazards: [
        {
          id: 'heavy_lifting',
          name: 'Heavy Lifting',
          description: 'Lifting items over 50 lbs or awkward shapes',
          severity: 'high',
          controlMeasures: [
            { id: 'team_lift', name: 'Two-person lift used' },
            { id: 'mechanical_aid', name: 'Mechanical lifting device used' },
            { id: 'proper_technique', name: 'Proper lifting techniques applied' }
          ]
        }
      ]
    },
    {
      id: 'struck_by',
      name: 'Struck By or Against',
      icon: 'Target',
      description: 'Hazard of being hit or colliding with objects',
      hazards: [
        {
          id: 'moving_objects',
          name: 'Moving Objects',
          description: 'Forklifts, swinging loads, or shifting materials',
          severity: 'high',
          controlMeasures: [
            { id: 'awareness', name: 'Situational awareness maintained' },
            { id: 'safe_distance', name: 'Safe working distance maintained' }
          ]
        }
      ]
    },
    {
      id: 'people',
      name: 'People',
      icon: 'Users',
      description: 'Interactions and coordination with other workers',
      hazards: [
        {
          id: 'coordination',
          name: 'Coordination Hazards',
          description: 'Poor communication between workers, supervisors, operators',
          severity: 'medium',
          controlMeasures: [
            { id: 'control_zone', name: 'Control zones established' },
            { id: 'signage', name: 'Signage posted' },
            { id: 'verbal_comm', name: 'Verbal communication maintained' }
          ]
        }
      ]
    },
    {
      id: 'projectiles',
      name: 'Projectiles/Flying Debris',
      icon: 'Wind',
      description: 'Objects that may become airborne',
      hazards: [
        {
          id: 'flying_debris',
          name: 'Flying Debris',
          description: 'Wood chips, metal shavings, dust particles',
          severity: 'medium',
          controlMeasures: [
            { id: 'eye_protection', name: 'Safety glasses/goggles worn' },
            { id: 'barriers', name: 'Physical barriers installed' },
            { id: 'dust_control', name: 'Dust control measures active' }
          ]
        }
      ]
    },
    {
      id: 'combustible',
      name: 'Combustible Dust',
      icon: 'Flame',
      description: 'Fire and explosion hazards from dust',
      hazards: [
        {
          id: 'wood_dust',
          name: 'Wood Dust Accumulation',
          description: 'Sawdust, wood particles, combustible materials',
          severity: 'high',
          controlMeasures: [
            { id: 'dust_collection', name: 'Dust collection system active' },
            { id: 'housekeeping', name: 'Regular housekeeping performed' },
            { id: 'ignition_control', name: 'Ignition sources controlled' }
          ]
        }
      ]
    },
    {
      id: 'energy_sources',
      name: 'Energy Sources',
      icon: 'Zap',
      description: 'Hazards from electrical, hydraulic, and other energy types',
      hazards: [
        {
          id: 'electrical_hazard',
          name: 'Electrical Hazards',
          description: 'Live wires, power tools, exposed circuits',
          severity: 'high',
          controlMeasures: [
            { id: 'lockout_tagout', name: 'Lockout/tagout applied' },
            { id: 'ppe', name: 'Electrical PPE worn' }
          ]
        },
        {
          id: 'hydraulic_hazard',
          name: 'Hydraulic Hazards',
          description: 'High-pressure fluid leaks or bursts',
          severity: 'high',
          controlMeasures: [
            { id: 'maintenance', name: 'Regular inspection and maintenance' }
          ]
        },
        {
          id: 'gravity_hazard',
          name: 'Gravity Hazards',
          description: 'Falling objects due to height',
          severity: 'high',
          controlMeasures: [
            { id: 'secure_loads', name: 'Loads secured' }
          ]
        }
      ]
    },
    {
      id: 'working_alone',
      name: 'Working Alone/Isolation',
      icon: 'UserX',
      description: 'Risks of working without direct supervision or assistance',
      hazards: [
        {
          id: 'isolation_risk',
          name: 'Isolation Risk',
          description: 'No immediate help available in emergencies',
          severity: 'medium',
          controlMeasures: [
            { id: 'check_ins', name: 'Regular check-ins required' },
            { id: 'communication', name: 'Reliable communication device used' }
          ]
        }
      ]
    },
    {
      id: 'other',
      name: 'Other',
      icon: 'MoreHorizontal',
      description: 'Any other hazards not listed in predefined categories',
      hazards: [
        {
          id: 'custom_hazard',
          name: 'Custom Hazard',
          description: 'User-defined hazard description',
          severity: 'variable',
          controlMeasures: [
            { id: 'custom_control', name: 'Custom control measures applied' }
          ]
        }
      ]
    }
  ];

  // Auto-save functionality
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      setAutoSaveStatus('saving');
      // Simulate save
      setTimeout(() => {
        localStorage.setItem('tolko-safety-form', JSON.stringify(formData));
        setAutoSaveStatus('saved');
      }, 1000);
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [formData]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('tolko-safety-form');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);

  const handleFormDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev?.[categoryId]
    }));
  };

  const calculateProgress = () => {
    const totalFields = 20; // Approximate total form fields
    let completedFields = 0;

    // Employee info fields
    const employeeFields = ['employeeNames', 'employeeId', 'date', 'time', 'shift', 'department', 'jobTask', 'location'];
    completedFields += employeeFields?.filter(field => formData?.[field])?.length;

    // Hazard categories
    const hasHazardSelections = Object.keys(formData)?.some(key => 
      hazardCategories?.some(cat => key?.startsWith(cat?.id))
    );
    if (hasHazardSelections) completedFields += 4;

    // Inspection checklist
    if (formData?.inspectionChecklist && Object.keys(formData?.inspectionChecklist)?.length > 0) {
      completedFields += 4;
    }

    // SPV section
    const spvData = formData?.spv || {};
    if (spvData?.spvName) completedFields++;
    if (spvData?.signature) completedFields++;
    if (spvData?.criticalQuestions && Object.keys(spvData?.criticalQuestions)?.length > 0) completedFields += 2;

    return Math.min(Math.round((completedFields / totalFields) * 100), 100);
  };

  const validateForm = () => {
    const newErrors = {};

    // Required employee fields
    const requiredFields = ['employeeNames', 'employeeId', 'shift', 'department', 'jobTask', 'location'];
    requiredFields?.forEach(field => {
      if (!formData?.[field]) {
        newErrors[field] = `${field?.replace(/([A-Z])/g, ' $1')?.replace(/^./, str => str?.toUpperCase())} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // const handleSubmit = async () => {
  //   if (!validateForm()) {
  //     return;
  //   }

  //   setIsSubmitting(true);
    
  //   try {
  //     // Simulate form submission
  //     await new Promise(resolve => setTimeout(resolve, 2000));
      
  //     // Clearcon= saved data
  //     localStorage.removeItem('tolko-safety-form');
      
  //     // Navigate to success page or dashboard
  //     navigate('/worker-dashboard-form-selection', { 
  //       state: { 
  //         message: 'Safety form submitted successfully!',
  //         formId: `ASPEN-${new Date()?.getFullYear()}-${String(Math.floor(Math.random() * 10000))?.padStart(4, '0')}`
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Form submission error:', error);
  //     setAutoSaveStatus('error');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  const handleSubmit = async () => {
    setIsSubmitting(true);
  
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      localStorage.removeItem('tolko-safety-form');
  
      navigate('/worker-dashboard-form-selection', { 
        state: { 
          message: 'Safety form submitted successfully!',
          formId: `ASPEN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
        }
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setAutoSaveStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  useEffect(()=>{
    if(role=="supervisor"){
      setName("Sarah Martinez")
    }else if (role == "worker"){
      setName("John Smith")
    }
  },[])

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={role} userName={name} />
      <Sidebar 
        userRole={role} 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={`transition-all duration-200 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}`}>
        <FormHeader
          formType={formType}
          progress={progress}
          autoSaveStatus={autoSaveStatus}
          onFormTypeChange={setFormType}
        />
        
        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-6 space-y-8">
            <EmployeeInfoSection
              formData={formData}
              onChange={handleFormDataChange}
              errors={errors}
            />

            {/* Inspections and Site Conditions Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                Inspections and Site Conditions
              </h2>

              <div className="space-y-4">
                {inspectionCategories
                  .filter(category => {
                    if (formType === "operational" && ["equipment", "permits"].includes(category.id)) {
                      return false; // hide Equipment & Permits in operational form
                    }
                    return true;
                  })
                  .map((category) => (
                    <HazardCategory
                      key={category.id}
                      category={category}
                      isExpanded={expandedCategories?.[category.id]}
                      onToggle={() => handleCategoryToggle(category.id)}
                      formData={formData}
                      onChange={handleFormDataChange}
                      formType={formType}
                    />
                ))}
              </div>
            </div>


            {/* Hazard Assessment Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                Hazard Identification & Control
              </h2>

              <div className="space-y-4">
                {hazardCategories
                  .filter(category => {
                    if (
                      formType === "maintenance" && 
                      ["repetitive", "body_position", "weight_lifting"].includes(category.id)
                    ) {
                      return false; // hide only in maintenance
                    }
                    return true;
                  })
                  .map((category) => (
                    <HazardCategory
                      key={category.id}
                      category={category}
                      isExpanded={expandedCategories?.[category.id]}
                      onToggle={() => handleCategoryToggle(category.id)}
                      formData={formData}
                      onChange={handleFormDataChange}
                      formType={formType}
                    />
                ))}
              </div>
            </div>

            <InspectionChecklist
              formData={formData}
              onChange={handleFormDataChange}
              errors={errors}
            />

            <SPVSection
              formData={formData}
              onChange={handleFormDataChange}
              errors={errors}
            />
          </div>

          {/* Completion Sidebar */}
          <CompletionSidebar
            formData={formData}
            errors={errors}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            formType={formType}
          />
        </div>
      </div>
    </div>
  );
};

export default PreJobSafetySurveyForm;