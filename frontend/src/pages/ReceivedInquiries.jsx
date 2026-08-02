import { useState, useEffect } from 'react';
import { getReceivedInquiries, updateInquiryStatus } from '../api/inquiries';
import styles from './Inquiries.module.css';

const STATUS_BADGE = {
	pending:   'badge badge-pending',
	responded: 'badge badge-responded',
	closed:    'badge badge-closed',
};
const STATUS_CLASS = {
	pending:   styles.statusPending,
	responded: styles.statusResponded,
	closed:    styles.statusClosed,
};

function SkeletonCard() {
	return (
		<div className={styles.skeletonCard} aria-hidden="true">
			<div className={`${styles.skeletonTitle} skeleton`} />
			<div className={`${styles.skeletonMeta} skeleton`} />
			<div className={`${styles.skeletonMsg} skeleton`} />
		</div>
	);
}

function ReceivedInquiries() {
	const [inquiries, setInquiries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	async function fetchInquiries() {
		setLoading(true);
		try {
			const data = await getReceivedInquiries();
			setInquiries(data.inquiries);
		} catch (error) {
			console.error(error);
			setError('Failed to load inquiries');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		(async () => {
			await fetchInquiries();
		})();
	}, []);

	async function handleStatusChange(id, newStatus) {
		try {
			await updateInquiryStatus(id, newStatus);
			setInquiries(inquiries.map((inq) =>
				inq.id === id ? { ...inq, status: newStatus } : inq
			));
		} catch (error) {
			console.error(error);
			alert(error.response?.data?.message || 'Failed to update status');
		}
	}

	return (
		<div className={styles.page}>
			<div className={styles.pageHeader}>
				<div>
					<h1 className={styles.pageTitle}>Inquiries received</h1>
					<p className={styles.pageSubtitle}>
						Messages from seekers interested in your listings. Update the status as you respond.
					</p>
				</div>
			</div>

			{error && <p className="form-error" role="alert">{error}</p>}

			{loading && (
				<div className={styles.list}>
					{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
				</div>
			)}

			{!loading && !error && inquiries.length === 0 && (
				<div className="empty-state">
					<div className="empty-state-icon">📭</div>
					<p>No inquiries yet. When seekers message you about a listing, they'll appear here.</p>
				</div>
			)}

			{!loading && inquiries.length > 0 && (
				<div className={styles.list}>
					{inquiries.map((inq) => (
						<div
							key={inq.id}
							className={`${styles.inquiryCard} ${STATUS_CLASS[inq.status] || styles.statusClosed}`}
						>
							<div className={styles.cardBody}>
								<div className={styles.cardHeader}>
									<h2 className={styles.listingTitle}>{inq.listing_title}</h2>
									<span className={STATUS_BADGE[inq.status] || 'badge badge-closed'}>
										{inq.status}
									</span>
								</div>

								<div className={styles.senderRow}>
									<span>From:</span>
									<span className={styles.senderName}>{inq.seeker_name}</span>
									<span className={styles.senderEmail}>({inq.seeker_email})</span>
								</div>

								<div className={styles.messageBlock}>
									<div className={styles.messageLabel}>Message</div>
									<p className={styles.messageText}>{inq.message}</p>
								</div>

								<div className={styles.cardFooter}>
									<span style={{ fontSize: 'var(--text-sm)', color: 'var(--graphite)' }}>
										Update status:
									</span>
									<select
										className={styles.statusSelect}
										value={inq.status}
										onChange={(e) => handleStatusChange(inq.id, e.target.value)}
										aria-label={`Update status for inquiry from ${inq.seeker_name}`}
									>
										<option value="pending">Pending</option>
										<option value="responded">Responded</option>
										<option value="closed">Closed</option>
									</select>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default ReceivedInquiries;

