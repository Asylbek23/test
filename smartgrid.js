module.exports = {
	outputStyle: 'sass',
	columns: 12,
	container: {
		maxWidth: '1200px', /* max-width оn very large screen */
		fields: '30px' /* side fields */
	},
	breakPoints: {
		lg: {
				width: '1100px', /* -> @media (max-width: 1100px) */
		},
		md: {
				width: '960px'
		},
		sm: {
				width: '780px',
				fields: '15px' /* set fields only if you want to change container.fields */
		},
		xs: {
				width: '560px'
		}
	}
};