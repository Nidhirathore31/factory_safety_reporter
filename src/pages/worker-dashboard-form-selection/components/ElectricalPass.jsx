import React, { useState, useMemo, useEffect } from "react";
import Header from "components/ui/Header";
import Sidebar from "components/ui/Sidebar";
import Input from "components/ui/Input";

const ElectricalPass = ({ sidebarCollapsed }) => {
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
  });

  useEffect(() => {
    const saved = localStorage.getItem("electrical-pass-form");
    if (saved) {
      try {
        setForm((prev) => ({ ...prev, ...JSON.parse(saved) }));
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
                <Input
                  label="Shift"
                  name="shift"
                  value={form.shift}
                  onChange={handleChange}
                  placeholder="Enter shift"
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
            <div className="bg-white shadow rounded-2xl p-6 mb-6">
              {/* Heading */}
              <h3 className="text-xl font-semibold text-center mb-4">
                Risk Assessment
              </h3>

              {/* Risk Probability Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 text-center font-semibold bg-gray-900 text-white py-2">
                  <div>IMPROBABLE</div>
                  <div>POSSIBLE</div>
                </div>

                <div className="grid grid-cols-2 text-center border-b">
                  <div className="p-2 text-sm">
                    Source of harm adequately guarded to avoid contact with
                    hazardous energy.
                  </div>
                  <div className="p-2 text-sm">
                    Source of harm not adequately guarded to avoid contact with
                    hazardous energy.
                  </div>
                </div>

                {/* LOW */}
                <div className="bg-green-300 p-2 text-sm font-semibold border-b">
                  LOW: Implement Hierarchy of Risk Control Methods on a
                  discretionary basis.
                </div>

                {/* MEDIUM */}
                <div className="bg-yellow-300 p-2 text-sm font-semibold border-b">
                  MEDIUM: Implement Hierarchy of Risk Control Methods to reduce
                  possibility of occurrence, severity of harm or both.
                </div>

                {/* HIGH */}
                <div className="bg-red-400 p-2 text-sm font-semibold">
                  HIGH: Use of multiple risk control methods required prior to
                  commencing work to reduce possibility of occurrence, severity
                  of harm or both.
                </div>
              </div>

              {/* Shock & Arc Flash Assessment */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {/* Shock Hazard Assessment */}
                {/* <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-900 text-white text-center font-semibold py-2">
                    Shock Hazard Assessment
                  </div>

                  
                  <div className="grid grid-cols-3 text-center font-semibold bg-gray-200 border-b">
                    <div>Likelihood of Occurrence of Harm</div>
                    <div className="col-span-2">Severity of Harm</div>
                  </div>

                 
                  <div className="grid grid-cols-3 text-center font-semibold bg-gray-200 border-b">
                    <div></div>
                    <div>&lt;30V</div>
                    <div>&gt;30V</div>
                  </div>

                 
                  <div className="grid grid-cols-3 text-center border-b">
                    <div className="font-semibold">IMPROBABLE</div>
                    <div className="bg-green-300 font-semibold">LOW</div>
                    <div className="bg-yellow-300 font-semibold">MED</div>
                  </div>

                 
                  <div className="grid grid-cols-3 text-center">
                    <div className="font-semibold">POSSIBLE</div>
                    <div className="bg-green-300 font-semibold">LOW</div>
                    <div className="bg-red-400 font-semibold">HIGH</div>
                  </div>
                </div> */}
                <div className="border rounded-lg overflow-hidden">
  <div className="bg-gray-900 text-white text-center font-semibold py-2">
    Shock Hazard Assessment
  </div>
  {/* Header Section */}
<div className="grid grid-cols-4 text-center font-semibold bg-gray-200 border-b">

{/* Left big column */}
<div className="col-span-2 flex items-center justify-center border-r">
  Likelihood of Occurrence of Harm
</div>

{/* Severity of Harm – spans 2 columns */}
<div className="col-span-2">
  <div className="border-b py-1">Severity of Harm</div>
  
  {/* Sub-headings: <30V and >30V */}
  <div className="grid grid-cols-2">
    <div className="border-r py-1">&lt;30V</div>
    <div className="py-1">&gt;30V</div>
  </div>
</div>

</div>




  {/* IMPROBABLE row */}
  <div className="grid grid-cols-4 text-center border-b">
    <div className="col-span-2 font-semibold border-r">IMPROBABLE</div>
    <div className="bg-green-300 font-semibold border-r">LOW</div>
    <div className="bg-yellow-300 font-semibold">MED</div>
  </div>

  {/* POSSIBLE row */}
  <div className="grid grid-cols-4 text-center">
    <div className="col-span-2 font-semibold border-r">POSSIBLE</div>
    <div className="bg-green-300 font-semibold border-r">LOW</div>
    <div className="bg-red-400 font-semibold">HIGH</div>
  </div>
</div>

                {/* ARC Hazard Assessment */}
                
                <div className="border rounded-lg overflow-hidden">
  <div className="bg-gray-900 text-white text-center font-semibold py-2">
    ARC Hazard Assessment
  </div>

  {/* Header Section */}
  <div className="grid grid-cols-4 text-center font-semibold bg-gray-200 border-b">

    {/* Left big column */}
    <div className="col-span-2 flex items-center justify-center border-r">
      Likelihood of Occurrence of Harm
    </div>

    {/* Severity of Harm – spans 2 columns */}
    <div className="col-span-2">
      <div className="border-b py-1">Severity of Harm</div>

      {/* Sub-headings: <1.2 and >1.2 */}
      <div className="grid grid-cols-2">
        <div className="border-r py-1">&lt;1.2 cal/cm²</div>
        <div className="py-1">&gt;1.2 cal/cm²</div>
      </div>
    </div>

  </div>

  {/* IMPROBABLE row */}
  <div className="grid grid-cols-4 text-center border-b">
    <div className="col-span-2 font-semibold border-r">IMPROBABLE</div>
    <div className="bg-green-300 font-semibold border-r">LOW</div>
    <div className="bg-yellow-300 font-semibold">MED</div>
  </div>

  {/* POSSIBLE row */}
  <div className="grid grid-cols-4 text-center">
    <div className="col-span-2 font-semibold border-r">POSSIBLE</div>
    <div className="bg-yellow-300 font-semibold border-r">MED</div>
    <div className="bg-red-400 font-semibold">HIGH</div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricalPass;
