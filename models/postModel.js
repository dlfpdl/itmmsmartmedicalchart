const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
	{
		content: String,
		images: {
			type: Array
		},
		likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
		comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
		user: { type: mongoose.Types.ObjectId, ref: 'user' },
		patientprofile: {
			type: Array,
			required: true,
			ref: 'patient'
		},
		vitalcheck: {
			type: Array,
			required: true,
			ref: 'patient'
		},
		treatmentdetail: {
			type: Array,
			required: true,
			ref: 'patient'
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('post', postSchema);
