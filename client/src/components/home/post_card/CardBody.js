import React, { useState } from 'react';
import Carousel from '../../Carousel';

const CardBody = ({ post, theme }) => {
	const [readMore, setReadMore] = useState(false);

	return (
		<div className='card_body'>
			<div
				className='card_body-content'
				style={{
					filter: theme ? 'invert(1)' : 'invert(0)',
					color: theme ? 'white' : '#111'
				}}
			>
				<h1 className='profile-text'>Patient Profile</h1>

				<div className='patient-profile-img'>
					{post.images.length > 0 && (
						<Carousel images={post.images} id={post._id} />
					)}
				</div>

				<div className='patient-profile-container'>
					{post.patientprofile}
					<h1 className='vitalcheck'>Vital Check</h1>
					{post.vitalcheck}
					<h2 className='pat-detail'>Patient Detail</h2>
					{post.treatmentdetail}
					<div className='patient-profile-img'>
						{post.images.length > 0 && (
							<Carousel images={post.images} id={post._id} />
						)}
					</div>
				</div>
				<span>
					{post.content.length < 60
						? post.content
						: readMore
						? post.content + ' '
						: post.content.slice(0, 60) + '.....'}
				</span>
				{post.content.length > 60 && (
					<span
						className='readMore'
						onClick={() => setReadMore(!readMore)}
					>
						{readMore ? 'Hide content' : 'Read more'}
					</span>
				)}
			</div>
		</div>
	);
};

export default CardBody;
