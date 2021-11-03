import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { createPost, updatePost } from '../redux/actions/postAction';
import { imageShow, videoShow } from '../utils/mediaShow';
import { useForm } from 'react-hook-form';

const StatusModal = ({ post }) => {
	const { auth, theme, status, socket } = useSelector(state => state);
	const dispatch = useDispatch();
	// content,
	// images,
	// patientprofile,
	// vitalcheck,
	// treatmentdetail
	const [content, setContent] = useState('');
	const [images, setImages] = useState([]);
	const [patientprofile, setPatientprofile] = useState([]);
	const [vitalcheck, setVitalcheck] = useState([]);
	const [treatmentdetail, setTreatmentdetail] = useState([]);

	const [stream, setStream] = useState(false);
	const videoRef = useRef();
	const refCanvas = useRef();
	const [tracks, setTracks] = useState('');

	const handleChangeImages = e => {
		const files = [...e.target.files];
		let err = '';
		let newImages = [];

		files.forEach(file => {
			if (!file) return (err = 'File does not exist.');

			if (file.size > 1024 * 1024 * 5) {
				return (err = 'The image/video largest is 5mb.');
			}

			return newImages.push(file);
		});

		if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
		setImages([...images, ...newImages]);
	};

	const deleteImages = index => {
		const newArr = [...images];
		newArr.splice(index, 1);
		setImages(newArr);
	};

	const handleStream = () => {
		setStream(true);
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then(mediaStream => {
					videoRef.current.srcObject = mediaStream;
					videoRef.current.play();

					const track = mediaStream.getTracks();
					setTracks(track[0]);
				})
				.catch(err => console.log(err));
		}
	};

	const handleCapture = () => {
		const width = videoRef.current.clientWidth;
		const height = videoRef.current.clientHeight;

		refCanvas.current.setAttribute('width', width);
		refCanvas.current.setAttribute('height', height);

		const ctx = refCanvas.current.getContext('2d');
		ctx.drawImage(videoRef.current, 0, 0, width, height);
		let URL = refCanvas.current.toDataURL();
		setImages([...images, { camera: URL }]);
	};

	const handleStopStream = () => {
		tracks.stop();
		setStream(false);
	};

	// const handleFormSubmit = e => {
	// 	e.
	// }

	const handleSubmit = e => {
		e.preventDefault();

		if (status.onEdit) {
			dispatch(
				updatePost({
					content,
					images,
					patientprofile,
					vitalcheck,
					treatmentdetail,
					auth,
					status
				})
			);
		} else {
			dispatch(
				createPost({
					content,
					images,
					patientprofile,
					vitalcheck,
					treatmentdetail,
					auth,
					socket
				})
			);
		}

		setContent('');
		setImages([]);
		setPatientprofile([]);
		setVitalcheck([]);
		setTreatmentdetail([]);
		if (tracks) tracks.stop();
		dispatch({ type: GLOBALTYPES.STATUS, payload: false });
	};

	useEffect(() => {
		if (status.onEdit) {
			setContent(status.content);
			setImages(status.images);
			setPatientprofile(status.patientprofile);
			setVitalcheck(status.patientprofile);
			setTreatmentdetail(status.treatmentdetail);
		}
	}, [status]);

	return (
		<div className='status_modal'>
			<form onSubmit={handleSubmit}>
				<div className='status_header'>
					<h5 className='m-0'>Create Post</h5>
					<span
						onClick={() =>
							dispatch({
								type: GLOBALTYPES.STATUS,
								payload: false
							})
						}
					>
						&times;
					</span>
				</div>

				<div className='status_body'>
					<textarea
						name='content'
						value={content}
						placeholder={`${auth.user.username}, Post your patient's status`}
						onChange={e => setContent(e.target.value)}
						style={{
							filter: theme ? 'invert(1)' : 'invert(0)',
							color: theme ? 'white' : '#111',
							background: theme ? 'rgba(0,0,0,.03)' : ''
						}}
					/>

					{/* <div className='d-flex'>
						<div className='flex-fill'></div>
						<Icons
							setContent={setContent}
							content={content}
							theme={theme}
						/>
					</div> */}

					<h1 className='profile-text'>Patient Profile</h1>

					<div className='show_images'>
						{images.map((img, index) => (
							<div key={index} id='file_img'>
								{img.camera ? (
									imageShow(img.camera, theme)
								) : img.url ? (
									<>
										{img.url.match(/video/i)
											? videoShow(img.url, theme)
											: imageShow(img.url, theme)}
									</>
								) : (
									<>
										{img.type.match(/video/i)
											? videoShow(
													URL.createObjectURL(img),
													theme
											  )
											: imageShow(
													URL.createObjectURL(img),
													theme
											  )}
									</>
								)}
								<span onClick={() => deleteImages(index)}>
									&times;
								</span>
							</div>
						))}
					</div>

					<div className='input_images'>
						{stream ? (
							<i
								className='fas fa-camera'
								onClick={handleCapture}
							/>
						) : (
							<>
								<i
									className='fas fa-camera'
									onClick={handleStream}
								/>

								<div className='file_upload'>
									<i className='fas fa-image' />
									<input
										type='file'
										name='file'
										id='file'
										multiple
										accept='image/*,video/*'
										onChange={handleChangeImages}
									/>
								</div>
							</>
						)}
					</div>

					{stream && (
						<div className='stream position-relative'>
							<video
								className='camera-stream'
								autoPlay
								ref={videoRef}
								width='50%'
								height='50%'
								style={{
									filter: theme ? 'invert(1)' : 'invert(0)'
								}}
							/>

							<span onClick={handleStopStream}>&times;</span>
							<canvas
								ref={refCanvas}
								style={{ display: 'none' }}
							/>
						</div>
					)}

					<div className='patient-profile-container'>
						<form
							className='medical-field-container'
							value={patientprofile}
							onSubmit={e => setPatientprofile(e.target.value)}
						>
							<label>Choose a Treatment Subject: </label>
							<select name='medical-field' id='fields' required>
								<option value=''>Choose Among Those</option>
								<option value='GS'>일반외과</option>
								<option value='OB-GY'>산부인과</option>
								<option value='PD'>소아과</option>
								<option value='OS'>정형외과</option>
								<option value='DR'>피부과</option>
								<option value='ENT'>이비인후과</option>
								<option value='EY'>안과</option>
								<option value='ICU'>응급환자</option>
								<option value='Undefined'>
									Can Not Identify
								</option>
							</select>
						</form>

						<form className='country-id'>
							<label>Country ID (#number): </label>
							<select name='medical-field' id='fields' required>
								<option value=''>Choose Among Those</option>
								<option value='Africa-Brundi'>
									아프리카브룬디 (#01)
								</option>
								<option value='India-Gru'>인도 (#02)</option>
								<option value='Indonesia-siam'>
									인도네시아-A (#03)
								</option>
								<option value='Indonesia-B'>
									인도네시아-B (#04)
								</option>
							</select>
						</form>

						<div className='currentTime'>
							<label for='current-time'>
								Current Time (date and time):
							</label>{' '}
							<input
								type='datetime-local'
								id='current-time'
								className='time'
							></input>
						</div>
						<div className='gender'>
							<a>Gender</a>
							<br />
							<button className='male'>Male</button>
							<button className='female'>Female</button>
						</div>
						<div className='marriage'>
							<a>Marriage</a>
							<br />
							<button className='married'>Married</button>
							<button className='single'>Single</button>
							<button className='divorced'>Divorced</button>
						</div>
						<h1 className='vitalcheck'>Vital Check</h1>
						<form className='form'>
							<label for='blood-pressure'>Blood Pressure:</label>{' '}
							<input
								type='text'
								id='blood-pressure'
								name='blood-pressure'
								placeholder='Type a blood pressure of patient'
							></input>
						</form>
						<form className='form'>
							<label for='heart-rate'>Heart Rate:</label>{' '}
							<input
								type='text'
								id='heart-rate'
								name='heart-rate'
								placeholder='Type a heartrate of patient'
							></input>
						</form>
						<form className='form'>
							<label for='respiration-rate'>
								Respiration Rate:
							</label>{' '}
							<input
								type='text'
								id='respiration-rate'
								name='respiration-rate'
								placeholder='Type a respiration rate of patient'
							></input>
						</form>
						<form className='form'>
							<label for='Body-Heat'>Body Heat:</label>{' '}
							<input
								type='text'
								id='Body-Heat'
								name='Body-Heat'
								placeholder='Type the body heat of patient'
							></input>
						</form>
						<form className='form'>
							<label>Wound Treatment (# Stage): </label>{' '}
							<select name='treatment-stage' id='fields' required>
								<option value=''>Choose Among Those</option>
								<option value='stag-1'>
									treatment stag. 1 (#01)
								</option>
								<option value='stag-2'>
									treatment stag. 2 ($02)
								</option>
								<option value='stag-3'>
									treatment stag. 3 (#03)
								</option>
								<option value='stag-4'>
									treatment stag. 4 (#04)
								</option>
								<option value='stag-5'>
									treatment stag. 5 (#05)
								</option>
							</select>
						</form>
						<h1 className='tre-detail'>Treatment Detail</h1>
						<h3 className='presc'>Prescript</h3>
						<form className='form'>
							<label for='daily-prescripted'>일투수:</label>{' '}
							<input
								type='text'
								id='daily-prescripted'
								name='daily-prescripted'
								placeholder='Type # of daily prescription'
							></input>
						</form>
						<form className='form'>
							<label for='dose'>Dose:</label>{' '}
							<input
								type='text'
								id='Dose'
								name='Dose'
								placeholder='Type a Dose prescripted'
							></input>
						</form>
						<form className='form'>
							<label for='period'>Period:</label>{' '}
							<input
								type='text'
								id='period'
								name='period'
								placeholder='Type a period prescripted'
							></input>
						</form>
						<h2 className='pat-detail'>Patient Detail</h2>
						<form>
							<input
								type='text'
								id='patient-detail'
								name='patient-detail'
								placeholder='Write Specification'
							></input>
						</form>
						<div className='show_images'>
							{images.map((img, index) => (
								<div key={index} id='file_img'>
									{img.camera ? (
										imageShow(img.camera, theme)
									) : img.url ? (
										<>
											{img.url.match(/video/i)
												? videoShow(img.url, theme)
												: imageShow(img.url, theme)}
										</>
									) : (
										<>
											{img.type.match(/video/i)
												? videoShow(
														URL.createObjectURL(
															img
														),
														theme
												  )
												: imageShow(
														URL.createObjectURL(
															img
														),
														theme
												  )}
										</>
									)}
									<span onClick={() => deleteImages(index)}>
										&times;
									</span>
								</div>
							))}
						</div>

						<div className='input_images'>
							{stream ? (
								<i
									className='fas fa-camera'
									onClick={handleCapture}
								/>
							) : (
								<>
									<i
										className='fas fa-camera'
										onClick={handleStream}
									/>

									<div className='file_upload'>
										<i className='fas fa-image' />
										<input
											type='file'
											name='file'
											id='file'
											multiple
											accept='image/*,video/*'
											onChange={handleChangeImages}
										/>
									</div>
								</>
							)}
						</div>

						{stream && (
							<div className='stream position-relative'>
								<video
									className='camera-stream'
									autoPlay
									ref={videoRef}
									width='50%'
									height='50%'
									style={{
										filter: theme
											? 'invert(1)'
											: 'invert(0)'
									}}
								/>

								<span onClick={handleStopStream}>&times;</span>
								<canvas
									ref={refCanvas}
									style={{ display: 'none' }}
								/>
							</div>
						)}
					</div>
				</div>

				<div className='status_footer'>
					<button className='btn btn-secondary w-100' type='submit'>
						Post
					</button>
				</div>
			</form>
		</div>
	);
};

export default StatusModal;
