import React, { useState, useMemo, useEffect } from "react";
import Header from "components/ui/Header";
import Sidebar from "components/ui/Sidebar";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import Button from "components/ui/Button";
import Icon from "components/AppIcon";
import { Checkbox } from "components/ui/Checkbox";
import { useNavigate } from "react-router-dom";

const ElectricalPass = ({ sidebarCollapsed }) => {
  const [open, setOpen] = useState(false);
  const [isRiskAssessmentExpanded, setIsRiskAssessmentExpanded] = useState(false);
  const [shockImprobableExpanded, setShockImprobableExpanded] = useState(false);
  const [shockPossibleExpanded, setShockPossibleExpanded] = useState(false);
  const [arcImprobableExpanded, setArcImprobableExpanded] = useState(false);
  const [arcPossibleExpanded, setArcPossibleExpanded] = useState(false);
  const [riskAssessmentSelections, setRiskAssessmentSelections] = useState({
    improbable: false,
    improbable_controls: {},
    possible: false,
    possible_controls: {}
  });
  const [shockHazardSelections, setShockHazardSelections] = useState({
    improbable: {
      under30v: false,
      under30v_controls: {},
      over30v: false,
      over30v_controls: {}
    },
    possible: {
      under30v: false,
      under30v_controls: {},
      over30v: false,
      over30v_controls: {}
    }
  });
  const [arcHazardSelections, setArcHazardSelections] = useState({
    improbable: {
      under12: false,
      under12_controls: {},
      over12: false,
      over12_controls: {}
    },
    possible: {
      under12: false,
      under12_controls: {},
      over12: false,
      over12_controls: {}
    }
  });

  const [form, setForm] = useState({
    date: "",
    time: "",
    shift: "",
    employees: "",
    jobTaskArea: "",
    jobTaskLocation: "",
    jobTaskDescription: "",

    equipment: [],
    condition: "",
    vac: "",
    vdc: "",
    arcFlashEnergy: "",
    shockBoundary: "",
    arcFlashBoundary: "",
    ppe: [],
    restrictedApproach: "",
    insulatedTools: "",
    barricades: "",
    insulation: "",
    voltageTestPerformed: "",
    comments: "",
    riskAssessment: {
      improbable: false,
      improbable_controls: {},
      possible: false,
      possible_controls: {}
    },
    shockHazard: {
      improbable: {
        under30v: false,
        under30v_controls: {},
        over30v: false,
        over30v_controls: {}
      },
      possible: {
        under30v: false,
        under30v_controls: {},
        over30v: false,
        over30v_controls: {}
      }
    },
    arcHazard: {
      improbable: {
        under12: false,
        under12_controls: {},
        over12: false,
        over12_controls: {}
      },
      possible: {
        under12: false,
        under12_controls: {},
        over12: false,
        over12_controls: {}
      }
    }
  });
  const navigate = useNavigate()
  const shiftOptions = [
    { value: 'day', label: 'Day Shift (6:00 AM - 2:00 PM)' },
    { value: 'afternoon', label: 'Afternoon Shift (2:00 PM - 10:00 PM)' },
    { value: 'night', label: 'Night Shift (10:00 PM - 6:00 AM)' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem("electrical-pass-form");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
        if (parsed.riskAssessment) {
          setRiskAssessmentSelections(parsed.riskAssessment);
        }
        if (parsed.shockHazard) {
          setShockHazardSelections(parsed.shockHazard);
        }
        if (parsed.arcHazard) {
          setArcHazardSelections(parsed.arcHazard);
        }
      } catch (err) {
        console.error("Failed to parse saved electrical pass form", err);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("electrical-pass-form", JSON.stringify(form));
    }, 1500);

    return () => clearTimeout(timer);
  }, [form]);

  const progress = useMemo(() => {
    const trackedFields = [
      form.date,
      form.time,
      form.shift,
      form.employees,
      form.jobTaskArea,
      form.jobTaskLocation,
      form.jobTaskDescription,
      form.condition,
      form.vac,
      form.vdc,
      form.arcFlashEnergy,
    ];

    const fieldCount = trackedFields.length + 1; // +1 accounts for equipment selection
    const filledFields =
      trackedFields.filter((val) => val && val.toString().trim() !== "")
        .length + (form.equipment.length > 0 ? 1 : 0);

    return Math.min(100, (filledFields / fieldCount) * 100 || 0);
  }, [form]);

  const getProgressColor = () => {
    if (progress < 40) return "bg-red-500";
    if (progress < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const toggleCheckbox = (field, value) => {
    setForm((prev) => {
      const list = prev[field];
      return {
        ...prev,
        [field]: list.includes(value)
          ? list.filter((i) => i !== value)
          : [...list, value],
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:",form);
    navigate("/worker-dashboard-form-selection");
  };

  const handleShiftChange =(field,value)=>{
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  }
  

  const equipmentList = useMemo(
    () => [
      "Panelboard",
      "MCC",
      "VFD",
      "Switchgear",
      "Disconnect",
      "Breaker",
      "Starter",
      "Transformer",
    ],
    []
  );

  const ppeList = useMemo(
    () => [
      "Gloves",
      "Safety Glasses",
      "Face Shield",
      "FR Clothing",
      "Insulated Tools",
      "Hearing Protection",
      "Hard Hat",
      "Voltage Rated Gloves",
    ],
    []
  );

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar collapsed={sidebarCollapsed} />

        <div
          className={`${
            sidebarCollapsed ? "lg:ml-20" : "lg:ml-60"
          } flex-1 transition-all p-6`}
        >
          <div className="max-w-5xl mx-auto">
            {/* Progress Section */}
            <div className="sticky top-0 z-20 mb-6">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Electrical Pass
                    </h2>
                    <p className="text-sm text-gray-500">
                      Form completion progress
                    </p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* NEW SECTION — Added From Image */}
            <div className="bg-white shadow rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Job Information</h3>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <Input
                  label="Date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  placeholder="Enter date"
                />
                <Input
                  label="Time"
                  name="time"
                  type="time"
                  value={form.time}
                  onChange={handleChange}
                  placeholder="Enter time"
                />
                {/* <Input
                  label="Shift"
                  name="shift"
                  value={form.shift}
                  onChange={handleChange}
                  placeholder="Enter shift"
                /> */}
                <Select
          label="Shift"
          name="shift"
          options={shiftOptions}
          value={form?.shift || ''}
          // onChange={}
          onChange={(value) => handleShiftChange('shift', value)}
          // error={errors?.shift}
          required
          placeholder="Select shift"
          className="col-span-1"
        />
              </div>

              <Input
                label="Employee(s)"
                name="employees"
                value={form.employees}
                onChange={handleChange}
                placeholder="Enter employee names"
              />

              <div className="mt-4">
                <Input
                  label="Job/Task Area"
                  name="jobTaskArea"
                  value={form.jobTaskArea}
                  onChange={handleChange}
                  placeholder="Enter job/task area"
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Job/Task Location"
                  name="jobTaskLocation"
                  value={form.jobTaskLocation}
                  onChange={handleChange}
                  placeholder="Enter location"
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Job/Task Description of Work Performed"
                  name="jobTaskDescription"
                  value={form.jobTaskDescription}
                  onChange={handleChange}
                  placeholder="Describe work performed"
                />
              </div>
            </div>

            <div className="bg-white shadow rounded-2xl p-6 mb-6">
              <h3 className="text-center text-xl font-semibold mb-4">
                Shock and Arc Flash Hazard Assessment
              </h3>
              <h5 className="text-lg font-semibold mb-4"> Equipment</h5>
              <div className="grid grid-cols-2 gap-3">
                {equipmentList.map((item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.equipment.includes(item)}
                      onChange={() => toggleCheckbox("equipment", item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              <h5 className="text-lg font-semibold mb-4">
                Equipment Condition
              </h5>
              <div className="flex gap-6">
                {["Normal", "Abnormal"].map((val) => (
                  <label key={val} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="condition"
                      value={val}
                      checked={form.condition === val}
                      onChange={handleChange}
                    />
                    {val}
                  </label>
                ))}
              </div>

              <h5 className="text-lg font-semibold mb-4">Voltage Rating</h5>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="VAC"
                  name="vac"
                  value={form.vac}
                  onChange={handleChange}
                  placeholder="Enter VAC"
                />
                <Input
                  label="VDC"
                  name="vdc"
                  value={form.vdc}
                  onChange={handleChange}
                  placeholder="Enter VDC"
                />
              </div>

              <br />
              <p className="text-lg font-semibold mb-4">
                {" "}
                Arc Flash Incident Energy (cal/cm²)
              </p>
              <Input
                label="Incident Energy"
                name="arcFlashEnergy"
                value={form.arcFlashEnergy}
                onChange={handleChange}
                placeholder="Enter value"
              />
            </div>

            {/* energy electrical boundaries */}
            {/* NEW CARD — Energized Electrical Boundaries */}
            <div className="bg-white shadow rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Energized Electrical Boundaries
              </h3>

              <p className="text-center text-red-600 text-sm mb-4">
                Work Zone boundaries are required for Incident Energy 1.2 – 12
                cal/cm² & Voltage &gt;150VAC – 750VAC
              </p>

              <table className="w-full border border-gray-300">
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="p-3 font-semibold border-r border-gray-300">
                      Electrical Work Zone Barricade (EWB)
                    </td>
                    <td className="p-3">
                      EWB shall be established at 3.0m (10ft)
                    </td>
                  </tr>

                  <tr className="border-b border-gray-300">
                    <td className="p-3 font-semibold border-r border-gray-300">
                      Restricted Approach Boundary (RAB)
                    </td>
                    <td className="p-3">
                      RAB shall be 0.3m (1ft)
                      <br />
                      <span className="text-red-600">
                        Qualified persons must be guarded or insulated from
                        exposed conductors
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold border-r border-gray-300">
                      Arc Flash Boundary (AFB)
                    </td>
                    <td className="p-3">
                      AFB shall be 1.85m (6ft)
                      <br />
                      <span className="text-red-600">
                        All personnel must wear appropriate PPE inside the AFB
                        while arc flash hazard exists
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ppe requirments */}
            {/* NEW CARD — PPE Requirements */}
            <div className="bg-white shadow rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                PPE Requirements
              </h3>

              <table className="w-full border border-gray-300">
                <tbody>
                  {/* Row 1 */}
                  <tr className="border-b border-gray-300">
                    <td className="p-3 font-semibold border-r border-gray-300 w-1/3">
                      &lt;30V and &lt;1.2 cal/cm²
                    </td>
                    <td className="p-3 w-1/2">
                      General use gloves, AF coveralls, eye protection, hard hat
                    </td>
                    <td className="p-3 text-right w-1/4">
                      Inspected
                      <input type="checkbox" className="ml-2" />
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="border-b border-gray-300">
                    <td className="p-3 font-semibold border-r border-gray-300">
                      &gt;30VAC to &lt;750VAC
                    </td>
                    <td className="p-3">
                      Class 0 Rubber insulated gloves with leather protectors
                    </td>
                    <td className="p-3 text-right">
                      Inspected
                      <input type="checkbox" className="ml-2" />
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr>
                    <td className="p-3 font-semibold border-r border-gray-300">
                      1.2 – 12 cal/cm²
                    </td>
                    <td className="p-3">
                      <span className="font-semibold">
                        Arc Flash PPE min. rating 12 cal/cm²
                      </span>
                      <br />
                      (AF coveralls, face shield/balaclava or hood, hearing
                      protection)
                    </td>
                    <td className="p-3 text-right">
                      Inspected
                      <input type="checkbox" className="ml-2" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* energy isolation */}
            {/* NEW CARD — Energy Isolation */}
            <div className="bg-white shadow rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Energy Isolation
              </h3>

              <table className="w-full border border-gray-300 text-sm">
                <tbody>
                  {/* Row 1 - Energized Work Beyond Diagnostic */}
                  <tr className="border-b border-gray-300">
                    <td className="p-3 font-semibold w-1/2">
                      Are you performing energized work beyond diagnostic?
                    </td>
                    <td className="p-3 flex items-center gap-4 w-1/2">
                      YES <input type="checkbox" className="ml-1" />
                      NO <input type="checkbox" className="ml-1" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td colSpan={2} className="p-2 text-red-600 text-center">
                      If yes, an Energized Electrical Permit is required. Stop
                      work and contact your supervisor
                    </td>
                  </tr>

                  {/* Row 2 - Isolation Required */}
                  <tr className="border-b border-gray-300">
                    <td className="p-3 font-semibold">
                      Is Isolation required?
                    </td>
                    <td className="p-3 flex items-center gap-4">
                      YES <input type="checkbox" />
                      NO <input type="checkbox" />
                      Diagnostic <input type="checkbox" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td colSpan={2} className="p-2 text-red-600 text-center">
                      If work scope is beyond diagnostic and isolation of energy
                      is not possible, stop work and contact your supervisor
                    </td>
                  </tr>

                  {/* Row 3 - Voltage Test Complete */}
                  <tr>
                    <td className="p-3 font-semibold">
                      Voltage test complete?
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-4">
                        Always <input type="checkbox" />
                      </div>
                      <div className="text-red-600 mt-1">
                        Approved 1000VAC meter required
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-white shadow rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-center mb-4">
                Physical Hazards Identification and Control
              </h3>

              {/* Table Header */}
              <div className="grid grid-cols-3 font-semibold border-b pb-2 mb-2">
                <div>Physical</div>
                <div>Detail / Description</div>
                <div>Actions and Controls</div>
              </div>

              {/* Repetitive Strains */}
              <div className="grid grid-cols-3 border-b py-3">
                <div>Repetitive Strains</div>
                <div></div>
                <div></div>
              </div>

              {/* Over Extension / Exertion */}
              <div className="grid grid-cols-3 border-b py-3">
                <div>Over Extension / Exertion</div>
                <div></div>
                <div></div>
              </div>

              {/* Body Position */}
              <div className="grid grid-cols-3 border-b py-3">
                <div>Body Position</div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Comfortable
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Awkward
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Work Above Head
                  </label>
                </div>
                <div></div>
              </div>

              {/* Weight / Lifting */}
              <div className="grid grid-cols-3 border-b py-3">
                <div>Weight / Lifting (Heavy / Awkward)</div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> &lt;50lbs
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> 50–80lbs
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> &gt;80lbs
                  </label>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> 1 Person
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> 2 Person
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Leverage
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Lift Device
                  </label>
                </div>
              </div>

              {/* Slip/Trip/Fall */}
              <div className="grid grid-cols-3 border-b py-3">
                <div>Slip / Trip / Fall</div>
                <div></div>
                <div></div>
              </div>

              {/* Cut by Sharp Edges */}
              <div className="grid grid-cols-3 border-b py-3">
                <div>Cut by Sharp Edges</div>
                <div></div>
                <div></div>
              </div>

              {/* Projectiles / Flying Debris */}
              <div className="grid grid-cols-3 border-b py-3">
                <div>Projectiles / Flying Debris</div>
                <div></div>
                <div></div>
              </div>

              {/* Overhead / Suspended */}
              <div className="grid grid-cols-3 border-b py-3">
                <div>Overhead / Suspended</div>
                <div></div>
                <div></div>
              </div>

              {/* Struck By or Against */}
              <div className="grid grid-cols-3 border-b py-3">
                <div>Struck By or Against</div>
                <div></div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Hands Free
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Body Clear
                  </label>
                </div>
              </div>

              {/* Fall From Height */}
              <div className="grid grid-cols-3 border-b py-3">
                <div>Fall From Height</div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> &lt;10ft
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> &gt;10ft
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> &gt;25ft
                  </label>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Equipment Inspected
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Total fall distance calculated
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Fall protection system appropriate
                  </label>
                </div>
              </div>

              {/* Combustible Dust */}
              <div className="grid grid-cols-3 border-b py-3">
                <div>Combustible Dust</div>
                <div></div>
                <div></div>
              </div>

              {/* People */}
              <div className="grid grid-cols-3 border-b py-3">
                <div>People</div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Operator
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Supervisor
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Co-Worker
                  </label>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Control Zone
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Signage
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Verbal Communication
                  </label>
                </div>
              </div>

              {/* Energy Sources */}
              <div className="grid grid-cols-3 border-b py-3">
                <div>Energy Sources</div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Electrical
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Hydraulic
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Air
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Gravity
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Rotation / Kinetic
                  </label>
                </div>
                <div></div>
              </div>

              {/* Working Alone / Isolation */}
              <div className="grid grid-cols-3 border-b py-3">
                <div>Working Alone / Isolation</div>
                <div></div>
                <div></div>
              </div>

              {/* Other */}
              <div className="grid grid-cols-3 border-b py-3">
                <div>Other</div>
                <div></div>
                <div></div>
              </div>

              {/* Tools / Process Improvement */}
              <p className="mt-4 font-semibold text-center">
                Are there any tools or processes that would make this job/task
                easier or more efficient?
              </p>
            </div>
            {/* risk assesment */}
            <div className="bg-white shadow rounded-2xl mb-6">
              {/* Accordion Header */}
              <button
                onClick={() => setIsRiskAssessmentExpanded(!isRiskAssessmentExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  Risk Assessment
                </h3>
                <Icon 
                  name={isRiskAssessmentExpanded ? 'ChevronUp' : 'ChevronDown'} 
                  size={20} 
                  className="text-gray-400"
                />
              </button>

              {/* Accordion Content */}
              {isRiskAssessmentExpanded && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="mt-4 space-y-4">
                    {/* Improbable Hazard Card */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={riskAssessmentSelections.improbable || false}
                          onChange={(e) => {
                            const updated = {
                              ...riskAssessmentSelections,
                              improbable: e.target.checked
                            };
                            setRiskAssessmentSelections(updated);
                            setForm(prev => ({ ...prev, riskAssessment: updated }));
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">IMPROBABLE</h4>
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                              LOW
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Source of harm adequately guarded to avoid contact with hazardous energy.
                          </p>
                          
                          {riskAssessmentSelections.improbable && (
                            <div className="mt-4 pl-4 border-l-2 border-blue-200">
                              <h5 className="font-medium text-gray-900 mb-2">Required Control Measures:</h5>
                              <div className="space-y-2">
                                <div className="flex items-start space-x-2">
                                  <Checkbox
                                    checked={riskAssessmentSelections.improbable_controls?.low || false}
                                    onChange={(e) => {
                                      const updated = {
                                        ...riskAssessmentSelections,
                                        improbable_controls: {
                                          ...riskAssessmentSelections.improbable_controls,
                                          low: e.target.checked
                                        }
                                      };
                                      setRiskAssessmentSelections(updated);
                                      setForm(prev => ({ ...prev, riskAssessment: updated }));
                                    }}
                                    size="sm"
                                  />
                                  <label className="text-sm text-gray-700">Low</label>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <Checkbox
                                    checked={riskAssessmentSelections.improbable_controls?.medium || false}
                                    onChange={(e) => {
                                      const updated = {
                                        ...riskAssessmentSelections,
                                        improbable_controls: {
                                          ...riskAssessmentSelections.improbable_controls,
                                          medium: e.target.checked
                                        }
                                      };
                                      setRiskAssessmentSelections(updated);
                                      setForm(prev => ({ ...prev, riskAssessment: updated }));
                                    }}
                                    size="sm"
                                  />
                                  <label className="text-sm text-gray-700">Medium</label>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Possible Hazard Card */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={riskAssessmentSelections.possible || false}
                          onChange={(e) => {
                            const updated = {
                              ...riskAssessmentSelections,
                              possible: e.target.checked
                            };
                            setRiskAssessmentSelections(updated);
                            setForm(prev => ({ ...prev, riskAssessment: updated }));
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">POSSIBLE</h4>
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                              MEDIUM
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Source of harm not adequately guarded to avoid contact with hazardous energy.
                          </p>
                          
                          {riskAssessmentSelections.possible && (
                            <div className="mt-4 pl-4 border-l-2 border-blue-200">
                              <h5 className="font-medium text-gray-900 mb-2">Required Control Measures:</h5>
                              <div className="space-y-2">
                                <div className="flex items-start space-x-2">
                                  <Checkbox
                                    checked={riskAssessmentSelections.possible_controls?.low || false}
                                    onChange={(e) => {
                                      const updated = {
                                        ...riskAssessmentSelections,
                                        possible_controls: {
                                          ...riskAssessmentSelections.possible_controls,
                                          low: e.target.checked
                                        }
                                      };
                                      setRiskAssessmentSelections(updated);
                                      setForm(prev => ({ ...prev, riskAssessment: updated }));
                                    }}
                                    size="sm"
                                  />
                                  <label className="text-sm text-gray-700">Low</label>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <Checkbox
                                    checked={riskAssessmentSelections.possible_controls?.medium || false}
                                    onChange={(e) => {
                                      const updated = {
                                        ...riskAssessmentSelections,
                                        possible_controls: {
                                          ...riskAssessmentSelections.possible_controls,
                                          medium: e.target.checked
                                        }
                                      };
                                      setRiskAssessmentSelections(updated);
                                      setForm(prev => ({ ...prev, riskAssessment: updated }));
                                    }}
                                    size="sm"
                                  />
                                  <label className="text-sm text-gray-700">Medium</label>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <Checkbox
                                    checked={riskAssessmentSelections.possible_controls?.high || false}
                                    onChange={(e) => {
                                      const updated = {
                                        ...riskAssessmentSelections,
                                        possible_controls: {
                                          ...riskAssessmentSelections.possible_controls,
                                          high: e.target.checked
                                        }
                                      };
                                      setRiskAssessmentSelections(updated);
                                      setForm(prev => ({ ...prev, riskAssessment: updated }));
                                    }}
                                    size="sm"
                                  />
                                  <label className="text-sm text-gray-700">High</label>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
              
              {/* Shock & Arc Flash Assessment */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Shock Hazard Assessment</h4>
                <div className="space-y-4">
                  {/* IMPROBABLE */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={shockImprobableExpanded}
                        onChange={(e) => {
                          setShockImprobableExpanded(e.target.checked);
                          if (!e.target.checked) {
                            // Uncheck all nested options when main checkbox is unchecked
                            const updated = {
                              ...shockHazardSelections,
                              improbable: {
                                under30v: false,
                                under30v_controls: {},
                                over30v: false,
                                over30v_controls: {}
                              }
                            };
                            setShockHazardSelections(updated);
                            setForm(prev => ({ ...prev, shockHazard: updated }));
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">IMPROBABLE</h4>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Source of harm adequately guarded to avoid contact with hazardous energy.
                        </p>
                        
                        {shockImprobableExpanded && (
                          <div className="mt-4 space-y-3">
                          {/* <30V Option */}
                          <div className="pl-4 border-l-2 border-blue-200">
                            <div className="flex items-start space-x-2 mb-2">
                              <Checkbox
                                checked={shockHazardSelections.improbable?.under30v || false}
                                onChange={(e) => {
                                  const updated = {
                                    ...shockHazardSelections,
                                    improbable: {
                                      ...shockHazardSelections.improbable,
                                      under30v: e.target.checked
                                    }
                                  };
                                  setShockHazardSelections(updated);
                                  setForm(prev => ({ ...prev, shockHazard: updated }));
                                }}
                                size="sm"
                              />
                              <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-900">&lt;30V</label>
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                  LOW
                                </span>
                              </div>
                            </div>
                            {shockHazardSelections.improbable?.under30v && (
                              <div className="ml-6 mt-2">
                                <h5 className="font-medium text-gray-900 mb-2 text-sm">Required Control Measures:</h5>
                                <div className="space-y-2">
                                  <div className="flex items-start space-x-2">
                                    <Checkbox
                                      checked={shockHazardSelections.improbable?.under30v_controls?.low || false}
                                      onChange={(e) => {
                                        const updated = {
                                          ...shockHazardSelections,
                                          improbable: {
                                            ...shockHazardSelections.improbable,
                                            under30v_controls: {
                                              ...shockHazardSelections.improbable?.under30v_controls,
                                              low: e.target.checked
                                            }
                                          }
                                        };
                                        setShockHazardSelections(updated);
                                        setForm(prev => ({ ...prev, shockHazard: updated }));
                                      }}
                                      size="sm"
                                    />
                                    <label className="text-sm text-gray-700">Low</label>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* >30V Option */}
                          <div className="pl-4 border-l-2 border-blue-200">
                            <div className="flex items-start space-x-2 mb-2">
                              <Checkbox
                                checked={shockHazardSelections.improbable?.over30v || false}
                                onChange={(e) => {
                                  const updated = {
                                    ...shockHazardSelections,
                                    improbable: {
                                      ...shockHazardSelections.improbable,
                                      over30v: e.target.checked
                                    }
                                  };
                                  setShockHazardSelections(updated);
                                  setForm(prev => ({ ...prev, shockHazard: updated }));
                                }}
                                size="sm"
                              />
                              <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-900">&gt;30V</label>
                                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                                  MED
                                </span>
                              </div>
                            </div>
                            {shockHazardSelections.improbable?.over30v && (
                              <div className="ml-6 mt-2">
                                <h5 className="font-medium text-gray-900 mb-2 text-sm">Required Control Measures:</h5>
                                <div className="space-y-2">
                                  <div className="flex items-start space-x-2">
                                    <Checkbox
                                      checked={shockHazardSelections.improbable?.over30v_controls?.medium || false}
                                      onChange={(e) => {
                                        const updated = {
                                          ...shockHazardSelections,
                                          improbable: {
                                            ...shockHazardSelections.improbable,
                                            over30v_controls: {
                                              ...shockHazardSelections.improbable?.over30v_controls,
                                              medium: e.target.checked
                                            }
                                          }
                                        };
                                        setShockHazardSelections(updated);
                                        setForm(prev => ({ ...prev, shockHazard: updated }));
                                      }}
                                      size="sm"
                                    />
                                    <label className="text-sm text-gray-700">Medium</label>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* POSSIBLE */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={shockPossibleExpanded}
                        onChange={(e) => {
                          setShockPossibleExpanded(e.target.checked);
                          if (!e.target.checked) {
                            // Uncheck all nested options when main checkbox is unchecked
                            const updated = {
                              ...shockHazardSelections,
                              possible: {
                                under30v: false,
                                under30v_controls: {},
                                over30v: false,
                                over30v_controls: {}
                              }
                            };
                            setShockHazardSelections(updated);
                            setForm(prev => ({ ...prev, shockHazard: updated }));
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">POSSIBLE</h4>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Source of harm not adequately guarded to avoid contact with hazardous energy.
                        </p>
                        
                        {shockPossibleExpanded && (
                          <div className="mt-4 space-y-3">
                          {/* <30V Option */}
                          <div className="pl-4 border-l-2 border-blue-200">
                            <div className="flex items-start space-x-2 mb-2">
                              <Checkbox
                                checked={shockHazardSelections.possible?.under30v || false}
                                onChange={(e) => {
                                  const updated = {
                                    ...shockHazardSelections,
                                    possible: {
                                      ...shockHazardSelections.possible,
                                      under30v: e.target.checked
                                    }
                                  };
                                  setShockHazardSelections(updated);
                                  setForm(prev => ({ ...prev, shockHazard: updated }));
                                }}
                                size="sm"
                              />
                              <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-900">&lt;30V</label>
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                  LOW
                                </span>
                              </div>
                            </div>
                            {shockHazardSelections.possible?.under30v && (
                              <div className="ml-6 mt-2">
                                <h5 className="font-medium text-gray-900 mb-2 text-sm">Required Control Measures:</h5>
                                <div className="space-y-2">
                                  <div className="flex items-start space-x-2">
                                    <Checkbox
                                      checked={shockHazardSelections.possible?.under30v_controls?.low || false}
                                      onChange={(e) => {
                                        const updated = {
                                          ...shockHazardSelections,
                                          possible: {
                                            ...shockHazardSelections.possible,
                                            under30v_controls: {
                                              ...shockHazardSelections.possible?.under30v_controls,
                                              low: e.target.checked
                                            }
                                          }
                                        };
                                        setShockHazardSelections(updated);
                                        setForm(prev => ({ ...prev, shockHazard: updated }));
                                      }}
                                      size="sm"
                                    />
                                    <label className="text-sm text-gray-700">Low</label>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* >30V Option */}
                          <div className="pl-4 border-l-2 border-blue-200">
                            <div className="flex items-start space-x-2 mb-2">
                              <Checkbox
                                checked={shockHazardSelections.possible?.over30v || false}
                                onChange={(e) => {
                                  const updated = {
                                    ...shockHazardSelections,
                                    possible: {
                                      ...shockHazardSelections.possible,
                                      over30v: e.target.checked
                                    }
                                  };
                                  setShockHazardSelections(updated);
                                  setForm(prev => ({ ...prev, shockHazard: updated }));
                                }}
                                size="sm"
                              />
                              <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-900">&gt;30V</label>
                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                                  HIGH
                                </span>
                              </div>
                            </div>
                            {shockHazardSelections.possible?.over30v && (
                              <div className="ml-6 mt-2">
                                <h5 className="font-medium text-gray-900 mb-2 text-sm">Required Control Measures:</h5>
                                <div className="space-y-2">
                                  <div className="flex items-start space-x-2">
                                    <Checkbox
                                      checked={shockHazardSelections.possible?.over30v_controls?.high || false}
                                      onChange={(e) => {
                                        const updated = {
                                          ...shockHazardSelections,
                                          possible: {
                                            ...shockHazardSelections.possible,
                                            over30v_controls: {
                                              ...shockHazardSelections.possible?.over30v_controls,
                                              high: e.target.checked
                                            }
                                          }
                                        };
                                        setShockHazardSelections(updated);
                                        setForm(prev => ({ ...prev, shockHazard: updated }));
                                      }}
                                      size="sm"
                                    />
                                    <label className="text-sm text-gray-700">High</label>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ARC Hazard Assessment */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">ARC Hazard Assessment</h4>
                <div className="space-y-4">
                  {/* IMPROBABLE */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={arcImprobableExpanded}
                        onChange={(e) => {
                          setArcImprobableExpanded(e.target.checked);
                          if (!e.target.checked) {
                            // Uncheck all nested options when main checkbox is unchecked
                            const updated = {
                              ...arcHazardSelections,
                              improbable: {
                                under12: false,
                                under12_controls: {},
                                over12: false,
                                over12_controls: {}
                              }
                            };
                            setArcHazardSelections(updated);
                            setForm(prev => ({ ...prev, arcHazard: updated }));
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">IMPROBABLE</h4>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Source of harm adequately guarded to avoid contact with hazardous energy.
                        </p>
                        
                        {arcImprobableExpanded && (
                          <div className="mt-4 space-y-3">
                          {/* <1.2 cal/cm² Option */}
                          <div className="pl-4 border-l-2 border-blue-200">
                            <div className="flex items-start space-x-2 mb-2">
                              <Checkbox
                                checked={arcHazardSelections.improbable?.under12 || false}
                                onChange={(e) => {
                                  const updated = {
                                    ...arcHazardSelections,
                                    improbable: {
                                      ...arcHazardSelections.improbable,
                                      under12: e.target.checked
                                    }
                                  };
                                  setArcHazardSelections(updated);
                                  setForm(prev => ({ ...prev, arcHazard: updated }));
                                }}
                                size="sm"
                              />
                              <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-900">&lt;1.2 cal/cm²</label>
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                  LOW
                                </span>
                              </div>
                            </div>
                            {arcHazardSelections.improbable?.under12 && (
                              <div className="ml-6 mt-2">
                                <h5 className="font-medium text-gray-900 mb-2 text-sm">Required Control Measures:</h5>
                                <div className="space-y-2">
                                  <div className="flex items-start space-x-2">
                                    <Checkbox
                                      checked={arcHazardSelections.improbable?.under12_controls?.low || false}
                                      onChange={(e) => {
                                        const updated = {
                                          ...arcHazardSelections,
                                          improbable: {
                                            ...arcHazardSelections.improbable,
                                            under12_controls: {
                                              ...arcHazardSelections.improbable?.under12_controls,
                                              low: e.target.checked
                                            }
                                          }
                                        };
                                        setArcHazardSelections(updated);
                                        setForm(prev => ({ ...prev, arcHazard: updated }));
                                      }}
                                      size="sm"
                                    />
                                    <label className="text-sm text-gray-700">Low</label>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* >1.2 cal/cm² Option */}
                          <div className="pl-4 border-l-2 border-blue-200">
                            <div className="flex items-start space-x-2 mb-2">
                              <Checkbox
                                checked={arcHazardSelections.improbable?.over12 || false}
                                onChange={(e) => {
                                  const updated = {
                                    ...arcHazardSelections,
                                    improbable: {
                                      ...arcHazardSelections.improbable,
                                      over12: e.target.checked
                                    }
                                  };
                                  setArcHazardSelections(updated);
                                  setForm(prev => ({ ...prev, arcHazard: updated }));
                                }}
                                size="sm"
                              />
                              <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-900">&gt;1.2 cal/cm²</label>
                                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                                  MED
                                </span>
                              </div>
                            </div>
                            {arcHazardSelections.improbable?.over12 && (
                              <div className="ml-6 mt-2">
                                <h5 className="font-medium text-gray-900 mb-2 text-sm">Required Control Measures:</h5>
                                <div className="space-y-2">
                                  <div className="flex items-start space-x-2">
                                    <Checkbox
                                      checked={arcHazardSelections.improbable?.over12_controls?.medium || false}
                                      onChange={(e) => {
                                        const updated = {
                                          ...arcHazardSelections,
                                          improbable: {
                                            ...arcHazardSelections.improbable,
                                            over12_controls: {
                                              ...arcHazardSelections.improbable?.over12_controls,
                                              medium: e.target.checked
                                            }
                                          }
                                        };
                                        setArcHazardSelections(updated);
                                        setForm(prev => ({ ...prev, arcHazard: updated }));
                                      }}
                                      size="sm"
                                    />
                                    <label className="text-sm text-gray-700">Medium</label>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* POSSIBLE */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={arcPossibleExpanded}
                        onChange={(e) => {
                          setArcPossibleExpanded(e.target.checked);
                          if (!e.target.checked) {
                            // Uncheck all nested options when main checkbox is unchecked
                            const updated = {
                              ...arcHazardSelections,
                              possible: {
                                under12: false,
                                under12_controls: {},
                                over12: false,
                                over12_controls: {}
                              }
                            };
                            setArcHazardSelections(updated);
                            setForm(prev => ({ ...prev, arcHazard: updated }));
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">POSSIBLE</h4>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Source of harm not adequately guarded to avoid contact with hazardous energy.
                        </p>
                        
                        {arcPossibleExpanded && (
                          <div className="mt-4 space-y-3">
                          {/* <1.2 cal/cm² Option */}
                          <div className="pl-4 border-l-2 border-blue-200">
                            <div className="flex items-start space-x-2 mb-2">
                              <Checkbox
                                checked={arcHazardSelections.possible?.under12 || false}
                                onChange={(e) => {
                                  const updated = {
                                    ...arcHazardSelections,
                                    possible: {
                                      ...arcHazardSelections.possible,
                                      under12: e.target.checked
                                    }
                                  };
                                  setArcHazardSelections(updated);
                                  setForm(prev => ({ ...prev, arcHazard: updated }));
                                }}
                                size="sm"
                              />
                              <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-900">&lt;1.2 cal/cm²</label>
                                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                                  MED
                                </span>
                              </div>
                            </div>
                            {arcHazardSelections.possible?.under12 && (
                              <div className="ml-6 mt-2">
                                <h5 className="font-medium text-gray-900 mb-2 text-sm">Required Control Measures:</h5>
                                <div className="space-y-2">
                                  <div className="flex items-start space-x-2">
                                    <Checkbox
                                      checked={arcHazardSelections.possible?.under12_controls?.medium || false}
                                      onChange={(e) => {
                                        const updated = {
                                          ...arcHazardSelections,
                                          possible: {
                                            ...arcHazardSelections.possible,
                                            under12_controls: {
                                              ...arcHazardSelections.possible?.under12_controls,
                                              medium: e.target.checked
                                            }
                                          }
                                        };
                                        setArcHazardSelections(updated);
                                        setForm(prev => ({ ...prev, arcHazard: updated }));
                                      }}
                                      size="sm"
                                    />
                                    <label className="text-sm text-gray-700">Medium</label>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* >1.2 cal/cm² Option */}
                          <div className="pl-4 border-l-2 border-blue-200">
                            <div className="flex items-start space-x-2 mb-2">
                              <Checkbox
                                checked={arcHazardSelections.possible?.over12 || false}
                                onChange={(e) => {
                                  const updated = {
                                    ...arcHazardSelections,
                                    possible: {
                                      ...arcHazardSelections.possible,
                                      over12: e.target.checked
                                    }
                                  };
                                  setArcHazardSelections(updated);
                                  setForm(prev => ({ ...prev, arcHazard: updated }));
                                }}
                                size="sm"
                              />
                              <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-900">&gt;1.2 cal/cm²</label>
                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                                  HIGH
                                </span>
                              </div>
                            </div>
                            {arcHazardSelections.possible?.over12 && (
                              <div className="ml-6 mt-2">
                                <h5 className="font-medium text-gray-900 mb-2 text-sm">Required Control Measures:</h5>
                                <div className="space-y-2">
                                  <div className="flex items-start space-x-2">
                                    <Checkbox
                                      checked={arcHazardSelections.possible?.over12_controls?.high || false}
                                      onChange={(e) => {
                                        const updated = {
                                          ...arcHazardSelections,
                                          possible: {
                                            ...arcHazardSelections.possible,
                                            over12_controls: {
                                              ...arcHazardSelections.possible?.over12_controls,
                                              high: e.target.checked
                                            }
                                          }
                                        };
                                        setArcHazardSelections(updated);
                                        setForm(prev => ({ ...prev, arcHazard: updated }));
                                      }}
                                      size="sm"
                                    />
                                    <label className="text-sm text-gray-700">High</label>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supervisor Review */}
              <div className="mt-6">
                <p className="font-semibold mb-1">
                  Supervisor Review / Comments
                </p>
                <textarea
                  className="w-full border rounded-lg p-2"
                  rows="3"
                  placeholder="Feedback, additional hazards, concerns, or controls identified during review"
                ></textarea>
              </div>

              {/* Controls / Solution / Action */}
              <div className="mt-4">
                <p className="font-semibold mb-1">
                  Controls / Solution / Action = What actions did you take to
                  fix it or make it safer?
                </p>
                <textarea
                  className="w-full border rounded-lg p-2"
                  rows="3"
                ></textarea>
              </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-6">
            <Button
              type="submit"
              onClick={handleSubmit}
              variant="primary"
              size="lg"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg"
            >
              Submit
            </Button>
          </div>
    </div>
  );
};

export default ElectricalPass;
