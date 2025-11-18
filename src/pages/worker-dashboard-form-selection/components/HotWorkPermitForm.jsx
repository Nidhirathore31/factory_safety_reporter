import React, { useState, useMemo, useEffect } from 'react';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';

const HotWorkPermitForm = () => {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [formData, setFormData] = useState({
		date: '',
		jobNumber: '',
		location: '',
		natureOfJob: '',
		authorizedBy: '',
		highRiskAuthorizer: '',
		conductingHotWork: '',
		performingFireWatch: '',
		hotWorkBy: 'employee', // employee | contractor
		timeStarted: '',
		timeFinished: '',
		fireWatch: Array(4).fill({ initial: '', time: '', irScan: '', comments: '' }),
		leaveWith: {
			dateOfWork: '',
			locationOfWork: '',
			startTime: '',
			workCarriedOutBy: '',
			fireWatchCompletedBy: ''
		}
	});

	// Save data to localStorage whenever formData changes
	useEffect(() => {
		const saveTimer = setTimeout(() => {
			// Simulate save
			setTimeout(() => {
				localStorage.setItem("hot-work-form", JSON.stringify(formData));
			}, 1000);
		}, 2000);

		return () => clearTimeout(saveTimer);
	}, [formData]);

	// Load data from localStorage when component mounts
	useEffect(() => {
		const saved = localStorage.getItem("hot-work-form");
		if (saved) {
			try {
				setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
			} catch (err) {
				console.error("Error parsing saved form data:", err);
			}
		}
	}, []);

	// Progress calculation
	const progress = useMemo(() => {
		const fields = [
			formData.date,
			formData.jobNumber,
			formData.location,
			formData.natureOfJob,
			formData.authorizedBy,
			formData.highRiskAuthorizer,
			formData.conductingHotWork,
			formData.performingFireWatch,
			formData.timeStarted,
			formData.timeFinished,
			...formData.fireWatch.flatMap(item => [
				item.initial,
				item.time,
				item.irScan,
				item.comments
			]),
			formData.leaveWith.dateOfWork,
			formData.leaveWith.locationOfWork,
			formData.leaveWith.startTime,
			formData.leaveWith.workCarriedOutBy,
			formData.leaveWith.fireWatchCompletedBy
		];

		const filled = fields.filter(
			val => val && val.toString().trim() !== ''
		).length;
		return (filled / fields.length) * 100;
	}, [formData]);

	// Color based on progress
	const getFormTypeColor = () => {
		if (progress < 40) return 'bg-red-500';
		if (progress < 80) return 'bg-yellow-500';
		return 'bg-green-500';
	};

	const handleChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleFireWatchChange = (index, field, value) => {
		const updated = [...formData.fireWatch];
		updated[index] = { ...updated[index], [field]: value };
		setFormData(prev => ({ ...prev, fireWatch: updated }));
	};

	const handleLeaveWithChange = (field, value) => {
		setFormData(prev => ({
			...prev,
			leaveWith: { ...prev.leaveWith, [field]: value }
		}));
	};

	const handleSubmit = e => {
		e.preventDefault();
		console.log('Form Submitted:', formData);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Header userRole="worker" userName="John Smith" />
			<Sidebar
				userRole="worker"
				isCollapsed={sidebarCollapsed}
				onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
			/>

			<div
				className={`transition-all duration-200 p-6 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'
					}`}
			>
				<div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
					<div className="px-6 py-4">
						<div className="flex items-center justify-between mb-4">
							<h1 className="text-2xl font-bold text-gray-900">Hot Work Permit</h1>
							<div className="text-sm text-gray-500">
								Form ID: HOT-{new Date().getFullYear()}-
								{String(Math.floor(Math.random() * 10000)).padStart(4, "0")}
							</div>
						</div>

						{/* Progress Bar */}
						<div className="w-full">
							<div className="flex justify-between text-sm text-gray-600 mb-2">
								<span>Form Completion</span>
								<span>{Math.round(progress)}% Complete</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className={`h-2 rounded-full transition-all duration-300 ${getFormTypeColor()}`}
									style={{ width: `${progress}%` }}
								/>
							</div>
						</div>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-8">
					{/* Permit Info */}
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
							<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
								<span className="text-blue-600 font-bold text-sm">1</span>
							</div>
							Permit Information
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Input
								label="Date"
								type="date"
								value={formData.date}
								onChange={e => handleChange('date', e.target.value)}
								required
							/>
							<Input
								label="Job Number"
								type="text"
								placeholder="Enter job number"
								value={formData.jobNumber}
								onChange={e => handleChange('jobNumber', e.target.value)}
								required
							/>
							<Input
								label="Specific Location/Building And Floor"
								type="text"
								placeholder="Enter location"
								value={formData.location}
								onChange={e => handleChange('location', e.target.value)}
								required
							/>
							<Input
								label="Nature of Job/Object"
								type="text"
								placeholder="Enter nature of job"
								value={formData.natureOfJob}
								onChange={e => handleChange('natureOfJob', e.target.value)}
								required
							/>
							<Input
								label="Name & Signature (Authorizing Hot Work)"
								type="text"
								value={formData.authorizedBy}
								onChange={e => handleChange('authorizedBy', e.target.value)}
								required
							/>
							<Input
								label="Name & Signature (Authorizing High Risk Area)"
								type="text"
								value={formData.highRiskAuthorizer}
								onChange={e =>
									handleChange('highRiskAuthorizer', e.target.value)
								}
							/>
							<Input
								label="Name & Signature (Conducting Hot Work)"
								type="text"
								value={formData.conductingHotWork}
								onChange={e =>
									handleChange('conductingHotWork', e.target.value)
								}
							/>
							<Input
								label="Name & Signature (Performing Fire Watch)"
								type="text"
								value={formData.performingFireWatch}
								onChange={e =>
									handleChange('performingFireWatch', e.target.value)
								}
							/>
							<Input
								label="Time Started"
								type="time"
								value={formData.timeStarted}
								onChange={e => handleChange('timeStarted', e.target.value)}
								required
							/>
							<Input
								label="Time Finished"
								type="time"
								value={formData.timeFinished}
								onChange={e => handleChange('timeFinished', e.target.value)}
								required
							/>
						</div>

						{/* Employee / Contractor */}
						<div className="mt-4">
							<label className="font-medium text-gray-700">
								Hot Work Being Done By:
							</label>
							<div className="flex gap-6 mt-2">
								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="hotWorkBy"
										value="employee"
										checked={formData.hotWorkBy === 'employee'}
										onChange={e => handleChange('hotWorkBy', e.target.value)}
									/>
									Employee
								</label>
								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="hotWorkBy"
										value="contractor"
										checked={formData.hotWorkBy === 'contractor'}
										onChange={e => handleChange('hotWorkBy', e.target.value)}
									/>
									Contractor
								</label>
							</div>
						</div>
					</div>

					{/* Fire Watch Section */}
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
							<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
								<span className="text-blue-600 font-bold text-sm">2</span>
							</div>
							Fire Watch Record
						</h2>
						<div className="overflow-x-auto">
							<table className="w-full border border-border text-sm">
								<thead>
									<tr className="bg-muted">
										<th className="p-2 border border-border">Hour</th>
										<th className="p-2 border border-border">Fire Watch Initial</th>
										<th className="p-2 border border-border">Time (AM/PM)</th>
										<th className="p-2 border border-border">Infrared Scan (Y/N)</th>
										<th className="p-2 border border-border">Comments</th>
									</tr>
								</thead>
								<tbody>
									{['1st Hour', '2nd Hour', '3rd Hour', '4th Hour'].map((hour, i) => (
										<tr key={i}>
											<td className="p-2 border border-border">{hour}</td>
											<td className="p-2 border border-border">
												<Input type="text" value={formData.fireWatch[i].initial} onChange={(e) => handleFireWatchChange(i, 'initial', e.target.value)} />
											</td>
											<td className="p-2 border border-border">
												<Input type="time" value={formData.fireWatch[i].time} onChange={(e) => handleFireWatchChange(i, 'time', e.target.value)} />
											</td>
											<td className="p-2 border border-border">
												<Input type="text" value={formData.fireWatch[i].irScan} onChange={(e) => handleFireWatchChange(i, 'irScan', e.target.value)} />
											</td>
											<td className="p-2 border border-border">
												<Input type="text" value={formData.fireWatch[i].comments} onChange={(e) => handleFireWatchChange(i, 'comments', e.target.value)} />
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Leave With Permit Section */}
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
							<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
								<span className="text-blue-600 font-bold text-sm">3</span>
							</div>
							Leave with Permit Authorizing Individual
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Input label="Date of Work" type="date" value={formData.leaveWith.dateOfWork} onChange={(e) => handleLeaveWithChange('dateOfWork', e.target.value)} />
							<Input label="Location of Work" type="text" value={formData.leaveWith.locationOfWork} onChange={(e) => handleLeaveWithChange('locationOfWork', e.target.value)} />
							<Input label="Start Time" type="time" value={formData.leaveWith.startTime} onChange={(e) => handleLeaveWithChange('startTime', e.target.value)} />
							<Input label="Work Carried Out By" type="text" value={formData.leaveWith.workCarriedOutBy} onChange={(e) => handleLeaveWithChange('workCarriedOutBy', e.target.value)} />
							<Input label="Fire Watch Completed By" type="text" value={formData.leaveWith.fireWatchCompletedBy} onChange={(e) => handleLeaveWithChange('fireWatchCompletedBy', e.target.value)} />
						</div>
					</div>

					{/* Required Precautions Checklist Section */}
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
							<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
								<span className="text-blue-600 font-bold text-sm">4</span>
							</div>
							Required Precautions Checklist
						</h2>

						<div className="space-y-6">
							{/* General Confirmation */}
							<div>
								<h3 className="text-center font-bold text-lg mb-2">General Confirmation</h3>
								<div className="space-y-2">
									<label className="flex items-center gap-2">
										<input type="checkbox" />
										Confirm Automatic Sprinkler System is in operation and valves are open.
									</label>
									<label className="flex items-center gap-2">
										<input type="checkbox" />
										Provide hose streams and fire extinguishers in the immediate area and confirm they are operable.
									</label>
									<label className="flex items-center gap-2">
										<input type="checkbox" />
										Inspect Hot Work Equipment prior to Hot Work and confirm in good working condition.
									</label>
								</div>
							</div>

							{/* Requirements Within 50 ft. */}
							<div>
								<h3 className="text-center font-bold text-lg mb-2">Requirements Within 50 ft. of Hot Work</h3>
								<div className="space-y-2">
									<label className="flex items-center gap-2"><input type="checkbox" /> Clean floors, work level, horizontal surfaces (above and below) of combustible debris and oily deposits.</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Confirm no hidden accumulations on cable trays, ducts, ledges, etc.</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Wet down floors and surrounding areas within 50 ft if conditions permit.</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Protect or shield area with welding blankets, pads, curtains or other non-combustible shielding.</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Cover or shield wall and floor openings with non-combustible material.</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Suspend approved welding pads/blankets below work area when working on multiple levels.</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Protect or shut down ducts/ventilation systems that may carry sparks to distant combustible materials.</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Eliminate explosive/dusty atmospheres or confirm potential is not present.</label>
								</div>
							</div>

							{/* Hot Work on Walls/Ceilings */}
							<div>
								<h3 className="text-center font-bold text-lg mb-2">Hot Work on Walls, Ceilings, Roofs or Enclosed Equipment</h3>
								<div className="space-y-2">
									<label className="flex items-center gap-2"><input type="checkbox" /> Verify construction is noncombustible and without combustible covering/insulation.</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Protect or move combustible material on the other side of walls, ceilings, or roofs.</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Inspect and clean enclosed equipment of all combustibles.</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Inspect and purge containers which may contain flammable liquids/vapors (gas test to confirm).</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Ventilate or isolate pressurized vessels, piping, and equipment.</label>
								</div>
							</div>

							{/* Fire Watch */}
							<div>
								<h3 className="text-center font-bold text-lg mb-2">Fire Watch and Hot Work Area Monitoring Requirements</h3>
								<div className="space-y-2">
									<label className="flex items-center gap-2"><input type="checkbox" /> Provide continuous Fire Watch during and for at least 60 minutes after hot work.</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Supply Fire Watch with suitable fire extinguishers/hoses.</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Ensure Fire Watch is trained in use of fire equipment and sounding alarms.</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Provide additional Fire Watch when working on multiple levels or adjoining areas.</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Monitor area hourly for 3 hours after 1-hour constant Fire Watch.</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Take IR photo of Hot Work area after 60 min Fire Watch and after 4-hour Fire Watch.</label>
								</div>
							</div>

							{/* Other Precautions */}
							<div>
								<h3 className="text-center font-bold text-lg mb-2">Other Precautions That May Be Required</h3>
								<div className="space-y-2">
									<label className="flex items-center gap-2"><input type="checkbox" /> Use Confined Space or Lock-Out-Tag-Out as required.</label>
									<label className="flex items-center gap-2"><input type="checkbox" /> Disable area smoke/heat detection (ENSURE system is restored after Hot Work is complete).</label>
								</div>
							</div>
						</div>
					</div>

					{/* <Button type="submit" variant="primary" size="lg" className="mt-6">
						Submit Permit
					</Button> */}
				</form>
			</div>
		</div>
	);
};

export default HotWorkPermitForm;
