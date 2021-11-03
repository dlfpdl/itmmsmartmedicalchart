const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema(
	{
		patientprofile: [
			{
				doctor: {
					type: mongoose.Types.ObjectId,
					ref: 'user'
				},
				patientid: {
					type: String,
					ref: 'patient'
				},
				name: {
					type: String,
					required: true
				},
				subject: {
					type: String,
					required: true
				},
				country: {
					type: String,
					required: true
				},
				date: {
					type: Date,
					default: Date.now,
					required: true
				},
				status: {
					type: String,
					required: true
				},
				gender: {
					type: String,
					required: true
				},
				marriage: {
					type: String,
					required: true
				},
				date: {
					type: Date,
					default: Date.now
				}
			}
		]
	},
	{
		vitalcheck: [
			{
				bloodpressure: {
					type: String,
					required: true
				},
				pulserate: {
					type: String,
					required: true
				},
				respirationrate: {
					type: String,
					required: true
				},
				bodyheat: {
					type: String,
					required: true
				},
				woundtreatment: {
					type: String,
					required: true
				}
			}
		]
	},
	{
		// [] 대괄호는 array를 의미, {} 중괄호는 object를 의미
		treatmentdetail: [
			{
				daily: {
					type: String,
					required: true
				},
				dose: {
					type: String,
					required: true
				},
				period: {
					type: String,
					required: true
				},
				description: {
					type: String
				}
			}
		]
	}
);

module.exports = profile = mongoose.model('patient', patientProfileSchema);
